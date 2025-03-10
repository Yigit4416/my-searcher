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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
    cell: ({ row, table }) => {
      const bang = row.original;
      // The meta property in table.options.meta is a way to pass additional contextual data or utility functions to the table. In this case, it is being used to provide the deleteButton function, which allows rows in the table to be deleted.
      const { deleteButton } = table.options.meta as {
        deleteButton: (id: number) => Promise<void>;
      };
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();

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
            <DropdownMenuItem
              // Because this code executes after component is rendered so there is no problem calling async functions
              //✅ Use async in event handlers (onClick, onSubmit, etc.).
              //✅ Use useEffect for fetching data on mount.
              //❌ Do NOT make the component itself async.
              onClick={async () => {
                try {
                  await deleteButton(bang.id);
                  toast.success("Bang deleted successfully!");
                  router.refresh();
                } catch (e) {
                  console.error(e);
                  toast.error("Failed to delete bang");
                }
              }}
              className="cursor-pointer rounded-md bg-red-600 px-2 py-1 text-white transition hover:bg-red-800"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
