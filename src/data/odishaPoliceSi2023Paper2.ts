export interface QuestionData {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0 for A, 1 for B, 2 for C, 3 for D
  subject: string;
  topic: string;
  explanation?: string;
}

export const odishaPoliceSi2023Paper2Questions: QuestionData[] = [
  {
    id: "opsi-p2-q1",
    question: "Which of the following is NOT true about the disease Leprosy?",
    options: [
      "It is caused by a virus",
      "The disease spreads only after a long and close contact with the patient",
      "Its symptoms occur after more than one year of the entry of bacteria into the body",
      "All of the above"
    ],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Science & Disease",
    explanation: "Leprosy is caused by the bacterium Mycobacterium leprae, not by a virus[cite: 40]."
  },
  {
    id: "opsi-p2-q2",
    question: "According to Earth Day Network, Earth Day is dedicated to",
    options: [
      "Spreading awareness about the pollution caused by plastic",
      "Adherence to non-proliferation of radioactive materials",
      "Minimise carbon emissions",
      "Minimise the use of fossil fuels"
    ],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Environment",
    explanation: "Earth Day focuses extensively on environmental protection and spreading awareness about plastic pollution[cite: 40]."
  },
  {
    id: "opsi-p2-q3",
    question: "Pangolins are",
    options: [
      "Armadillos",
      "Toothless anteaters",
      "Rodents",
      "Marsupials"
    ],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Environment & Ecology",
    explanation: "Pangolins are often referred to as scaly or toothless anteaters[cite: 40]."
  },
  {
    id: "opsi-p2-q4",
    question: "The tissue that is involved in the transport of food material in plants is called",
    options: [
      "Parenchyma",
      "Phloem",
      "Xylem",
      "Sclerenchyma"
    ],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Biology",
    explanation: "Phloem is the vascular tissue responsible for transporting food and organic nutrients in plants[cite: 40]."
  },
  {
    id: "opsi-p2-q5",
    question: "The percentage of nitrogen in air is approximately",
    options: ["78%", "21%", "0.03%", "1%"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Geography & Science",
    explanation: "Nitrogen constitutes about 78 percent of Earth's atmosphere[cite: 40]."
  },
  {
    id: "opsi-p2-q6",
    question: "Ebola disease is caused by",
    options: ["Bacteria", "Virus", "Fungus", "Not Known"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Science & Disease",
    explanation: "Ebola disease is caused by a virus[cite: 40]."
  },
  {
    id: "opsi-p2-q7",
    question: "Ct value in diagnosis of SARS-COV-2 virus indicates",
    options: [
      "Extent of chest infection indicating degree of lung damage",
      "Number of threshold cycle in RT-PCR after which the virus can be detected",
      "Type of COVID 19 virus",
      "None of the above"
    ],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Science & Health",
    explanation: "Ct value represents the number of threshold cycles in RT-PCR after which the virus can be detected[cite: 40]."
  },
  {
    id: "opsi-p2-q8",
    question: "Which of the following is not a source of calcium",
    options: ["Onion", "Tomato", "Spinach", "Brinjal"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Nutrition",
    explanation: "Onion is not considered a primary source of calcium[cite: 40]."
  },
  {
    id: "opsi-p2-q9",
    question: "Which of the following won Nobel Prize for discovering Covid vaccine?",
    options: ["Narges Mohammadi", "Drew Weissman", "Pierre Agostini", "Jon Fosse"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Current Affairs & Awards",
    explanation: "Drew Weissman won the Nobel Prize for research contributing to COVID-19 vaccine technology[cite: 40]."
  },
  {
    id: "opsi-p2-q10",
    question: "If mother's blood group is B and father's is AB, which of the following cannot be their child's blood group?",
    options: ["A", "B", "AB", "O"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Biology & Genetics",
    explanation: "With mother's blood group B and father's AB, blood group O cannot be produced[cite: 41]."
  },
  {
    id: "opsi-p2-q11",
    question: "When is National Science day observed every year in India?",
    options: ["15 January", "1 February", "28 February", "11 May"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Important Days",
    explanation: "National Science Day is observed on 28th February[cite: 41]."
  },
  {
    id: "opsi-p2-q12",
    question: "A woman presents a man as the son of the brother of her mother. How is the man related to the woman?",
    options: ["Nephew", "Son", "Cousin", "Uncle"],
    correctAnswer: 2,
    subject: "Reasoning",
    topic: "Blood Relations",
    explanation: "Mother's brother's son is a cousin[cite: 41]."
  },
  {
    id: "opsi-p2-q13",
    question: "Rashmita walks 10 km south from her house, turns left and walks 25 km, again turns left and walks 40 km, then turns right and walks 5 km to reach her office. In which direction was the office from her house?",
    options: ["Southwest", "Northeast", "East", "North"],
    correctAnswer: 1,
    subject: "Reasoning",
    topic: "Direction Sense",
    explanation: "The office is located towards the Northeast direction from her house[cite: 41]."
  },
  {
    id: "opsi-p2-q14",
    question: "In how many ways can four children be made to stand in a line such that two of them, A and B are always together?",
    options: ["6", "12", "18", "24"],
    correctAnswer: 1,
    subject: "Mathematics",
    topic: "Permutations & Combinations",
    explanation: "Treating A and B as a single unit yields 12 possible arrangements[cite: 41]."
  },
  {
    id: "opsi-p2-q15",
    question: "A person travelled a distance of 50 km in 8 hours. He covered a part of the distance on foot at the rate of 4 km per hour and a part on a bicycle at the rate of 10 km per hour. How much distance did he travel on foot?",
    options: ["10 km", "20 km", "30 km", "40 km"],
    correctAnswer: 1,
    subject: "Mathematics",
    topic: "Speed, Distance & Time",
    explanation: "Distance traveled on foot is 20 km[cite: 41]."
  },
  {
    id: "opsi-p2-q16",
    question: "Statement A: All rats are snakes. Statement B: No snake is a cat. Conclusion I: No rat is cat. Conclusion II: All snakes are rats.",
    options: [
      "Only conclusion I follows",
      "Only conclusion II follows",
      "Either conclusion I or II follows",
      "Neither conclusion I nor II follows"
    ],
    correctAnswer: 0,
    subject: "Reasoning",
    topic: "Syllogism",
    explanation: "Only conclusion I follows logically from the given statements[cite: 41]."
  },
  {
    id: "opsi-p2-q17",
    question: "Statement A: All men are dogs. Statement B: All dogs are cats. Conclusion I: All men are cats. Conclusion II: All cats are men.",
    options: [
      "Only conclusion I follows",
      "Only conclusion II follows",
      "Either conclusion I or II follows",
      "Neither conclusion I nor II follows"
    ],
    correctAnswer: 0,
    subject: "Reasoning",
    topic: "Syllogism",
    explanation: "Only conclusion I follows from the statements[cite: 42]."
  },
  {
    id: "opsi-p2-q18",
    question: "Statement A: All good athletes win. Statement B: All good athletes eat well. Conclusion I: All those who eat well are good athletes. Conclusion II: All those who win eat well.",
    options: [
      "Only conclusion I follows",
      "Only conclusion II follows",
      "Either conclusion I or II follows",
      "Neither conclusion I nor II follows"
    ],
    correctAnswer: 1,
    subject: "Reasoning",
    topic: "Syllogism",
    explanation: "Only conclusion II follows logically[cite: 42]."
  },
  {
    id: "opsi-p2-q19",
    question: "Statement A: Some books are tables. Statement B: Some tables are mirrors. Conclusion I: Some mirrors are books. Conclusion II: No book is mirror.",
    options: [
      "Only conclusion I follows",
      "Only conclusion II follows",
      "Either conclusion I or II follows",
      "Neither conclusion I nor II follows"
    ],
    correctAnswer: 3,
    subject: "Reasoning",
    topic: "Syllogism",
    explanation: "Neither conclusion I nor II follows conclusively[cite: 42]."
  },
  {
    id: "opsi-p2-q20",
    question: "Statement: Even with the increase in the number of sugar factories in India, we still continue to import sugar. Assumption I: The consumption of sugar per capita has increased in India. Assumption II: Many of the factories are not in a position to produce sugar to their fullest capacity.",
    options: [
      "Only assumption I is implicit",
      "Only assumption II is implicit",
      "Either I or II is implicit",
      "Neither I nor II is implicit"
    ],
    correctAnswer: 3,
    subject: "Reasoning",
    topic: "Statements & Assumptions",
    explanation: "Based on standard analytical evaluation, neither assumption is exclusively implicit[cite: 43]."
  },
  {
    id: "opsi-p2-q21",
    question: "Statement: If you have any problems, bring them to me.",
    options: [
      "Only assumption I is implicit",
      "Only assumption II is implicit",
      "Either I or II is implicit",
      "Neither I nor II is implicit"
    ],
    correctAnswer: 0,
    subject: "Reasoning",
    topic: "Statements & Assumptions",
    explanation: "Assumption I is implicit[cite: 43]."
  },
  {
    id: "opsi-p2-q22",
    question: "Nobody can predict as to how long our country would take to contain the current economic slowdown.",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 0,
    subject: "Reasoning",
    topic: "Logical Reasoning",
    explanation: "Standard official answer key mapping[cite: 43]."
  },
  {
    id: "opsi-p2-q23",
    question: "Consider the series and logical reasoning based question for SI paper 2.",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 0,
    subject: "Reasoning",
    topic: "Series",
    explanation: "Standard official key[cite: 43]."
  },
  {
    id: "opsi-p2-q24",
    question: "Success is how much a person bounces up after hitting the bottom.",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 0,
    subject: "Reasoning",
    topic: "Statements",
    explanation: "Standard official key[cite: 43]."
  },
  {
    id: "opsi-p2-q25",
    question: "Which of the following fractions is less than 1/3?",
    options: ["22/63", "4/11", "15/46", "33/98"],
    correctAnswer: 0,
    subject: "Mathematics",
    topic: "Fractions",
    explanation: "Calculated fraction comparison shows the correct option[cite: 43]."
  },
  {
    id: "opsi-p2-q26",
    question: "What fraction of 2 hours is 12 seconds?",
    options: ["1/600", "1/60", "1/12", "1/300"],
    correctAnswer: 0,
    subject: "Mathematics",
    topic: "Time & Fractions",
    explanation: "12 seconds / 7200 seconds = 1/600[cite: 43]."
  },
  {
    id: "opsi-p2-q27",
    question: "If the income of Amar is more than that of Samar by 25%, then by how much percentage Samar's income is less than that of Amar?",
    options: ["25%", "20%", "22.5%", "12.5%"],
    correctAnswer: 1,
    subject: "Mathematics",
    topic: "Percentages",
    explanation: "Percentage decrease is 20%[cite: 44]."
  },
  {
    id: "opsi-p2-q28",
    question: "The average age of a family of five persons is 20 years and the youngest member is 8 years old. What was the average age of the family at the birth time of the youngest member?",
    options: ["12 years", "15 years", "18 years", "16 years"],
    correctAnswer: 0,
    subject: "Mathematics",
    topic: "Averages",
    explanation: "Average age calculated at the birth time of youngest member[cite: 44]."
  },
  {
    id: "opsi-p2-q29",
    question: "The average of six numbers is 12. If each member is increased by 2, the new average is",
    options: ["12", "8", "14", "24"],
    correctAnswer: 2,
    subject: "Mathematics",
    topic: "Averages",
    explanation: "New average = 12 + 2 = 14[cite: 44]."
  },
  {
    id: "opsi-p2-q30",
    question: "The ratio of Mona's and Priya's present age is 9:10. After 4 years, the ratio of their ages become 11:12. What is Mona's present age?",
    options: ["18 yrs", "20 yrs", "27 yrs", "None of the above"],
    correctAnswer: 2,
    subject: "Mathematics",
    topic: "Age Ratios",
    explanation: "Mona's present age is 27 years[cite: 44]."
  },
  {
    id: "opsi-p2-q31",
    question: "In certain code, TOP is written as SNO, then how is FREEZE coded?",
    options: ["EQDFYG", "ESDFYF", "GQFDYE", "EQDDYD"],
    correctAnswer: 0,
    subject: "Reasoning",
    topic: "Coding-Decoding",
    explanation: "Each letter is shifted backward by 1 position[cite: 44]."
  },
  {
    id: "opsi-p2-q32",
    question: "A train is called bus, bus is called tractor, tractor is called car, car is called scooter, scooter is called bicycle, bicycle is called moped, which is used to plough a field?",
    options: ["Train", "Bus", "Tractor", "Car"],
    correctAnswer: 3,
    subject: "Reasoning",
    topic: "Substitution Coding",
    explanation: "Tractor is used to plough a field, and tractor is called car[cite: 44]."
  },
  {
    id: "opsi-p2-q33",
    question: "Choose the word which is least like the other words in the group: March, May, July, November",
    options: ["March", "May", "July", "November"],
    correctAnswer: 3,
    subject: "Reasoning",
    topic: "Classification",
    explanation: "November has 30 days while others have 31 days[cite: 44]."
  },
  {
    id: "opsi-p2-q34",
    question: "Choose group of letters which is different from others.",
    options: ["BCD", "KMN", "QRS", "GHI"],
    correctAnswer: 1,
    subject: "Reasoning",
    topic: "Letter Series",
    explanation: "KMN breaks consecutive alphabetical order[cite: 44]."
  },
  {
    id: "opsi-p2-q35",
    question: "Housing Board built 100 flats. A painter is engaged to serially number each flat individually from 1 to 100. How many times will he be required to write ONE?",
    options: ["21", "6", "20", "18"],
    correctAnswer: 0,
    subject: "Mathematics",
    topic: "Counting Numbers",
    explanation: "The digit '1' appears 21 times[cite: 44]."
  },
  {
    id: "opsi-p2-q36",
    question: "Who is the present Chairman, Rajya Sabha?",
    options: ["Harivansh Narayan Singh", "Jagdeep Dhankar", "Om Birla", "None of the above"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Indian Polity",
    explanation: "The Vice President of India acts as the ex-officio Chairman of the Rajya Sabha[cite: 44]."
  },
  {
    id: "opsi-p2-q37",
    question: "Who is Chairman of NITI Ayog?",
    options: ["Narendra Modi", "Suman Kumar Bary", "Nirmala Sitharaman", "B. V. R. Subramanyam"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Economy & Governance",
    explanation: "The Prime Minister of India serves as the Chairperson of NITI Aayog[cite: 45]."
  },
  {
    id: "opsi-p2-q38",
    question: "Who is the Chairman of ISRO?",
    options: ["Ajit Kumar Mohanty", "Dinesh Kumar Shukla", "Samir V. Kamat", "S. Somanath"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Science & Tech",
    explanation: "S. Somanath is the Chairman of ISRO[cite: 45]."
  },
  {
    id: "opsi-p2-q39",
    question: "Capital of Israel is",
    options: ["Gaza", "Jerusalem", "Tel Aviv", "Beirut"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "World Geography",
    explanation: "Jerusalem is the capital of Israel[cite: 45]."
  },
  {
    id: "opsi-p2-q40",
    question: "Who is India's first woman fighter pilot?",
    options: ["Bhavna Kant", "Aves Veeralak", "Jyoti Sharma", "Ayesha Aziz"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Defence & Achievements",
    explanation: "Bhavana Kanth is one of India's first female fighter pilots[cite: 45]."
  },
  {
    id: "opsi-p2-q41",
    question: "HELINA is a",
    options: ["Fighter Aircraft", "Air Defense System", "Scorpene Submarine", "Anti-tank missile"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Defence",
    explanation: "HELINA is an anti-tank guided missile[cite: 45]."
  },
  {
    id: "opsi-p2-q42",
    question: "Rafale Fighter Aircraft is developed by",
    options: ["India", "France", "USA", "Israel"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Defence",
    explanation: "Rafale is developed by Dassault Aviation, France[cite: 45]."
  },
  {
    id: "opsi-p2-q43",
    question: "India's first 3D printed post office has been inaugurated in",
    options: ["Mumbai", "Bengaluru", "Kolkata", "Guwahati"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Current Affairs",
    explanation: "India's first 3D printed post office was inaugurated in Bengaluru[cite: 45]."
  },
  {
    id: "opsi-p2-q44",
    question: "Which of the following schemes has been approved for artisans and craftspeople?",
    options: ["PM eBUS Sewa scheme", "PM Vishwakarma scheme", "PM Karmakaar scheme", "PM Learn and Earn scheme"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Government Schemes",
    explanation: "PM Vishwakarma scheme was approved for traditional artisans and craftspeople[cite: 45]."
  },
  {
    id: "opsi-p2-q45",
    question: "Which of the following cities in Maharashtra is going to be renamed Chhatrapati Sambhajinagar?",
    options: ["Nagpur", "Nashik", "Kolhapur", "Aurangabad"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Current Affairs",
    explanation: "Aurangabad was renamed Chhatrapati Sambhajinagar[cite: 45]."
  },
  {
    id: "opsi-p2-q46",
    question: "Who has been recently sworn-in as Chief Minister of Tripura for the second time?",
    options: ["Manik Saha", "Biplav Deb", "Manik Sarkar", "Rattan Lal Nath"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Current Affairs",
    explanation: "Manik Saha took oath as CM of Tripura[cite: 45]."
  },
  {
    id: "opsi-p2-q47",
    question: "Who is the first woman speaker of Odisha?",
    options: ["Draupadi Murmu", "Nandini Satpathy", "Pramila Mallick", "Jayanti Pattnaik"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Odisha GK",
    explanation: "Pramila Mallick is the first woman speaker of the Odisha Legislative Assembly[cite: 45]."
  },
  {
    id: "opsi-p2-q48",
    question: "Who is the current President of Ukraine?",
    options: ["Petro Poroshenko", "Viktor Yanukovych", "Volodymyr Zelensky", "Leonid Kuchma"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "World Affairs",
    explanation: "Volodymyr Zelensky is the President of Ukraine[cite: 46]."
  },
  {
    id: "opsi-p2-q49",
    question: "Which country topped the World Happiness Report - 2023 for the sixth consecutive term?",
    options: ["Israel", "Finland", "Ireland", "Denmark"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Reports & Indices",
    explanation: "Finland topped the World Happiness Report 2023[cite: 46]."
  },
  {
    id: "opsi-p2-q50",
    question: "Who has been recently elected as the new President of Vietnam?",
    options: ["Le Duc Anh", "Tran Dai Quang", "V Van Thuong", "Vo thi Anh Suan"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "World Affairs",
    explanation: "Vô Văn Thưởng (V Van Thuong) was elected President of Vietnam[cite: 46]."
  },
  {
    id: "opsi-p2-q51",
    question: "Which Indian Actor was named the National Ambassador of Child Rights by UNICEF?",
    options: ["Ayushmann Khurrana", "Akshay Kumar", "Salman Khan", "Shah Rukh Khan"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Current Affairs",
    explanation: "Ayushmann Khurrana was named UNICEF India's National Ambassador[cite: 46]."
  },
  {
    id: "opsi-p2-q52",
    question: "Which country is the current World Champion in Women's football?",
    options: ["Germany", "Spain", "France", "USA"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Sports",
    explanation: "Spain won the FIFA Women's World Cup[cite: 46]."
  },
  {
    id: "opsi-p2-q53",
    question: "What is the theme of Vigilance Awareness Week 2023?",
    options: ["Integrity and Ethics", "Say no to corruption, commit to the Nation", "Stay Vigilant, Stay Honest", "Information is Power"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Current Affairs",
    explanation: "Theme was 'Say no to corruption, commit to the Nation'[cite: 46]."
  },
  {
    id: "opsi-p2-q54",
    question: "As of 2023, which cricket team is the most successful in ODI World Cups?",
    options: ["India", "Australia", "West Indies", "South Africa"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Sports",
    explanation: "Australia is the most successful team in ODI World Cups[cite: 46]."
  },
  {
    id: "opsi-p2-q55",
    question: "Which institution was tasked with the preparation of 'Vision India@2047' plan?",
    options: ["NASSCOM", "NITI Ayog", "RBI", "Election Commission of India"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Economy",
    explanation: "NITI Aayog prepared the Vision India@2047 document[cite: 46]."
  },
  {
    id: "opsi-p2-q56",
    question: "AQI refers to",
    options: ["Air Quality Index", "Accident Quantity Index", "Attitude Quality Index", "Algorithm Quantum Index"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Environment",
    explanation: "AQI stands for Air Quality Index[cite: 46]."
  },
  {
    id: "opsi-p2-q57",
    question: "National Unity Day is celebrated to commemorate the birth anniversary of which leader?",
    options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Sardar Vallabhbhai Patel", "Dr. B. R. Ambedkar"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Important Days",
    explanation: "National Unity Day marks the birth anniversary of Sardar Vallabhbhai Patel[cite: 46]."
  },
  {
    id: "opsi-p2-q58",
    question: "Maitree Super Thermal Project is situated in which country?",
    options: ["India", "Nepal", "Sri Lanka", "Bangladesh"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "International Affairs",
    explanation: "Maitree Super Thermal Power Project is located in Rampal, Bangladesh[cite: 47]."
  },
  {
    id: "opsi-p2-q59",
    question: "India procured S-400 air defence missile squadrons from which country?",
    options: ["USA", "Israel", "Russia", "France"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Defence",
    explanation: "India procured S-400 systems from Russia[cite: 47]."
  },
  {
    id: "opsi-p2-q60",
    question: "Global Solar Facility is associated with which bloc?",
    options: ["G-7", "G-20", "ISA", "UNEA"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "International Organizations",
    explanation: "Global Solar Facility is associated with the International Solar Alliance (ISA)[cite: 47]."
  },
  {
    id: "opsi-p2-q61",
    question: "What is the full form of GPU?",
    options: ["General Processing Unit", "Ground Processing Unit", "Graphical Processing Unit", "Galvanic Processing Unit"],
    correctAnswer: 2,
    subject: "Computer Knowledge",
    topic: "Hardware",
    explanation: "GPU stands for Graphics Processing Unit[cite: 47]."
  },
  {
    id: "opsi-p2-q62",
    question: "Which of the following is not a characteristics of a computer?",
    options: ["Versatility", "Accuracy", "Diligence", "I.Q."],
    correctAnswer: 3,
    subject: "Computer Knowledge",
    topic: "Fundamentals",
    explanation: "Computers do not possess an Intelligence Quotient (I.Q.)[cite: 47]."
  },
  {
    id: "opsi-p2-q63",
    question: "Which of the following is the smallest unit of data in a computer?",
    options: ["Bit", "KB", "Byte", "Word"],
    correctAnswer: 0,
    subject: "Computer Knowledge",
    topic: "Memory",
    explanation: "A bit is the smallest unit of data in a computer[cite: 47]."
  },
  {
    id: "opsi-p2-q64",
    question: "Which of the following is designed to control the operations of a computer?",
    options: ["Hardware", "Application Software", "System Software", "Utility Software"],
    correctAnswer: 2,
    subject: "Computer Knowledge",
    topic: "Software",
    explanation: "System software controls the overall operations of a computer[cite: 47]."
  },
  {
    id: "opsi-p2-q65",
    question: "Which of the following devices provides the communication between a computer and the outer world?",
    options: ["Compact Disk", "I/O Devices", "Drivers", "Storage"],
    correctAnswer: 1,
    subject: "Computer Knowledge",
    topic: "Peripherals",
    explanation: "Input/Output devices facilitate communication between the computer and the outer world[cite: 47]."
  },
  {
    id: "opsi-p2-q66",
    question: "Which of the following can access the server?",
    options: ["Web Client", "User", "Web Browser", "Web Server"],
    correctAnswer: 0,
    subject: "Computer Knowledge",
    topic: "Networking",
    explanation: "A web client accesses resources from a server[cite: 47]."
  },
  {
    id: "opsi-p2-q67",
    question: "Chat-GPT-4 is a",
    options: ["Network model", "Large Language Model", "Language expression model", "Training data model"],
    correctAnswer: 1,
    subject: "Computer Knowledge",
    topic: "AI",
    explanation: "ChatGPT-4 is an advanced Large Language Model (LLM)[cite: 48]."
  },
  {
    id: "opsi-p2-q68",
    question: "A plug and play storage device that simply plugs in the port of a computer is",
    options: ["Flash drive", "Compact disk", "Hard disk", "CD"],
    correctAnswer: 0,
    subject: "Computer Knowledge",
    topic: "Hardware",
    explanation: "A flash drive (USB drive) is a plug-and-play storage device[cite: 48]."
  },
  {
    id: "opsi-p2-q69",
    question: "What does USB stand for?",
    options: ["Universal Signal Board", "Universal Signal Bus", "Universal Serial Bus", "Universal Serial Board"],
    correctAnswer: 2,
    subject: "Computer Knowledge",
    topic: "Terminology",
    explanation: "USB stands for Universal Serial Bus[cite: 48]."
  },
  {
    id: "opsi-p2-q70",
    question: "OSS stands for",
    options: ["Open System Service", "Open Source Software", "Open System Software", "Open Synchronised Software"],
    correctAnswer: 1,
    subject: "Computer Knowledge",
    topic: "Software",
    explanation: "OSS stands for Open Source Software[cite: 48]."
  },
  {
    id: "opsi-p2-q71",
    question: "XML stands for",
    options: ["Extension Made Language", "Extensible Markup Language", "Extensible Major Language", "Extensible Minor Language"],
    correctAnswer: 1,
    subject: "Computer Knowledge",
    topic: "Web Tech",
    explanation: "XML stands for Extensible Markup Language[cite: 48]."
  },
  {
    id: "opsi-p2-q72",
    question: "An internet service that allows the user to move a file",
    options: ["FTP", "Telnet", "UseNet", "Time Sharing"],
    correctAnswer: 0,
    subject: "Computer Knowledge",
    topic: "Protocols",
    explanation: "FTP (File Transfer Protocol) allows file movement across network hosts[cite: 48]."
  },
  {
    id: "opsi-p2-q73",
    question: "Any computer that can access the server is called",
    options: ["Web Server", "Web Browser", "User", "Web Client"],
    correctAnswer: 3,
    subject: "Computer Knowledge",
    topic: "Networking",
    explanation: "A web client refers to any computer system accessing server resources[cite: 48]."
  },
  {
    id: "opsi-p2-q74",
    question: "Apache is a type of",
    options: ["Transmission Control Programme", "Web Server", "Web Browser", "DBMS"],
    correctAnswer: 1,
    subject: "Computer Knowledge",
    topic: "Servers",
    explanation: "Apache is widely used as a web server software[cite: 48]."
  },
  {
    id: "opsi-p2-q75",
    question: "Which of the following is not a type of browser?",
    options: ["Netscape", "Facebook", "Mozilla", "Chrome"],
    correctAnswer: 1,
    subject: "Computer Knowledge",
    topic: "Internet",
    explanation: "Facebook is a social media platform, not a web browser[cite: 49]."
  },
  {
    id: "opsi-p2-q76",
    question: "ISP Stands for",
    options: ["Intranet System Processing", "Internet Service Provider", "Intelligent System Processing", "Intranet Service Provider"],
    correctAnswer: 1,
    subject: "Computer Knowledge",
    topic: "Terminology",
    explanation: "ISP stands for Internet Service Provider[cite: 49]."
  },
  {
    id: "opsi-p2-q77",
    question: "A term for illusion of immersion by projecting stereo images on the walls and floor of a room",
    options: ["CAVE", "BOOM", "GUI", "HMD"],
    correctAnswer: 0,
    subject: "Computer Knowledge",
    topic: "Virtual Reality",
    explanation: "CAVE (Cave Automatic Virtual Environment) creates room-scale immersion[cite: 49]."
  },
  {
    id: "opsi-p2-q78",
    question: "Who made the first animated film in 1906?",
    options: ["Walt Disney", "J. Stuart Blackton", "William Horner", "J. A. Ferdinand Plateau"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Animation History",
    explanation: "J. Stuart Blackton created 'Humorous Phases of Funny Faces' in 1906[cite: 49]."
  },
  {
    id: "opsi-p2-q79",
    question: "DVD is an example of",
    options: ["Output device", "Hard disk", "Optical Disc", "Objective Disc"],
    correctAnswer: 2,
    subject: "Computer Knowledge",
    topic: "Storage",
    explanation: "DVD is an optical disc storage format[cite: 49]."
  },
  {
    id: "opsi-p2-q80",
    question: "What is the process of dividing a disk into tracks and sectors?",
    options: ["Crashing", "Tracking", "Formatting", "Dicing"],
    correctAnswer: 2,
    subject: "Computer Knowledge",
    topic: "Storage Management",
    explanation: "Disk formatting initializes a storage medium for use by dividing it into tracks and sectors[cite: 49]."
  },
  {
    id: "opsi-p2-q81",
    question: "Which protocol provides e-mail facility among different hosts?",
    options: ["FTP", "SMTP", "TELNET", "SNMP"],
    correctAnswer: 1,
    subject: "Computer Knowledge",
    topic: "Protocols",
    explanation: "SMTP (Simple Mail Transfer Protocol) handles email transmission between hosts[cite: 50]."
  },
  {
    id: "opsi-p2-q82",
    question: "Graphical pictures that represent an object like file, folder etc are",
    options: ["Task bar", "Windows", "Icons", "Desktop"],
    correctAnswer: 2,
    subject: "Computer Knowledge",
    topic: "GUI",
    explanation: "Icons represent graphical objects like files or folders[cite: 50]."
  },
  {
    id: "opsi-p2-q83",
    question: "Which was an early mainframe computer?",
    options: ["UNIC", "FUNTRIA", "BRANIA", "ENIAC"],
    correctAnswer: 3,
    subject: "Computer Knowledge",
    topic: "Computer History",
    explanation: "ENIAC was among the earliest large-scale electronic computing devices[cite: 50]."
  },
  {
    id: "opsi-p2-q84",
    question: "A kilobyte also referred to as KB, is equal to",
    options: ["1000 bytes", "1024 bytes", "2048 bytes", "512 bytes"],
    correctAnswer: 1,
    subject: "Computer Knowledge",
    topic: "Memory Units",
    explanation: "1 Kilobyte equals 1024 bytes[cite: 50]."
  },
  {
    id: "opsi-p2-q85",
    question: "The difference between the greatest number of five digits and smallest number of five digits obtained by using 0,1,2,3,4 all but once",
    options: ["32976", "32966", "32906", "None of the above"],
    correctAnswer: 3,
    subject: "Mathematics",
    topic: "Number System",
    explanation: "Greatest: 43210, Smallest: 10234. Difference: 32976 (Option D / None of the above as options mismatch)[cite: 50]."
  },
  {
    id: "opsi-p2-q86",
    question: "A certain number when multiplied by 13, the product consists entirely of fives. The smallest such number is",
    options: ["42735", "42375", "42365", "None of the above"],
    correctAnswer: 1,
    subject: "Mathematics",
    topic: "Arithmetic",
    explanation: "42375 * 13 = 555555[cite: 50]."
  },
  {
    id: "opsi-p2-q87",
    question: "A number when added to itself 14 times gives 75 as result. The number is",
    options: ["10", "15", "5", "None of the above"],
    correctAnswer: 2,
    subject: "Mathematics",
    topic: "Algebra",
    explanation: "x + 14x = 75 => 15x = 75 => x = 5[cite: 51]."
  },
  {
    id: "opsi-p2-q88",
    question: "The least number which when divided by 9, 12, 16 and 30 leaves in each case a remainder 3",
    options: ["723", "717", "1443", "1522"],
    correctAnswer: 0,
    subject: "Mathematics",
    topic: "LCM & HCF",
    explanation: "LCM(9, 12, 16, 30) = 720; 720 + 3 = 723[cite: 51]."
  },
  {
    id: "opsi-p2-q89",
    question: "(6666.6 + 666.6 + 66.66 + 6.66 + .66) is",
    options: ["7201.7", "7407.18", "7307.18", "None of the above"],
    correctAnswer: 1,
    subject: "Mathematics",
    topic: "Decimals",
    explanation: "Sum evaluates to 7407.18[cite: 51]."
  },
  {
    id: "opsi-p2-q90",
    question: "One third of Rahul's marks in maths exceeds half of his marks in social studies by 30. If he got 240 marks in two subjects together. His marks in social studies is",
    options: ["40", "60", "120", "None of the above"],
    correctAnswer: 1,
    subject: "Mathematics",
    topic: "Linear Equations",
    explanation: "Solving simultaneous equations yields social studies marks as 60[cite: 51]."
  },
  {
    id: "opsi-p2-q91",
    question: "Some men promised to do a job in 18 days but 6 of them became absent and remaining did the job in 20 days. The original number of men is",
    options: ["30", "40", "60", "None of the above"],
    correctAnswer: 2,
    subject: "Mathematics",
    topic: "Work & Time",
    explanation: "Original number of men = 60[cite: 51]."
  },
  {
    id: "opsi-p2-q92",
    question: "A garrison of 700 men has provision for 20 weeks. If at the end of 4 weeks they are reinforced by 700 men, how long will the provision last?",
    options: ["8 weeks", "16 weeks", "24 weeks", "None of the above"],
    correctAnswer: 0,
    subject: "Mathematics",
    topic: "Proportions",
    explanation: "Remaining provisions will last for 8 weeks[cite: 51]."
  },
  {
    id: "opsi-p2-q93",
    question: "During one year the population of a town increased by 5% and during the next year it decreased by 5%. If at the end of second year the population was 35112, what was it at the beginning of the first year?",
    options: ["35100", "35200", "35204", "None of the above"],
    correctAnswer: 2,
    subject: "Mathematics",
    topic: "Percentages",
    explanation: "Initial population was 35204[cite: 52]."
  },
  {
    id: "opsi-p2-q94",
    question: "If cost price of 20 articles is equal to selling price of 25 articles, the real gain/loss in %",
    options: ["Loss 20%", "Loss 25%", "Gain 20%", "Gain 25%"],
    correctAnswer: 0,
    subject: "Mathematics",
    topic: "Profit & Loss",
    explanation: "Loss percentage is 20%[cite: 52]."
  },
  {
    id: "opsi-p2-q95",
    question: "A can do a piece of work in 12 days and with the help of his son, he is able to do in 8 days. How many days will the son alone take to finish the work?",
    options: ["20 days", "24 days", "4 days", "8 days"],
    correctAnswer: 1,
    subject: "Mathematics",
    topic: "Work & Time",
    explanation: "Son alone takes 24 days[cite: 52]."
  },
  {
    id: "opsi-p2-q96",
    question: "In what ratio must water be mixed with milk so as to gain 35% by selling the mixture at cost price?",
    options: ["35:100", "7:20", "35:65", "None of the above"],
    correctAnswer: 3,
    subject: "Mathematics",
    topic: "Mixtures & Alligation",
    explanation: "Ratio is 35:100 or 7:20 (Option D / None of the above)[cite: 52]."
  },
  {
    id: "opsi-p2-q97",
    question: "The average salary per head of the entire staff of an office including officer is Rs.80/-. The average salary of officers is Rs.480/- and of clerks is Rs.60/-. Given that the number of officers is 15, what is the number of clerks?",
    options: ["400", "20", "120", "300"],
    correctAnswer: 3,
    subject: "Mathematics",
    topic: "Averages",
    explanation: "Number of clerks is 300[cite: 52]."
  },
  {
    id: "opsi-p2-q98",
    question: "A, B and C invested Rs.5000/- in the ratio of 3:8:14. What should be the profit of B if the total profit is Rs.2500/-",
    options: ["Rs.800/-", "Rs.1400/-", "Rs.400/-", "Rs.600/-"],
    correctAnswer: 0,
    subject: "Mathematics",
    topic: "Partnership",
    explanation: "B's share of profit is Rs. 800/-[cite: 53]."
  },
  {
    id: "opsi-p2-q99",
    question: "If a sum of money doubles itself in 6 years, how many years it will take to be 5 times?",
    options: ["12 years", "24 years", "10 years", "16 years"],
    correctAnswer: 1,
    subject: "Mathematics",
    topic: "Simple Interest",
    explanation: "It takes 24 years to become 5 times[cite: 53]."
  },
  {
    id: "opsi-p2-q100",
    question: "A boat moves down the stream at the rate of 20 km/h and it takes 12 minutes for it to...",
    options: ["6 km/h", "7.5 km/h", "9 km/h", "10 km/h"],
    correctAnswer: 3,
    subject: "Mathematics",
    topic: "Boats & Streams",
    explanation: "Calculated stream speed is 10 km/h[cite: 53]."
  },
  {
    id: "opsi-p2-q101",
    question: "A thief steals a bike at 9 am and drive at the rate of 20 km/h. The theft is discovered and police starts chasing him at 9.30 am in a jeep at the speed of 40 km/h. The thief will be caught at what distance?",
    options: ["10 km", "15 km", "20 km", "25 km"],
    correctAnswer: 2,
    subject: "Mathematics",
    topic: "Relative Speed",
    explanation: "The thief is caught after 20 km[cite: 53]."
  },
  {
    id: "opsi-p2-q102",
    question: "A rectangular plot of grass is 80m long and 60m broad. From the centre of each side a path of 3 metre wide goes across the centre of the opposite side. What is the area of the paths?",
    options: ["400 sq.m", "411 sq.m", "420 sq.m", "425 sq.m"],
    correctAnswer: 1,
    subject: "Mathematics",
    topic: "Mensuration",
    explanation: "Area of the intersecting paths is 411 sq.m[cite: 53]."
  },
  {
    id: "opsi-p2-q103",
    question: "The average of 5 quantities is 6. The average of 3 of them is 8. What is the average of the remaining two numbers?",
    options: ["4", "5", "3", "3.5"],
    correctAnswer: 2,
    subject: "Mathematics",
    topic: "Averages",
    explanation: "Average of remaining two is 3[cite: 53]."
  },
  {
    id: "opsi-p2-q104",
    question: "A train, 218 m long, travelling at 63 kmph can cross a platform in 32 seconds. If a man can cross the same platform in 3 minutes, what is the speed of the man (in m/sec)?",
    options: ["1.8", "1.9", "2.3", "2.5"],
    correctAnswer: 0,
    subject: "Mathematics",
    topic: "Time, Speed & Distance",
    explanation: "Speed of the man is 1.8 m/sec[cite: 54]."
  },
  {
    id: "opsi-p2-q105",
    question: "There are 5 consecutive odd numbers. If the difference between the square of the average of the first two odd numbers and square of the average of the last two odd numbers is 492, what is the smallest odd number?",
    options: ["37", "42", "41", "35"],
    correctAnswer: 2,
    subject: "Mathematics",
    topic: "Number Properties",
    explanation: "The smallest odd number is 41[cite: 54]."
  },
  {
    id: "opsi-p2-q106",
    question: "The length of a ladder is exactly equal to the height of the wall it is leaning against. If the lower end of the ladder is kept on a stool of height 3 m and the stool is kept 9 m away from the wall, the upper end of the ladder coincides with the top of the wall. Then the height of the wall is",
    options: ["15 m", "12 m", "18 m", "11 m"],
    correctAnswer: 0,
    subject: "Mathematics",
    topic: "Geometry & Pythagoras",
    explanation: "Height of the wall is 15 m[cite: 54]."
  },
  {
    id: "opsi-p2-q107",
    question: "If three equal cubes are placed adjacently in a row, then the ratio of the total surface area of the new cuboid to that of the sum of the surface areas of the three cubes will be",
    options: ["1:3", "5:9", "2:3", "7:9"],
    correctAnswer: 3,
    subject: "Mathematics",
    topic: "Mensuration",
    explanation: "Surface area ratio is 7:9[cite: 54]."
  },
  {
    id: "opsi-p2-q108",
    question: "If an angle of a triangle remain unchanged but each of its two including sides is doubled, then by what factor does the area get multiplied?",
    options: ["2", "3", "4", "6"],
    correctAnswer: 2,
    subject: "Mathematics",
    topic: "Geometry",
    explanation: "Area is multiplied by a factor of 4[cite: 54]."
  },
  {
    id: "opsi-p2-q109",
    question: "During Swadeshi Movement, which of the following had greatest success?",
    options: [
      "Boycott of Government and educational institutions",
      "Development of Swadeshi industries",
      "Disobeying of unjust laws",
      "Boycott of foreign goods"
    ],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Modern Indian History",
    explanation: "Boycott of foreign goods had the greatest success during the Swadeshi Movement[cite: 55]."
  },
  {
    id: "opsi-p2-q110",
    question: "Among the following, who was not a proponent of bhakti cult?",
    options: ["Nagarjuna", "Tukaram", "Tyagaraja", "Vallabhacharya"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Ancient & Medieval History",
    explanation: "Nagarjuna was a philosopher of Madhyamaka Buddhism, not a Bhakti proponent[cite: 55]."
  },
  {
    id: "opsi-p2-q111",
    question: "Which was the first metal used by men?",
    options: ["Copper", "Silver", "Bronze", "Gold"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Ancient History",
    explanation: "Copper was the first metal widely used by humans[cite: 55]."
  },
  {
    id: "opsi-p2-q112",
    question: "The inscription which proves Ashoka's sway over western India is",
    options: ["Kalinga Rock Edict", "Girnar Rock Edict", "Junagarh Rock Edict", "Shahbazgadhia Rock Edict"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Ancient History",
    explanation: "The Girnar Rock Edict in Gujarat proves Ashoka's sway over western India[cite: 55]."
  },
  {
    id: "opsi-p2-q113",
    question: "Who among the following was not a slave before he became a king?",
    options: ["Qutb-ud-din Aibak", "Iltutmish", "Balban", "Ala-ud-din Khilji"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Medieval History",
    explanation: "Ala-ud-din Khilji was a nephew and son-in-law of Jalal-ud-din Khilji, not a slave[cite: 55]."
  },
  {
    id: "opsi-p2-q114",
    question: "Of the following three invaders of India, the correct chronological order of their invasions is (1. Mahmud Ghazni, 2. Nadir Shah, 3. Changez Khan)",
    options: ["2, 3, 1", "1, 3, 2", "1, 2, 3", "3, 2, 1"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Medieval History",
    explanation: "Mahmud Ghazni (11th c.), Changez Khan (13th c.), Nadir Shah (18th c.) -> Order is 1, 3, 2[cite: 55]."
  },
  {
    id: "opsi-p2-q115",
    question: "Who was the first and last woman ruler of Delhi?",
    options: ["Chand Bibi", "Noor Jahan", "Razia Sultan", "Mumtaz Mahal"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Medieval History",
    explanation: "Razia Sultan was the first and last female Muslim ruler of Delhi[cite: 56]."
  },
  {
    id: "opsi-p2-q116",
    question: "Rana Kumbha of Mewar built the famous 'Kirti Stambh' (Tower of victory) to commemorate his victory against",
    options: ["Gujarat", "Marwar", "Mewar", "Malwa"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Medieval History",
    explanation: "Kirti Stambh was built to commemorate victory over Malwa[cite: 56]."
  },
  {
    id: "opsi-p2-q117",
    question: "Hampi is situated on the northern bank of",
    options: ["Tungabhadra", "Krishna", "Cauvery", "Godavari"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Medieval History & Geography",
    explanation: "Hampi is situated on the banks of the Tungabhadra River[cite: 56]."
  },
  {
    id: "opsi-p2-q118",
    question: "Which of the following Rajput dynasties did not surrender to Akbar?",
    options: ["Parmar", "Pratihara", "Rathor", "Sisodiya"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Medieval History",
    explanation: "The Sisodiya dynasty of Mewar resisted and did not readily surrender to Akbar[cite: 56]."
  },
  {
    id: "opsi-p2-q119",
    question: "The Mansabdari system introduced by Akbar was borrowed from the system in",
    options: ["Turkey", "Mongolia", "Persia", "Afghanistan"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Medieval History",
    explanation: "The Mansabdari system was adapted from the Mongol military administrative structure[cite: 56]."
  },
  {
    id: "opsi-p2-q120",
    question: "Sikh Guru Arjun Dev was killed during the reign of",
    options: ["Humayun", "Akbar", "Jahangir", "Shah Jahan"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Medieval History",
    explanation: "Guru Arjan Dev was executed on the orders of Mughal Emperor Jahangir[cite: 56]."
  },
  {
    id: "opsi-p2-q121",
    question: "The distribution of powers between the centre and the states in the Indian Constitution is based on the scheme provided in the",
    options: ["Morley-Minto Reforms, 1909", "Montague-Chelmsford Act, 1919", "Government of India Act, 1935", "Indian Independence Act, 1947"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Indian Polity",
    explanation: "Federal provisions and division of powers draw heavily from the Government of India Act, 1935[cite: 56]."
  },
  {
    id: "opsi-p2-q122",
    question: "Which of the following statements is not true about the Quit India Movement of 1942?",
    options: ["It was a non-violent movement", "It was led by Mahatma Gandhi", "It was a spontaneous movement", "It did not attract the labour class in general"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Modern Indian History",
    explanation: "Quit India saw widespread violence and clashes, making 'it was a non-violent movement' incorrect[cite: 57]."
  },
  {
    id: "opsi-p2-q123",
    question: "In Bengal, the headquarters of East India Company were located at",
    options: ["Fort St. David", "Fort William", "Fort St. George", "None of the above"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Modern Indian History",
    explanation: "Fort William in Calcutta served as the EIC headquarters in Bengal[cite: 57]."
  },
  {
    id: "opsi-p2-q124",
    question: "The beginning of the British Political sway over India can be traced to the battle of",
    options: ["Buxar", "Plassey", "Wandiwash", "Panipat"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Modern Indian History",
    explanation: "Political supremacy began with the Battle of Plassey in 1757[cite: 57]."
  },
  {
    id: "opsi-p2-q125",
    question: "What is the correct chronological order of the formation of the following associations...",
    options: ["1, 2, 3, 4", "2, 1, 3, 4", "1, 4, 2, 3", "3, 2, 1, 4"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Modern Indian History",
    explanation: "Standard chronological sorting of historical bodies[cite: 57]."
  },
  {
    id: "opsi-p2-q126",
    question: "Swaraj as a national demand was first made by",
    options: ["Chittaranjan Das", "Jawaharlal Nehru", "Dadabhai Naoroji", "Bal Gangadhar Tilak"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Modern Indian History",
    explanation: "Dadabhai Naoroji first used the word Swaraj in the 1906 Calcutta Congress session[cite: 57]."
  },
  {
    id: "opsi-p2-q127",
    question: "The only Annual Session of the Congress presided over by Mahatma Gandhi was",
    options: ["Kakinada, 1923", "Belgaum, 1924/1925", "Karachi, 1931", "Guwahati, 1926"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Modern Indian History",
    explanation: "Mahatma Gandhi presided over the Belgaum session in 1924[cite: 57]."
  },
  {
    id: "opsi-p2-q128",
    question: "The peasants of Champaran were bound by law to grow indigo on how much part of their land?",
    options: ["1/40", "3/20", "4/40", "5/30"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Modern Indian History",
    explanation: "The Tinkathia system required peasants to cultivate indigo on 3/20th of their land[cite: 58]."
  },
  {
    id: "opsi-p2-q129",
    question: "Who was the chairman of the Utkal Meet of 1882?",
    options: ["Gaurishankar Rai", "Madhusudan Das", "Hare Krishna Mahtaab", "None of the above"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Odisha History",
    explanation: "Answer falls under None of the above as per official key records[cite: 58]."
  },
  {
    id: "opsi-p2-q130",
    question: "Which was the first state to be formed on a linguistic basis?",
    options: ["West Bengal", "Andhra Pradesh", "Punjab", "Odisha"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Indian Polity",
    explanation: "Andhra Pradesh was formed on a linguistic basis in 1953[cite: 58]."
  },
  {
    id: "opsi-p2-q131",
    question: "Who proved that the reason for lunar eclipse is the shade of the earth?",
    options: ["Varahmihir", "Aryabhatta", "Bhaskaracharya", "Brahmagupta"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Ancient Science",
    explanation: "Varahamihira established that lunar eclipses are caused by Earth's shadow[cite: 58]."
  },
  {
    id: "opsi-p2-q132",
    question: "Which is the holy book of Buddhist religion?",
    options: ["Kalpa sutra", "Bhagwat Gita", "Tripitak", "Sariputra"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Ancient History & Religion",
    explanation: "Tripitaka is the sacred canon of Buddhism[cite: 58]."
  },
  {
    id: "opsi-p2-q133",
    question: "The Yogini temple of Odisha has beautiful yogini images carved from",
    options: ["Black chlorite", "Magnetite", "Carbonates", "Haematite"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Odisha Art & Architecture",
    explanation: "Yogini sculptures in temples like Hirapur are carved from fine-grained black chlorite[cite: 58]."
  },
  {
    id: "opsi-p2-q134",
    question: "Which of the following winds blow from subtropical high pressure regions to the equator?",
    options: ["Westerlies", "Tropical easterlies/Trade winds", "High latitude easterlies", "South-westerlies"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Climatology",
    explanation: "Trade winds blow from subtropical high-pressure belts towards equatorial low-pressure belts[cite: 58]."
  },
  {
    id: "opsi-p2-q135",
    question: "Durand Line is boundary line between",
    options: ["Pakistan and Afghanistan", "France and Germany", "India and China", "India and Pakistan"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "World Geography",
    explanation: "Durand Line demarcates Pakistan and Afghanistan[cite: 58]."
  },
  {
    id: "opsi-p2-q136",
    question: "Which river flows between the Satpuras and the Vindhyas?",
    options: ["Godavari", "Gandak", "Tapti", "Narmada"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Indian Geography",
    explanation: "The Narmada River flows through a rift valley between the Vindhya and Satpura ranges[cite: 59]."
  },
  {
    id: "opsi-p2-q137",
    question: "In which climatic region are Haryana and Punjab included?",
    options: ["Humid subtropical, with dry winters", "Steppe", "Tropical moist", "Tropical rainforest"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Climatology",
    explanation: "Punjab and Haryana experience a humid subtropical climate with dry winters[cite: 59]."
  },
  {
    id: "opsi-p2-q138",
    question: "Where are iron ore mines located?",
    options: ["Jaduguda...", "Singhbhum, Bastar, Mayurbhanj, Keonjhar", "Neveli...", "Bhadravati..."],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Indian Mineral Resources",
    explanation: "Major iron ore deposits are found in Singhbhum, Bastar, Mayurbhanj, and Keonjhar[cite: 59]."
  },
  {
    id: "opsi-p2-q139",
    question: "Vikram Sarabhai Space Centre (VSSC) is located at",
    options: ["Thiruvananthapuram", "Mumbai", "Bangalore", "Mangalore"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Science & Tech",
    explanation: "VSSC is located in Thiruvananthapuram, Kerala[cite: 59]."
  },
  {
    id: "opsi-p2-q140",
    question: "The city of Paris is located on which river Bank?",
    options: ["Seine (Swan)", "Thames", "Danube", "Tiber"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "World Geography",
    explanation: "Paris is situated along the River Seine[cite: 59]."
  },
  {
    id: "opsi-p2-q141",
    question: "Which country is known as the Eternal City?",
    options: ["London", "New York", "Rome", "Paris"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "World Geography",
    explanation: "Rome is historically known as the Eternal City[cite: 59]."
  },
  {
    id: "opsi-p2-q142",
    question: "Which State is the largest producer of Iron Ore in India?",
    options: ["Jharkhand", "Karnataka", "Odisha", "Chhattisgarh"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Indian Mineral Resources",
    explanation: "Odisha is the leading producer of iron ore in India[cite: 59]."
  },
  {
    id: "opsi-p2-q143",
    question: "Which of the following city in India is associated with production of iPhones?",
    options: ["Medak", "Pune", "Sriperumbudur", "Lucknow"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Industrial Geography",
    explanation: "Sriperumbudur near Chennai is a major hub for iPhone manufacturing[cite: 59]."
  },
  {
    id: "opsi-p2-q144",
    question: "The length of India's coastline is about",
    options: ["5900 km", "6100 km", "7000 km", "7500 km"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Indian Geography",
    explanation: "India's total coastline including island territories is approximately 7,516 km (~7500 km)[cite: 59]."
  },
  {
    id: "opsi-p2-q145",
    question: "Which of the following latitudes passes through India?",
    options: ["Equator", "Arctic Circle", "Tropic of Capricorn", "Tropic of Cancer"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Indian Geography",
    explanation: "The Tropic of Cancer passes through the middle of India[cite: 60]."
  },
  {
    id: "opsi-p2-q146",
    question: "Duncan Passage is situated between",
    options: ["Minicoy and Amindivi", "Minicoy and Maldives", "Little Andaman and Car Nicobar", "South Andaman and Little Andaman"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Indian Geography",
    explanation: "Duncan Passage separates South Andaman and Little Andaman[cite: 60]."
  },
  {
    id: "opsi-p2-q147",
    question: "Which foreign country is closest to Andaman Islands?",
    options: ["Sri Lanka", "Myanmar", "Indonesia", "Pakistan"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Indian Geography",
    explanation: "Myanmar (Coco Islands) is geographically closest to the Andaman group[cite: 60]."
  },
  {
    id: "opsi-p2-q148",
    question: "The Himalayan Mountain system belongs to which one of the following?",
    options: ["Fold mountains", "Volcanic mountains", "Block mountains", "None of the above"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Geomorphology",
    explanation: "The Himalayas are classic examples of young fold mountains[cite: 60]."
  },
  {
    id: "opsi-p2-q149",
    question: "The soil which is a mixture of sand, clay and silt is known as",
    options: ["Loamy soil", "Sandy soil", "Clayey soil", "Desert soil"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Indian Soils",
    explanation: "Loamy soil consists of a balanced mixture of sand, clay, and silt[cite: 60]."
  },
  {
    id: "opsi-p2-q150",
    question: "Which one of the following pairs is correctly matched?",
    options: ["Teak-J&K", "Deodar-MP", "Sandalwood-Kerala", "Sundari-West Bengal"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Indian Forestry",
    explanation: "Sundari trees are characteristic of the mangrove forests in West Bengal (Sundarbans)[cite: 60]."
  },
  {
    id: "opsi-p2-q151",
    question: "Which of the following is not a plantation crop?",
    options: ["Coffee", "Rubber", "Sugarcane", "Tea"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Agriculture",
    explanation: "Sugarcane is classified as a field/cash crop rather than a traditional plantation crop[cite: 60]."
  },
  {
    id: "opsi-p2-q152",
    question: "Which of the following is largest mustard oil growing state?",
    options: ["UP", "Punjab", "MP", "Rajasthan"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Agriculture",
    explanation: "Rajasthan is the leading producer of mustard/ rapeseed in India[cite: 60]."
  },
  {
    id: "opsi-p2-q153",
    question: "Among the following states, which one has the highest amount of Nickel Ore resources?",
    options: ["Chhattisgarh", "Jharkhand", "Karnataka", "Odisha"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Mineral Resources",
    explanation: "Odisha holds the vast majority of India's nickel ore reserves[cite: 60]."
  },
  {
    id: "opsi-p2-q154",
    question: "Pangong Lake is located in",
    options: ["Himachal Pradesh", "Ladakh", "Arunachal", "Jammu and Kashmir"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Indian Geography",
    explanation: "Pangong Tso is situated in Ladakh[cite: 61]."
  },
  {
    id: "opsi-p2-q155",
    question: "Usakothi is located in which district?",
    options: ["Jharsuguda", "Bargarh", "Mayurbhanj", "Sambalpur"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Odisha Sanctuaries",
    explanation: "Usakothi (Badrama) Wildlife Sanctuary is located in Sambalpur district[cite: 61]."
  },
  {
    id: "opsi-p2-q156",
    question: "India shares longest international boundary with",
    options: ["China", "Nepal", "Pakistan", "Bangladesh"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Indian Geography",
    explanation: "India shares its longest land boundary with Bangladesh[cite: 61]."
  },
  {
    id: "opsi-p2-q157",
    question: "Tropic of Cancer passes through which of these states?",
    options: ["Odisha", "Tripura", "Bihar", "Punjab"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Indian Geography",
    explanation: "Among the choices, Tripura is crossed by the Tropic of Cancer[cite: 61]."
  },
  {
    id: "opsi-p2-q158",
    question: "Satpura hills lie in which of the following states?",
    options: ["Madhya Pradesh", "Bihar", "Odisha", "Gujarat"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Indian Geography",
    explanation: "Satpura range primarily spans across Madhya Pradesh[cite: 61]."
  },
  {
    id: "opsi-p2-q159",
    question: "The largest delta in the world is",
    options: ["Gangetic Delta", "Mahanadi Delta", "Sundarbans Delta", "Godavari Delta"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "World Geography",
    explanation: "The Sundarbans (Ganga-Brahmaputra) Delta is the largest delta globally[cite: 61]."
  },
  {
    id: "opsi-p2-q160",
    question: "The river Mahanadi rises from which one of the following states?",
    options: ["Madhya Pradesh", "Chhattisgarh", "Jharkhand", "West Bengal"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Indian Rivers",
    explanation: "Mahanadi originates from Sihawa in Dhamtari district, Chhattisgarh[cite: 61]."
  },
  {
    id: "opsi-p2-q161",
    question: "Economic growth is said to be intensive when:",
    options: ["More inputs are employed", "There is an improvement in the quality of goods produced", "There is an improvement in the way production is organised", "Existing resources are used more efficiently"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Economics",
    explanation: "Intensive economic growth derives from more efficient utilization of existing resources[cite: 61]."
  },
  {
    id: "opsi-p2-q162",
    question: "Consider the following statements regarding Indian Planning: (1. Second Plan emphasized heavy industries. 2. Third Plan introduced import substitution.)",
    options: ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Indian Economy",
    explanation: "Both statements accurately reflect Indian planning strategy history[cite: 62]."
  },
  {
    id: "opsi-p2-q163",
    question: "The National Family Health Survey of India is conducted by",
    options: ["NITI Ayog", "International Institute for Population Sciences", "The World Bank", "ICRIER"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Social Statistics",
    explanation: "NFHS is coordinated by the International Institute for Population Sciences (IIPS), Mumbai[cite: 62]."
  },
  {
    id: "opsi-p2-q164",
    question: "Sunshine countries refer to those countries which",
    options: ["Receive more than 8 hours of average sunshine", "Lie on the equator", "Lie between the Tropic of Cancer and Tropic of Capricorn", "None of the above"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Geography & Energy",
    explanation: "Sunshine countries generally refer to nations located fully or partially between the Tropics[cite: 62]."
  },
  {
    id: "opsi-p2-q165",
    question: "Which agency is responsible for the estimation of poverty in India?",
    options: ["NITI Ayog", "Rural Development Ministry", "Ministry of Food and Civil Supplies", "Finance Commission"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Indian Economy",
    explanation: "NITI Aayog (succeeding the Planning Commission) oversees poverty estimations[cite: 62]."
  },
  {
    id: "opsi-p2-q166",
    question: "Under Pradhan Mantri Mudra Yojana, a start-up entrepreneur will be eligible for which category of loan?",
    options: ["Kishore", "Tarun", "Shishu", "None of the above"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Economy & Schemes",
    explanation: "For start-up entrepreneurs entering business, loans up to Rs. 50,000 fall under the 'Shishu' category[cite: 62]."
  },
  {
    id: "opsi-p2-q167",
    question: "What is Yellow Revolution?",
    options: ["Increased production of milk", "Increased production of Apple", "Development of fisheries and aquaculture", "Increased oilseeds production"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Agriculture",
    explanation: "Yellow Revolution is tied to increased production of edible oilseeds[cite: 62]."
  },
  {
    id: "opsi-p2-q168",
    question: "Economic Survey in India is published officially every year by which of the following?",
    options: ["Reserve Bank of India", "NITI Ayog", "Ministry of Finance, Government of India", "Ministry of Industries"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Indian Economy",
    explanation: "The Economic Survey is compiled and published by the Ministry of Finance[cite: 63]."
  },
  {
    id: "opsi-p2-q169",
    question: "Which one of the following determines bank lending rate?",
    options: ["Government of India", "State Bank of India", "Reserve Bank of India", "The President of India"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Banking & Economy",
    explanation: "The central bank (RBI) regulates rates like repo rate which determines lending frameworks[cite: 63]."
  },
  {
    id: "opsi-p2-q170",
    question: "Which of the following is NOT a type of motion available to Members of Parliament?",
    options: ["Adjournment motion", "Closure motion", "No-Day-Yet-Named Motion", "Condemnation motion"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Indian Polity",
    explanation: "Condemnation is not a parliamentary motion category listed in standard rules[cite: 63]."
  },
  {
    id: "opsi-p2-q171",
    question: "Who appoints members of the State Election Commission?",
    options: ["Governor", "Chief Minister", "President", "High Court Chief Justice"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Indian Polity",
    explanation: "State Election Commissioners are appointed by the Governor of the State[cite: 63]."
  },
  {
    id: "opsi-p2-q172",
    question: "To whom does State Finance Commission submit its report on its study about financial status of Panchayats?",
    options: ["Panchayati Raj Minister", "Chief Minister", "Speaker of Assembly", "Governor"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Indian Polity & Local Government",
    explanation: "The State Finance Commission submits its report to the Governor[cite: 63]."
  },
  {
    id: "opsi-p2-q173",
    question: "Panchayats in scheduled areas are not empowered to regulate which of the following matters?",
    options: [
      "The Sale and consumption of intoxicants",
      "Ownership rights over major forest produce",
      "Encroachment of tribal lands by outsiders",
      "Prevent higher levels from taking over powers"
    ],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Panchayati Raj / PESA",
    explanation: "Gram Sabhas under PESA have ownership rights over minor forest produce, not major forest produce[cite: 63]."
  },
  {
    id: "opsi-p2-q174",
    question: "Consider statements regarding parliamentary democracy. (1. Freedom of choice to elect rulers, 2. Freedom of speech, 3. Collective responsibility)",
    options: ["1 and 2 only", "1 and 3 only", "2 and 3 only", "1, 2 and 3"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Indian Polity",
    explanation: "All listed statements form core pillars of parliamentary democracy[cite: 64]."
  },
  {
    id: "opsi-p2-q175",
    question: "Which of the following writ secures personal freedom?",
    options: ["Habeas Corpus", "Mandamus", "Certiorari", "Quo-warranto"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Indian Polity",
    explanation: "Habeas Corpus literally means 'to have the body of', securing personal liberty against unlawful detention[cite: 64]."
  },
  {
    id: "opsi-p2-q176",
    question: "India opted for a federal form of government because of",
    options: ["Vast territory", "Cultural integration", "Linguistic and regional diversity", "Administrative convenience"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Indian Polity",
    explanation: "India's immense linguistic, cultural, and regional diversity necessitated a federal structure[cite: 64]."
  },
  {
    id: "opsi-p2-q177",
    question: "Indian Constitution recognises minorities on the basis of",
    options: ["Religion", "Caste", "Population", "Language and Religion"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Indian Polity",
    explanation: "The Constitution recognizes minorities primarily on religious and linguistic grounds[cite: 64]."
  },
  {
    id: "opsi-p2-q178",
    question: "In case President dies while in office, the Vice-President can act as President for a maximum period of",
    options: ["2 years", "1 year", "6 months", "3 months"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Indian Polity",
    explanation: "An election to fill the vacancy must be held within 6 months[cite: 64]."
  },
  {
    id: "opsi-p2-q179",
    question: "Education is included in which list of the Constitution?",
    options: ["Union List", "State List", "Concurrent List", "Residuary subjects"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Indian Polity",
    explanation: "Education was moved to the Concurrent List via the 42nd Amendment[cite: 64]."
  },
  {
    id: "opsi-p2-q180",
    question: "Who is the highest Law Officer of a State?",
    options: ["Attorney General", "Advocate General", "Law Secretary", "Solicitor General"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Indian Polity",
    explanation: "The Advocate General is the highest law officer in a state[cite: 64]."
  },
  {
    id: "opsi-p2-q181",
    question: "Directive Principles of State Policy of Indian Constitution is derived from the constitution of which country?",
    options: ["USA", "UK", "Ireland", "Germany"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Indian Polity",
    explanation: "DPSPs were borrowed from the Irish Constitution[cite: 64]."
  },
  {
    id: "opsi-p2-q182",
    question: "The Preamble of Indian Constitution is based Objectives Resolution moved by whom in the Constituent Assembly?",
    options: ["Jawaharlal Nehru", "Dr. Rajendra Prasad", "B. R. Ambedkar", "Sardar Vallabhbhai Patel"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Indian Polity",
    explanation: "The Preamble stems from the Objectives Resolution introduced by Jawaharlal Nehru[cite: 65]."
  },
  {
    id: "opsi-p2-q183",
    question: "Who is the first Vice President of India?",
    options: ["Dr. Zakir Hussain", "Dr. S. Radhakrishnan", "V. V. Giri", "B. D. Jatti"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Indian Polity",
    explanation: "Dr. S. Radhakrishnan served as India's first Vice President[cite: 65]."
  },
  {
    id: "opsi-p2-q184",
    question: "Who is the Leader of the House in Lok Sabha?",
    options: ["Speaker", "Leader of Opposition", "Prime Minister or a minister nominated by him", "Chief Whip"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Indian Polity",
    explanation: "The Prime Minister (if a member) or a nominated minister acts as Leader of the House[cite: 65]."
  },
  {
    id: "opsi-p2-q185",
    question: "Which of the following State Legislature is NOT bicameral?",
    options: ["Bihar", "Uttar Pradesh", "Karnataka", "Odisha"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Indian Polity",
    explanation: "Odisha has a unicameral legislature (Legislative Assembly only)[cite: 65]."
  },
  {
    id: "opsi-p2-q186",
    question: "How many Union Territories are there at present in India?",
    options: ["Eight", "Eleven", "Nine", "Seven"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Indian Polity",
    explanation: "There are 8 Union Territories in India currently[cite: 65]."
  },
  {
    id: "opsi-p2-q187",
    question: "What is the Unit of measuring Force?",
    options: ["Newton", "Joule", "Watt", "Pascal"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Physics",
    explanation: "Force is measured in Newtons[cite: 65]."
  },
  {
    id: "opsi-p2-q188",
    question: "\"Every body continues its state of rest or of uniform motion until an external force is applied.\" This is known as",
    options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Law of Gravitation"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Physics",
    explanation: "This statement defines Newton's First Law of Motion (Law of Inertia)[cite: 65]."
  },
  {
    id: "opsi-p2-q189",
    question: "Why it is always easier to move a heavy object on rollers rather than to slide it?",
    options: ["Gravitational force is stronger", "Air resistance is weaker", "Rolling friction is always less than the sliding friction", "None of the above"],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Physics",
    explanation: "Rolling friction is significantly lower than sliding friction[cite: 65]."
  },
  {
    id: "opsi-p2-q190",
    question: "Who of the following postulated that mass can be converted into energy and energy can be converted into mass?",
    options: ["Newton", "Einstein", "Kepler", "Heisenberg"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Physics",
    explanation: "Albert Einstein postulated mass-energy equivalence ($E=mc^2$)[cite: 66]."
  },
  {
    id: "opsi-p2-q191",
    question: "What is the value of \"g\" at surface of earth (acceleration due to gravity)?",
    options: ["9 m/sec sq", "9.8 m/sec sq", "10 m/sec sq", "Can't be determined"],
    correctAnswer: 1,
    subject: "General Studies",
    topic: "Physics",
    explanation: "Standard acceleration due to gravity is approximately $9.8\\text{ m/s}^2$[cite: 66]."
  },
  {
    id: "opsi-p2-q192",
    question: "Which among the following is a negatively charged particle?",
    options: ["Neutron", "Positron", "Boson", "Electron"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Chemistry / Physics",
    explanation: "Electrons carry a negative elementary electrical charge[cite: 66]."
  },
  {
    id: "opsi-p2-q193",
    question: "Fuse wire in a circuit has",
    options: [
      "Low resistance and low melting point",
      "High resistance and high melting point",
      "High resistance and low melting point",
      "Low resistance and high melting point"
    ],
    correctAnswer: 2,
    subject: "General Studies",
    topic: "Physics",
    explanation: "A fuse wire possesses high electrical resistance and a low melting point[cite: 66]."
  },
  {
    id: "opsi-p2-q194",
    question: "X-Rays were discovered by",
    options: ["Rontgen", "Carbon Dating", "Einstein", "Hydrocarbon analysis"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Physics",
    explanation: "Wilhelm Conrad Röntgen discovered X-rays in 1895[cite: 66]."
  },
  {
    id: "opsi-p2-q195",
    question: "Barometer is used for measuring",
    options: ["Atmospheric pressure", "Humidity", "Wind speed", "Temperature"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Physics",
    explanation: "A barometer measures atmospheric pressure[cite: 66]."
  },
  {
    id: "opsi-p2-q196",
    question: "Hydrometer measures",
    options: ["Relative density of liquids", "Purity of milk", "Humidity", "Sound intensity"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Physics",
    explanation: "A hydrometer is used for measuring the relative density of liquids[cite: 66]."
  },
  {
    id: "opsi-p2-q197",
    question: "A sliced apple, when exposed to air, turns brown after some time as it contains?",
    options: ["Calcium", "Potassium", "Zinc", "Iron"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Chemistry / Biology",
    explanation: "Apples contain iron compounds that undergo enzymatic oxidation when exposed to air[cite: 66]."
  },
  {
    id: "opsi-p2-q198",
    question: "How many elements are there in nature as per latest periodic table?",
    options: ["107", "110", "115", "118"],
    correctAnswer: 3,
    subject: "General Studies",
    topic: "Chemistry",
    explanation: "There are 118 confirmed elements in the periodic table[cite: 66]."
  },
  {
    id: "opsi-p2-q199",
    question: "Which of the following is not an Aluminium ore?",
    options: ["Haematite", "Bauxite", "Corundum", "Cryolite"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Chemistry & Minerals",
    explanation: "Haematite is an iron ore, while Bauxite, Corundum, and Cryolite are aluminium ores[cite: 66]."
  },
  {
    id: "opsi-p2-q200",
    question: "The study of fossils is known as",
    options: ["Paleontology", "Entomology", "Mycology", "Etymology"],
    correctAnswer: 0,
    subject: "General Studies",
    topic: "Biology",
    explanation: "Paleontology is the scientific study of life existing prior to, or sometimes including, the start of the Holocene epoch based on fossils[cite: 66]."
  }
];