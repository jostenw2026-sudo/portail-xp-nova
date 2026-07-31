import type { Metadata } from "next";
import JobDetail from "@/components/JobDetail";
import { getJobBySlug } from "@/lib/jobs";

export const dynamic = "force-dynamic";

function excerpt(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return { title: "Offre introuvable" };
  return {
    title: `${job.name} — Carrières`,
    description: job.description ? excerpt(job.description) : `Rejoignez-nous : ${job.name}. Candidature en ligne.`,
    alternates: {
      canonical: `/carrieres/${slug}`,
      languages: { fr: `/carrieres/${slug}`, en: `/en/carrieres/${slug}` },
    },
  };
}

export default async function OffrePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <JobDetail slug={slug} lang="fr" />;
}
