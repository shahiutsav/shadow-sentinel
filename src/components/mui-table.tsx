"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { fetchPersonalStats } from "@/actions";

const CustomTable = ({ members, apiKey }: { members: any; apiKey: string }) => {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    getPersonalStats();
  }, [members]);

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
        data.attacksLost +
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

  //should be memoized or stable
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "name", //access nested data with dot notation
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "level",
        header: "Level",
        size: 150,
      },
      {
        accessorKey: "status", //normal accessorKey
        header: "Status",
        size: 200,
      },
      {
        accessorKey: "xanaxTaken",
        header: "Xanax Taken",
        size: 150,
      },
      {
        accessorKey: "warHit",
        header: "War Hit",
        size: 150,
      },
      {
        accessorKey: "cansUsed",
        header: "Cans Used",
        size: 150,
      },
      {
        accessorKey: "revivesDone",
        header: "Revives given",
        size: 150,
      },
      {
        accessorKey: "networth",
        header: "Networth",
        size: 150,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return <MaterialReactTable table={table} />;
};

export default CustomTable;
