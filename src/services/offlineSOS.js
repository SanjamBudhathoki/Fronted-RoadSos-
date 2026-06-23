import { sosService } from "../services/sosService";

export const saveOfflineSOS = (data) => {
  const existing =
    JSON.parse(localStorage.getItem("offlineSOS")) || [];

  existing.push(data);

  localStorage.setItem(
    "offlineSOS",
    JSON.stringify(existing)
  );
};

export const syncOfflineSOS = async () => {

  const pending =
    JSON.parse(localStorage.getItem("offlineSOS")) || [];

  if (!pending.length) return;

  const remaining = [];

  for (const sos of pending) { // for of iletrates over objects like Array string map sets set for(const:creates a new lexical env)

    try {
      await sosService.createSOS(sos);
    }
    catch {
      remaining.push(sos);
    }

  }

  localStorage.setItem(
    "offlineSOS",
    JSON.stringify(remaining)
  );
};