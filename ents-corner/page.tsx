import WorkspacePage from "@/components/admin/WorkspacePage";
export default function Page() {
  return <WorkspacePage eyebrow="Candidate activity" title="Students Corner" description="The intended admin area for signup totals, candidate activity, assigned tests and progress summaries." status="Progress data integration required" nextStep="The existing candidate preferences route does not establish test assignments or progress analytics. Identify the real student and test-attempt data sources before showing metrics." />;
}
