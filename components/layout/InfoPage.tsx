import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { StructuredData } from "@/components/seo/StructuredData";
import { breadcrumbGraph, schemaGraph, webPageSchema } from "@/lib/schema";

export function InfoPage({
  title,
  description,
  path,
  pageType = "WebPage",
  extra = [],
  children,
}: {
  title: string;
  description: string;
  path: string;
  pageType?: "WebPage" | "AboutPage" | "ContactPage";
  extra?: object[];
  children: React.ReactNode;
}) {
  const crumbs = [
    { name: "Home", href: "/" },
    { name: title, href: path },
  ];
  return (
    <article className="site-container py-12">
      <Breadcrumbs items={crumbs} />
      <h1 className="display mt-6 max-w-3xl text-4xl font-semibold text-balance sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{description}</p>
      <div className="prose-content mt-8">{children}</div>
      <StructuredData
        data={schemaGraph([
          webPageSchema({ name: title, description, path, type: pageType }),
          breadcrumbGraph(crumbs),
          ...extra,
        ])}
      />
    </article>
  );
}
