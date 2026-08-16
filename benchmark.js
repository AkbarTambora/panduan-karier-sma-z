import axios from "axios";
import { performance } from "perf_hooks";

const TARGET = process.argv[2] || "http://localhost:3000/api/health";
const REQUEST_COUNT = 20;

async function runBenchmark() {
  console.log(`🚀 Benchmarking ${TARGET} with ${REQUEST_COUNT} requests...`);

  const latencies = [];

  for (let i = 0; i < REQUEST_COUNT; i++) {
    const start = performance.now();
    try {
      await axios.get(TARGET);
      const duration = performance.now() - start;
      latencies.push(duration);
    } catch (err) {
      console.error(`❌ Request ${i + 1} failed:`, err.message);
    }
  }

  const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const min = Math.min(...latencies);
  const max = Math.max(...latencies);

  console.log(`\n📊 Benchmark Result (${REQUEST_COUNT} requests):`);
  console.log(`   ➤ Avg latency : ${avg.toFixed(2)} ms`);
  console.log(`   ➤ Min latency : ${min.toFixed(2)} ms`);
  console.log(`   ➤ Max latency : ${max.toFixed(2)} ms`);
}

runBenchmark();
