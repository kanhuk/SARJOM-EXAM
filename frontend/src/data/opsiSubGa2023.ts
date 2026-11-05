import { QuestionData, odishaPoliceSi2023Paper2Questions } from "./odishaPoliceSi2023Paper2";

// Helper filters for 7 subjects
export const getQuestionsBySubject = (subKey: string): QuestionData[] => {
  return odishaPoliceSi2023Paper2Questions.filter(q => {
    if (subKey === "history") return q.topic.includes("History");
    if (subKey === "polity") return q.topic.includes("Polity") || q.topic.includes("Panchayati");
    if (subKey === "geography") return q.topic.includes("Geography") || q.topic.includes("Soil") || q.topic.includes("River") || q.topic.includes("Mineral") || q.topic.includes("Climatology");
    if (subKey === "economy") return q.topic.includes("Economy") || q.topic.includes("Scheme") || q.topic.includes("Banking");
    if (subKey === "science") return q.topic.includes("Physics") || q.topic.includes("Chemistry") || q.topic.includes("Biology") || q.topic.includes("Science") || q.topic.includes("Tech");
    if (subKey === "current") return q.topic.includes("Current") || q.topic.includes("Award") || q.topic.includes("Sports") || q.topic.includes("Report") || q.topic.includes("World Affairs");
    if (subKey === "computer") return q.subject === "Computer Knowledge";
    return false;
  });
};


export const opsiSubGa2023Questions = [];
