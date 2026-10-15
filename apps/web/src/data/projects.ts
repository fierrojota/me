import nowTiny from '../assets/systems/now-344.webp';
import jFlowTiny from '../assets/systems/j-flow-344.webp';
import supercleanTiny from '../assets/systems/superclean-344.webp';
import meTiny from '../assets/systems/me-344.webp';
import nowLarge from '../assets/systems/now.webp';
import nowSmall from '../assets/systems/now-688.webp';
import jFlowLarge from '../assets/systems/j-flow.webp';
import jFlowSmall from '../assets/systems/j-flow-688.webp';
import supercleanLarge from '../assets/systems/superclean.webp';
import supercleanSmall from '../assets/systems/superclean-688.webp';
import meLarge from '../assets/systems/me.webp';
import meSmall from '../assets/systems/me-688.webp';

export type Project = {
  id: string;
  tag: string; // i18n key path, e.g. 'featuredSystems.superclean.tag'
  title: string; // i18n key path
  description: string; // i18n key path
  imageAlt?: string; // i18n key path — present only when `image` is set
  tagVariant?: 'success' | 'neutral';
  weight: number;
  url: string; // the whole card navigates here
  image?: { src: string; srcSmall: string; srcTiny: string; width: number; height: number };
};

export const projects: Project[] = [
  {
    id: 'now',
    tag: 'featuredSystems.now.tag',
    title: 'featuredSystems.now.title',
    description: 'featuredSystems.now.description',
    imageAlt: 'featuredSystems.now.imageAlt',
    weight: 900, // flagship — biggest cell in the desktop treemap
    url: 'https://youtu.be/utNbTEwnnLc', // the card is the video's thumbnail, so it opens the video
    image: { src: nowLarge, srcSmall: nowSmall, srcTiny: nowTiny, width: 1376, height: 768 },
  },
  {
    id: 'jFlow',
    tag: 'featuredSystems.jFlow.tag',
    title: 'featuredSystems.jFlow.title',
    description: 'featuredSystems.jFlow.description',
    imageAlt: 'featuredSystems.jFlow.imageAlt',
    weight: 500,
    url: 'https://github.com/fierrojota/j-flow',
    image: { src: jFlowLarge, srcSmall: jFlowSmall, srcTiny: jFlowTiny, width: 1376, height: 768 },
  },
  {
    id: 'superclean',
    tag: 'featuredSystems.superclean.tag',
    title: 'featuredSystems.superclean.title',
    description: 'featuredSystems.superclean.description',
    imageAlt: 'featuredSystems.superclean.imageAlt',
    tagVariant: 'neutral',
    weight: 300,
    url: 'https://github.com/fierrojota/superclean',
    image: { src: supercleanLarge, srcSmall: supercleanSmall, srcTiny: supercleanTiny, width: 1376, height: 768 },
  },
  {
    id: 'me',
    tag: 'featuredSystems.me.tag',
    title: 'featuredSystems.me.title',
    description: 'featuredSystems.me.description',
    imageAlt: 'featuredSystems.me.imageAlt',
    tagVariant: 'neutral',
    weight: 200,
    url: 'https://github.com/fierrojota/me',
    image: { src: meLarge, srcSmall: meSmall, srcTiny: meTiny, width: 1376, height: 768 },
  },
];
