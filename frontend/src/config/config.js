const LOCAL_BACKEND_URL = "http://localhost:5000";
const REMOTE_BACKEND_URL = "https://interviewpreparationbot.onrender.com";

let resolvedBackendUrl = REMOTE_BACKEND_URL;
let initPromise = null;

const withTimeout = (ms) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { controller, timer };
};

const canReachBackend = async (url) => {
  const { controller, timer } = withTimeout(2500);
  try {
    // Any HTTP response means backend is reachable; status code does not matter.
    await fetch(`${url}/jobs/jobs`, {
      method: "GET",
      signal: controller.signal,
    });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
};

export const initializeBackendUrl = async () => {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const localUp = await canReachBackend(LOCAL_BACKEND_URL);
    resolvedBackendUrl = localUp ? LOCAL_BACKEND_URL : REMOTE_BACKEND_URL;
    return resolvedBackendUrl;
  })();

  return initPromise;
};

const config = {
  get backendUrl() {
    return resolvedBackendUrl;
  },
  LOCAL_BACKEND_URL,
  REMOTE_BACKEND_URL,
};

export default config;
