type StaticPageContentProps = {
  html: string;
};

export function StaticPageContent({ html }: StaticPageContentProps) {
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}
