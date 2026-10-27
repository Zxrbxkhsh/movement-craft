process.env.NODE_ENV = 'test';
import './config/env';
import app from './server';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TestResult {
  name: string;
  passed: boolean;
  details?: any;
}

const results: TestResult[] = [];

async function makeRequest(
  server: http.Server,
  method: string,
  urlPath: string,
  body?: any,
  headers: Record<string, string> = {}
): Promise<{ status: number; body: any; headers: http.IncomingHttpHeaders }> {
  const addr = server.address();
  const port = typeof addr === 'object' && addr ? addr.port : 3000;

  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const reqHeaders: Record<string, string> = {
      ...headers
    };
    if (body) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(dataString).toString();
    }

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: urlPath,
        method,
        headers: reqHeaders
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          let parsed = rawData;
          try {
            parsed = JSON.parse(rawData);
          } catch {
            // keep string
          }
          resolve({
            status: res.statusCode || 0,
            body: parsed,
            headers: res.headers
          });
        });
      }
    );

    req.on('error', (err) => reject(err));
    if (dataString) {
      req.write(dataString);
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting backend and API tests...\n');

  // Create temporary local HTTP server for in-memory express testing
  const server = http.createServer(app);
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve());
  });

  try {
    // 1. Health & Status
    const health = await makeRequest(server, 'GET', '/api/health');
    console.log('[Test 1] GET /api/health:', health.status, health.body?.status);
    results.push({
      name: 'GET /api/health',
      passed: health.status === 200 && health.body?.status === 'healthy',
      details: health.body
    });

    // 2. Public Packages
    const publicPkgs = await makeRequest(server, 'GET', '/api/packages');
    console.log('[Test 2] GET /api/packages (public):', publicPkgs.status, 'Total:', publicPkgs.body?.length);
    results.push({
      name: 'GET /api/packages (public)',
      passed: publicPkgs.status === 200 && Array.isArray(publicPkgs.body) && publicPkgs.body.length > 0,
      details: `Returned ${publicPkgs.body?.length} packages`
    });

    // 3. Admin Authentication Failed
    const failedAuth = await makeRequest(server, 'POST', '/api/admin/login', { password: 'wrong_password_123' });
    console.log('[Test 3] POST /api/admin/login (invalid):', failedAuth.status, failedAuth.body?.error);
    results.push({
      name: 'POST /api/admin/login (invalid password rejection)',
      passed: failedAuth.status === 401 && failedAuth.body?.success === false
    });

    // 4. Admin Authentication Success
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      throw new Error('ADMIN_PASSWORD must be defined in .env for tests to run');
    }
    const successAuth = await makeRequest(server, 'POST', '/api/admin/login', { password: adminPassword });
    const token = successAuth.body?.token;
    console.log('[Test 4] POST /api/admin/login (valid):', successAuth.status, 'Has token:', Boolean(token));
    results.push({
      name: 'POST /api/admin/login (valid password)',
      passed: successAuth.status === 200 && Boolean(token)
    });

    // 5. Admin Token Check
    const checkAuth = await makeRequest(server, 'GET', '/api/admin/check', null, {
      Authorization: `Bearer ${token}`
    });
    console.log('[Test 5] GET /api/admin/check:', checkAuth.status, 'Authenticated:', checkAuth.body?.authenticated);
    results.push({
      name: 'GET /api/admin/check with valid Bearer token',
      passed: checkAuth.status === 200 && checkAuth.body?.authenticated === true
    });

    // 6. Admin Create Package
    const testPackageId = 'test_pkg_' + Date.now();
    const createdPkg = await makeRequest(
      server,
      'POST',
      '/api/packages',
      {
        id: testPackageId,
        title: 'Automated Test Luxury Package',
        subtitle: 'Created during test run',
        description: 'Verify package creation works end-to-end',
        startingPrice: 5999,
        inclusions: [{ text: 'Cold Sparklers' }, { text: 'Cake', isOurSide: true }],
        addons: []
      },
      { Authorization: `Bearer ${token}` }
    );
    console.log('[Test 6] POST /api/packages (create):', createdPkg.status, createdPkg.body?.title);
    results.push({
      name: 'POST /api/packages (Admin create package)',
      passed: createdPkg.status === 201 && createdPkg.body?.id === testPackageId
    });

    // 7. Admin Update Package
    const updatedPkg = await makeRequest(
      server,
      'PUT',
      `/api/packages/${testPackageId}`,
      {
        title: 'Updated Test Luxury Package',
        startingPrice: 6499
      },
      { Authorization: `Bearer ${token}` }
    );
    console.log('[Test 7] PUT /api/packages/:id (update):', updatedPkg.status, updatedPkg.body?.startingPrice);
    results.push({
      name: 'PUT /api/packages/:id (Admin update package)',
      passed: updatedPkg.status === 200 && updatedPkg.body?.startingPrice === 6499
    });

    // 8. Admin Delete Package
    const deletedPkg = await makeRequest(server, 'DELETE', `/api/packages/${testPackageId}`, null, {
      Authorization: `Bearer ${token}`
    });
    console.log('[Test 8] DELETE /api/packages/:id (delete):', deletedPkg.status, deletedPkg.body?.message);
    results.push({
      name: 'DELETE /api/packages/:id (Admin delete package)',
      passed: deletedPkg.status === 200 && deletedPkg.body?.success === true
    });

    // 9. Website Config GET & PUT
    const configGet = await makeRequest(server, 'GET', '/api/config');
    console.log('[Test 9] GET /api/config:', configGet.status, 'Founder:', configGet.body?.founder);
    results.push({
      name: 'GET /api/config',
      passed: configGet.status === 200 && Boolean(configGet.body?.name)
    });

    // 10. Add-ons & Services
    const addonsGet = await makeRequest(server, 'GET', '/api/addons');
    const servicesGet = await makeRequest(server, 'GET', '/api/services');
    console.log('[Test 10] GET /api/addons & /api/services:', addonsGet.status, servicesGet.status);
    results.push({
      name: 'GET /api/addons and /api/services',
      passed: addonsGet.status === 200 && servicesGet.status === 200 && Array.isArray(addonsGet.body)
    });

    // 11. Photo Upload API
    // 1x1 transparent png in base64
    const sampleBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    const uploadRes = await makeRequest(
      server,
      'POST',
      '/api/upload',
      {
        imageBase64: sampleBase64,
        filename: 'test.png',
        mimeType: 'image/png'
      },
      { Authorization: `Bearer ${token}` }
    );
    console.log('[Test 11] POST /api/upload:', uploadRes.status, 'URL:', uploadRes.body?.url);
    const uploadedUrl = uploadRes.body?.url;
    let fileWritten = false;
    if (uploadedUrl) {
      const writtenFilePath = path.resolve(__dirname, '../frontend/public', uploadedUrl.replace(/^\//, ''));
      fileWritten = fs.existsSync(writtenFilePath);
      if (fileWritten) {
        fs.unlinkSync(writtenFilePath); // clean up test image
      }
    }
    results.push({
      name: 'POST /api/upload (secure disk persistence & URL response)',
      passed: uploadRes.status === 200 && Boolean(uploadedUrl) && fileWritten
    });

    // 12. Public Client Inquiry Submission
    const inquiryRes = await makeRequest(server, 'POST', '/api/inquiries', {
      name: 'Rohit Sharma',
      phone: '+91 9876543210',
      occasion: 'Anniversary Surprise',
      packageTitle: 'Midnight Surprise',
      date: '2026-11-15',
      timeSlot: 'Midnight (11:30 PM - 12:30 AM)',
      area: 'CIDCO',
      estimatedBudget: 4299,
      notes: 'Automated test booking'
    });
    console.log('[Test 12] POST /api/inquiries:', inquiryRes.status, inquiryRes.body?.message);
    results.push({
      name: 'POST /api/inquiries (Client booking inquiry)',
      passed: inquiryRes.status === 201 && inquiryRes.body?.success === true
    });

    // 13. Admin Inquiries List
    const inqList = await makeRequest(server, 'GET', '/api/inquiries', null, {
      Authorization: `Bearer ${token}`
    });
    console.log('[Test 13] GET /api/inquiries (Admin):', inqList.status, 'Count:', inqList.body?.length);
    results.push({
      name: 'GET /api/inquiries (Admin inquiry review)',
      passed: inqList.status === 200 && Array.isArray(inqList.body)
    });

    console.log('\n=============================================');
    console.log('              TEST SUMMARY RESULTS           ');
    console.log('=============================================');
    let allPassed = true;
    for (const r of results) {
      console.log(`${r.passed ? '✅ PASS' : '❌ FAIL'}: ${r.name}`);
      if (!r.passed) allPassed = false;
    }
    console.log('=============================================\n');

    if (!allPassed) {
      process.exit(1);
    }
  } finally {
    server.close();
  }
}

runTests().catch((e) => {
  console.error('Fatal test execution error:', e);
  process.exit(1);
});
