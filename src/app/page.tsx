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
  strength?: string; // Add the new attributes here
  speed?: string;
  defense?: string;
  dexterity?: string;
  total?: string;
  timestamp?: string;
}

export default function Home() {
  const [factionID, setFactionID] = useState("");
  const [tornApiKey, setTornApiKey] = useState("");
  const [tornstatsApiKey, setTornstatsApiKey] = useState("");
  const [faction, setFaction] = useState<any>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const members: Member[] = useMemo(() => [], []);

  const [data, setData] = useState<any>([]);

  const fetchFactionDetail = async () => {
    let faction = await fetchFactionDetails({
      apiKey: tornApiKey,
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
        apiKey: tornApiKey,
      });

      const totalAttacks =
        data.attackswon +
        data.attackslost +
        data.attacksdraw +
        data.attacksassisted;

      dataList.push({
        id: member.id,
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
    return dataList;
  };

  const getEnemyStatsFromSpies = async ({
    warID,
    originalData,
  }: {
    warID: string;
    originalData: Member[];
  }) => {
    const data = await fetchEnemyStats({
      apiKey: tornstatsApiKey,
      warID: warID,
    });

    const keys = Object.keys(data);
    if (data[keys[0]].hasOwnProperty("spy")) {
      console.log("Yup spy property found");
      for (const id in data) {
        const matchingObjectIndex = originalData.findIndex(
          (obj) => obj.id === id
        );
        if (matchingObjectIndex !== -1) {
          // Add new properties to the matching object within the originalData array
          originalData[matchingObjectIndex].strength = data[id].spy.strength;
          originalData[matchingObjectIndex].speed = data[id].spy.speed;
          originalData[matchingObjectIndex].defense = data[id].spy.defense;
          originalData[matchingObjectIndex].dexterity = data[id].spy.dexterity;
          originalData[matchingObjectIndex].total = data[id].spy.total;
          originalData[matchingObjectIndex].timestamp = data[id].spy.timestamp;
        }
      }

      setData(originalData);
    } else {
      for (const id in data) {
        const matchingObjectIndex = originalData.findIndex(
          (obj) => obj.id === id
        );
        if (matchingObjectIndex !== -1) {
          // Add new properties to the matching object within the originalData array
          originalData[matchingObjectIndex].strength = "NA";
          originalData[matchingObjectIndex].speed = "NA";
          originalData[matchingObjectIndex].defense = "NA";
          originalData[matchingObjectIndex].dexterity = "NA";
          originalData[matchingObjectIndex].total = "NA";
          originalData[matchingObjectIndex].timestamp = "NA";
        }
      }
    }
  };

  const handleFactionIDChange = (event: React.FormEvent<HTMLInputElement>) => {
    setFactionID(event.currentTarget.value);
  };

  return (
    <main className="h-dvh">
      <div className="max-w-72 h-full fixed shadow px-6 py-8 rounded-md flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <label htmlFor="torn_api_key">Torn API Key</label>
          <input
            name="torn_api_key"
            type="text"
            className="border p-2 rounded-md border-slate-400"
            placeholder="API Key here"
            value={tornApiKey}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              setTornApiKey(e.currentTarget.value)
            }
          />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="tornstats_api_key">Tornstats API Key</label>
          <input
            name="tornstats_api_key"
            type="text"
            className="border p-2 rounded-md border-slate-400"
            placeholder="API Key here"
            value={tornstatsApiKey}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              setTornstatsApiKey(e.currentTarget.value)
            }
          />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="faction_id">War Enemy Faction ID</label>
          <input
            type="text"
            className="border p-2 rounded-md border-slate-400"
            placeholder="8124"
            value={factionID}
            onChange={handleFactionIDChange}
          />
          <button
            className="bg-slate-950 text-white p-2 rounded-md disabled:bg-slate-500 disabled:line-through disabled:cursor-not-allowed flex items-center justify-center h-10"
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true);
              fetchFactionDetail().then((faction) => {
                setMembersList({ faction: faction });
                getPersonalStats().then((originalData) => {
                  getEnemyStatsFromSpies({
                    warID: Object.keys(faction.ranked_wars)[0],
                    originalData: originalData,
                  }).then(() => {
                    setIsLoading(false);
                  });
                });
              });
            }}
          >
            {isLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-b-4 border-t-4 border-white"></span>
            ) : (
              "Search Faction"
            )}
          </button>
        </div>
      </div>
      <div className="w-[calc(100%-288px)] ml-auto mr-0">
        <CustomTable
          factionName={faction && faction.name}
          data={data}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
