export const getMockSuggestions = (query: string): string[] => {
  const mockData = [
    `${query} tutorial`,
    `${query} examples`,
    `${query} documentation`,
    `${query} best practices`,
    `${query} for beginners`,
  ];

  return query ? mockData : [];
};
