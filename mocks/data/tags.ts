// Popular tags for civic engagement topics
export const tags: string[] = [
  'civic-tech',
  'democracy',
  'open-government',
  'open-data',
  'smart-cities',
  'urban-planning',
  'participatory-budgeting',
  'public-finance',
  'community',
  'digital-democracy',
  'tools',
  'technology',
  'community-organizing',
  'activism',
  'digital-tools',
  'nextjs',
  'react',
  'transparency',
  'citizen-engagement',
  'local-government',
];

export const getPopularTags = (): string[] => {
  // Return top tags (simulating popularity)
  return tags.slice(0, 15);
};
