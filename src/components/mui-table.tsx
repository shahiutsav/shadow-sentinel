"use client";

import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Typography } from "@mui/material";

const CustomTable = ({
  factionName,
  isLoading,
  data,
}: {
  factionName: string;
  isLoading: boolean;
  data: any;
}) => {
  //should be memoized or stable
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "level",
        header: "LVL",
        size: 20,
      },
      {
        accessorKey: "name", //access nested data with dot notation
        header: "Name",
        size: 150,
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
        Cell: ({ cell }) => {
          return (
            <span>
              {formatToThousandSeparator({ number: cell.getValue<number>() })}
            </span>
          );
        },
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
    state: {
      isLoading: isLoading,
    },
    muiSkeletonProps: {
      animation: "wave",
    },

    enableDensityToggle: false,
    enablePagination: false,
    enableStickyHeader: true,
    enableColumnPinning: true,
    initialState: {
      density: "compact",
      pagination: {
        pageIndex: 0,
        pageSize: 100,
      },
      sorting: [
        {
          id: "level",
          desc: true,
        },
      ],
      columnPinning: {
        left: ["level", "name"],
      },
    },
    muiTablePaperProps: {
      sx: {
        boxShadow: "none",
      },
    },
    muiTableContainerProps: {
      sx: {
        minHeight: "calc(100vh - 112px)",
        height: "calc(100vh - 112px)",
        maxHeight: "calc(100vh - 112px)",
      },
    },
    renderTopToolbarCustomActions: () => (
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

function formatToThousandSeparator({ number }: { number: number }) {
  let numberString = number.toString();

  let chars = numberString.split("");

  let commaCount = 0;
  let formattedString = "";

  for (let i = chars.length - 1; i >= 0; i--) {
    formattedString = chars[i] + formattedString;
    commaCount++;
    if (commaCount % 3 === 0 && i !== 0) {
      formattedString = "," + formattedString;
    }
  }

  return formattedString;
}
