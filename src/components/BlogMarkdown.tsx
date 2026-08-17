import { Markdown } from '@astryxdesign/core/Markdown';

export function BlogMarkdown({ body }: { body: string }) {
  return (
    <Markdown
      className="blog-markdown"
      contentWidth="var(--reading-width)"
      headingLevelStart={1}
      autolink="gfm"
    >
      {body}
    </Markdown>
  );
}
