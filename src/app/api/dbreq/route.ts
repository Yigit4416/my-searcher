import { getBang } from "~/server/queries";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const bang = url.searchParams.get("bang");
  if (!bang) {
    return new Response("Bang parameter is missing", { status: 400 });
  }
  const bangLink = await getBang(bang);
  if (!bangLink) {
    return new Response("Bang not found", { status: 404 });
  }
  return new Response(JSON.stringify({ banglink: bangLink.banglink }), {
    headers: { "Content-Type": "application/json" },
  });
}
