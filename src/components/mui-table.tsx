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
  console.log(data);
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
        accessorKey: "strength",
        header: "STR",
        size: 20,
      },
      {
        accessorKey: "speed",
        header: "SPD",
        size: 20,
      },
      {
        accessorKey: "defense",
        header: "DF",
        size: 20,
      },
      {
        accessorKey: "dexterity",
        header: "DXT",
        size: 20,
      },
      {
        accessorKey: "total",
        header: "Total",
        size: 20,
      },
      {
        accessorKey: "timestamp",
        header: "Time",
        size: 20,
        Cell: ({ cell }) => {
          return (
            <span>
              {cell.getValue<string>() === "NA"
                ? "NA"
                : timestampToHumanReadable(
                    Number.parseInt(cell.getValue<string>())
                  )}
            </span>
          );
        },
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
    enableBottomToolbar: false,
    muiTableFooterProps: {
      sx: {
        display: "none",
      },
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
        minHeight: "calc(100vh - 56px)",
        height: "calc(100vh - 56px)",
        maxHeight: "calc(100vh - 56px)",
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

const timestampToHumanReadable = (timestamp: number) => {
  // Convert Unix timestamp to milliseconds
  const date = new Date(timestamp * 1000);

  // Get month abbreviation and zero-padded day
  const month = date.toLocaleString("default", { month: "short" });
  const day = ("0" + date.getDate()).slice(-2);

  // Get formatted time (12-hour format with am/pm)
  let hours = date.getHours();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12; // Convert 0 to 12
  const minutes = ("0" + date.getMinutes()).slice(-2);

  // Construct the human-readable date and time string
  const humanReadableDateTime = `${month} ${day}, ${date.getFullYear()} at ${hours}:${minutes} ${ampm}`;

  return humanReadableDateTime;
};
