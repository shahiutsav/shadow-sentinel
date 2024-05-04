"use client";

import { fetchMemberDetails } from "@/actions";
import React, { useState } from "react";


export default function Home() {
  const [factionID, setFactionID] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [faction, setFaction] = useState<any>();

  const fetchFactionDetail = async () => {
    console.log("I am being called");
    let faction = await fetchMemberDetails({
      apiKey: apiKey,
      factionID: factionID,
    });

    console.log(Object.keys(faction.members));

    setFaction(faction);
  };

  const handleFactionIDChange = (event: React.FormEvent<HTMLInputElement>) => {
    setFactionID(event.currentTarget.value);
  };

  const handleAPIKeyChange = (event: React.FormEvent<HTMLInputElement>) => {
    setApiKey(event.currentTarget.value);
  };

  return (
    <main>
      <div className="max-w-[1280px] w-full shadow px-6 py-8 mx-auto rounded-md flex gap-8">
        <div className="flex-1">
          <label htmlFor="api_key_1">API Key 1</label>
          <input
            name="api_key_1"
            type="text"
            className="border"
            placeholder="API Key here"
            value={apiKey}
            onChange={handleAPIKeyChange}
          />
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <label htmlFor="faction_id">Faction ID</label>
          <input
            type="text"
            className="border"
            placeholder="8124"
            value={factionID}
            onChange={handleFactionIDChange}
          />
          <button
            className="bg-slate-950 text-white"
            onClick={fetchFactionDetail}
          >
            Search Faction
          </button>
        </div>
      </div>
      <div>
        <p>{faction?.ID}</p>
        <p>{faction?.name}</p>
        <ul>
          {Object.values(faction.members).map((member: any) => {
            return <li key={member}>{member.name}</li>;
          })}
        </ul>
      </div>
    </main>
  );
}
