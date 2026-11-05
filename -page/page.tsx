import WorkspacePage from "@/components/admin/WorkspacePage";
export default function Page() {
  return <WorkspacePage eyebrow="Content management" title="Home Page Management" description="Review homepage sections, featured content and announcement areas. The public homepage currently contains hardcoded content, so persistent editing needs a verified configuration layer." status="Configuration integration required" nextStep="Next: define a validated homepage configuration schema, connect it to persistent storage, and add preview-before-publish with revision history." />;
}
