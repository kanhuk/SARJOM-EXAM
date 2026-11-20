import type { Metadata } from "next";
import { findSyllabusByParam } from "@/lib/syllabusSeo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = findSyllabusByParam(id);

  if (!item) {
    return {
      title: "Exam Syllabus",
      description:
        "Official exam syllabus breakdown, selection stages, and subject structure on SARJOM EXAM.",
      alternates: {
        canonical: `/syllabus/${encodeURIComponent(id)}`,
      },
    };
  }

  const canonicalSlug = item.slug || item.id;
  const title = `${item.title} Syllabus & Exam Pattern`;
  const description =
    item.description ||
    `${item.title} (${item.conductingBody}) syllabus, papers, topics, and selection stages on SARJOM EXAM.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/syllabus/${encodeURIComponent(canonicalSlug)}`,
    },
    openGraph: {
      type: "article",
      url: `https://www.sarjomexam.in/syllabus/${encodeURIComponent(canonicalSlug)}`,
      siteName: "SARJOM EXAM",
      title,
      description,
    },
  };
}

export default function SyllabusDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}