import http from 'http';

interface TestResult {
  name: string;
  passed: boolean;
  durationMs: number;
  details?: any;
  error?: string;
}

const BASE_URL = process.env.TEST_BASE_URL || 'http://127.0.0.1:5000';

async function get(path: string): Promise<{ status: number; headers: http.IncomingHttpHeaders; body: any; durationMs: number }> {
  const start = Date.now();
  const url = new URL(path, BASE_URL);

  return new Promise((resolve, reject) => {
    const req = http.get(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        timeout: 5000,
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          const durationMs = Date.now() - start;
          try {
            resolve({ status: res.statusCode || 0, headers: res.headers, body: JSON.parse(raw), durationMs });
          } catch {
            resolve({ status: res.statusCode || 0, headers: res.headers, body: raw, durationMs });
          }
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
  });
}

async function runSmokeSuite() {
  console.log('🔬 [E-Cell Smoke Test] Starting production health and audit suite against:', BASE_URL);
  const results: TestResult[] = [];

  // Probe 1: Core Health & Diagnostics
  try {
    const res = await get('/api/health');
    const passed = res.status === 200 && res.body?.status === 'HEALTHY' && res.body?.shards === 10;
    results.push({
      name: '1. Health & Diagnostics Probe (/api/health)',
      passed,
      durationMs: res.durationMs,
      details: res.body,
    });
  } catch (err: any) {
    results.push({ name: '1. Health & Diagnostics Probe', passed: false, durationMs: 0, error: err.message });
  }

  // Probe 2: Sharded Telemetry Latency & SWR
  try {
    const res = await get('/api/portal/stats');
    const passed = res.status === 200 && res.body?.success === true && typeof res.body?.data?.startupsRegistered === 'number';
    results.push({
      name: '2. Sharded Telemetry Counter Aggregation (/api/portal/stats)',
      passed,
      durationMs: res.durationMs,
      details: { startups: res.body?.data?.startupsRegistered, applicants: res.body?.data?.totalApplicants },
    });
  } catch (err: any) {
    results.push({ name: '2. Sharded Telemetry Counter Aggregation', passed: false, durationMs: 0, error: err.message });
  }

  // Probe 3: Prefix-Aware Polymorphic Tracker Lookup
  try {
    const res = await get('/api/portal/track/EC-2026-AIML-101');
    const passed = res.status === 200 && res.body?.data?.sourceType === 'COUNCIL_RECRUITMENT';
    results.push({
      name: '3. Polymorphic Tracker Resolution (/api/portal/track/EC-2026-AIML-101)',
      passed,
      durationMs: res.durationMs,
      details: { refId: res.body?.data?.refId, status: res.body?.data?.status },
    });
  } catch (err: any) {
    results.push({ name: '3. Polymorphic Tracker Resolution', passed: false, durationMs: 0, error: err.message });
  }

  // Probe 4: Security Headers Audit
  try {
    const res = await get('/health');
    const hasFrameguard = res.headers['x-frame-options'] === 'SAMEORIGIN' || res.headers['x-frame-options'] === 'DENY';
    const hasNoSniff = res.headers['x-content-type-options'] === 'nosniff';
    results.push({
      name: '4. HTTP Security Headers Compliance (Helmet Audit)',
      passed: Boolean(hasNoSniff),
      durationMs: res.durationMs,
      details: { 'x-content-type-options': res.headers['x-content-type-options'] },
    });
  } catch (err: any) {
    results.push({ name: '4. HTTP Security Headers Compliance', passed: false, durationMs: 0, error: err.message });
  }

  // Print Summary
  console.log('\n📊 [E-Cell Smoke Test Summary]');
  console.log('─────────────────────────────────────────────────────────────────────────────');
  let allPassed = true;
  for (const r of results) {
    const symbol = r.passed ? '✅' : '❌';
    console.log(`${symbol} ${r.name} (${r.durationMs}ms)`);
    if (r.details) console.log('   Data:', JSON.stringify(r.details));
    if (r.error) console.log('   Error:', r.error);
    if (!r.passed) allPassed = false;
  }
  console.log('─────────────────────────────────────────────────────────────────────────────');

  if (!allPassed) {
    console.error('❌ One or more smoke tests failed!');
    process.exit(1);
  } else {
    console.log('🚀 All smoke probes PASSED! Ingress and backend are production ready.\n');
  }
}

runSmokeSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
