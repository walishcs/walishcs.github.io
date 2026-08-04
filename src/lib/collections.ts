import { getCollection } from 'astro:content';
import {
  filterPublished,
  groupByYear,
  selectFeatured,
  sortByDateDesc,
} from './collection-utils';

export async function getPublishedPosts() {
  const posts = await getCollection('blog');
  return sortByDateDesc(
    filterPublished(posts, {
      isDraft: (entry) => entry.data.draft,
      publishedAt: (entry) => entry.data.publishedAt,
    }),
    (entry) => entry.data.publishedAt,
  );
}

export async function getProjects() {
  const projects = await getCollection('projects');
  return sortByDateDesc(projects, (entry) => entry.data.startDate);
}

export async function getTalks() {
  const talks = await getCollection('talks');
  return sortByDateDesc(talks, (entry) => entry.data.date);
}

export async function getActiveServices() {
  const services = await getCollection('services');
  return services
    .filter((entry) => entry.data.active)
    .sort(
      (a, b) =>
        a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
    );
}

export async function getNews() {
  return sortByDateDesc(
    await getCollection('news'),
    (entry) => entry.data.date,
  );
}

export async function getPublications() {
  const publications = await getCollection('publications');
  return [...publications].sort(
    (a, b) =>
      b.data.year - a.data.year || a.data.title.localeCompare(b.data.title),
  );
}

export async function getFeaturedPublications(limit = 3) {
  return selectFeatured(
    await getPublications(),
    (entry) => entry.data.featured,
    limit,
  );
}

export async function getFeaturedProjects(limit = 3) {
  return selectFeatured(
    await getProjects(),
    (entry) => entry.data.featured,
    limit,
  );
}

export async function getPublicationsByYear() {
  return groupByYear(await getPublications(), (entry) => entry.data.year);
}

export async function getTalksByYear() {
  return groupByYear(await getTalks(), (entry) =>
    Number(entry.data.date.slice(0, 4)),
  );
}
