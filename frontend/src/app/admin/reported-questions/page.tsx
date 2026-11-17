import WorkspacePage from "@/components/admin/WorkspacePage";
export default function Page() {
  return <WorkspacePage eyebrow="Candidate feedback" title="Reported Questions" description="A dedicated destination for student-reported mistakes, ambiguous options and answer-key concerns." status="Reporting workflow not found in audit" nextStep="The current audit did not confirm a dedicated report-submission API or admin resolution workflow. Build that end-to-end before showing a report count or resolution buttons." />;
}
