/**
 * Mock data for MSW browser mocking
 * This file contains realistic mock data to simulate a full backend
 */

import { ArticleType } from '../lib/types/articleType';
import { UserType } from '../lib/types/userType';
import { CommentType } from '../lib/types/commentType';

// Mock users
export const mockUsers: Record<string, UserType> = {
  'jake@jake.jake': {
    email: 'jake@jake.jake',
    username: 'jake',
    bio: 'I work at statefarm',
    image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
    token: 'jwt.token.jake',
  },
  'john@john.john': {
    email: 'john@john.john',
    username: 'john',
    bio: 'Software engineer and civic engagement enthusiast',
    image: 'https://api.realworld.io/images/demo-avatar.png',
    token: 'jwt.token.john',
  },
  'jane@jane.jane': {
    email: 'jane@jane.jane',
    username: 'jane',
    bio: 'Policy researcher and community organizer',
    image: 'https://i.pravatar.cc/150?img=5',
    token: 'jwt.token.jane',
  },
};

// Current logged-in user (can be changed during development)
export let currentUser: UserType | null = null;

export const setCurrentUser = (user: UserType | null) => {
  currentUser = user;
};

// Mock articles with realistic civic engagement content
export const mockArticles: ArticleType[] = [
  {
    slug: 'understanding-local-governance',
    title: 'Understanding Local Governance: A Beginner\'s Guide',
    description: 'Learn how your city council works and how you can make your voice heard in local decisions.',
    body: `# Understanding Local Governance

Local governance is the foundation of civic engagement. Your city council makes decisions that directly affect your daily life - from zoning laws to public transportation budgets.

## How City Councils Work

City councils typically meet monthly and are composed of elected representatives from different districts. These meetings are public, and citizens can attend to voice their concerns.

## How to Get Involved

1. Attend city council meetings
2. Contact your representatives
3. Join local civic organizations
4. Vote in local elections

Remember: local government has the most direct impact on your community!`,
    tagList: ['civics', 'local-government', 'democracy'],
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: '2025-01-15T10:00:00.000Z',
    favorited: false,
    favoritesCount: 42,
    author: {
      username: 'jake',
      bio: 'I work at statefarm',
      image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
      following: false,
    },
  },
  {
    slug: 'community-organizing-tips',
    title: '5 Essential Tips for Community Organizing',
    description: 'Practical advice for building grassroots movements and creating real change in your neighborhood.',
    body: `# 5 Essential Tips for Community Organizing

Building a strong community movement takes time, dedication, and strategy. Here are five essential tips to get you started.

## 1. Start Small

Don't try to solve every problem at once. Focus on one specific issue that affects your community and build from there.

## 2. Build Relationships

Community organizing is all about relationships. Get to know your neighbors, local business owners, and community leaders.

## 3. Create Clear Goals

Define what success looks like. Make your goals specific, measurable, and achievable.

## 4. Use Multiple Communication Channels

Meet people where they are - use social media, flyers, door-knocking, and community events.

## 5. Celebrate Small Wins

Recognize progress along the way to keep your team motivated and engaged.

Together, we can create the change we want to see!`,
    tagList: ['organizing', 'community', 'activism'],
    createdAt: '2025-01-14T14:30:00.000Z',
    updatedAt: '2025-01-14T14:30:00.000Z',
    favorited: true,
    favoritesCount: 67,
    author: {
      username: 'jane',
      bio: 'Policy researcher and community organizer',
      image: 'https://i.pravatar.cc/150?img=5',
      following: true,
    },
  },
  {
    slug: 'transparency-in-government',
    title: 'The Importance of Transparency in Government',
    description: 'Why open government data and transparent decision-making matter for democracy.',
    body: `# The Importance of Transparency in Government

Transparency is the cornerstone of democratic governance. When government operates in the open, citizens can hold their representatives accountable.

## What is Government Transparency?

Government transparency means that citizens have access to:
- Meeting minutes and agendas
- Budget documents
- Voting records
- Policy proposals
- Public records

## Why It Matters

Transparent government:
- Builds public trust
- Reduces corruption
- Enables informed voting
- Encourages civic participation
- Improves policy outcomes

## How to Access Public Information

Most local governments have open data portals where you can access meeting minutes, budgets, and other important documents. You can also file Freedom of Information Act (FOIA) requests.`,
    tagList: ['transparency', 'open-government', 'accountability'],
    createdAt: '2025-01-13T09:15:00.000Z',
    updatedAt: '2025-01-13T09:15:00.000Z',
    favorited: false,
    favoritesCount: 89,
    author: {
      username: 'john',
      bio: 'Software engineer and civic engagement enthusiast',
      image: 'https://api.realworld.io/images/demo-avatar.png',
      following: false,
    },
  },
  {
    slug: 'voting-rights-overview',
    title: 'Your Voting Rights: What You Need to Know',
    description: 'A comprehensive guide to understanding and protecting your right to vote.',
    body: `# Your Voting Rights: What You Need to Know

Voting is one of the most powerful tools citizens have to influence their government. Understanding your voting rights is essential.

## Federal Protections

The Voting Rights Act protects against discrimination in voting. Key protections include:
- No literacy tests
- No poll taxes
- Language assistance for voters
- Protection against intimidation

## Registration

Most states allow online voter registration. Deadlines vary by state, so check your local election office.

## Early Voting and Absentee Ballots

Many states offer early voting or vote-by-mail options. Check your state's rules.

## What to Bring

Requirements vary by state. Some require photo ID, others accept utility bills or bank statements.

## If You Encounter Problems

Contact your local election protection hotline or the Election Protection Coalition at 866-OUR-VOTE.`,
    tagList: ['voting', 'rights', 'democracy', 'elections'],
    createdAt: '2025-01-12T16:45:00.000Z',
    updatedAt: '2025-01-12T16:45:00.000Z',
    favorited: true,
    favoritesCount: 134,
    author: {
      username: 'jake',
      bio: 'I work at statefarm',
      image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
      following: false,
    },
  },
  {
    slug: 'understanding-public-budgets',
    title: 'How to Read Your City\'s Budget',
    description: 'Demystifying public budgets and learning where your tax dollars go.',
    body: `# How to Read Your City's Budget

Public budgets can seem intimidating, but understanding them is crucial for informed civic participation.

## Budget Basics

A municipal budget shows:
- Expected revenue (taxes, fees, grants)
- Planned expenditures (services, infrastructure, personnel)
- Capital projects (long-term investments)

## Where Does the Money Come From?

Common revenue sources:
- Property taxes
- Sales taxes
- User fees (parking, permits)
- State/federal grants
- Bonds

## Where Does It Go?

Typical spending categories:
- Public safety (police, fire)
- Infrastructure (roads, water, sewer)
- Parks and recreation
- Education (if applicable)
- Administrative costs

## How to Get Involved

1. Attend budget hearings
2. Review draft budgets online
3. Submit public comments
4. Contact your representatives

Your input matters!`,
    tagList: ['budget', 'taxes', 'local-government', 'finance'],
    createdAt: '2025-01-11T11:00:00.000Z',
    updatedAt: '2025-01-11T11:00:00.000Z',
    favorited: false,
    favoritesCount: 56,
    author: {
      username: 'john',
      bio: 'Software engineer and civic engagement enthusiast',
      image: 'https://api.realworld.io/images/demo-avatar.png',
      following: false,
    },
  },
];

