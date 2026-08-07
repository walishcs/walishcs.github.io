import { collection, config, fields, singleton } from '@keystatic/core';

const linkFields = fields.object({
  label: fields.text({ label: 'Label', validation: { isRequired: true } }),
  url: fields.url({ label: 'URL', validation: { isRequired: true } }),
});

const imageField = (label: string, directory: string) =>
  fields.image({
    label,
    directory: `public/images/${directory}`,
    publicPath: `/images/${directory}/`,
  });

const partialDateField = (label: string) =>
  fields.text({
    label,
    description: 'Use YYYY-MM or YYYY-MM-DD.',
    validation: {
      pattern: {
        regex: /^$|^\d{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?$/,
        message: 'Use YYYY-MM or YYYY-MM-DD.',
      },
    },
  });

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'Academic Portfolio' },
    navigation: {
      Pages: ['siteSettings', 'home', 'about'],
      Research: ['publications', 'talks', 'projects'],
      Writing: ['blog', 'news'],
      Work: ['services'],
    },
  },
  singletons: {
    siteSettings: singleton({
      label: 'Site settings',
      path: 'src/content/singletons/site-settings',
      format: 'yaml',
      schema: {
        name: fields.text({ label: 'Name', validation: { isRequired: true } }),
        defaultContributorName: fields.text({
          label: 'Default author / speaker name',
          description:
            'Use “Family, Given” or “Given Family”. This name can be inserted and emphasized in Publications and Talks.',
        }),
        title: fields.text({ label: 'Academic title or role' }),
        description: fields.text({
          label: 'SEO description',
          multiline: true,
          validation: { length: { max: 180 } },
        }),
        email: fields.text({ label: 'Email' }),
        location: fields.text({ label: 'Location' }),
        socialImage: imageField('Default social image', 'site'),
        socialLinks: fields.array(linkFields, {
          label: 'Social links',
          itemLabel: (props) => props.fields.label.value || 'Social link',
        }),
        showAboutPage: fields.checkbox({
          label: 'Show About page',
          description: 'Include About in the public navigation.',
          defaultValue: true,
        }),
        showPublicationsPage: fields.checkbox({
          label: 'Show Publications page',
          description: 'Include Publications in the public navigation.',
          defaultValue: true,
        }),
        showTalksPage: fields.checkbox({
          label: 'Show Talks page',
          description: 'Include Talks in the public navigation.',
          defaultValue: true,
        }),
        showBlogPage: fields.checkbox({
          label: 'Show Blog page',
          description: 'Include Blog in the public navigation.',
          defaultValue: true,
        }),
        showProjectsPage: fields.checkbox({
          label: 'Show Projects page',
          description: 'Include Projects in the public navigation.',
          defaultValue: true,
        }),
        showServicesPage: fields.checkbox({
          label: 'Show Services page',
          description: 'Include Services in the public navigation.',
          defaultValue: true,
        }),
      },
    }),
    home: singleton({
      label: 'Home page',
      path: 'src/content/singletons/home',
      format: 'yaml',
      schema: {
        eyebrow: fields.text({ label: 'Eyebrow' }),
        heading: fields.text({ label: 'Heading' }),
        introduction: fields.text({ label: 'Introduction', multiline: true }),
        portrait: imageField('Hero portrait', 'home'),
        primaryCtaLabel: fields.text({ label: 'Primary CTA label' }),
        primaryCtaUrl: fields.text({ label: 'Primary CTA URL' }),
        secondaryCtaLabel: fields.text({ label: 'Secondary CTA label' }),
        secondaryCtaUrl: fields.text({ label: 'Secondary CTA URL' }),
        showFeaturedPublications: fields.checkbox({
          label: 'Show featured publications',
          defaultValue: true,
        }),
        showFeaturedProjects: fields.checkbox({
          label: 'Show featured projects',
          defaultValue: true,
        }),
        showLatestPosts: fields.checkbox({
          label: 'Show latest blog posts',
          defaultValue: true,
        }),
        showNews: fields.checkbox({
          label: 'Show news',
          defaultValue: true,
        }),
      },
    }),
    about: singleton({
      label: 'About page',
      path: 'src/content/singletons/about',
      format: 'yaml',
      schema: {
        heading: fields.text({ label: 'Heading' }),
        portrait: imageField('Portrait', 'about'),
        introduction: fields.text({ label: 'Introduction', multiline: true }),
        biography: fields.text({ label: 'Biography', multiline: true }),
        affiliations: fields.array(
          fields.object({
            name: fields.text({
              label: 'Institution or organisation',
              validation: { isRequired: true },
            }),
            role: fields.text({ label: 'Role' }),
            url: fields.url({ label: 'URL' }),
            startDate: partialDateField('Start date'),
            endDate: partialDateField('End date'),
            current: fields.checkbox({
              label: 'Current affiliation',
              defaultValue: false,
            }),
          }),
          {
            label: 'Affiliations',
            itemLabel: (props) => props.fields.name.value || 'Affiliation',
          },
        ),
        education: fields.array(
          fields.object({
            institution: fields.text({
              label: 'Institution',
              validation: { isRequired: true },
            }),
            degree: fields.text({ label: 'Degree' }),
            field: fields.text({ label: 'Field of study' }),
            url: fields.url({ label: 'Institution URL' }),
            startDate: partialDateField('Start date'),
            endDate: partialDateField('End date'),
            current: fields.checkbox({
              label: 'Currently studying',
              defaultValue: false,
            }),
          }),
          {
            label: 'Education',
            itemLabel: (props) => props.fields.institution.value || 'Education',
          },
        ),
        researchInterests: fields.array(fields.text({ label: 'Interest' }), {
          label: 'Research interests',
          itemLabel: (props) => props.value || 'Research interest',
        }),
        contactNote: fields.text({ label: 'Contact note', multiline: true }),
      },
    }),
  },
  collections: {
    publications: collection({
      label: 'Publications',
      slugField: 'title',
      path: 'src/content/publications/*',
      format: 'yaml',
      columns: ['title', 'type', 'featured'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        authors: fields.array(fields.text({ label: 'Author' }), {
          label: 'Authors',
          description:
            'Leave empty when the configured default name is the only author. Otherwise add authors in publication order using “Family, Given” or “Given Family”.',
          itemLabel: (props) => props.value || 'Author',
        }),
        defaultContributorPosition: fields.integer({
          label: 'Default name position',
          description:
            'When other authors are listed, enter 1 for first author, 2 for second, and so on. Leave empty when the default name is the only author or is already listed above.',
          validation: { min: 1 },
        }),
        year: fields.conditional(
          fields.select({
            label: 'Publication year',
            defaultValue: 'year',
            options: [
              { label: 'Year', value: 'year' },
              { label: 'To appear', value: 'to-appear' },
              { label: 'Ongoing', value: 'ongoing' },
            ],
            description:
              'Choose one status, or enter a numeric year. These choices are mutually exclusive.',
          }),
          {
            year: fields.integer({
              label: 'Year',
              description: 'Use a year from 1800 to 2200.',
              validation: { isRequired: true, min: 1800, max: 2200 },
            }),
            'to-appear': fields.empty(),
            ongoing: fields.empty(),
          },
        ),
        type: fields.select({
          label: 'Type',
          defaultValue: 'article',
          options: [
            { label: 'Journal article', value: 'article' },
            { label: 'Conference paper', value: 'conference' },
            { label: 'Book chapter', value: 'chapter' },
            { label: 'Book', value: 'book' },
            { label: 'Thesis', value: 'thesis' },
            { label: 'Report', value: 'report' },
            { label: 'Other', value: 'other' },
          ],
        }),
        venue: fields.text({ label: 'Venue or publisher' }),
        abstract: fields.text({ label: 'Abstract', multiline: true }),
        doi: fields.text({ label: 'DOI' }),
        links: fields.array(linkFields, {
          label: 'Links',
          itemLabel: (props) => props.fields.label.value || 'Publication link',
        }),
        featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
      },
    }),
    talks: collection({
      label: 'Talks',
      slugField: 'title',
      path: 'src/content/talks/*',
      format: 'yaml',
      columns: ['title', 'date', 'type', 'event'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        speakers: fields.array(fields.text({ label: 'Speaker' }), {
          label: 'Speakers',
          description:
            'Leave empty when the configured default name is the only speaker. Otherwise add speakers in presentation order using “Family, Given” or “Given Family”.',
          itemLabel: (props) => props.value || 'Speaker',
        }),
        defaultContributorPosition: fields.integer({
          label: 'Default name position',
          description:
            'When other speakers are listed, enter 1 for first speaker, 2 for second, and so on. Leave empty when the default name is the only speaker or is already listed above.',
          validation: { min: 1 },
        }),
        date: fields.date({
          label: 'Date',
          validation: { isRequired: true },
        }),
        type: fields.select({
          label: 'Type',
          defaultValue: 'conference-presentation',
          options: [
            {
              label: 'Conference presentation',
              value: 'conference-presentation',
            },
            { label: 'Invited talk', value: 'invited-talk' },
          ],
        }),
        event: fields.text({ label: 'Event or host' }),
        location: fields.text({ label: 'Location' }),
        abstract: fields.text({ label: 'Abstract', multiline: true }),
        links: fields.array(linkFields, {
          label: 'Links',
          itemLabel: (props) => props.fields.label.value || 'Talk link',
        }),
      },
    }),
    blog: collection({
      label: 'Blog posts',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'body' },
      entryLayout: 'content',
      columns: ['title', 'publishedAt', 'draft'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        excerpt: fields.text({ label: 'Excerpt', multiline: true }),
        publishedAt: fields.date({
          label: 'Published date',
          validation: { isRequired: true },
        }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: true }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value || 'Tag',
        }),
        cover: imageField('Cover image', 'blog'),
        body: fields.markdoc({ label: 'Body' }),
      },
    }),
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { contentField: 'body' },
      entryLayout: 'content',
      columns: ['title', 'status', 'featured'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        status: fields.select({
          label: 'Status',
          defaultValue: 'active',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Completed', value: 'completed' },
            { label: 'On hold', value: 'on-hold' },
          ],
        }),
        startDate: fields.date({ label: 'Start date' }),
        endDate: fields.date({ label: 'End date' }),
        cover: imageField('Cover image', 'projects'),
        links: fields.array(linkFields, {
          label: 'Links',
          itemLabel: (props) => props.fields.label.value || 'Project link',
        }),
        featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
        body: fields.markdoc({ label: 'Body' }),
      },
    }),
    services: collection({
      label: 'Services',
      slugField: 'title',
      path: 'src/content/services/*',
      format: { contentField: 'body' },
      entryLayout: 'content',
      columns: ['title', 'order', 'active'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        audience: fields.text({ label: 'Audience', multiline: true }),
        deliverables: fields.array(fields.text({ label: 'Deliverable' }), {
          label: 'Deliverables',
          itemLabel: (props) => props.value || 'Deliverable',
        }),
        order: fields.integer({ label: 'Sort order', defaultValue: 0 }),
        active: fields.checkbox({ label: 'Active', defaultValue: true }),
        body: fields.markdoc({ label: 'Body' }),
      },
    }),
    news: collection({
      label: 'News',
      slugField: 'title',
      path: 'src/content/news/*',
      format: 'yaml',
      columns: ['title', 'date'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Date', validation: { isRequired: true } }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        url: fields.url({ label: 'Optional external URL' }),
      },
    }),
  },
});
