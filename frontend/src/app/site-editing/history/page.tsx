import type { Metadata } from "next";
import WorkspacePage from "@/components/admin/WorkspacePage";
export default function Page() {
  return <WorkspacePage eyebrow="Site editing" title="Version History" description="A future revision list for saved drafts and published website configurations." status="Revision storage required" nextStep="Each revision needs an immutable snapshot, author, timestamp and a safe restore workflow. No revision data is fabricated here." />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "History",
    description: "History on SARJOM EXAM.",
    openGraph: {
      title: "History | SARJOM EXAM",
      description: "History on SARJOM EXAM.",
      url: "https://www.sarjomexam.in/site-editing/history",
    },
  };
}