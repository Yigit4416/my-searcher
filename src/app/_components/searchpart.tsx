export default function SearchPart() {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="mb-6 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold">Ojrd Search</h1>
        </div>
        <div className="w-full">
          <div className="mx-auto w-full sm:w-3/5 max-w-2xl">
            <input
              type="text"
              placeholder="Search for anything..."
              className="w-full rounded-md border border-gray-300 p-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    );
  }
  