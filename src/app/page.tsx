"use client";

import {
  fetchEnemyStats,
  fetchFactionDetails,
  fetchPersonalStats,
} from "@/server/actions";
import CustomTable from "@/components/mui-table";
import React, { useEffect, useMemo, useState } from "react";

interface Member {
  id: string;
  name: string;
  status: string;
  level: number;
}

export default function Home() {
  const [factionID, setFactionID] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [faction, setFaction] = useState<any>();

  const members: Member[] = useMemo(() => [], []);

  const [data, setData] = useState<any>([]);

  const fetchFactionDetail = async () => {
    let faction = await fetchFactionDetails({
      apiKey: apiKey,
      factionID: factionID,
    });

    setFaction(faction);
    return faction;
  };

  const setMembersList = ({ faction }: { faction: any }) => {
    if (faction !== undefined) {
      const membersFromAPI = faction.members;
      for (const id in membersFromAPI) {
        members.push({
          id: id,
          name: membersFromAPI[id].name,
          status: membersFromAPI[id].status.description,
          level: membersFromAPI[id].level,
        });
      }
    }
  };

  const getPersonalStats = async () => {
    let dataList = [];
    for (let memberIndex in members) {
      const member = members[memberIndex];
      const data = await fetchPersonalStats({
        id: member.id,
        apiKey: apiKey,
      });

      const totalAttacks =
        data.attackswon +
        data.attackslost +
        data.attacksdraw +
        data.attacksassisted;

      dataList.push({
        name: member.name,
        status: member.status,
        level: member.level,
        totalAttacks: totalAttacks,
        networth: data.networth,
        xanaxTaken: data.xantaken,
        warHit: data.rankedwarhits,
        revivesDone: data.revives,
        cansUsed: data.energydrinkused,
      });
    }
    setData(dataList);
  };

  const getEnemyStatsFromSpies = async ({ warID }: { warID: string }) => {
    const data = await fetchEnemyStats({
      apiKey: process.env.TORNSTATS_API_KEY,
      warID: warID,
    });
    console.log(data, "war id");
  };

  const handleFactionIDChange = (event: React.FormEvent<HTMLInputElement>) => {
    setFactionID(event.currentTarget.value);
  };

  const handleAPIKeyChange = (event: React.FormEvent<HTMLInputElement>) => {
    setApiKey(event.currentTarget.value);
  };

  return (
    <main className="h-dvh">
      <div className="max-w-72 h-full fixed shadow px-6 py-8 rounded-md flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <label htmlFor="api_key_1">API Key</label>
          <input
            name="api_key_1"
            type="text"
            className="border p-2 rounded-md border-slate-400"
            placeholder="API Key here"
            value={apiKey}
            onChange={handleAPIKeyChange}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="faction_id">Faction ID</label>
          <input
            type="text"
            className="border p-2 rounded-md border-slate-400"
            placeholder="8124"
            value={factionID}
            onChange={handleFactionIDChange}
          />
          <button
            className="bg-slate-950 text-white p-2 rounded-md"
            onClick={async () => {
              fetchFactionDetail().then((faction) => {
                setMembersList({ faction: faction });
                getPersonalStats();
                getEnemyStatsFromSpies({
                  warID: Object.keys(faction.ranked_wars)[0],
                });
              });
            }}
          >
            Search Faction
          </button>
        </div>
      </div>
      <div className="w-[calc(100%-288px)] ml-auto mr-0">
        <CustomTable factionName={faction && faction.name} data={data} />
      </div>
    </main>
  );
}
