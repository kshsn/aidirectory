import { describe, it, expect } from 'vitest';
import { createHash } from 'crypto';

// Extracted pure functions from the redirect API to test in isolation
function appendUtm(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', 'aidirectory');
    u.searchParams.set('utm_medium', 'affiliate');
    u.searchParams.set('utm_campaign', 'tools');
    return u.toString();
  } catch {
    return url;
  }
}

function hashIp(ip: string, salt = 'test-salt'): string {
  return createHash('sha256').update(ip + salt).digest('hex');
}

const BOT_UA_PATTERNS = [/googlebot/i, /bingbot/i, /slurp/i, /semrushbot/i, /ahrefsbot/i];
function isBot(ua: string): boolean {
  return BOT_UA_PATTERNS.some((p) => p.test(ua));
}

describe('appendUtm', () => {
  it('appends UTM params to a clean URL', () => {
    const result = appendUtm('https://jasper.ai');
    expect(result).toContain('utm_source=aidirectory');
    expect(result).toContain('utm_medium=affiliate');
    expect(result).toContain('utm_campaign=tools');
  });

  it('overwrites existing UTM params', () => {
    const result = appendUtm('https://jasper.ai?utm_source=google');
    expect(result).toContain('utm_source=aidirectory');
    expect(result).not.toContain('utm_source=google');
  });

  it('preserves existing non-UTM query params', () => {
    const result = appendUtm('https://example.com?ref=partner&plan=pro');
    expect(result).toContain('ref=partner');
    expect(result).toContain('plan=pro');
  });

  it('returns original URL if malformed', () => {
    const bad = 'not-a-url';
    expect(appendUtm(bad)).toBe(bad);
  });
});

describe('hashIp', () => {
  it('returns a 64-char hex string', () => {
    expect(hashIp('192.168.1.1')).toHaveLength(64);
  });

  it('is deterministic for same input', () => {
    expect(hashIp('10.0.0.1')).toBe(hashIp('10.0.0.1'));
  });

  it('produces different hashes for different IPs', () => {
    expect(hashIp('1.1.1.1')).not.toBe(hashIp('2.2.2.2'));
  });

  it('never returns raw IP', () => {
    const ip = '192.168.1.100';
    expect(hashIp(ip)).not.toContain(ip);
  });
});

describe('isBot', () => {
  it('detects Googlebot', () => {
    expect(isBot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')).toBe(true);
  });

  it('detects Bingbot', () => {
    expect(isBot('Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)')).toBe(true);
  });

  it('detects SemrushBot', () => {
    expect(isBot('Mozilla/5.0 (compatible; SemrushBot/7~bl)')).toBe(true);
  });

  it('does not flag real browsers', () => {
    expect(isBot('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')).toBe(false);
  });

  it('does not flag empty UA (logged but not filtered)', () => {
    expect(isBot('')).toBe(false);
  });
});
