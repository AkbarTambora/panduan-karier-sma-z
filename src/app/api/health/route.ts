export async function GET() {
  const start = Date.now();
  return new Response(JSON.stringify({
    status: 'ok',
    time: new Date().toISOString(),
    latency: `${Date.now() - start}ms`
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
