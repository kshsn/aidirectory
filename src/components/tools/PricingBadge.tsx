import { PricingType } from '@prisma/client';

const CONFIG: Record<PricingType, { label: string; classes: string }> = {
  FREE:        { label: 'Free',        classes: 'bg-free-bg text-free' },
  FREEMIUM:    { label: 'Freemium',    classes: 'bg-freemium-bg text-freemium' },
  PAID:        { label: 'Paid',        classes: 'bg-paid-bg text-paid' },
  OPEN_SOURCE: { label: 'Open Source', classes: 'bg-opensource-bg text-opensource' },
};

export default function PricingBadge({ type }: { type: PricingType }) {
  const { label, classes } = CONFIG[type] ?? CONFIG.FREEMIUM;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-badge text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}
