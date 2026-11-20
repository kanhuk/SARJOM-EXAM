import { ALL_EXAM_SYLLABI, type ExamSyllabusRecord } from "@/data/examSyllabusCatalog";

export function findSyllabusByParam(param: string): ExamSyllabusRecord | undefined {
  const decoded = decodeURIComponent(param || "").trim().toLowerCase();
  if (!decoded) return undefined;

  return ALL_EXAM_SYLLABI.find(
    (item) =>
      item.slug.toLowerCase() === decoded ||
      item.id.toLowerCase() === decoded ||
      item.title.toLowerCase() === decoded,
  );
}