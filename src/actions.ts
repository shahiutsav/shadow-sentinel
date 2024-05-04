"use server";
export async function fetchFactionDetails({
  apiKey,
  factionID,
}: {
  apiKey: string;
  factionID: string;
}) {
  const url = `https://api.torn.com/faction/${factionID}?selections=basic&key=${apiKey}`;
  const resp = await fetch(url);

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
  const resp = await fetch(url);

  if (!resp.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await resp.json();
  return data.personalstats;
}

async function getUserData(apiKey: string, factionId: string): Promise<string> {
  const url = `https://api.torn.com/faction/${factionId}?selections=basic&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  let output = "";
  const currentDate = new Date(); // Get the current date and time
  const formattedDate = currentDate.toLocaleString(); // Format the date and time

  if (data && data.members) {
    for (const id in data.members) {
      const memberInfoUrl = `https://api.torn.com/user/${id}?selections=personalstats&key=${apiKey}`;
      const memberResponse = await fetch(memberInfoUrl);
      const memberStats = await memberResponse.json();

      if (memberStats && memberStats.personalstats) {
        const stats = memberStats.personalstats;
        const totalAttacks =
          (stats.attackswon || 0) +
          (stats.attackslost || 0) +
          (stats.attacksdraw || 0) +
          (stats.attacksassisted || 0);
        const formattedNetWorth = `$${Number(
          stats.networth || 0
        ).toLocaleString()}`;
        output += `<tr><td>${data.members[id].name}</td>
        <td>${id}</td>
        <td>${
          data.members[id].level
        }</td>
        <td>${stats.attackswon || 0}</td>
        <td>${
          stats.attackslost || 0
        }</td>
        <td>${stats.attacksdraw || 0}</td>
        <td>${
          stats.attacksassisted || 0
        }</td>
        <td><strong>${totalAttacks}</strong></td>
        <td>${
          stats.energydrinkused || 0
        }</td>
        <td>${stats.xantaken || 0}</td><td>${formattedNetWorth}</td>
        <td>${
          stats.rankedwarhits || 0
        }</td></tr>`;
      }
    }
    output += "</table><br><button onclick='exportCSV()'>Export CSV</button>";
  } else {
    output = "<p>No data found or access denied.</p>";
  }

  return output;
}
