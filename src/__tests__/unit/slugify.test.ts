import { describe, it, expect } from 'vitest';

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

describe('slugify', () => {
  it('converts to lowercase', () => {
    expect(slugify('ChatGPT')).toBe('chatgpt');
  });

  it('replaces spaces with hyphens', () => {
    expect(slugify('GitHub Copilot')).toBe('github-copilot');
  });

  it('removes special characters', () => {
    expect(slugify('Copy.ai')).toBe('copy-ai');
  });

  it('collapses multiple separators', () => {
    expect(slugify('AI  --  Tool')).toBe('ai-tool');
  });

  it('strips leading/trailing hyphens', () => {
    expect(slugify('  tool  ')).toBe('tool');
  });

  it('handles numbers', () => {
    expect(slugify('GPT-4o')).toBe('gpt-4o');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });
});
