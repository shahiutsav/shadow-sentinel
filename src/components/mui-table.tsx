"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { fetchPersonalStats } from "@/server/actions";
import { Box, Button, Typography } from "@mui/material";

const CustomTable = ({
  factionName,
  members,
  apiKey,
}: {
  factionName: string;
  members: any;
  apiKey: string;
}) => {
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
        size: 20,
      },
      {
        accessorKey: "xanaxTaken",
        header: "XT",
        size: 20,
      },
      {
        accessorKey: "totalAttacks",
        header: "TA",
        size: 20,
      },
      {
        accessorKey: "warHit",
        header: "WH",
        size: 20,
      },
      {
        accessorKey: "cansUsed",
        header: "CU",
        size: 20,
      },
      {
        accessorKey: "revivesDone",
        header: "RG",
        size: 20,
      },
      {
        accessorKey: "networth",
        header: "Networth",
        size: 150,
      },
      {
        accessorKey: "status", //normal accessorKey
        header: "Status",
        size: 260,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableDensityToggle: false,
    enablePagination: false,
    initialState: {
      density: "compact",
      pagination: {
        pageIndex: 0,
        pageSize: 100,
      },
    },
    muiTableBodyProps: {
      sx: {
        minHeight: "calc(100vh - 165.59px)",
        height: "calc(100vh - 165.59px)",
        maxHeight: "calc(100vh - 165.59px)",
        flexGrow: "1",
      },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Typography
        variant={"h5"}
        sx={{
          fontWeight: "bold",
        }}
      >
        {factionName}
      </Typography>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default CustomTable;
