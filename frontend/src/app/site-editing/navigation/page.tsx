import type { Metadata } from "next";
import WorkspacePage from "@/components/admin/WorkspacePage";
export default function Page() {
  return <WorkspacePage eyebrow="Site editing" title="Navigation & Buttons" description="A future editor for approved navigation labels, destinations and button text." status="Navigation schema required" nextStep="Validate destinations and permitted labels before persisting any changes." />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Navigation",
    description: "Navigation on SARJOM EXAM.",
    openGraph: {
      title: "Navigation | SARJOM EXAM",
      description: "Navigation on SARJOM EXAM.",
      url: "https://www.sarjomexam.in/site-editing/navigation",
    },
  };
}