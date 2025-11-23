export default async function TestDynamicPage({ 
  params 
}: { 
  params: Promise<{ test: string }> 
}) {
  const { test } = await params;
  return (
    <div style={{ padding: '50px', background: 'cyan' }}>
      <h1>✅ Dynamic route WORKS!</h1>
      <p>Test param: {test}</p>
    </div>
  );
}