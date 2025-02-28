"use client"
import { useState } from "react";
import { Button } from "~/components/ui/button";

export default function SearchPart() {
  const [searchValue, setSearchValue] = useState("");
  const [isUrl, setIsUrl] = useState(false);

  const urlOrNormalSearch = (input: string) => {
    const trimmedInput = input.trimStart();
    let tempWord = "";
    for (const word of trimmedInput) {
      tempWord += word;
      if (word === " ") {
        setIsUrl(false);
        return;
      } else if (
        tempWord === "http://www." ||
        tempWord === "https://www." ||
        tempWord === "www."
      ) {
        setIsUrl(true);
        return;
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    urlOrNormalSearch(searchValue);
    if (isUrl) {
      search(true);
    } else {
      search(false);
    }
  };

  const search = (isUrl: boolean) => {
    if (isUrl) {
      console.log({isUrl, searchValue})
      const url = `https://${searchValue}`;
      window.location.href = url;
    } else {
      const url = `https://www.google.com/search?q=${searchValue}`;
      window.location.href = url;
    }
  };

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
            >
              <input
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                type="text"
                placeholder="Search for anything..."
                className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="submit"
                variant={"outline"}
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
