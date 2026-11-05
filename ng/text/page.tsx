import WorkspacePage from "@/components/admin/WorkspacePage";
export default function Page() {
  return <WorkspacePage eyebrow="Site editing" title="Text & Headings" description="A future editor for approved website text fields and headings." status="Persistent configuration required" nextStep="Editable fields must be explicitly allowlisted and saved as a draft before any public update." />;
}
