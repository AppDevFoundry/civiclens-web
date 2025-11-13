import editorReducer from '../../lib/utils/editorReducer';

describe('editorReducer', () => {
  const initialState = {
    title: '',
    description: '',
    body: '',
    tagList: [],
  };

  describe('SET_TITLE', () => {
    it('updates the title', () => {
      const action = { type: 'SET_TITLE', text: 'New Title' };
      const result = editorReducer(initialState, action);

      expect(result.title).toBe('New Title');
      expect(result.description).toBe('');
      expect(result.body).toBe('');
      expect(result.tagList).toEqual([]);
    });

    it('preserves other state properties', () => {
      const state = {
        title: 'Old Title',
        description: 'Description',
        body: 'Body content',
        tagList: ['tag1'],
      };
      const action = { type: 'SET_TITLE', text: 'New Title' };
      const result = editorReducer(state, action);

      expect(result.title).toBe('New Title');
      expect(result.description).toBe('Description');
      expect(result.body).toBe('Body content');
      expect(result.tagList).toEqual(['tag1']);
    });
  });

  describe('SET_DESCRIPTION', () => {
    it('updates the description', () => {
      const action = { type: 'SET_DESCRIPTION', text: 'New Description' };
      const result = editorReducer(initialState, action);

      expect(result.description).toBe('New Description');
    });
  });

  describe('SET_BODY', () => {
    it('updates the body', () => {
      const action = { type: 'SET_BODY', text: 'New Body Content' };
      const result = editorReducer(initialState, action);

      expect(result.body).toBe('New Body Content');
    });

    it('handles markdown content', () => {
      const markdown = '# Header\n\n**Bold** text';
      const action = { type: 'SET_BODY', text: markdown };
      const result = editorReducer(initialState, action);

      expect(result.body).toBe(markdown);
    });
  });

  describe('ADD_TAG', () => {
    it('adds a new tag to empty list', () => {
      const action = { type: 'ADD_TAG', tag: 'javascript' };
      const result = editorReducer(initialState, action);

      expect(result.tagList).toEqual(['javascript']);
    });

    it('adds a new tag to existing list', () => {
      const state = { ...initialState, tagList: ['react'] };
      const action = { type: 'ADD_TAG', tag: 'typescript' };
      const result = editorReducer(state, action);

      expect(result.tagList).toEqual(['react', 'typescript']);
    });

    it('allows duplicate tags (validation should be elsewhere)', () => {
      const state = { ...initialState, tagList: ['react'] };
      const action = { type: 'ADD_TAG', tag: 'react' };
      const result = editorReducer(state, action);

      expect(result.tagList).toEqual(['react', 'react']);
    });
  });

  describe('REMOVE_TAG', () => {
    it('removes a tag from the list', () => {
      const state = { ...initialState, tagList: ['react', 'typescript', 'nextjs'] };
      const action = { type: 'REMOVE_TAG', tag: 'typescript' };
      const result = editorReducer(state, action);

      expect(result.tagList).toEqual(['react', 'nextjs']);
    });

    it('handles removing non-existent tag', () => {
      const state = { ...initialState, tagList: ['react'] };
      const action = { type: 'REMOVE_TAG', tag: 'nonexistent' };
      const result = editorReducer(state, action);

      expect(result.tagList).toEqual(['react']);
    });

    it('removes all occurrences of duplicate tags', () => {
      const state = { ...initialState, tagList: ['react', 'react', 'nextjs'] };
      const action = { type: 'REMOVE_TAG', tag: 'react' };
      const result = editorReducer(state, action);

      expect(result.tagList).toEqual(['nextjs']);
    });
  });

  describe('Unknown action', () => {
    it('throws an error for unhandled action type', () => {
      const action = { type: 'UNKNOWN_ACTION' };

      expect(() => editorReducer(initialState, action)).toThrow('Unhandled action');
    });
  });
});
