import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

export const defaultSiteSettings = {
  name: 'Academic Portfolio',
  title: '',
  description:
    'An academic portfolio for research, writing, and professional work.',
  email: '',
  location: '',
  socialImage: null,
  socialLinks: [],
};

export const defaultHome = {
  eyebrow: 'Research · Writing · Practice',
  heading: 'A place for academic work and ideas.',
  introduction:
    'This site is ready for your biography, publications, projects, services, and writing.',
  portrait: null,
  primaryCtaLabel: 'About',
  primaryCtaUrl: '/about/',
  secondaryCtaLabel: 'Publications',
  secondaryCtaUrl: '/publications/',
  showFeaturedPublications: true,
  showFeaturedProjects: true,
  showLatestPosts: true,
  showNews: true,
};

export const defaultAbout = {
  heading: 'About',
  portrait: null,
  introduction: '',
  biography: '',
  affiliations: [],
  education: [],
  researchInterests: [],
  contactNote: '',
};

export async function getSiteSettings() {
  return (await reader.singletons.siteSettings.read()) ?? defaultSiteSettings;
}

export async function getHomeContent() {
  return (await reader.singletons.home.read()) ?? defaultHome;
}

export async function getAboutContent() {
  return (await reader.singletons.about.read()) ?? defaultAbout;
}
