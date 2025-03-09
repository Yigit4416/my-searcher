"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type BangsTypes = {
  id: number;
  name: string;
  bang: string;
  banglink: string;
};

export type RealBangTypes = BangsTypes[];

export const columns: ColumnDef<BangsTypes>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "bang",
    header: "Bang",
  },
  {
    accessorKey: "banglink",
    header: "Bang Link",
  },
  {
    id: "actions",
    accessorKey: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const bang = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-white/10 focus-visible:ring-white"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="text-white" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="rounded-lg border border-white bg-black/90 p-3 shadow-lg backdrop-blur-md"
          >
            <DropdownMenuLabel className="text-sm text-white opacity-80">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(String(bang.bang))}
              className="cursor-pointer rounded-md px-2 py-1 text-white transition hover:bg-white/10"
            >
              Copy bang
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
