import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const linkSchema = z.object({
  label: z.string(),
  url: z.url(),
});

const publicationYearNumberSchema = z
  .union([z.number().int(), z.string().regex(/^\d{4}$/)])
  .transform(Number)
  .refine((year) => year >= 1800 && year <= 2200, {
    message: 'Publication year must be between 1800 and 2200.',
  });

const publicationYearSchema = z
  .union([
    publicationYearNumberSchema,
    z.literal('to-appear'),
    z.literal('ongoing'),
    z.object({
      discriminant: z.literal('year'),
      value: publicationYearNumberSchema,
    }),
    z.object({
      discriminant: z.literal('to-appear'),
      value: z.null().optional(),
    }),
    z.object({
      discriminant: z.literal('ongoing'),
      value: z.null().optional(),
    }),
  ])
  .transform((value) => {
    if (typeof value === 'object') {
      return value.discriminant === 'year' ? value.value : value.discriminant;
    }
    return value;
  });

const calendarDateSchema = z
  .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.date()])
  .transform((value) =>
    typeof value === 'string' ? value : value.toISOString().slice(0, 10),
  );

const publications = defineCollection({
  loader: glob({
    pattern: '**/*.{yaml,yml}',
    base: './src/content/publications',
  }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()).default([]),
    defaultContributorPosition: z.number().int().min(1).nullable().optional(),
    year: publicationYearSchema,
    type: z.enum([
      'article',
      'conference',
      'chapter',
      'book',
      'thesis',
      'report',
      'other',
    ]),
    venue: z.string().default(''),
    abstract: z.string().default(''),
    doi: z.string().default(''),
    links: z.array(linkSchema).default([]),
    featured: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string().default(''),
    publishedAt: calendarDateSchema,
    draft: z.boolean().default(true),
    tags: z.array(z.string()).default([]),
    cover: z.string().nullable().optional(),
  }),
});

const talks = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/talks' }),
  schema: z.object({
    title: z.string(),
    speakers: z.array(z.string()).default([]),
    defaultContributorPosition: z.number().int().min(1).nullable().optional(),
    date: calendarDateSchema,
    type: z.enum(['conference-presentation', 'invited-talk']),
    event: z.string().default(''),
    location: z.string().default(''),
    abstract: z.string().default(''),
    links: z.array(linkSchema).default([]),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().default(''),
    status: z.enum(['active', 'completed', 'on-hold']),
    startDate: calendarDateSchema.nullable().optional(),
    endDate: calendarDateSchema.nullable().optional(),
    cover: z.string().nullable().optional(),
    links: z.array(linkSchema).default([]),
    featured: z.boolean().default(false),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().default(''),
    audience: z.string().default(''),
    deliverables: z.array(z.string()).default([]),
    order: z.number().int().default(0),
    active: z.boolean().default(true),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: calendarDateSchema,
    summary: z.string().default(''),
    url: z.url().nullable().optional(),
  }),
});

export const collections = {
  publications,
  talks,
  blog,
  projects,
  services,
  news,
};
