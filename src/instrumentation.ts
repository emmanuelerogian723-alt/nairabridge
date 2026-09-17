export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const base =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.APP_BASE_URL ||
    'https://nairabridge.onrender.com';
  const ping = async () => {
    try {
      await fetch(`${base.replace(/\/$/, '')}/heartbeat`, { cache: 'no-store' });
      console.log(`[keepalive] pinged ${base}`);
    } catch {}
  };
  setTimeout(() => {
    ping();
    setInterval(ping, 5 * 60 * 1000); // every 5 min; Render free sleeps at 15
  }, 60 * 1000);
}
