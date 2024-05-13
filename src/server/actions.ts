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
  factionID,
}: {
  apiKey: string | undefined;
  factionID: string;
}) {
  const url = `https://www.tornstats.com/api/v2/${apiKey}/spy/faction/${factionID}`;
  const resp = await fetch(url, {
    cache: "no-cache",
  });

  if (!resp.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await resp.json();
  return data.faction.members;
}
