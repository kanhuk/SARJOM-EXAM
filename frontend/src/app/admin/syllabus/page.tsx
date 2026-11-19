import type { Metadata } from "next";
import WorkspacePage from "@/components/admin/WorkspacePage";
export default function Page() {
  return <WorkspacePage eyebrow="Learning content" title="Syllabus Management" description="Organize canonical syllabus records and topic structure while preserving the existing public content query behavior." status="Admin editing workflow required" nextStep="Next: connect syllabus record listing and detail editing to the canonical repository, with draft review and explicit publication controls." />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Syllabus",
    description: "Syllabus on SARJOM EXAM.",
    openGraph: {
      title: "Syllabus | SARJOM EXAM",
      description: "Syllabus on SARJOM EXAM.",
      url: "https://www.sarjomexam.in/admin/syllabus",
    },
  };
}