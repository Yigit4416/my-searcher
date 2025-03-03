"use client";
import { Button } from "~/components/ui/button";
import { useState, useEffect } from "react";
import { getMockSuggestions } from "~/utils/mockData";
import axios from "axios";

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
    console.log("Fetching bang link for:", bang);
    const response = await fetch(`/api/dbreq?bang=${bang}`);
    console.log("Response status:", response.status);

    if (!response.ok) {
      console.error("Response not OK:", response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as BangResponse;
    console.log("Received data:", data);
    return { data };
  } catch (error) {
    console.error("Error fetching bang link:", error);
    throw error;
  }
}

export async function handleSubmission(formData: string): Promise<void> {
  let trimmedInput = formData.trimStart();
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
    trimmedInput = deleteBang({ entry: trimmedInput, bang: bang });
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

function deleteBang({ entry, bang }: { entry: string; bang: string[] }) {
  if (bang[0] === undefined) return entry;
  const bangLenght = bang[0].length;
  return entry.slice(bangLenght + 1);
}

export default function SearchPage() {
  const [ourInput, setOurInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const handleSuggestions = async () => {
    if (ourInput.length > 0) {
      try {
        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: ourInput }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = (await response.json()) as { response: string[] };
        console.log(data.response);
        setSuggestions(data.response);
      } catch (error) {
        console.error(error);
      }

      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSuggestions().catch((error) => console.error(error));
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [ourInput]);

  const handleSuggestionClick = (suggestion: string) => {
    setOurInput(suggestion);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleSubmission(ourInput);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
      setOurInput("");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 text-gray-100">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-gray-100 sm:text-6xl">
          Ojrd Search
        </h1>
      </div>
      <div className="flex w-full flex-row">
        <div className="mx-auto w-full max-w-2xl sm:w-3/5">
          <div className="relative w-full">
            <form
              className="flex w-full items-center"
              onSubmit={handleSubmit}
              name="search-form"
            >
              <input
                type="text"
                name="search"
                value={ourInput}
                disabled={loading}
                onChange={(e) => setOurInput(e.target.value)}
                placeholder="Search for anything..."
                className="m-3 w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-sm text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="submit"
                disabled={loading}
                variant="outline"
                className="rounded-r-md border border-gray-700 bg-gray-900 p-5 text-sm text-gray-100 hover:bg-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Search
              </Button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 z-10 mt-1 w-[calc(100%-3.5rem)] rounded-md border border-gray-700 bg-gray-900 shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={`suggestion-${index}`}
                    className="cursor-pointer border-b border-gray-700 p-3 text-gray-100 last:border-b-0 hover:bg-gray-800"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
