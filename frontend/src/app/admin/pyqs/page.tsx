import type { Metadata } from "next";
import WorkspacePage from "@/components/admin/WorkspacePage";
export default function Page() {
  return <WorkspacePage eyebrow="Question papers" title="PYQ Management" description="Manage previous-year questions without weakening the existing verification filter. Public PYQs must continue to satisfy the canonical verified-question requirements." status="Verification safeguards preserved" nextStep="Next: inspect the existing parser and verified PYQ repository workflow before connecting upload, review or publication controls." />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Pyqs",
    description: "Pyqs on SARJOM EXAM.",
    openGraph: {
      title: "Pyqs | SARJOM EXAM",
      description: "Pyqs on SARJOM EXAM.",
      url: "https://www.sarjomexam.in/admin/pyqs",
    },
  };
}