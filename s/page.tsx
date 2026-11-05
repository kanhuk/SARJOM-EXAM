import WorkspacePage from "@/components/admin/WorkspacePage";
export default function Page() {
  return <WorkspacePage eyebrow="Exam catalogue" title="Exams Management" description="Manage canonical exam records and their publication lifecycle. The existing exam query layer is the source of truth; this page does not create a parallel catalogue." status="Admin data workflow required" nextStep="Next: connect list and detail views to canonical exam records, then add validated draft editing and an authorized publication action." links={[{label:"Syllabus Management",href:"/admin/syllabus",description:"Review syllabus records."},{label:"PYQ Management",href:"/admin/pyqs",description:"Review verified question content."}]} />;
}
