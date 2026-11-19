import type { Metadata } from "next";
import WorkspacePage from "@/components/admin/WorkspacePage";
export default function Page() {
  return <WorkspacePage eyebrow="Site editing" title="Sections & Cards" description="A future editor for explicitly configurable homepage sections and cards." status="Section schema required" nextStep="Only registered sections should be editable; arbitrary application components must not be mutated by this editor." />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Sections",
    description: "Sections on SARJOM EXAM.",
    openGraph: {
      title: "Sections | SARJOM EXAM",
      description: "Sections on SARJOM EXAM.",
      url: "https://www.sarjomexam.in/site-editing/sections",
    },
  };
}