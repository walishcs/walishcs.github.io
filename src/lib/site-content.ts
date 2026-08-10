import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import { isPdfPath } from './cv';
import { DEFAULT_SITE_THEME } from './site-theme-options';

const reader = createReader(process.cwd(), keystaticConfig);

export const defaultSiteSettings = {
  name: 'Academic Portfolio',
  defaultContributorName: '',
  title: '',
  theme: DEFAULT_SITE_THEME,
  description:
    'An academic portfolio for research, writing, and professional work.',
  email: '',
  location: '',
  socialImage: null,
  socialLinks: [],
  showAboutPage: true,
  showCvPage: false,
  showPublicationsPage: true,
  showTalksPage: true,
  showBlogPage: true,
  showProjectsPage: true,
  showServicesPage: true,
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

export const defaultCv = {
  heading: 'Curriculum vitae',
  introduction: '',
  pdf: null,
  presentation: [],
  externalUrl: '',
};

export async function getSiteSettings() {
  return {
    ...defaultSiteSettings,
    ...((await reader.singletons.siteSettings.read()) ?? {}),
  };
}

export async function getHomeContent() {
  return (await reader.singletons.home.read()) ?? defaultHome;
}

export async function getAboutContent() {
  return (await reader.singletons.about.read()) ?? defaultAbout;
}

export async function getCvContent() {
  const content = await reader.singletons.cv.read();

  return {
    ...defaultCv,
    ...(content ?? {}),
    pdf: isPdfPath(content?.pdf) ? content.pdf : null,
  };
}
