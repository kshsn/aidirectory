import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PricingBadge from '@/components/tools/PricingBadge';

describe('PricingBadge', () => {
  it('renders Free badge', () => {
    render(<PricingBadge type="FREE" />);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('renders Freemium badge', () => {
    render(<PricingBadge type="FREEMIUM" />);
    expect(screen.getByText('Freemium')).toBeInTheDocument();
  });

  it('renders Paid badge', () => {
    render(<PricingBadge type="PAID" />);
    expect(screen.getByText('Paid')).toBeInTheDocument();
  });

  it('renders Open Source badge', () => {
    render(<PricingBadge type="OPEN_SOURCE" />);
    expect(screen.getByText('Open Source')).toBeInTheDocument();
  });

  it('applies correct classes for Free', () => {
    const { container } = render(<PricingBadge type="FREE" />);
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('text-free');
  });

  it('applies correct classes for Paid', () => {
    const { container } = render(<PricingBadge type="PAID" />);
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('text-paid');
  });
});
