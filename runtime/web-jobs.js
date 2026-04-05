const jobs = new Map();
const events = [];
const MAX_EVENTS = 200;

function pushEvent(type, payload = {}) {
  events.push({ id: crypto.randomUUID(), ts: new Date().toISOString(), type, ...payload });
  if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS);
}

export function getRecentEvents(limit = 50) {
  return events.slice(-Math.max(1, limit));
}

export function getJobStatuses() {
  return Array.from(jobs.entries()).map(([name, j]) => ({
    name,
    running: j.running,
    startedAt: j.startedAt,
    finishedAt: j.finishedAt,
    lastError: j.lastError,
    lastResult: j.lastResult,
    runCount: j.runCount || 0,
  }));
}

export async function runLockedJob(name, fn, { retries = 0 } = {}) {
  const current = jobs.get(name) || { running: false, runCount: 0 };
  if (current.running) {
    return { skipped: true, reason: `${name} is already running` };
  }

  current.running = true;
  current.startedAt = new Date().toISOString();
  current.finishedAt = null;
  current.lastError = null;
  current.runCount += 1;
  jobs.set(name, current);
  pushEvent("job.started", { job: name, runCount: current.runCount });

  let attempt = 0;
  while (attempt <= retries) {
    try {
      const result = await fn();
      current.lastResult = result;
      current.finishedAt = new Date().toISOString();
      current.running = false;
      jobs.set(name, current);
      pushEvent("job.succeeded", { job: name, attempt: attempt + 1 });
      return { ok: true, result, attempt: attempt + 1 };
    } catch (error) {
      attempt += 1;
      current.lastError = error?.message || String(error);
      if (attempt > retries) {
        current.finishedAt = new Date().toISOString();
        current.running = false;
        jobs.set(name, current);
        pushEvent("job.failed", { job: name, error: current.lastError });
        throw error;
      }
    }
  }
}
