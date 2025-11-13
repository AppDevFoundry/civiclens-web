export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };
}

// In-memory articles database
export const articles: Article[] = [
  {
    slug: 'how-to-build-civic-engagement-platforms',
    title: 'How to Build Civic Engagement Platforms',
    description: 'A comprehensive guide to building platforms that empower citizens',
    body: `# Building Civic Engagement Platforms

Civic engagement platforms are crucial for modern democracy. They provide citizens with tools to participate in governance, voice concerns, and collaborate on solutions.

## Key Components

1. **User Authentication** - Secure identity verification
2. **Issue Tracking** - Systems for reporting and tracking community issues
3. **Voting Mechanisms** - Democratic decision-making tools
4. **Data Visualization** - Making complex data accessible
5. **Communication Channels** - Facilitating dialogue between citizens and officials

## Best Practices

- Prioritize accessibility and inclusivity
- Ensure data privacy and security
- Design for mobile-first experiences
- Implement transparent algorithms
- Foster community moderation

## Technical Stack

For modern civic platforms, consider:
- **Frontend**: React/Next.js for responsive UIs
- **Backend**: Node.js or Python for API services
- **Database**: PostgreSQL for relational data
- **Analytics**: Open-source tools for transparency

The goal is to create technology that serves democracy, not the other way around.`,
    tagList: ['civic-tech', 'democracy', 'open-government', 'nextjs'],
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
    favorited: false,
    favoritesCount: 42,
    author: {
      username: 'janedoe',
      bio: 'Urban planner and civic technology advocate.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
      following: false,
    },
  },
  {
    slug: 'open-data-initiatives-transforming-cities',
    title: 'Open Data Initiatives Transforming Cities',
    description: 'How open data is revolutionizing urban planning and citizen services',
    body: `# Open Data: The Foundation of Smart Cities

Open data initiatives are transforming how cities operate and how citizens interact with their local government.

## Success Stories

### New York City
NYC's open data portal has over 2,000 datasets, enabling:
- Real-time transit information
- Restaurant inspection scores
- Crime statistics mapping

### Barcelona
The city uses open data for:
- Smart lighting systems
- Waste management optimization
- Tourism flow analysis

## Challenges

1. Data quality and standardization
2. Privacy concerns
3. Digital divide
4. Sustainability of initiatives

## Getting Started

If your city doesn't have an open data portal:
- Start with public records requests
- Partner with local universities
- Engage civic tech communities
- Advocate for open data policies

Remember: Data is only valuable when it's accessible and actionable.`,
    tagList: ['open-data', 'smart-cities', 'urban-planning'],
    createdAt: '2024-01-10T14:30:00.000Z',
    updatedAt: '2024-01-12T09:15:00.000Z',
    favorited: true,
    favoritesCount: 128,
    author: {
      username: 'johnsmith',
      bio: 'Community organizer and open data enthusiast.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      following: false,
    },
  },
  {
    slug: 'participatory-budgeting-guide',
    title: 'A Complete Guide to Participatory Budgeting',
    description: 'Empowering communities to decide how public money is spent',
    body: `# Participatory Budgeting: Democracy in Action

Participatory budgeting (PB) is a democratic process where community members directly decide how to spend part of a public budget.

## How It Works

1. **Idea Collection** - Residents submit project proposals
2. **Proposal Development** - Ideas are refined into concrete projects
3. **Voting** - Community members vote on their priorities
4. **Implementation** - Winning projects receive funding

## Benefits

- Increases civic engagement
- Improves budget transparency
- Addresses community priorities
- Builds trust in government
- Educates citizens on budgeting

## Implementation Tips

### For Government Officials
- Start with a meaningful budget amount
- Provide clear guidelines
- Support community facilitators
- Follow through on commitments

### For Citizens
- Attend brainstorming sessions
- Propose realistic projects
- Encourage diverse participation
- Monitor implementation

## Case Study: Porto Alegre, Brazil

The birthplace of PB in 1989. Results after 30 years:
- Increased water access from 75% to 98%
- Sewage coverage from 46% to 85%
- Schools increased fourfold

Participatory budgeting proves that when citizens are empowered, communities thrive.`,
    tagList: ['participatory-budgeting', 'democracy', 'public-finance', 'community'],
    createdAt: '2024-01-08T16:45:00.000Z',
    updatedAt: '2024-01-08T16:45:00.000Z',
    favorited: false,
    favoritesCount: 89,
    author: {
      username: 'demouser',
      bio: 'Demo user for CivicLens platform.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      following: false,
    },
  },
  {
    slug: 'digital-democracy-tools-2024',
    title: 'Top Digital Democracy Tools in 2024',
    description: 'The best platforms and tools for civic participation',
    body: `# Digital Democracy Tools Landscape

2024 brings exciting innovations in digital democracy. Here are the top tools transforming civic participation.

## Voting & Polling

- **Decidim** - Open-source participatory democracy platform
- **Loomio** - Collaborative decision-making
- **Consul** - Government transparency tool

## Citizen Reporting

- **FixMyStreet** - Report local issues
- **SeeClickFix** - Municipal issue tracking
- **PublicStuff** - Community engagement

## Data Platforms

- **OpenGov** - Budget transparency
- **Socrata** - Open data publishing
- **CKAN** - Data portal framework

## Communication

- **CitizenLab** - Community engagement
- **Bang the Table** - Online consultation
- **Granicus** - Government communications

## Emerging Trends

1. AI-powered sentiment analysis
2. Blockchain for voting security
3. AR for urban planning visualization
4. Mobile-first accessibility
5. Multilingual support

Choose tools that match your community's needs and technical capacity.`,
    tagList: ['digital-democracy', 'civic-tech', 'tools', 'technology'],
    createdAt: '2024-01-05T11:20:00.000Z',
    updatedAt: '2024-01-06T08:30:00.000Z',
    favorited: false,
    favoritesCount: 67,
    author: {
      username: 'janedoe',
      bio: 'Urban planner and civic technology advocate.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
      following: false,
    },
  },
  {
    slug: 'community-organizing-digital-age',
    title: 'Community Organizing in the Digital Age',
    description: 'Blending traditional organizing with modern technology',
    body: `# Modern Community Organizing

The fundamentals of community organizing remain the same, but digital tools have expanded our reach and capabilities.

## Core Principles (Unchanged)

- Build relationships first
- Listen before speaking
- Empower, don't control
- Celebrate small wins
- Maintain long-term commitment

## Digital Enhancements

### Outreach
- Social media campaigns
- Email newsletters
- Text banking
- Virtual town halls

### Coordination
- Shared calendars
- Project management tools
- Document collaboration
- Communication platforms

### Data & Analysis
- Voter databases
- Geographic mapping
- Petition tracking
- Impact measurement

## Hybrid Approaches

The most effective organizing combines:
- In-person relationship building
- Digital communication efficiency
- Physical community presence
- Online resource accessibility

## Warning Signs

Avoid these pitfalls:
- Over-relying on social media
- Ignoring digital divide
- Losing personal touch
- Data without action
- Technology for technology's sake

Remember: Tools serve the mission, not the other way around.`,
    tagList: ['community-organizing', 'digital-tools', 'activism'],
    createdAt: '2024-01-03T09:00:00.000Z',
    updatedAt: '2024-01-03T09:00:00.000Z',
    favorited: false,
    favoritesCount: 54,
    author: {
      username: 'johnsmith',
      bio: 'Community organizer and open data enthusiast.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      following: false,
    },
  },
];

