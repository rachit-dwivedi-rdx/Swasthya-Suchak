const BACKEND_URL = import.meta.env.VITE_API_URL || "https://swasthya-suchak.onrender.com";
const WAKE_TIMEOUT = 30000;

export async function wakeBackend(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), WAKE_TIMEOUT);
    
    await fetch(`${BACKEND_URL}/`, { 
      signal: controller.signal,
      method: 'GET'
    });
    
    clearTimeout(timeout);
    return true;
  } catch {
    return false;
  }
}

export async function ensureBackendAwake(): Promise<void> {
  const maxRetries = 3;
  for (let i = 0; i < maxRetries; i++) {
    const awake = await wakeBackend();
    if (awake) return;
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}
