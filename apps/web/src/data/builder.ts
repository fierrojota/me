export type BuilderStat = {
  labelKey: string; // i18n key path
  titleKey: string; // i18n key path
  bodyKey: string; // i18n key path
};

export type BuilderProfile = {
  roleKey: string; // i18n key path — prefix text rendered before the company link
  company: { name: string; url: string };
  specializationKey: string; // i18n key path
  philosophyKey: string; // i18n key path
  quoteKey: string; // i18n key path
  stats: BuilderStat[];
};

export const builderProfile: BuilderProfile = {
  roleKey: 'builder.factRolePrefix',
  company: { name: 'Fz Sports', url: 'https://www.fzsports.com/' },
  specializationKey: 'builder.factSpecialization',
  philosophyKey: 'builder.factPhilosophy',
  quoteKey: 'builder.quote',
  stats: [
    { labelKey: 'builder.stat1Label', titleKey: 'builder.stat1Title', bodyKey: 'builder.stat1Body' },
    { labelKey: 'builder.stat2Label', titleKey: 'builder.stat2Title', bodyKey: 'builder.stat2Body' },
  ],
};
