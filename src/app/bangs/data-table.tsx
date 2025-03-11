"use client";

export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Plus } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "~/components/ui/input";

interface CustomBangs {
  name: string;
  bang: string;
  banglink: string;
}

function turnBang(bang: string) {
  if (bang.startsWith("!")) {
    return bang;
  } else {
    return "!" + bang;
  }
}

function isValidUrl(url: string): { isIt: boolean; returnString: string } {
  const urlRegex = /^(http|https|ftp|file):\/\/[^\s]+$/;
  const wwwRegex = /^www\.[^\s]+$/;

  if (urlRegex.test(url)) {
    return { isIt: true, returnString: url };
  } else if (wwwRegex.test(url)) {
    return { isIt: true, returnString: `http://${url}` };
  } else {
    return { isIt: false, returnString: "" };
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  addBangs: ({
    name,
    bang,
    banglink,
  }: CustomBangs) => Promise<
    { name: string; bang: string; banglink: string }[]
  >;
  deleteButton: (id: number) => Promise<void>;
  getDefaultBangs: (reqBang: string) => Promise<boolean>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  addBangs,
  deleteButton,
  getDefaultBangs,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    // The meta property in table.options.meta is a way to pass additional contextual data or utility functions to the table. In this case, it is being used to provide the deleteButton function, which allows rows in the table to be deleted.
    // You can pass any object to options.meta and access it anywhere the table is available via table.options.meta.
    meta: {
      deleteButton,
    },
  });

  const router = useRouter();

  return (
    <div className="w-3/5 rounded-md border">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-semibold">Bangs List</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Add new bang
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Add a custom bang shortcut to your collection. Please ensure
                URLs are correct.
              </DialogDescription>
            </DialogHeader>
            <form
              className="mt-4 space-y-4"
              action={async (formData: FormData) => {
                const name = formData.get("name") as string;
                const bang = formData.get("bang") as string;
                const banglink = formData.get("banglink") as string;

                const realBang = turnBang(bang);
                const haveSameBang = await getDefaultBangs(realBang);

                const isURL = isValidUrl(banglink);
                if (isURL.isIt && haveSameBang) {
                  try {
                    await addBangs({
                      name,
                      bang: realBang,
                      banglink: isURL.returnString,
                    });
                    toast.success("Bang added successfully!");
                  } catch (e) {
                    console.log(e);
                    toast.error("An error occurred");
                  }
                  router.refresh();
                } else {
                  if (haveSameBang === false) {
                    toast.error("We already have that bang");
                  } else {
                    toast.error("This is not a valid URL.");
                  }
                }
              }}
            >
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Google Search"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Bang</Label>
                <div className="flex items-center">
                  <span className="rounded-l-md border border-r-0 border-input bg-muted p-2">
                    !
                  </span>
                  <Input
                    id="bang"
                    name="bang"
                    placeholder="g"
                    className="w-full rounded-l-none"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Example: !g for Google
                </p>
              </div>

              <div className="space-y-2">
                <Label>URL Template</Label>
                <Input
                  id="banglink"
                  name="banglink"
                  placeholder="https://www.google.com/search?q={}"
                  className="w-full"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Use {} where the search term should go
                </p>
              </div>

              <DialogFooter className="mt-6">
                <Button type="submit" className="px-4">
                  Save Bang
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Toaster richColors />
    </div>
  );
}
