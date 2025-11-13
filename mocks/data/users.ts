export interface User {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;
}

export interface Profile {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

// Mock users database
export const users: Map<string, User & { password: string }> = new Map([
  [
    'demo@civiclens.org',
    {
      email: 'demo@civiclens.org',
      password: 'password123',
      token: 'mock-jwt-token-demo-user',
      username: 'demouser',
      bio: 'Demo user for CivicLens platform. Passionate about civic engagement and community building.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    },
  ],
  [
    'jane@civiclens.org',
    {
      email: 'jane@civiclens.org',
      password: 'password123',
      token: 'mock-jwt-token-jane',
      username: 'janedoe',
      bio: 'Urban planner and civic technology advocate. Building better cities through data.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    },
  ],
  [
    'john@civiclens.org',
    {
      email: 'john@civiclens.org',
      password: 'password123',
      token: 'mock-jwt-token-john',
      username: 'johnsmith',
      bio: 'Community organizer and open data enthusiast. Making government more accessible.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    },
  ],
]);

// Track who follows whom
export const followingRelationships: Map<string, Set<string>> = new Map([
  ['demouser', new Set(['janedoe'])],
  ['janedoe', new Set(['demouser', 'johnsmith'])],
  ['johnsmith', new Set(['janedoe'])],
]);

export const getProfile = (username: string, currentUser?: string): Profile | null => {
  const userEntry = Array.from(users.values()).find((u) => u.username === username);
  if (!userEntry) return null;

  const following = currentUser
    ? followingRelationships.get(currentUser)?.has(username) || false
    : false;

  return {
    username: userEntry.username,
    bio: userEntry.bio,
    image: userEntry.image,
    following,
  };
};

export const getUserByToken = (token: string): User | null => {
  const userEntry = Array.from(users.values()).find((u) => u.token === token);
  if (!userEntry) return null;

  const { password: _, ...user } = userEntry;
  return user;
};

export const getUserByEmail = (email: string): (User & { password: string }) | null => {
  return users.get(email) || null;
};
