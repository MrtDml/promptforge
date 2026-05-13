export const PLANS = {
  free: {
    name: 'Free',
    generationsLimit: 3,
    price: 0,
    priceTRY: 0,
  },
  starter: {
    name: 'Starter',
    generationsLimit: 50,
    price: 29,
    priceTRY: 950,
  },
  pro: {
    name: 'Pro',
    generationsLimit: -1, // -1 = sınırsız
    price: 99,
    priceTRY: 3250,
  },
} as const;

export type PlanType = keyof typeof PLANS;
