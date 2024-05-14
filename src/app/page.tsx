"use client";

import {
  fetchEnemyStats,
  fetchFactionDetails,
  fetchPersonalStats,
} from "@/server/actions";
import CustomTable from "@/components/mui-table";
import React, { useMemo, useState } from "react";
import axios from "axios";

interface Member {
  id: string;
  name: string;
  status: string;
  level: number;
  strength?: number; // Add the new attributes here
  speed?: number;
  defense?: number;
  dexterity?: number;
  total?: number;
  totalAttacks?: number;
  networth?: number;
  xanaxTaken?: number;
  warHit?: number;
  revivesDone?: number;
  cansUsed?: number;
}

interface SpyMemberData {
  id: string;
  spy?: {
    strength: number;
    speed: number;
    defense: number;
    dexterity: number;
    total: number;
    timestamp: number;
  };
}

export default function Home() {
  const [factionID, setFactionID] = useState("");
  const [tornApiKey, setTornApiKey] = useState("");
  const [tornstatsApiKey, setTornstatsApiKey] = useState("");
  const [faction, setFaction] = useState<any>();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState(60);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const members: Member[] = useMemo(() => [], []);

  const [tableData, setTableData] = useState<any>([]);

  const [error, setError] = useState<string | undefined>(undefined);

  const [tornApiInputError, setTornApiInputError] = useState<
    string | undefined
  >(undefined);
  const [tornStatsApiInputError, setTornStatsApiInputError] = useState<
    string | undefined
  >(undefined);

  const doesWarExist = ({ faction }: { faction: any }) => {
    if (Object.keys(faction.ranked_wars).length === 0) {
      return false;
    } else {
      return true;
    }
  };

  const fetchFactionDetail = async () => {
    let response = await fetchFactionDetails({
      apiKey: tornApiKey,
      factionID: factionID,
    });

    setError(undefined);
    switch (response.status) {
      case 500:
        setIsLoading(false);
        setError("The torn server cannot be reached.");
        return;
      case 404:
        setError("The faction does not exist");
        setIsLoading(false);
        return;
      case 200:
        return response.data;
    }
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
    let dataList: Member[] = [];

    await Promise.all(
      members.map((member) =>
        axios
          .get(
            `https://api.torn.com/user/${
              member.id
            }?key=${tornApiKey}&timestamp=${1715641606}&stat=boostersused,xantaken,networth,rankedwarhits,revives,energydrinkused,attackswon,attackslost,attacksdraw,attacksassisted&comment=ShadowSentinel&selections=personalstats`
          )
          .then((data) => {
            const personalStats = data.data.personalstats;
            const totalAttacks =
              personalStats.attackswon +
              personalStats.attackslost +
              personalStats.attacksdraw +
              personalStats.attacksassisted;

            dataList.push({
              id: member.id,
              name: member.name,
              status: member.status,
              level: member.level,
              totalAttacks: totalAttacks,
              networth: personalStats.networth,
              xanaxTaken: personalStats.xantaken,
              warHit: personalStats.rankedwarhits,
              revivesDone: personalStats.revives,
              cansUsed: personalStats.energydrinkused,
            });
          })
      )
    );

    return dataList;
  };

  const getEnemyStatsFromSpies = async ({
    factionID,
    originalData,
  }: {
    factionID: string;
    originalData: Member[];
  }) => {
    const data: Record<string, SpyMemberData> = await fetchEnemyStats({
      apiKey: tornstatsApiKey,
      factionID: factionID,
    });

    Object.values(data).map((member: { id: string; spy?: any }) => {
      const matchingObjectIndex = originalData.findIndex((obj) => {
        return obj.id === member.id.toString();
      });
      if (matchingObjectIndex !== -1 && member?.hasOwnProperty("spy")) {
        // Add new properties to the matching object within the originalData array
        originalData[matchingObjectIndex].strength = member.spy.strength;
        originalData[matchingObjectIndex].speed = member.spy.speed;
        originalData[matchingObjectIndex].defense = member.spy.defense;
        originalData[matchingObjectIndex].dexterity = member.spy.dexterity;
        originalData[matchingObjectIndex].total = member.spy.total;
      } else {
        originalData[matchingObjectIndex].strength = 0;
        originalData[matchingObjectIndex].speed = 0;
        originalData[matchingObjectIndex].defense = 0;
        originalData[matchingObjectIndex].dexterity = 0;
        originalData[matchingObjectIndex].total = 0;
      }
    });

    setTableData(originalData);
  };

  const handleFactionIDChange = (event: React.FormEvent<HTMLInputElement>) => {
    setFactionID(event.currentTarget.value);
  };

  const disableForAMinute = () => {
    setDisabled(true);

    const intervalId = setInterval(() => {
      setSecondsLeft((prevSeconds) => prevSeconds - 1);
    }, 1000); // Update every second

    setTimeout(() => {
      clearInterval(intervalId);
      setDisabled(false);
      setSecondsLeft(60);
    }, 60000); // 60000 milliseconds = 1 minute
  };

  const handleTornAPIKeyInputChange = (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    if (e.currentTarget.value.length !== 16) {
      setTornApiInputError("The api key should be 16 characters long");
    } else {
      setTornApiInputError(undefined);
    }

    setTornApiKey(e.currentTarget.value);
  };

  const handleTornStatsAPIKeyInputChange = (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    if (e.currentTarget.value.length !== 19) {
      setTornStatsApiInputError("The api key should be 19 characters long");
    } else {
      setTornStatsApiInputError(undefined);
    }

    setTornstatsApiKey(e.currentTarget.value);
  };

  const handleFetchWarData = async () => {
    setIsLoading(true);
    fetchFactionDetail().then((faction) => {
      setMembersList({ faction: faction });
      const warExists = doesWarExist({ faction: faction });
      if (warExists) {
        getPersonalStats().then((originalData) => {
          getEnemyStatsFromSpies({
            factionID: factionID,
            originalData: originalData,
          }).then(() => {
            setIsLoading(false);
            disableForAMinute();
          });
        });
      } else {
        setIsLoading(false);
        setError("The faction is not at war");
      }
    });
  };

  return (
    <main className="h-dvh">
      <div className="max-w-72 h-full fixed shadow px-6 py-8 rounded-md">
        <form action={handleFetchWarData} className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <label htmlFor="torn_api_key">Torn API Key</label>
            <input
              required
              name="torn_api_key"
              type="text"
              className="border p-2 rounded-md border-slate-400"
              placeholder="API Key here"
              value={tornApiKey}
              onChange={handleTornAPIKeyInputChange}
            />
            {tornApiInputError && (
              <p className="text-xs text-red-400 font-medium">
                {tornApiInputError}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="tornstats_api_key">Tornstats API Key</label>
            <input
              required
              name="tornstats_api_key"
              type="text"
              className="border p-2 rounded-md border-slate-400"
              placeholder="API Key here"
              value={tornstatsApiKey}
              onChange={handleTornStatsAPIKeyInputChange}
            />
            {tornStatsApiInputError && (
              <p className="text-xs text-red-400 font-medium">
                {tornStatsApiInputError}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="faction_id">War Enemy Faction ID</label>
            <input
              required
              type="text"
              name="faction_id"
              className="border p-2 rounded-md border-slate-400"
              placeholder="8124"
              value={factionID}
              onChange={handleFactionIDChange}
            />
            {error && (
              <ul key={error}>
                <li className="text-red-500">{error}</li>
              </ul>
            )}
            <button
              className="bg-slate-950 text-white p-2 rounded-md disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center h-10"
              disabled={disabled || isLoading}
              type="submit"
              value="submit"
            >
              {isLoading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-b-4 border-t-4 border-white"></span>
              ) : (
                `Search Faction ${disabled ? `(${secondsLeft})` : ""}`
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="w-[calc(100%-288px)] ml-auto mr-0">
        <CustomTable
          factionName={faction && faction.name}
          data={tableData}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
