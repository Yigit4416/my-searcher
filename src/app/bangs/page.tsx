import {
  getCustomBangs,
  addCustomBang,
  deleteBang,
  getAllBangs,
} from "~/server/queries";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { type RealBangTypes, columns } from "./columns";
import { DataTable } from "./data-table";

interface CustomBangs {
  name: string;
  bang: string;
  banglink: string;
}

async function getCustomBangList(): Promise<RealBangTypes> {
  const result = await getCustomBangs();
  return result;
}

async function getAllDefaultBangs(reqBang: string) {
  "use server";
  const result = await getAllBangs();
  const haveBang = result.findIndex((bang) => bang.bang === reqBang);
  const customResult = await getCustomBangList();
  const haveCustomBang = customResult.findIndex(
    (bang) => bang.bang === reqBang,
  );
  if (haveBang === -1 && haveCustomBang === -1) {
    return true;
  } else {
    return false;
  }
}

// Send addCustomBang and allCustomBangs to lower level
export default async function Bangs() {
  async function addBang({ name, bang, banglink }: CustomBangs) {
    "use server";
    if (!name || !bang || !banglink) {
      throw new Error("All fields are required");
    }
    try {
      new URL(banglink);
    } catch (e) {
      console.error(e);
      throw new Error("Invalid URL format for banglink");
    }
    const result = await addCustomBang({ name, bang, banglink });
    return result;
  }

  async function deleteButton(bangId: number) {
    "use server";
    if (!bangId) throw new Error("bangId missing");

    await deleteBang(bangId);
  }

  const getData = await getCustomBangList();

  return (
    <>
      <SignedIn>
        <div className="mt-16 flex flex-col items-center justify-center space-y-6 pt-6">
          <DataTable
            columns={columns}
            data={getData}
            addBangs={addBang}
            deleteButton={deleteButton}
            getDefaultBangs={getAllDefaultBangs}
          />
        </div>
      </SignedIn>
      <SignedOut>
        <div className="mt-16 flex flex-col items-center justify-center space-y-6 p-6">
          Please login
        </div>
      </SignedOut>
    </>
  );
}
