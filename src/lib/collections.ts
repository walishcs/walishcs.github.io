import { getCollection, type CollectionEntry } from 'astro:content';
import {
  filterPublished,
  groupByYear,
  selectFeatured,
  sortByDateDesc,
} from './collection-utils';
import {
  comparePublicationYears,
  type PublicationYear,
} from './publication-utils';

type PublicationEntry = CollectionEntry<'publications'>;

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
      comparePublicationYears(
        a.data.year as PublicationYear,
        b.data.year as PublicationYear,
      ) || a.data.title.localeCompare(b.data.title),
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
  const groups = new Map<PublicationYear, PublicationEntry[]>();

  for (const publication of await getPublications()) {
    const year = publication.data.year as PublicationYear;
    const entries = groups.get(year) ?? [];
    entries.push(publication);
    groups.set(year, entries);
  }

  return [...groups.entries()]
    .sort(([first], [second]) => comparePublicationYears(first, second))
    .map(([year, entries]) => ({ year, entries }));
}

export async function getTalksByYear() {
  return groupByYear(await getTalks(), (entry) =>
    Number(entry.data.date.slice(0, 4)),
  );
}
