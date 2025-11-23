export default function Home() {
  console.log("=== PAGE COMPONENT EXECUTING ===");
  
  return (
    <div style={{ padding: '50px', fontSize: '24px', backgroundColor: 'lightblue' }}>
      <h1>✅ Home Page Loaded Successfully!</h1>
      <p>English locale is working.</p>
      <p>If you see this, the routing works!</p>
    </div>
  );
}