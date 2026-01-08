import type { ComponentType } from 'react';
import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { DocsPage, DocsBody } from 'fumadocs-ui/page';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Callout } from 'fumadocs-ui/components/callout';
import { InstallTabs, CopyButton } from '@/components';

interface PageData {
  title: string;
  description?: string;
  body: ComponentType<{ components: object }>;
  toc: { title: string; url: string; depth: number }[];
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const page = source.getPage(slug);

  if (!page) notFound();

  const data = page.data as unknown as PageData;
  const MDX = data.body;

  return (
    <DocsPage toc={data.toc}>
      <DocsBody>
        <h1>{data.title}</h1>
        <MDX
          components={{
            ...defaultMdxComponents,
            Callout,
            InstallTabs,
            CopyButton,
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const data = page.data as unknown as PageData;

  return {
    title: data.title,
    description: data.description,
  };
}
