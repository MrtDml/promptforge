import { notFound } from "next/navigation";
import { Metadata } from "next";
import SharedProjectView from "@components/project/SharedProjectView";

interface Props {
  params: { token: string };
}

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
  return {
    title: `${project.name} – PromptForge`,
    description: project.description ?? `A project built with PromptForge`,
  };
}

export default async function SharePage({ params }: Props) {
  const project = await getSharedProject(params.token);
  if (!project) notFound();
  return <SharedProjectView project={project} />;
}
