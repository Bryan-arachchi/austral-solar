export const CATEGORY = {
  PANELS: 'Panels',
  INVERTERS: 'Inverters',
  BATTERIES: 'Batteries',
  MOUNTING_SYSTEMS: 'Mounting Systems',
  ACCESSORIES: 'Accessories',
  LED: 'LED'
} as const;

export type CATEGORY = typeof CATEGORY[keyof typeof CATEGORY]; 