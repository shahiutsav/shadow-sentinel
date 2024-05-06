"use client";

import { fetchFactionDetails } from "@/server/actions";
import CustomTable from "@/components/mui-table";
import React, { useEffect, useState } from "react";

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

  const [members, setMembers] = useState<Member[]>([]);

  const fetchFactionDetail = async () => {
    let faction = await fetchFactionDetails({
      apiKey: apiKey,
      factionID: factionID,
    });

    setFaction(faction);
  };

  useEffect(() => {
    let totalMembers = [];
    if (faction !== undefined) {
      const members = faction.members;
      for (const id in members) {
        totalMembers.push({
          id: id,
          name: members[id].name,
          status: members[id].status.description,
          level: members[id].level,
        });
      }
    }

    setMembers(totalMembers);
  }, [faction]);

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
            onClick={fetchFactionDetail}
          >
            Search Faction
          </button>
        </div>
      </div>
      <div className="w-[calc(100%-288px)] ml-auto mr-0">
        <CustomTable
          factionName={faction && faction.name}
          members={faction && members}
          apiKey={apiKey}
        />
      </div>
    </main>
  );
}
