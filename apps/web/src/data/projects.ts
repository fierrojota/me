export type Project = {
  id: string;
  tag: string; // i18n key path, e.g. 'featuredSystems.superclean.tag'
  title: string; // i18n key path
  description: string; // i18n key path
  imageAlt?: string; // i18n key path — present only when `image` is set
  tagVariant?: 'success' | 'neutral';
  weight: number;
  url: string; // the whole card navigates here
  image?: { src: string; width: number; height: number };
};

export const projects: Project[] = [
  {
    id: 'aura',
    tag: 'featuredSystems.aura.tag',
    title: 'featuredSystems.aura.title',
    description: 'featuredSystems.aura.description',
    imageAlt: 'featuredSystems.aura.imageAlt',
    weight: 900, // flagship — biggest cell in the desktop treemap
    url: 'https://aura-dev.jotafierro.me/',
    image: { src: '/systems/aura.webp', width: 1376, height: 768 },
  },
  {
    id: 'jFlow',
    tag: 'featuredSystems.jFlow.tag',
    title: 'featuredSystems.jFlow.title',
    description: 'featuredSystems.jFlow.description',
    imageAlt: 'featuredSystems.jFlow.imageAlt',
    weight: 500,
    url: 'https://github.com/jotafierro/j-flow',
    image: { src: '/systems/j-flow.webp', width: 1376, height: 768 },
  },
  {
    id: 'superclean',
    tag: 'featuredSystems.superclean.tag',
    title: 'featuredSystems.superclean.title',
    description: 'featuredSystems.superclean.description',
    imageAlt: 'featuredSystems.superclean.imageAlt',
    tagVariant: 'neutral',
    weight: 300,
    url: 'https://github.com/jotafierro/superclean',
    image: { src: '/systems/superclean.webp', width: 1376, height: 768 },
  },
  {
    id: 'me',
    tag: 'featuredSystems.me.tag',
    title: 'featuredSystems.me.title',
    description: 'featuredSystems.me.description',
    imageAlt: 'featuredSystems.me.imageAlt',
    tagVariant: 'neutral',
    weight: 200,
    url: 'https://github.com/jotafierro/me',
    image: { src: '/systems/me.webp', width: 1376, height: 768 },
  },
];
