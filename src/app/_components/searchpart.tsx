"use client";
import { Button } from "~/components/ui/button";
import { useState } from "react";

function extractBang(inputStr: string): string[] {
  const words = inputStr.split(" ");
  const bangs = words.filter((word) => word.startsWith("!"));
  return bangs;
}

interface BangResponse {
  banglink: string;
}

async function getBangLink(bang: string) {
  try {
    console.log('Fetching bang link for:', bang);
    const response = await fetch(`/api/dbreq?bang=${bang}`);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      console.error('Response not OK:', response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json() as BangResponse;
    console.log('Received data:', data);
    return { data };
  } catch (error) {
    console.error("Error fetching bang link:", error);
    throw error;
  }
}

export async function handleSubmission(formData: string): Promise<void> {
  const trimmedInput = formData.trimStart();
  const isValid = isValidUrl(trimmedInput);
  let link = "";

  if (!isValid.isIt) {
    const bang = extractBang(trimmedInput);
    if (bang.length > 0) {
      if (bang[0]) {
        const response = await getBangLink(bang[0]);
        const data = response.data as { banglink: string };
        link = data.banglink;
        console.log(link);
      }
    } else {
      const response = await getBangLink("!duck");
      const data = response.data as { banglink: string };
      link = data.banglink;
    }
    window.location.href = `${link}${trimmedInput}`;
  } else {
    if (isValid.returnString) {
      window.location.href = isValid.returnString;
    } else {
      throw new Error("Invalid URL");
    }
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

export default function SearchPage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSubmission(ourInput);
  };

  const [ourInput, setOurInput] = useState("");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold sm:text-6xl">Ojrd Search</h1>
      </div>
      <div className="flex w-full flex-row">
        <div className="mx-auto w-full max-w-2xl sm:w-3/5">
          <div className="flex items-center">
            <form
              className="flex w-full items-center"
              onSubmit={handleSubmit}
              name="search-form"
            >
              <input
                type="text"
                name="search"
                onChange={(e) => setOurInput(e.target.value)}
                placeholder="Search for anything..."
                className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="submit"
                variant="outline"
                className="m-2 rounded-r-md border border-gray-300 p-5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
