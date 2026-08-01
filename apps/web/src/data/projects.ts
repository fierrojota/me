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
    id: 'superclean',
    tag: 'featuredSystems.superclean.tag',
    title: 'featuredSystems.superclean.title',
    description: 'featuredSystems.superclean.description',
    weight: 800,
    url: 'https://github.com/jotafierro/superclean',
  },
  {
    id: 'backendTaskTracker',
    tag: 'featuredSystems.backendTaskTracker.tag',
    title: 'featuredSystems.backendTaskTracker.title',
    description: 'featuredSystems.backendTaskTracker.description',
    weight: 450,
    url: 'https://github.com/jotafierro/r-backend-task-tracker-cli',
  },
  {
    id: 'jUtils',
    tag: 'featuredSystems.jUtils.tag',
    title: 'featuredSystems.jUtils.title',
    description: 'featuredSystems.jUtils.description',
    tagVariant: 'neutral',
    weight: 200,
    url: 'https://github.com/jotafierro/j-utils',
  },
  {
    id: 'wrapperPath',
    tag: 'featuredSystems.wrapperPath.tag',
    title: 'featuredSystems.wrapperPath.title',
    description: 'featuredSystems.wrapperPath.description',
    tagVariant: 'neutral',
    weight: 200,
    url: 'https://github.com/jotafierro/wrapper-path',
  },
];
