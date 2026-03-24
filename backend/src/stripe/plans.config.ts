export const PLANS = {
  free: {
    name: 'Free',
    generationsLimit: 3,
    iyzicoReferenceCode: null as null,
    price: 0,
  },
  starter: {
    name: 'Starter',
    generationsLimit: 50,
    iyzicoReferenceCode: process.env.IYZICO_STARTER_PLAN_REF || '',
    price: 29,
  },
  pro: {
    name: 'Pro',
    generationsLimit: -1, // -1 = unlimited
    iyzicoReferenceCode: process.env.IYZICO_PRO_PLAN_REF || '',
    price: 99,
  },
} as const;

export type PlanType = keyof typeof PLANS;
