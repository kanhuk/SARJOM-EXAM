import type { Metadata } from "next";
import WorkspacePage from "@/components/admin/WorkspacePage";
export default function Page() {
  return <WorkspacePage eyebrow="Site editing" title="Responsive Preview" description="A dedicated destination for desktop, tablet and mobile previews of a saved draft." status="Draft preview integration required" nextStep="Preview must render the actual draft configuration at supported viewport sizes without publishing it." />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Preview",
    description: "Preview on SARJOM EXAM.",
    openGraph: {
      title: "Preview | SARJOM EXAM",
      description: "Preview on SARJOM EXAM.",
      url: "https://www.sarjomexam.in/site-editing/preview",
    },
  };
}