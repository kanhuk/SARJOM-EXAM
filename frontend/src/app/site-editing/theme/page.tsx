import type { Metadata } from "next";
import WorkspacePage from "@/components/admin/WorkspacePage";
export default function Page() {
  return <WorkspacePage eyebrow="Site editing" title="Colors & Theme" description="A future editor for supported design tokens and the forest-green/emerald brand palette." status="Theme token integration required" nextStep="Connect a validated theme schema and preview changes before saving or publishing." />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Theme",
    description: "Theme on SARJOM EXAM.",
    openGraph: {
      title: "Theme | SARJOM EXAM",
      description: "Theme on SARJOM EXAM.",
      url: "https://www.sarjomexam.in/site-editing/theme",
    },
  };
}