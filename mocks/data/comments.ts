export interface Comment {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };
}

// Store comments by article slug
export const commentsByArticle: Map<string, Comment[]> = new Map([
  [
    'how-to-build-civic-engagement-platforms',
    [
      {
        id: 1,
        createdAt: '2024-01-15T12:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
        body: 'Great article! I particularly appreciated the emphasis on accessibility. Too many civic tech projects forget about users with limited internet access or older devices.',
        author: {
          username: 'johnsmith',
          bio: 'Community organizer and open data enthusiast.',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
          following: false,
        },
      },
      {
        id: 2,
        createdAt: '2024-01-15T14:30:00.000Z',
        updatedAt: '2024-01-15T14:30:00.000Z',
        body: 'Would love to see more about security considerations. Civic platforms often handle sensitive data and need robust protection.',
        author: {
          username: 'demouser',
          bio: 'Demo user for CivicLens platform.',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
          following: false,
        },
      },
    ],
  ],
  [
    'open-data-initiatives-transforming-cities',
    [
      {
        id: 3,
        createdAt: '2024-01-11T09:00:00.000Z',
        updatedAt: '2024-01-11T09:00:00.000Z',
        body: 'Barcelona is such an inspiration! Their approach to smart city technology while maintaining citizen privacy is something more cities should emulate.',
        author: {
          username: 'janedoe',
          bio: 'Urban planner and civic technology advocate.',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
          following: false,
        },
      },
      {
        id: 4,
        createdAt: '2024-01-12T16:45:00.000Z',
        updatedAt: '2024-01-12T16:45:00.000Z',
        body: 'The digital divide point is crucial. Open data is only democratic if everyone can access and understand it. We need more investment in digital literacy programs.',
        author: {
          username: 'demouser',
          bio: 'Demo user for CivicLens platform.',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
          following: false,
        },
      },
    ],
  ],
  [
    'participatory-budgeting-guide',
    [
      {
        id: 5,
        createdAt: '2024-01-09T10:15:00.000Z',
        updatedAt: '2024-01-09T10:15:00.000Z',
        body: 'We implemented PB in our neighborhood and the results have been amazing. People feel much more connected to local government decisions.',
        author: {
          username: 'johnsmith',
          bio: 'Community organizer and open data enthusiast.',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
          following: false,
        },
      },
    ],
  ],
]);

let commentIdCounter = 5;

export const createComment = (
  articleSlug: string,
  body: string,
  author: { username: string; bio: string; image: string }
): Comment => {
  const now = new Date().toISOString();
  const newComment: Comment = {
    id: ++commentIdCounter,
    createdAt: now,
    updatedAt: now,
    body,
    author: {
      ...author,
      following: false,
    },
  };

  const articleComments = commentsByArticle.get(articleSlug) || [];
  articleComments.unshift(newComment);
  commentsByArticle.set(articleSlug, articleComments);

  return newComment;
};

export const deleteComment = (articleSlug: string, commentId: number): boolean => {
  const articleComments = commentsByArticle.get(articleSlug);
  if (!articleComments) return false;

  const index = articleComments.findIndex((c) => c.id === commentId);
  if (index === -1) return false;

  articleComments.splice(index, 1);
  return true;
};

export const getCommentsForArticle = (articleSlug: string): Comment[] => {
  return commentsByArticle.get(articleSlug) || [];
};
