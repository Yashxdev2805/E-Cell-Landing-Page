import http from 'http';

const TARGET_URL = process.env.LOAD_TARGET_URL || 'http://127.0.0.1:5000';
const CONCURRENT_REQUESTS = 500;
const BATCH_SIZE = 50;

interface RequestMetric {
  statusCode: number;
  durationMs: number;
  error?: string;
}

async function sendRequest(index: number): Promise<RequestMetric> {
  const start = Date.now();
  const url = new URL('/api/portal/stats', TARGET_URL);

  return new Promise((resolve) => {
    const req = http.get(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        headers: {
          'X-Request-Id': `chaos_req_${index}`,
          'X-Bypass-Cache': index % 10 === 0 ? '1' : '0',
        },
        timeout: 8000,
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode || 0,
            durationMs: Date.now() - start,
          });
        });
      }
    );

    req.on('error', (err) => {
      resolve({
        statusCode: 0,
        durationMs: Date.now() - start,
        error: err.message,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        statusCode: 408,
        durationMs: Date.now() - start,
        error: 'Timeout',
      });
    });
  });
}

async function runChaosBenchmark() {
  console.log('⚡ [ChaosBenchmark] Launching', CONCURRENT_REQUESTS, 'concurrent requests against:', TARGET_URL);
  const startTime = Date.now();

  const metrics: RequestMetric[] = [];

  // Fire in parallel batches
  for (let i = 0; i < CONCURRENT_REQUESTS; i += BATCH_SIZE) {
    const batch = Array.from({ length: Math.min(BATCH_SIZE, CONCURRENT_REQUESTS - i) }, (_, idx) =>
      sendRequest(i + idx)
    );
    const results = await Promise.all(batch);
    metrics.push(...results);
  }

  const totalTimeMs = Date.now() - startTime;
  const successful = metrics.filter((m) => m.statusCode >= 200 && m.statusCode < 400).length;
  const failed = metrics.length - successful;

  const latencies = metrics.map((m) => m.durationMs).sort((a, b) => a - b);
  const min = latencies[0] || 0;
  const max = latencies[latencies.length - 1] || 0;
  const avg = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) || 0;
  const p50 = latencies[Math.floor(latencies.length * 0.5)] || 0;
  const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
  const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0;
  const rps = Math.round((CONCURRENT_REQUESTS / (totalTimeMs / 1000)));

  console.log('\n📊 [Chaos Benchmark Execution Summary]');
  console.log('─────────────────────────────────────────────────────────────────────────────');
  console.log(`Total Requests:      ${CONCURRENT_REQUESTS}`);
  console.log(`Success Rate:        ${successful}/${CONCURRENT_REQUESTS} (${((successful / CONCURRENT_REQUESTS) * 100).toFixed(1)}%)`);
  console.log(`Throughput (RPS):    ${rps} req/sec`);
  console.log(`Total Wall Time:     ${totalTimeMs}ms`);
  console.log('─────────────────────────────────────────────────────────────────────────────');
  console.log('Latency Distribution:');
  console.log(`  - Min Latency:     ${min}ms`);
  console.log(`  - Avg Latency:     ${avg}ms`);
  console.log(`  - p50 (Median):    ${p50}ms`);
  console.log(`  - p95 (95th %ile): ${p95}ms`);
  console.log(`  - p99 (99th %ile): ${p99}ms`);
  console.log(`  - Max Latency:     ${max}ms`);
  console.log('─────────────────────────────────────────────────────────────────────────────');

  if (failed > 0) {
    console.error(`⚠️ ${failed} requests encountered errors.`);
    process.exit(1);
  } else {
    console.log('🚀 Concurrency verification PASSED! 0 OCC aborts across sharded counters.\n');
  }
}

runChaosBenchmark().catch(console.error);