// Track favorites
export const userFavorites: Map<string, Set<string>> = new Map([
  ['demouser', new Set(['open-data-initiatives-transforming-cities'])],
  ['janedoe', new Set(['participatory-budgeting-guide', 'community-organizing-digital-age'])],
  ['johnsmith', new Set(['how-to-build-civic-engagement-platforms'])],
]);

let articleIdCounter = articles.length;

export const createArticle = (
  articleData: { title: string; description: string; body: string; tagList: string[] },
  author: { username: string; bio: string; image: string }
): Article => {
  const slug = `${articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${++articleIdCounter}`;
  const now = new Date().toISOString();

  const newArticle: Article = {
    slug,
    title: articleData.title,
    description: articleData.description,
    body: articleData.body,
    tagList: articleData.tagList,
    createdAt: now,
    updatedAt: now,
    favorited: false,
    favoritesCount: 0,
    author: {
      ...author,
      following: false,
    },
  };

  articles.unshift(newArticle);
  return newArticle;
};

export const updateArticle = (
  slug: string,
  updates: Partial<{ title: string; description: string; body: string; tagList: string[] }>
): Article | null => {
  const index = articles.findIndex((a) => a.slug === slug);
  if (index === -1) return null;

  const article = articles[index];
  const updatedArticle = {
    ...article,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Update slug if title changed
  if (updates.title && updates.title !== article.title) {
    updatedArticle.slug = `${updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
  }

  articles[index] = updatedArticle;
  return updatedArticle;
};

export const deleteArticle = (slug: string): boolean => {
  const index = articles.findIndex((a) => a.slug === slug);
  if (index === -1) return false;

  articles.splice(index, 1);
  return true;
};

export const getArticleBySlug = (slug: string): Article | null => {
  return articles.find((a) => a.slug === slug) || null;
};
