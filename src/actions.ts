"use server";

export async function fetchMemberDetails({
  apiKey,
  factionID,
}: {
  apiKey: string;
  factionID: string;
}) {
  const resp = await fetch(
    `https://api.torn.com/faction/${factionID}?selections=basic&key=${apiKey}`
  );

  if (!resp.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await resp.json();
  return data;
}