// Mock comments
export const mockComments: Record<string, CommentType[]> = {
  'understanding-local-governance': [
    {
      id: 1,
      createdAt: '2025-01-15T12:30:00.000Z',
      updatedAt: '2025-01-15T12:30:00.000Z',
      body: 'Great introduction! I just attended my first city council meeting last week.',
      author: {
        username: 'john',
        bio: 'Software engineer and civic engagement enthusiast',
        image: 'https://api.realworld.io/images/demo-avatar.png',
        following: false,
      },
    },
    {
      id: 2,
      createdAt: '2025-01-15T14:00:00.000Z',
      updatedAt: '2025-01-15T14:00:00.000Z',
      body: 'This is so helpful! Can you write a follow-up about how to find your representatives?',
      author: {
        username: 'jane',
        bio: 'Policy researcher and community organizer',
        image: 'https://i.pravatar.cc/150?img=5',
        following: true,
      },
    },
  ],
  'community-organizing-tips': [
    {
      id: 3,
      createdAt: '2025-01-14T16:00:00.000Z',
      updatedAt: '2025-01-14T16:00:00.000Z',
      body: 'We used these exact tips to organize our neighborhood cleanup initiative!',
      author: {
        username: 'jake',
        bio: 'I work at statefarm',
        image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
        following: false,
      },
    },
  ],
  'transparency-in-government': [],
  'voting-rights-overview': [
    {
      id: 4,
      createdAt: '2025-01-12T18:00:00.000Z',
      updatedAt: '2025-01-12T18:00:00.000Z',
      body: 'Important information everyone should know!',
      author: {
        username: 'jane',
        bio: 'Policy researcher and community organizer',
        image: 'https://i.pravatar.cc/150?img=5',
        following: true,
      },
    },
  ],
  'understanding-public-budgets': [
    {
      id: 5,
      createdAt: '2025-01-11T13:00:00.000Z',
      updatedAt: '2025-01-11T13:00:00.000Z',
      body: 'I never understood budgets before. This makes it so much clearer!',
      author: {
        username: 'jake',
        bio: 'I work at statefarm',
        image: 'https://api.realworld.io/images/smiley-cyrus.jpeg',
        following: false,
      },
    },
  ],
};

// Mock tags
export const mockTags = [
  'civics',
  'local-government',
  'democracy',
  'organizing',
  'community',
  'activism',
  'transparency',
  'open-government',
  'accountability',
  'voting',
  'rights',
  'elections',
  'budget',
  'taxes',
  'finance',
];

// Helper to get user from token
export const getUserFromToken = (token: string): UserType | null => {
  return Object.values(mockUsers).find((user) => user.token === token) || null;
};

// Helper to generate new IDs
let nextCommentId = 100;
export const getNextCommentId = () => nextCommentId++;

let nextArticleId = 10;
export const getNextArticleSlug = (title: string) => {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${slug}-${nextArticleId++}`;
};
