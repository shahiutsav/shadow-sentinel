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
    return {
      message: "An error occurred while fetching the data from the api",
      data: {},
      status: 500,
    };
  }

  const data = await resp.json();

  if (data.error) {
    return {
      message: "The faction does not exist",
      data: {},
      status: 404,
    };
  }
  return {
    message: "Data fetch success",
    data: data,
    status: 200,
  };
}

export async function fetchPersonalStats({
  userID,
  apiKey,
  timeStamp,
}: {
  userID: number;
  apiKey: string;
  timeStamp: number;
}) {
  const url = `https://api.torn.com/user/${userID}?key=${apiKey}&timestamp=${timeStamp}&stat=boostersused,xantaken,networth,rankedwarhits,revives,energydrinkused&comment=ShadowSentinel&selections=personalstats`;
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
