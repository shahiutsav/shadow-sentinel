"use server";

export async function fetchFactionDetails({
  apiKey,
  factionID,
}: {
  apiKey: string;
  factionID: string;
}) {
  const url = `https://api.torn.com/faction/${factionID}?selections=basic&key=${apiKey}`;
  const resp = await fetch(url, {
    cache: "no-cache",
  });

  if (!resp.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await resp.json();
  return data;
}

export async function fetchPersonalStats({
  id,
  apiKey,
}: {
  id: string;
  apiKey: string;
}) {
  const url = `https://api.torn.com/user/${id}?selections=personalstats&key=${apiKey}`;
  const resp = await fetch(url, {
    cache: "no-cache",
  });

  if (!resp.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await resp.json();
  return data.personalstats;
}

export async function fetchEnemyStats({
  apiKey,
  warID,
}: {
  apiKey: string | undefined;
  warID: string;
}) {
  const url = `https://www.tornstats.com/api/v2/${apiKey}/wars/${warID}`;
  const resp = await fetch(url, {
    cache: "no-cache",
  });

  if (!resp.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await resp.json();
  return data.faction_b.members;
}
