import { notFound } from "next/navigation";
import { Metadata } from "next";
import SharedProjectView from "@components/project/SharedProjectView";

interface Props {
  params: { token: string };
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://promptforge.dev";

async function getSharedProject(token: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
  const res = await fetch(`${apiUrl}/api/v1/projects/public/${token}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? json;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getSharedProject(params.token);
  if (!project) return { title: "Project Not Found – PromptForge" };

  const title = `${project.name} – PromptForge`;
  const description =
    project.description ??
    `A production-ready SaaS backend generated with PromptForge AI — ${project.name}.`;
  const url = `${APP_URL}/share/${params.token}`;
  const ogImage = `${APP_URL}/share/${params.token}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "PromptForge",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: project.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const project = await getSharedProject(params.token);
  if (!project) notFound();

  const url = `${APP_URL}/share/${params.token}`;
  const entityCount = (project.parsedSchema?.entities ?? []).length;
  const fileCount = (project.generatedFiles ?? []).length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.name,
    description:
      project.description ?? `A SaaS backend generated with PromptForge.`,
    url,
    codeRepository: url,
    programmingLanguage: "TypeScript",
    runtimePlatform: "Node.js",
    creator: {
      "@type": "Organization",
      name: "PromptForge",
      url: APP_URL,
    },
    ...(fileCount > 0 && {
      about: `${fileCount} generated files, ${entityCount} data entities`,
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SharedProjectView project={project} />
    </>
  );
}
