export type SyllabusUnit = {
  title: string;
  weightage?: string;
  topics: string[];
};

export type SyllabusPaper = {
  name: string;
  description: string;
  units: SyllabusUnit[];
};

export type ExamPatternRow = {
  paper: string;
  subject: string;
  questions: number;
  marks: number;
  duration: string;
  negative: string;
};

export type ExamSyllabusRecord = {
  id: string;
  slug: string;
  contentType: "syllabus";
  title: string;
  description: string;
  category: string;
  stateCode: string;
  conductingBody: string;
  qualification?: string;
  officialUrl?: string;
  updatedAt: string;
  stages: string[];
  highYieldFocus: string[];
  pyqTopicHint: string;
  pattern: ExamPatternRow[];
  metadata: {
    examId: string;
    examName: string;
    subject: string;
    conductingBody: string;
    papers: SyllabusPaper[];
  };
};

type ExamSeed = {
  id: string;
  title: string;
  category: string;
  stateCode: string;
  conductingBody: string;
  description: string;
  qualification: string;
  officialUrl: string;
  officialSyllabusPdfUrl?: string;
  stages: string[];
  pyqTopicHint: string;
  highYieldFocus: string[];
  pattern: ExamPatternRow[];
  papers: SyllabusPaper[];
};

const EXAM_SEEDS: ExamSeed[] = [
  {
    id: "ossc-cgl-specialist",
    title: "OSSC CGL Specialist 2025 (CGLRE Specialist)",
    category: "Odisha State Exams",
    stateCode: "ODISHA",
    conductingBody: "Odisha Staff Selection Commission (OSSC)",
    description: "Preliminary Examination Admit Card out (Exam Date: 30/11/2026) for OSSC CGLRE Specialist 2025 (Advt No. 5919/OSSC).",
    qualification: "Graduation / Specialist Degree as per OSSC CGLRE notification",
    officialUrl: "https://ossc.gov.in/Public/Pages/Login.aspx",
    stages: ["Preliminary Examination", "Main Written Examination", "Certificate Verification"],
    pyqTopicHint: "OSSC CGL Specialist General Studies Arithmetic Reasoning Specialist Subject",
    highYieldFocus: ["General Studies & Odisha GK", "Arithmetic, Data Interpretation & Reasoning", "Specialist Domain Paper"],
    pattern: [
      { paper: "Preliminary Exam", subject: "General Studies, Arithmetic, Reasoning & Specialist Core", questions: 150, marks: 150, duration: "150 Mins", negative: "0.25" }
    ],
    papers: [
      {
        name: "Preliminary Examination Syllabus",
        description: "Core objective screening syllabus for OSSC CGL Specialist 2025.",
        units: [
          {
            title: "General Awareness, Odisha GK & Current Affairs",
            weightage: "High",
            topics: ["Indian & Odisha History, Polity, Geography and Economy", "General Science and Current Events"]
          },
          {
            title: "Quantitative Aptitude, Reasoning & Specialist Subject",
            weightage: "High",
            topics: ["Arithmetic, Percentage, Ratio, Data Interpretation and Logical Reasoning", "Post-Specific Specialist Technical Concepts"]
          }
        ]
      }
    ]
  },
  {
    id: "upsc-cse",
    title: "UPSC Civil Services Examination (IAS / IPS)",
    category: "National Civil Services",
    stateCode: "ALL INDIA",
    conductingBody: "Union Public Service Commission (UPSC)",
    description: "India's premier civil services examination conducted annually for recruitment to IAS, IFS, IPS, and Central Services.",
    qualification: "Bachelor's degree from a recognized university",
    officialUrl: "https://upsc.gov.in",
    stages: ["Preliminary Examination (GS I & CSAT)", "Main Examination (Written)", "Personality Test (Interview)"],
    pyqTopicHint: "Polity Economy Modern History Geography Environment",
    highYieldFocus: [
      "NCERT Class 6–12 core foundations & standard reference books",
      "12-month current affairs linked to GS I–IV & Prelims themes",
      "Answer writing structure, ethics case studies & CSAT practice",
    ],
    pattern: [
      { paper: "Prelims GS Paper I", subject: "History, Polity, Economy, Geography, Environment, Science & Current Affairs", questions: 100, marks: 200, duration: "2 Hours", negative: "-1/3" },
      { paper: "Prelims CSAT Paper II", subject: "Comprehension, Logical Reasoning & Numeracy", questions: 80, marks: 200, duration: "2 Hours", negative: "-1/3 (Qualifying 33%)" },
      { paper: "Mains GS I–IV", subject: "Heritage/History/Geo, Polity/Governance/IR, Economy/S&T/Security, Ethics", questions: 20, marks: 1000, duration: "3 Hours / Paper", negative: "Descriptive" },
    ],
    papers: [
      {
        name: "Prelims — Paper I (General Studies)",
        description: "Objective screening paper testing conceptual clarity and current affairs application.",
        units: [
          { title: "Indian Polity & Constitution", weightage: "High", topics: ["Preamble & Fundamental Rights", "DPSP & Fundamental Duties", "Parliament, Judiciary & Federalism", "Constitutional & Statutory Bodies"] },
          { title: "Economy & Social Development", weightage: "High", topics: ["National Income, Inflation & Monetary Policy", "Budget, Fiscal Policy & Taxation", "Agriculture, Industry & Infrastructure", "External Sector, BoP & Poverty/Inclusion"] },
          { title: "History, Art & Culture", weightage: "High", topics: ["Indus Valley, Vedic & Mauryan/Gupta Eras", "Architecture, Temple Styles, Dance & Music", "1857 Revolt & Indian National Movement", "Socio-Religious Reforms & Post-Independence"] },
          { title: "Geography & Environment", weightage: "High", topics: ["Indian & World Physical Geography", "Monsoon, Soils, Drainage & Resources", "Biodiversity, Protected Areas & National Parks", "Climate Change, Ecology & EIA"] },
        ],
      },
      {
        name: "Mains — GS Papers I–IV & Essay",
        description: "Descriptive analytical papers evaluating depth, balance, and administrative perspective.",
        units: [
          { title: "GS Paper I (Heritage, History & Society)", weightage: "250 Marks", topics: ["Modern Indian History & World History", "Indian Society, Diversity & Urbanization", "Physical & Human Geography"] },
          { title: "GS Paper II (Governance, Polity & IR)", weightage: "250 Marks", topics: ["Constitution, Parliament & State Legislatures", "Social Justice, Welfare Schemes & Governance", "India & Neighbourhood / Global Groupings"] },
          { title: "GS Paper III (Economy, S&T, Security)", weightage: "250 Marks", topics: ["Inclusive Growth, Budgeting & Farm Sector", "Science & Tech, Space, Biotech & IT", "Disaster Management & Internal Security"] },
          { title: "GS Paper IV (Ethics, Integrity & Aptitude)", weightage: "250 Marks", topics: ["Ethics & Human Interface", "Attitude, Emotional Intelligence & Probity", "Administrative Case Studies"] },
        ],
      },
    ],
  },
  {
    id: "opsc-ocs",
    title: "OPSC Odisha Civil Services Examination",
    category: "Odisha State Government Exams",
    stateCode: "ODISHA",
    conductingBody: "Odisha Public Service Commission (OPSC)",
    description: "Premier state civil services examination for recruitment into Group A and Group B administrative services in Odisha.",
    qualification: "Bachelor's degree from a recognized university",
    officialUrl: "https://www.opsc.gov.in",
    stages: ["Preliminary Examination", "Main Examination", "Personality Test"],
    pyqTopicHint: "Odisha History Geography Polity Economy",
    highYieldFocus: [
      "Odisha history, Paika Rebellion, freedom struggle & Odia culture",
      "Odisha geography, Similipal/Chilika, rivers, minerals & Odisha Budget",
      "Bilingual awareness of Odisha governance schemes & current affairs",
    ],
    pattern: [
      { paper: "Prelims GS I & II", subject: "National & Odisha GS + CSAT", questions: 100, marks: 200, duration: "2 Hours / Paper", negative: "-1/3" },
      { paper: "Mains Written", subject: "Odia/English, Essay, GS I & GS II + Optional", questions: 20, marks: 1800, duration: "3 Hours / Paper", negative: "Descriptive" },
    ],
    papers: [
      {
        name: "Preliminary Examination (GS I & CSAT)",
        description: "Objective papers covering national and Odisha-specific general studies.",
        units: [
          { title: "Odisha Specific GK & Heritage", weightage: "High", topics: ["Ancient to Modern History of Odisha", "Odisha Art, Culture, Festivals & Literature", "Odisha Geography, Forests & Mineral Resources"] },
          { title: "National Polity, Economy & History", weightage: "High", topics: ["Indian Constitution & Governance", "Economic Planning, RBI & Odisha Economy", "Indian National Movement & General Science"] },
        ],
      },
      {
        name: "Main Examination (Compulsory & Optional)",
        description: "Descriptive written examination for Odisha Civil Services posts.",
        units: [
          { title: "Odia & English Qualifying / Essay", weightage: "Compulsory", topics: ["Essay Writing on Odisha & National Themes", "Precis, Comprehension & Translation"] },
          { title: "General Studies I & II", weightage: "Core Mains", topics: ["History, Geography & Odisha Socio-Economy", "Constitution, Public Administration & International Affairs"] },
        ],
      },
    ],
  },
  {
    id: "odisha-police-si",
    title: "Odisha Police Sub-Inspector (SI) Recruitment",
    category: "Odisha State Government Exams",
    stateCode: "ODISHA",
    conductingBody: "Odisha Police Recruitment Board (OPRB)",
    description: "State police recruitment examination for Sub-Inspector of Police posts across Odisha.",
    qualification: "Bachelor's degree in any discipline",
    officialUrl: "https://odishapolice.gov.in",
    stages: ["Computer Based Recruitment Exam (Paper I & II)", "Physical Standard & Physical Efficiency Test", "Medical & Document Verification"],
    pyqTopicHint: "English Odia General Knowledge Reasoning Quantitative",
    highYieldFocus: [
      "Paper I (Odia & English Language) & Paper II (General Studies)",
      "Odisha GK, Indian Polity, current affairs & basic mental ability",
      "Timed CBT accuracy + physical fitness preparation",
    ],
    pattern: [
      { paper: "Paper I — Language", subject: "Odia & English Grammar/Comprehension", questions: 100, marks: 100, duration: "90 Mins", negative: "-0.25" },
      { paper: "Paper II — General Studies", subject: "GK, History, Geography, Polity, Economy & Science", questions: 200, marks: 200, duration: "180 Mins", negative: "-0.25" },
    ],
    papers: [
      {
        name: "Paper I — Odia & English Language",
        description: "Grammar, vocabulary, comprehension, and usage in Odia and English.",
        units: [
          { title: "English Language & Comprehension", weightage: "Paper I", topics: ["Reading Comprehension Passages", "Grammar, Tenses, Voice, Narration & Error Spotting", "Synonyms, Antonyms, Idioms & Cloze Test"] },
          { title: "Odia Language & Comprehension", weightage: "Paper I", topics: ["Odia Comprehension Passages", "Bakarana, Sandhi, Samasa & Ruthi/Bagdhara", "Biparit Shabda & Pratisabda"] },
        ],
      },
      {
        name: "Paper II — General Studies",
        description: "General knowledge, history, geography, polity, economy, and science.",
        units: [
          { title: "General Knowledge & Odisha Affairs", weightage: "Paper II", topics: ["Indian & Odisha History and Culture", "Indian Constitution, Geography & Economy", "General Science & Current Events"] },
        ],
      },
    ],
  },
  {
    id: "opsc-ag-aso",
    title: "OPSC Assistant Section Officer (ASO)",
    category: "Odisha State Government Exams",
    stateCode: "ODISHA",
    conductingBody: "Odisha Public Service Commission (OPSC)",
    description: "State secretariat and administrative recruitment examination for Assistant Section Officer posts.",
    qualification: "Bachelor's degree in any discipline",
    officialUrl: "https://www.opsc.gov.in",
    stages: ["Objective Written Examination", "Skill Test (where applicable)"],
    pyqTopicHint: "General Awareness Reasoning Quantitative English",
    highYieldFocus: [
      "Current affairs, Indian/Odisha GK, numerical ability & reasoning",
      "High-speed objective accuracy with negative marking control",
    ],
    pattern: [
      { paper: "Written Paper", subject: "General Awareness, Reasoning, Quantitative & English", questions: 200, marks: 200, duration: "150 Mins", negative: "-0.25" },
    ],
    papers: [
      {
        name: "Objective Written Examination",
        description: "Multi-subject objective paper for Assistant Section Officer.",
        units: [
          { title: "General Awareness & Current Events", weightage: "Core", topics: ["National & Odisha Current Affairs", "History, Geography, Polity & Economy", "General Science & Static GK"] },
          { title: "Reasoning, Quantitative & English", weightage: "Core", topics: ["Logical & Analytical Reasoning", "Arithmetic, Percentages, Ratio & Data Interpretation", "Grammar, Vocabulary & Comprehension"] },
        ],
      },
    ],
  },
  {
    id: "ugc-net-econ",
    title: "UGC NET Economics (Code 01 — JRF & Assistant Professor)",
    category: "National Eligibility & Research",
    stateCode: "ALL INDIA",
    conductingBody: "National Testing Agency (NTA)",
    description: "Official UGC NET Economics (Subject Code 01) syllabus covering all 10 core units across Microeconomics, Macroeconomics, Statistics & Econometrics, Mathematical Economics, International Economics, Public Economics, Money & Banking, Growth & Development, Environmental Economics & Demography, and Indian Economy.",
    qualification: "Master's degree in Economics / Applied Economics / Econometrics",
    officialUrl: "https://ugcnetonline.in/NTA_All_R_Syllabus/01/Economics_English.pdf",
    stages: ["Paper I — General Paper on Teaching & Research Aptitude", "Paper II — Economics (Units 1 to 10)"],
    pyqTopicHint: "Microeconomics Macroeconomics Econometrics Mathematical International Public Banking Growth Environment Indian Economy",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Unit 1 — Micro Economics",
        description: "Consumer choice, production and costs, uncertainty, game theory, market structures, factor pricing, general equilibrium, and welfare economics.",
        units: [
          {
            title: "Consumer Behaviour, Production & Costs",
            topics: [
              "Theory of Consumer Behaviour",
              "Theory of Production and Costs",
              "Decision making under uncertainty: Attitude towards Risk",
              "Game Theory — Non-Cooperative Games",
            ],
          },
          {
            title: "Markets, Equilibrium & Welfare Economics",
            topics: [
              "Market Structures, competitive and non-competitive equilibria, and their efficiency properties",
              "Factor Pricing",
              "General Equilibrium Analysis",
              "Efficiency Criteria: Pareto-Optimality, Kaldor, Hicks and Wealth Maximization",
              "Welfare Economics: Fundamental Theorems, Social Welfare Function",
              "Asymmetric Information: Adverse Selection and Moral Hazard",
            ],
          },
        ],
      },
      {
        name: "Unit 2 — Macro Economics",
        description: "National income, output and employment models, consumption and investment functions, money demand/supply, IS-LM, inflation, business cycles, and macro policy.",
        units: [
          {
            title: "National Income, Output & Employment",
            topics: [
              "National Income: Concepts and Measurement",
              "Determination of output and employment: Classical & Keynesian Approach",
              "Consumption Function",
              "Investment Function",
              "Multiplier and Accelerator",
            ],
          },
          {
            title: "Money, IS-LM, Inflation & Policy",
            topics: [
              "Demand for Money",
              "Supply of Money",
              "IS-LM Model Approach",
              "Inflation and Phillips Curve Analysis",
              "Business Cycles",
              "Monetary and Fiscal Policy",
              "Rational Expectation Hypothesis and its critique",
            ],
          },
        ],
      },
      {
        name: "Unit 3 — Statistics and Econometrics",
        description: "Probability, descriptive statistics, sampling and inference, regression models, simultaneous equations, discrete choice, and time series.",
        units: [
          {
            title: "Probability, Descriptive Stats & Inference",
            topics: [
              "Probability Theory: Concepts of probability, Distributions, Moments, Central Limit Theorem",
              "Descriptive Statistics — Measures of Central Tendency & Dispersion, Correlation, Index Numbers",
              "Sampling Methods & Sampling Distribution",
              "Statistical Inferences, Hypothesis Testing",
            ],
          },
          {
            title: "Regression & Econometric Models",
            topics: [
              "Linear Regression Models and their properties — BLUE",
              "Identification Problem",
              "Simultaneous Equation Models — recursive and non-recursive",
              "Discrete choice models",
              "Time Series Analysis",
            ],
          },
        ],
      },
      {
        name: "Unit 4 — Mathematical Economics",
        description: "Set theory and functions, calculus, linear algebra, optimization, input-output and linear programming, and differential/difference equations.",
        units: [
          {
            title: "Calculus, Linear Algebra & Optimization",
            topics: [
              "Sets, functions and continuity, sequence, series",
              "Differential Calculus and Its Applications",
              "Linear Algebra — Matrices, Vector Spaces",
              "Static Optimization Problems and their applications",
            ],
          },
          {
            title: "Programming & Dynamic Equations",
            topics: [
              "Input-Output Model, Linear Programming",
              "Difference and Differential equations with applications",
            ],
          },
        ],
      },
      {
        name: "Unit 5 — International Economics",
        description: "Trade theories, imperfect competition in trade, BoP, exchange rate and forex market, terms of trade, tariffs/non-tariff barriers, WTO, IMF, and World Bank.",
        units: [
          {
            title: "Trade Theories, Terms of Trade & Protection",
            topics: [
              "International Trade: Basic concepts and analytical tools",
              "Theories of International Trade",
              "International Trade under Imperfect Competition",
              "Gains from Trade, Terms of Trade, Trade Multiplier",
              "Tariff and Non-Tariff barriers to trade; Dumping",
            ],
          },
          {
            title: "BoP, Exchange Rate & Global Institutions",
            topics: [
              "Balance of Payments: Composition, Equilibrium, Disequilibrium and Adjustment Mechanisms",
              "Exchange Rate: Concepts and Theories",
              "Foreign Exchange Market and Arbitrage",
              "GATT, WTO, and Regional Trade Blocks; Trade Policy Issues",
              "IMF & World Bank",
            ],
          },
        ],
      },
      {
        name: "Unit 6 — Public Economics",
        description: "Market failure and regulation, public revenue and taxation, public expenditure, public debt, public budget, and fiscal policy.",
        units: [
          {
            title: "Market Failure & Public Revenue",
            topics: [
              "Market Failure and Remedial Measures: Asymmetric Information, Public Goods, Externality",
              "Regulation of Market — Collusion and Consumers' Welfare",
              "Public Revenue: Tax & Non-Tax Revenue, Direct & Indirect Taxes, Progressive and non-progressive Taxation, Incidence and Effects of Taxation",
            ],
          },
          {
            title: "Expenditure, Debt, Budget & Fiscal Policy",
            topics: [
              "Public expenditure",
              "Public Debt and its management",
              "Public Budget and Budget Multiplier",
              "Fiscal Policy and Its Implications",
            ],
          },
        ],
      },
      {
        name: "Unit 7 — Money and Banking",
        description: "Money supply components, central bank, commercial banking, monetary policy, non-bank financial institutions, and financial markets.",
        units: [
          {
            title: "Money Supply, Banking & Monetary Policy",
            topics: [
              "Components of Money Supply",
              "Central Bank",
              "Commercial Banking",
              "Instruments and working of Monetary Policy",
            ],
          },
          {
            title: "Financial Institutions & Markets",
            topics: [
              "Non-banking Financial Institutions",
              "Capital Market and its regulation",
            ],
          },
        ],
      },
      {
        name: "Unit 8 — Growth and Development Economics",
        description: "Growth vs. development, classical to endogenous growth theories and models, technical progress, and development indicators.",
        units: [
          {
            title: "Development Theories & Indicators",
            topics: [
              "Economic Growth and Economic Development",
              "Theories of Economic Development: Adam Smith, Ricardo, Marx, Schumpeter, Rostow, Balanced & Unbalanced growth, Big Push approach",
              "Indicators of Economic Development: PQLI, HDI, SDGs",
            ],
          },
          {
            title: "Growth Models & Technical Progress",
            topics: [
              "Models of Economic Growth: Harrod-Domar, Solow, Robinson, Kaldor",
              "Technical progress — Disembodied & embodied; endogenous growth",
            ],
          },
        ],
      },
      {
        name: "Unit 9 — Environmental Economics and Demography",
        description: "Environmental goods, externalities and valuation, climate/sustainability policies, demographic transition, fertility, mortality, and migration.",
        units: [
          {
            title: "Environmental Economics",
            topics: [
              "Environment as a Public Good",
              "Market Failure, Externality and Coase Theorem",
              "Cost-Benefit Analysis and Valuation of Environmental Goods",
              "Sustainable Development and Climate Change Policy",
            ],
          },
          {
            title: "Demography",
            topics: [
              "Theories of Population and Demographic Transition",
              "Fertility, Mortality, Life Tables and Migration",
            ],
          },
        ],
      },
      {
        name: "Unit 10 — Indian Economy",
        description: "Indian growth structure, agriculture, industry, services, rural/urban development, foreign trade and BoP, infrastructure, reforms, fiscal federalism, and poverty/unemployment.",
        units: [
          {
            title: "Growth, Sectors & Rural/Urban Development",
            topics: [
              "Economic Growth in India: Pattern and Structure",
              "Agriculture: Pattern & Structure of Growth, Major Challenges, Policy Responses",
              "Industry: Pattern & Structure of Growth, Major Challenges, Policy Responses",
              "Services: Pattern & Structure of Growth, Major Challenges, Policy Responses",
              "Rural Development — Issues, Challenges & Policy Responses",
              "Urban Development — Issues, Challenges, and Policy Responses",
            ],
          },
          {
            title: "Trade, Infrastructure, Reforms, Finance & Inclusion",
            topics: [
              "Foreign Trade: Structure and Direction, BOP, Flow of Foreign Capital, Trade Policies",
              "Infrastructure Development: Physical and Social; Public-Private Partnerships",
              "Reforms in Land, Labour, and Capital Markets",
              "Centre-State Financial Relations and Finance Commissions of India; FRBM",
              "Poverty, Inequality & Unemployment",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "cuet-pg-eco",
    title: "CUET PG Economics Entrance Examination",
    category: "Postgraduate Entrance Exams",
    stateCode: "ALL INDIA",
    conductingBody: "National Testing Agency (NTA)",
    description: "National entrance examination for admission into MA / M.Sc. Economics programs across participating universities.",
    qualification: "Bachelor's degree with Economics / Quantitative background",
    officialUrl: "https://pgcuet.samarth.ac.in",
    stages: ["Computer Based Test (Domain Paper)"],
    pyqTopicHint: "Microeconomics Macroeconomics Statistics Mathematics Indian Economy",
    highYieldFocus: [
      "Core micro/macro concepts, basic calculus/statistics & Indian economy",
    ],
    pattern: [
      { paper: "Domain Test — Economics", subject: "Micro, Macro, Quantitative Methods & Indian Economy", questions: 75, marks: 300, duration: "90 Mins", negative: "-1" },
    ],
    papers: [
      {
        name: "CUET PG Economics Domain Syllabus",
        description: "Postgraduate entrance syllabus covering core economic theory and quantitative basics.",
        units: [
          { title: "Micro, Macro & Quantitative Methods", weightage: "Core", topics: ["Demand, Supply, Elasticity & Market Equilibrium", "National Income, Money, Banking & Trade", "Basic Calculus, Matrices, Statistics & Indian Economy"] },
        ],
      },
    ],
  },
  {
    id: "nda-na",
    title: "UPSC NDA & NA Examination",
    category: "Defence & Armed Forces",
    stateCode: "ALL INDIA",
    conductingBody: "Union Public Service Commission (UPSC)",
    description: "Premier national defence entrance examination for admission to Army, Navy, and Air Force wings of NDA and Naval Academy.",
    qualification: "10+2 passed or appearing (Physics & Maths required for Air Force/Naval wings)",
    officialUrl: "https://upsc.gov.in",
    stages: ["Written Examination (Maths + GAT)", "SSB Interview", "Medical Examination"],
    pyqTopicHint: "Mathematics General Ability Test English Physics History Geography",
    highYieldFocus: [
      "NCERT Class 11–12 Mathematics speed & accuracy",
      "GAT English grammar/vocabulary + General Studies (History, Geo, Polity, Science)",
    ],
    pattern: [
      { paper: "Mathematics", subject: "Algebra, Trigonometry, Calculus, Vectors, Matrices & Probability", questions: 120, marks: 300, duration: "150 Mins", negative: "-1/3" },
      { paper: "General Ability Test (GAT)", subject: "English + General Knowledge (Physics, Chem, Bio, Geo, History, CA)", questions: 150, marks: 600, duration: "150 Mins", negative: "-1/3" },
    ],
    papers: [
      {
        name: "Paper I — Mathematics",
        description: "10+2 level quantitative and analytical mathematics.",
        units: [
          { title: "Calculus, Algebra & Trigonometry", weightage: "High", topics: ["Limits, Continuity, Differentiation & Integration", "Matrices, Determinants, Complex Numbers & Quadratics", "Trigonometric Identities, Equations & Properties of Triangles"] },
          { title: "Analytical Geometry, Vectors & Statistics", weightage: "High", topics: ["2D/3D Geometry, Straight Lines & Conic Sections", "Vector Algebra & Statistics/Probability"] },
        ],
      },
      {
        name: "Paper II — General Ability Test",
        description: "English comprehension/usage and broad general studies.",
        units: [
          { title: "English & General Science", weightage: "Core", topics: ["Grammar, Vocabulary, Idioms & Reading Comprehension", "Physics, Chemistry, General Science & Current Affairs"] },
          { title: "History, Geography & Polity", weightage: "Core", topics: ["Freedom Movement, Indian Constitution, Physical/Indian Geography"] },
        ],
      },
    ],
  },
  {
    id: "cds",
    title: "UPSC Combined Defence Services (CDS)",
    category: "Defence & Armed Forces",
    stateCode: "ALL INDIA",
    conductingBody: "Union Public Service Commission (UPSC)",
    description: "National examination for entry into IMA, INA, AFA, and OTA.",
    qualification: "Bachelor's degree (Engineering / 10+2 Maths for AFA/INA)",
    officialUrl: "https://upsc.gov.in",
    stages: ["Written Examination", "SSB Interview", "Medical Board"],
    pyqTopicHint: "English General Knowledge Elementary Mathematics",
    highYieldFocus: [
      "Strong command of English usage, GS fundamentals & Class 10 level Maths",
    ],
    pattern: [
      { paper: "English", subject: "Vocabulary, Grammar, Comprehension & Sentence Improvement", questions: 120, marks: 100, duration: "2 Hours", negative: "-1/3" },
      { paper: "General Knowledge", subject: "GS, Current Events, History, Geography, Polity & Economy", questions: 120, marks: 100, duration: "2 Hours", negative: "-1/3" },
      { paper: "Elementary Mathematics", subject: "Arithmetic, Algebra, Trigonometry, Geometry & Mensuration", questions: 100, marks: 100, duration: "2 Hours", negative: "-1/3" },
    ],
    papers: [
      {
        name: "Written Objective Papers",
        description: "English, General Knowledge, and Elementary Mathematics (IMA/INA/AFA).",
        units: [
          { title: "English & General Studies", weightage: "Core", topics: ["Comprehension, Cloze, Para-jumbles & Grammar", "Polity, Modern History, Geography, Economy & Current Affairs"] },
          { title: "Elementary Mathematics", weightage: "IMA/INA/AFA", topics: ["Number System, Percentage, Profit/Loss, Time & Work", "Algebra, Trigonometry, Geometry & Mensuration"] },
        ],
      },
    ],
  },
  {
    id: "agniveer-vayu-army",
    title: "Agniveer (Indian Army / Air Force / Navy)",
    category: "Defence & Armed Forces",
    stateCode: "ALL INDIA",
    conductingBody: "Indian Armed Forces / CDAC",
    description: "Entry examination for Agniveer recruitment across Army, Air Force (Agniveer Vayu), and Navy.",
    qualification: "Matric (10th) / 10+2 / Diploma as per trade",
    officialUrl: "https://agnipathvayu.cdac.in",
    stages: ["Online CEE", "Physical Fitness Test", "Medical Exam"],
    pyqTopicHint: "General Knowledge General Science Mathematics Reasoning English",
    highYieldFocus: [
      "Speed, basic arithmetic, reasoning, general science & current affairs",
    ],
    pattern: [
      { paper: "Online CEE", subject: "General Knowledge, General Science, Maths, Reasoning & English", questions: 50, marks: 100, duration: "60 Mins", negative: "-0.25" },
    ],
    papers: [
      {
        name: "Common Entrance Examination (CEE)",
        description: "Objective online test covering general awareness, science, aptitude, and English.",
        units: [
          { title: "GK, General Science & Current Affairs", weightage: "Core", topics: ["Indian History, Geography, Polity, Sports & Awards", "Basic Physics, Chemistry & Biology"] },
          { title: "Mathematics, Reasoning & English", weightage: "Core", topics: ["Arithmetic, Mensuration, Coding-Decoding & Series", "Basic Grammar & Comprehension"] },
        ],
      },
    ],
  },
  {
    id: "gate",
    title: "GATE (Graduate Aptitude Test in Engineering)",
    category: "Engineering & PSU Exams",
    stateCode: "ALL INDIA",
    conductingBody: "IITs & IISc",
    description: "National examination for M.Tech/MS admissions and PSU recruitment across engineering and science disciplines.",
    qualification: "Bachelor's degree in Engineering / Technology / Science (3rd year+ eligible)",
    officialUrl: "https://gate2027.iisc.ac.in",
    stages: ["Computer Based Test (CBT)"],
    pyqTopicHint: "General Aptitude Engineering Mathematics Core Technical",
    highYieldFocus: [
      "General Aptitude (15 marks) + Engineering Mathematics + Core subject fundamentals",
      "MCQ, MSQ, and NAT numerical precision",
    ],
    pattern: [
      { paper: "GATE Paper", subject: "General Aptitude + Engineering Maths + Core Discipline", questions: 65, marks: 100, duration: "3 Hours", negative: "-1/3 or -2/3 on MCQs" },
    ],
    papers: [
      {
        name: "GATE CBT Structure",
        description: "General Aptitude, Engineering Mathematics, and Core Subject syllabus.",
        units: [
          { title: "General Aptitude & Engineering Mathematics", weightage: "High", topics: ["Verbal/Numerical Aptitude, Analytical & Spatial Reasoning", "Linear Algebra, Calculus, Differential Equations & Probability"] },
          { title: "Core Discipline Subjects", weightage: "High", topics: ["Fundamental Theory & Standard Algorithms/Systems", "Previous Year GATE Problem Sets & NAT Practice"] },
        ],
      },
    ],
  },
  {
    id: "ojee",
    title: "OJEE (Odisha Joint Entrance Examination)",
    category: "Odisha State Entrance Exams",
    stateCode: "ODISHA",
    conductingBody: "Odisha Joint Entrance Examination Board",
    description: "State entrance examination for admission to B.Pharm, MCA, M.Tech, MBA, and lateral entry courses in Odisha.",
    qualification: "10+2 / Graduation / Relevant qualifying degree",
    officialUrl: "https://ojee.nic.in",
    stages: ["Computer Based Test (CBT)", "OJEE Counselling"],
    pyqTopicHint: "Analytical Reasoning Verbal Quantitative Course Domain",
    highYieldFocus: [
      "Course-specific domain syllabus + analytical & logical reasoning",
    ],
    pattern: [
      { paper: "Course CBT", subject: "Subject Domain + Analytical & Logical Reasoning", questions: 120, marks: 480, duration: "2 Hours", negative: "-1" },
    ],
    papers: [
      {
        name: "OJEE Course-Specific CBT",
        description: "Subject and aptitude syllabus tailored to chosen stream.",
        units: [
          { title: "Stream Core & Analytical Ability", weightage: "Core", topics: ["Program-Specific Subject Fundamentals", "Data Interpretation, Logical & Verbal Reasoning"] },
        ],
      },
    ],
  },
  {
    id: "neet-ug",
    title: "NEET UG (Medical Entrance Examination)",
    category: "Medical & Healthcare Entrance",
    stateCode: "ALL INDIA",
    conductingBody: "National Testing Agency (NTA)",
    description: "Single national medical entrance exam for MBBS, BDS, BAMS, BHMS, and allied medical courses.",
    qualification: "10+2 with Physics, Chemistry, Biology/Biotechnology & English",
    officialUrl: "https://exams.nta.ac.in/NEET",
    stages: ["Pen & Paper / CBT Examination", "MCC / State Counselling"],
    pyqTopicHint: "Physics Chemistry Botany Zoology NCERT",
    highYieldFocus: [
      "Line-by-line NCERT Class 11 & 12 Biology & Chemistry mastery",
      "Physics formula application, numerical speed & OMR accuracy",
    ],
    pattern: [
      { paper: "NEET UG", subject: "Physics, Chemistry, Botany & Zoology", questions: 180, marks: 720, duration: "200 Mins", negative: "-1" },
    ],
    papers: [
      {
        name: "NEET UG Core Syllabus",
        description: "Physics, Chemistry, and Biology (Botany & Zoology).",
        units: [
          { title: "Biology (Botany & Zoology)", weightage: "360 Marks", topics: ["Cell Structure, Genetics, Biotechnology & Ecology", "Human Physiology, Plant Physiology & Reproduction"] },
          { title: "Physics & Chemistry", weightage: "360 Marks", topics: ["Mechanics, Electrodynamics, Optics & Modern Physics", "Physical, Organic & Inorganic Chemistry"] },
        ],
      },
    ],
  },
  {
    id: "central-university-bed",
    title: "CUET B.Ed (Central University B.Ed Entrance)",
    category: "Teaching & Education Exams",
    stateCode: "ALL INDIA",
    conductingBody: "National Testing Agency (NTA)",
    description: "Entrance examination for B.Ed admissions across Central and participating universities.",
    qualification: "Bachelor's degree from a recognized university",
    officialUrl: "https://pgcuet.samarth.ac.in",
    stages: ["Computer Based Test"],
    pyqTopicHint: "Teaching Aptitude General Awareness Reasoning Language",
    highYieldFocus: [
      "Teaching aptitude, current educational policies (NEP 2020), reasoning & language",
    ],
    pattern: [
      { paper: "CUET B.Ed", subject: "Language, General Awareness, Reasoning & Teaching Aptitude", questions: 75, marks: 300, duration: "90 Mins", negative: "-1" },
    ],
    papers: [
      {
        name: "B.Ed Entrance Syllabus",
        description: "Teaching aptitude, general knowledge, reasoning, and subject comprehension.",
        units: [
          { title: "Teaching Aptitude & NEP 2020", weightage: "High", topics: ["Classroom Management, Learner Psychology & Pedagogy", "National Education Policy & Inclusive Education"] },
          { title: "GK, Reasoning & Language", weightage: "Core", topics: ["Current Affairs, General Knowledge, Analytical Reasoning & English/Hindi"] },
        ],
      },
    ],
  },
  {
    id: "ctet",
    title: "CTET (Central Teacher Eligibility Test)",
    category: "Teaching & Education Exams",
    stateCode: "ALL INDIA",
    conductingBody: "Central Board of Secondary Education (CBSE)",
    description: "National teacher eligibility examination for Paper I (Classes I–V) and Paper II (Classes VI–VIII).",
    qualification: "D.El.Ed / B.Ed as per NCTE norms",
    officialUrl: "https://ctet.nic.in",
    stages: ["Paper I (Primary)", "Paper II (Elementary)"],
    pyqTopicHint: "Child Development Pedagogy Mathematics EVS Social Studies",
    highYieldFocus: [
      "Child Development & Pedagogy (CDP) concepts + NCERT pedagogy",
    ],
    pattern: [
      { paper: "Paper I / Paper II", subject: "CDP, Language I & II, Maths/EVS or Maths/Science or SST", questions: 150, marks: 150, duration: "150 Mins", negative: "None" },
    ],
    papers: [
      {
        name: "Paper I & Paper II Syllabus",
        description: "Child development, pedagogy, languages, and core subjects.",
        units: [
          { title: "Child Development & Pedagogy", weightage: "30 Marks", topics: ["Piaget, Vygotsky, Kohlberg, Learning & Assessment", "Inclusive Education & Pedagogical Issues"] },
          { title: "Languages & Subject Content", weightage: "120 Marks", topics: ["Comprehension & Language Pedagogy", "Mathematics, EVS, Science or Social Studies"] },
        ],
      },
    ],
  },
  {
    id: "kvs-nvs-recruitment",
    title: "KVS & NVS Teacher Recruitment Exam",
    category: "Teaching & Education Exams",
    stateCode: "ALL INDIA",
    conductingBody: "KVS / NVS",
    description: "Recruitment examination for PRT, TGT, and PGT teaching posts in Kendriya Vidyalayas and Jawahar Navodaya Vidyalayas.",
    qualification: "Graduation / Post-Graduation + B.Ed / D.El.Ed + CTET (as applicable)",
    officialUrl: "https://kvsangathan.nic.in",
    stages: ["CBT Written Exam", "Interview / Demo Teaching"],
    pyqTopicHint: "Pedagogy General Knowledge Reasoning Subject Concern",
    highYieldFocus: [
      "Perspectives on Education & Leadership + subject-specific NCERT depth",
    ],
    pattern: [
      { paper: "Written CBT", subject: "General English/Hindi, GK/Reasoning, Pedagogy & Subject", questions: 180, marks: 180, duration: "180 Mins", negative: "As notified" },
    ],
    papers: [
      {
        name: "CBT Written Syllabus",
        description: "General ability, education/pedagogy, and subject-specific mastery.",
        units: [
          { title: "Education & Pedagogy", weightage: "High", topics: ["Curriculum, Teaching-Learning Strategies, Assessment & School Leadership"] },
          { title: "Subject Concern & General Ability", weightage: "High", topics: ["Post-Specific Subject Syllabus + GK, Reasoning & Languages"] },
        ],
      },
    ],
  },
  {
    id: "odisha-junior-regular-teacher",
    title: "Odisha Junior Teacher (Regular) Recruitment",
    category: "Teaching & Education Exams",
    stateCode: "ODISHA",
    conductingBody: "OSEPA / Odisha Govt",
    description: "Teacher recruitment examination for primary and upper primary schools in Odisha.",
    qualification: "CT / D.El.Ed / B.Ed + OSSTET / CTET eligibility",
    officialUrl: "https://osepa.odisha.gov.in",
    stages: ["Computer Based Test (CBT)"],
    pyqTopicHint: "Odia English General Knowledge Pedagogy Mathematics EVS",
    highYieldFocus: [
      "Odia & English language skills, pedagogy, Odisha GK & school curriculum",
    ],
    pattern: [
      { paper: "CBT Paper", subject: "Odia, English, GK/Current Affairs, Pedagogy & Subject", questions: 150, marks: 150, duration: "150 Mins", negative: "-0.25" },
    ],
    papers: [
      {
        name: "Junior Teacher CBT Syllabus",
        description: "Languages, general awareness, pedagogy, and subject fundamentals.",
        units: [
          { title: "Odia, English & General Awareness", weightage: "Core", topics: ["Odia & English Grammar/Comprehension, Odisha GK & Current Affairs"] },
          { title: "Pedagogy & Core Subjects", weightage: "Core", topics: ["Child Development, Classroom Pedagogy, Maths, EVS/Social Studies"] },
        ],
      },
    ],
  },
  {
    id: "ugc-net-education",
    title: "UGC NET Education (JRF & Assistant Professor)",
    category: "Teaching & Education Exams",
    stateCode: "ALL INDIA",
    conductingBody: "National Testing Agency (NTA)",
    description: "National eligibility examination for Assistant Professor and Junior Research Fellowship in Education.",
    qualification: "Master's degree in Education (M.Ed) or allied discipline",
    officialUrl: "https://ugcnet.nta.ac.in",
    stages: ["CBT (Paper I + Paper II)"],
    pyqTopicHint: "Philosophy Psychology Research Methodology Curriculum Teacher Education",
    highYieldFocus: [
      "Philosophical/Sociological/Psychological foundations, research methods & curriculum",
    ],
    pattern: [
      { paper: "Paper I + Paper II", subject: "Teaching/Research Aptitude + Education Domain", questions: 150, marks: 300, duration: "3 Hours", negative: "None" },
    ],
    papers: [
      {
        name: "Paper II — Education",
        description: "Foundations of education, research, curriculum, and teacher education.",
        units: [
          { title: "Foundations & Research in Education", weightage: "High", topics: ["Philosophical, Sociological & Psychological Bases", "Qualitative & Quantitative Educational Research, Statistics"] },
          { title: "Curriculum, Pedagogy & Teacher Ed", weightage: "High", topics: ["Curriculum Design, Measurement/Evaluation & Teacher Education Policies"] },
        ],
      },
    ],
  },
  {
    id: "ignou-bed-entrance",
    title: "IGNOU B.Ed Entrance Examination",
    category: "Teaching & Education Exams",
    stateCode: "ALL INDIA",
    conductingBody: "IGNOU / NTA",
    description: "Entrance examination for IGNOU Bachelor of Education (B.Ed) programme.",
    qualification: "Bachelor's / Master's degree + in-service teaching eligibility as per IGNOU norms",
    officialUrl: "https://ignou.ac.in",
    stages: ["Entrance Test"],
    pyqTopicHint: "General English Comprehension Logical Reasoning Teaching Learning",
    highYieldFocus: [
      "Teaching-learning scenarios, logical reasoning & comprehension speed",
    ],
    pattern: [
      { paper: "Entrance Test", subject: "General English, Logical Reasoning, GK & Teaching-Learning", questions: 100, marks: 100, duration: "2 Hours", negative: "None" },
    ],
    papers: [
      {
        name: "IGNOU B.Ed Entrance Syllabus",
        description: "General awareness, reasoning, English, and teaching-learning in schools.",
        units: [
          { title: "General English, GK & Reasoning", weightage: "Core", topics: ["Comprehension, Vocabulary, Current Affairs & Logical/Analytical Reasoning"] },
          { title: "Teaching-Learning & School Environment", weightage: "Core", topics: ["Learner Characteristics, Classroom Interaction & Educational Context"] },
        ],
      },
    ],
  },
  {
    id: "odisha-ct-deled",
    title: "Odisha CT / D.El.Ed Entrance Examination",
    category: "Teaching & Education Exams",
    stateCode: "ODISHA",
    conductingBody: "SERT Odisha",
    description: "State entrance examination for admission to Diploma in Elementary Education (D.El.Ed / CT) institutes in Odisha.",
    qualification: "10+2 / Higher Secondary pass",
    officialUrl: "https://scertodisha.nic.in",
    stages: ["Written / CBT Entrance Exam"],
    pyqTopicHint: "Odia English Mathematics Social Science General Science Reasoning",
    highYieldFocus: [
      "Odia/English basics, school-level Maths/Science/SST & reasoning",
    ],
    pattern: [
      { paper: "Entrance Paper", subject: "Language (Odia/English), Reasoning, Maths, Science & SST", questions: 90, marks: 90, duration: "2 Hours", negative: "-0.25" },
    ],
    papers: [
      {
        name: "Odisha D.El.Ed (CT) Entrance Syllabus",
        description: "Languages, reasoning, and secondary school core subjects.",
        units: [
          { title: "Languages & Reasoning", weightage: "Core", topics: ["Odia & English Comprehension/Grammar, Logical & Analytical Reasoning"] },
          { title: "Mathematics, Science & Social Science", weightage: "Core", topics: ["Arithmetic/Algebra/Geometry, General Science, History, Geography & Civics"] },
        ],
      },
    ],
  },
  {
    id: "odisha-bed-entrance",
    title: "Odisha B.Ed Entrance Examination",
    category: "Teaching & Education Exams",
    stateCode: "ODISHA",
    conductingBody: "Higher Education Dept, Odisha / SAMS",
    description: "State entrance examination for B.Ed admission in government and self-financing training colleges of Odisha.",
    qualification: "Bachelor's degree with required minimum marks",
    officialUrl: "https://samsodisha.gov.in",
    stages: ["Entrance Examination", "SAMS Counselling"],
    pyqTopicHint: "General English Reasoning General Awareness Teaching Aptitude Subject",
    highYieldFocus: [
      "Paper I common sections + Paper II stream subject (Science or Arts)",
    ],
    pattern: [
      { paper: "Paper I & Paper II", subject: "English, GK, Reasoning, Teaching Aptitude + Arts/Science Subject", questions: 100, marks: 100, duration: "2 Hours", negative: "-0.25" },
    ],
    papers: [
      {
        name: "Odisha B.Ed Entrance Syllabus",
        description: "Common aptitude section and stream-specific (Arts / Science) section.",
        units: [
          { title: "General Awareness, English & Reasoning", weightage: "Paper I", topics: ["Current Events, Indian History/Geography/Polity, English & Reasoning"] },
          { title: "Teaching Aptitude & Stream Subject", weightage: "Paper II", topics: ["Educational & General Awareness, Arts (History/Geo/Polity) or Science (Phy/Chem/Bio/Maths)"] },
        ],
      },
    ],
  },
  {
    id: "odisha-osstet",
    title: "Odisha OSSTET (Secondary Teacher Eligibility Test)",
    category: "Teaching & Education Exams",
    stateCode: "ODISHA",
    conductingBody: "BSE Odisha",
    description: "Eligibility test for secondary school teachers in Odisha.",
    qualification: "Bachelor's degree + B.Ed / B.Ed (Special Education)",
    officialUrl: "https://bseodisha.ac.in",
    stages: ["Written Eligibility Test (Paper I / Paper II)"],
    pyqTopicHint: "Child Development Pedagogy Language Subject Content",
    highYieldFocus: [
      "Child development & pedagogy + subject content & methodology",
    ],
    pattern: [
      { paper: "OSSTET Paper", subject: "CDP, Languages, Subject Content & Methodology", questions: 150, marks: 150, duration: "150 Mins", negative: "None" },
    ],
    papers: [
      {
        name: "OSSTET Syllabus",
        description: "Pedagogy, languages, and secondary subject content.",
        units: [
          { title: "Pedagogy & Classroom Processes", weightage: "Core", topics: ["Learning Theories, Assessment, Inclusive Education & Odia/English Pedagogy"] },
          { title: "Secondary Subject Content", weightage: "Core", topics: ["Sciences, Mathematics, Odia, English, History or Geography"] },
        ],
      },
    ],
  },
  {
    id: "ssc-cgl",
    title: "SSC Combined Graduate Level (SSC CGL)",
    category: "SSC",
    stateCode: "ALL INDIA",
    conductingBody: "Staff Selection Commission (SSC)",
    description: "All-India examination for recruitment to Group B and Group C posts in central ministries and departments.",
    qualification: "Bachelor's degree from a recognized university",
    officialUrl: "https://ssc.gov.in",
    stages: ["Tier I (CBT)", "Tier II (CBT + DEST)"],
    pyqTopicHint: "Quantitative Aptitude General Intelligence English General Awareness",
    highYieldFocus: [
      "Arithmetic/Advance Maths speed, static GK & current affairs, English vocab/grammar",
    ],
    pattern: [
      { paper: "Tier I", subject: "Reasoning, General Awareness, Quantitative Aptitude & English", questions: 100, marks: 200, duration: "60 Mins", negative: "-0.50" },
      { paper: "Tier II", subject: "Maths, Reasoning, English, GK & Computer Knowledge", questions: 150, marks: 390, duration: "150 Mins", negative: "-1" },
    ],
    papers: [
      {
        name: "Tier I & Tier II Syllabus",
        description: "Quantitative aptitude, reasoning, English comprehension, and general awareness.",
        units: [
          { title: "Quantitative Aptitude & Reasoning", weightage: "High", topics: ["Percentage, Ratio, SI/CI, Profit/Loss, Trigonometry, Geometry, Algebra & DI", "Verbal/Non-Verbal Reasoning, Syllogism, Coding & Puzzles"] },
          { title: "English & General Awareness", weightage: "High", topics: ["Reading Comprehension, Cloze, Active/Passive, Narration & Vocabulary", "Polity, History, Geography, Economy, Science & Current Affairs"] },
        ],
      },
    ],
  },
  {
    id: "ibps-po",
    title: "IBPS Probationary Officer (IBPS PO)",
    category: "Banking",
    stateCode: "ALL INDIA",
    conductingBody: "Institute of Banking Personnel Selection",
    description: "National banking recruitment examination for Probationary Officer / Management Trainee posts in public sector banks.",
    qualification: "Bachelor's degree from a recognized university",
    officialUrl: "https://www.ibps.in",
    stages: ["Preliminary Exam", "Main Exam", "Interview"],
    pyqTopicHint: "Data Interpretation Reasoning Ability English Banking Awareness",
    highYieldFocus: [
      "DI sets, seating/puzzle speed, English comprehension & banking/economy awareness",
    ],
    pattern: [
      { paper: "Prelims", subject: "English, Quantitative Aptitude & Reasoning Ability", questions: 100, marks: 100, duration: "60 Mins", negative: "-0.25" },
      { paper: "Mains", subject: "Reasoning/Computer, Data Analysis/DI, General/Economy/Banking & English", questions: 155, marks: 200, duration: "3 Hours", negative: "-0.25" },
    ],
    papers: [
      {
        name: "Prelims & Mains Syllabus",
        description: "Quant/DI, reasoning, English, and banking/economy awareness.",
        units: [
          { title: "Quantitative Aptitude & Data Interpretation", weightage: "High", topics: ["Tabulation, Pie/Bar/Line Charts, Caselet DI, Number Series & Arithmetic"] },
          { title: "Reasoning & Banking/Economy Awareness", weightage: "High", topics: ["Puzzles, Seating Arrangement, Syllogism, Data Sufficiency, RBI/Monetary Policy & Current Affairs"] },
        ],
      },
    ],
  },
  {
    id: "rrb-ntpc",
    title: "RRB NTPC (Non-Technical Popular Categories)",
    category: "Railways",
    stateCode: "ALL INDIA",
    conductingBody: "Railway Recruitment Boards (RRB)",
    description: "Indian Railways recruitment examination for undergraduate and graduate non-technical posts.",
    qualification: "12th pass / Bachelor's degree depending on post level",
    officialUrl: "https://indianrailways.gov.in",
    stages: ["CBT Stage 1", "CBT Stage 2", "Typing / CBAT (post-specific)"],
    pyqTopicHint: "General Awareness Mathematics General Intelligence Reasoning",
    highYieldFocus: [
      "General Awareness (40% weightage in CBT 1/2), arithmetic & reasoning speed",
    ],
    pattern: [
      { paper: "CBT Stage 1", subject: "General Awareness, Mathematics & General Intelligence/Reasoning", questions: 100, marks: 100, duration: "90 Mins", negative: "-1/3" },
      { paper: "CBT Stage 2", subject: "General Awareness, Mathematics & General Intelligence/Reasoning", questions: 120, marks: 120, duration: "90 Mins", negative: "-1/3" },
    ],
    papers: [
      {
        name: "CBT Stage 1 & Stage 2 Syllabus",
        description: "General awareness, mathematics, and reasoning for Railway NTPC.",
        units: [
          { title: "General Awareness & Science", weightage: "High", topics: ["Current Events, Indian Geography, History, Polity, Economy, Railways & General Science"] },
          { title: "Mathematics & Reasoning", weightage: "High", topics: ["Number System, Decimals, LCM/HCF, Percentage, Mensuration, Algebra, Geometry & Reasoning"] },
        ],
      },
    ],
  },
];

type NetSubjectSpec = {
  code: string;
  slug: string;
  name: string;
  pdfUrl?: string;
  papers: SyllabusPaper[];
};

const UGC_NET_SUBJECT_SPECS: NetSubjectSpec[] = [
  {
    code: "00",
    slug: "ugc-net-subject-00-general-paper",
    name: "General Paper on Teaching & Research Aptitude (Paper I)",
    pdfUrl: "https://ugcnetonline.in/NTA_All_R_Syllabus/00/Paper-I_English.pdf",
    papers: [
      {
        name: "Unit I — Teaching Aptitude",
        description: "Teaching concepts, learner profiles, teaching factors/methods, support systems, and evaluation systems.",
        units: [
          {
            title: "Teaching, Learners & Factors Affecting Teaching",
            topics: [
              "Teaching: Concept, Objectives, Levels of teaching (Memory, Understanding and Reflective), Characteristics and basic requirements",
              "Learner's characteristics: Characteristics of adolescent and adult learners (Academic, Social, Emotional and Cognitive), Individual differences",
              "Factors affecting teaching related to: Teacher, Learner, Support material, Instructional facilities, Learning environment and Institution",
            ],
          },
          {
            title: "Teaching Methods, Support Systems & Evaluation",
            topics: [
              "Methods of teaching in Institutions of higher learning: Teacher centred vs. Learner centred methods; Off-line vs. On-line methods (Swayam, Swayamprabha, MOOCs etc.)",
              "Teaching Support System: Traditional, Modern and ICT based",
              "Evaluation Systems: Elements and Types of evaluation, Evaluation in Choice Based Credit System in Higher education, Computer based testing, Innovations in evaluation systems",
            ],
          },
        ],
      },
      {
        name: "Unit II — Research Aptitude",
        description: "Research approaches, methods, steps, academic writing/referencing, ICT in research, and ethics.",
        units: [
          {
            title: "Approaches, Methods & Research Process",
            topics: [
              "Research: Meaning, Types, and Characteristics, Positivism and Post-positivistic approach to research",
              "Methods of Research: Experimental, Descriptive, Historical, Qualitative and Quantitative methods",
              "Steps of Research",
            ],
          },
          {
            title: "Academic Writing, ICT & Research Ethics",
            topics: [
              "Thesis and Article writing: Format and styles of referencing",
              "Application of ICT in research",
              "Research ethics",
            ],
          },
        ],
      },
      {
        name: "Unit III — Comprehension",
        description: "Passage-based reading comprehension and analytical question answering.",
        units: [
          {
            title: "Reading Comprehension",
            topics: [
              "A passage of text be given. Questions be asked from the passage to be answered",
            ],
          },
        ],
      },
      {
        name: "Unit IV — Communication",
        description: "Communication concepts, types, classroom/group dynamics, barriers, and mass media.",
        units: [
          {
            title: "Communication Process, Modes & Barriers",
            topics: [
              "Communication: Meaning, types and characteristics of communication",
              "Effective communication: Verbal and Non-verbal, Inter-Cultural and group communications, Classroom communication",
              "Barriers to effective communication",
              "Mass-Media and Society",
            ],
          },
        ],
      },
      {
        name: "Unit V — Mathematical Reasoning and Aptitude",
        description: "Reasoning patterns, series/codes/relationships, and core arithmetic/aptitude topics.",
        units: [
          {
            title: "Reasoning Series, Codes & Mathematical Aptitude",
            topics: [
              "Types of reasoning",
              "Number series, Letter series, Codes and Relationships",
              "Mathematical Aptitude (Fraction, Time & Distance, Ratio, Proportion and Percentage, Profit and Loss, Interest and Discounting, Averages etc.)",
            ],
          },
        ],
      },
      {
        name: "Unit VI — Logical Reasoning",
        description: "Deductive/inductive arguments, propositions, fallacies, Venn diagrams, and Indian logic (Pramanas).",
        units: [
          {
            title: "Propositions, Fallacies, Logic & Venn Diagrams",
            topics: [
              "Understanding the structure of arguments: argument forms, structure of categorical propositions, Mood and Figure, Formal and Informal fallacies, Uses of language, Connotations and denotations of terms, Classical square of opposition",
              "Evaluating and distinguishing deductive and inductive reasoning",
              "Analogies",
              "Venn diagram: Simple and multiple use for establishing validity of arguments",
            ],
          },
          {
            title: "Indian Logic (Pramanas)",
            topics: [
              "Indian Logic: Means of knowledge",
              "Pramanas: Pratyaksha (Perception), Anumana (Inference), Upamana (Comparison), Shabda (Verbal testimony), Arthapatti (Implication) and Anupalabddhi (Non-apprehension)",
              "Structure and kinds of Anumana (inference), Vyapti (invariable relation), Hetvabhasas (fallacies of inference)",
            ],
          },
        ],
      },
      {
        name: "Unit VII — Data Interpretation",
        description: "Data sources/types, charts/graphs/mapping, data interpretation, and data in governance.",
        units: [
          {
            title: "Data Types, Charts & Interpretation",
            topics: [
              "Sources, acquisition and classification of Data",
              "Quantitative and Qualitative Data",
              "Graphical representation (Bar-chart, Histograms, Pie-chart, Table-chart and Line-chart) and mapping of Data",
              "Data Interpretation",
              "Data and Governance",
            ],
          },
        ],
      },
      {
        name: "Unit VIII — Information and Communication Technology (ICT)",
        description: "ICT terms, networks and conferencing, higher education digital initiatives, and ICT governance.",
        units: [
          {
            title: "ICT Basics, Digital Initiatives & Governance",
            topics: [
              "ICT: General abbreviations and terminology",
              "Basics of Internet, Intranet, E-mail, Audio and Video-conferencing",
              "Digital initiatives in higher education",
              "ICT and Governance",
            ],
          },
        ],
      },
      {
        name: "Unit IX — People, Development and Environment",
        description: "MDGs/SDGs, pollution and waste, climate change, natural/energy resources, disasters, and environmental laws/agreements.",
        units: [
          {
            title: "Development, Environment, Pollution & Resources",
            topics: [
              "Development and environment: Millennium development and Sustainable development goals",
              "Human and environment interaction: Anthropogenic activities and their impacts on environment",
              "Environmental issues: Local, Regional and Global; Air pollution, Water pollution, Soil pollution, Noise pollution, Waste (solid, liquid, biomedical, hazardous, electronic), Climate change and its Socio-Economic and Political dimensions",
              "Impacts of pollutants on human health",
              "Natural and energy resources: Solar, Wind, Soil, Hydro, Geothermal, Biomass, Nuclear and Forests",
            ],
          },
          {
            title: "Disasters, Acts & International Agreements",
            topics: [
              "Natural hazards and disasters: Mitigation strategies",
              "Environmental Protection Act (1986), National Action Plan on Climate Change, International agreements/efforts - Montreal Protocol, Rio Summit, Convention on Biodiversity, Kyoto Protocol, Paris Agreement, International Solar Alliance",
            ],
          },
        ],
      },
      {
        name: "Unit X — Higher Education System",
        description: "Ancient and post-independence higher education, learning programmes, specialized education, values, and governance.",
        units: [
          {
            title: "Evolution, Institutions, Programmes & Governance",
            topics: [
              "Institutions of higher learning and education in ancient India",
              "Evolution of higher learning and research in Post Independence India",
              "Oriental, Conventional and Non-conventional learning programmes in India",
              "Professional, Technical and Skill Based education",
              "Value education and environmental education",
              "Policies, Governance, and Administration",
            ],
          },
        ],
      },
    ],
  },
  {
    code: "02",
    slug: "ugc-net-subject-02-political-science",
    name: "Political Science",
    pdfUrl: "https://ugcnetonline.in/NTA_All_R_Syllabus/02/Political_Science_English.pdf",
    papers: [
      {
        name: "Political Theory, Thought & Comparative Politics",
        description: "Foundational political concepts, traditions, thinkers, and comparative political systems.",
        units: [
          {
            title: "Political Theory & Political Thought",
            topics: ["Liberty, Equality, Justice, Rights, Democracy, Power, Citizenship & State", "Liberalism, Conservatism, Socialism, Marxism, Feminism, Multiculturalism & Postmodernism", "Western & Indian Political Thinkers"],
          },
          {
            title: "Comparative Political Analysis & Institutions",
            topics: ["Approaches to Comparative Politics, Constitutionalism, Electoral Systems & Party Systems", "State in Comparative Perspective, Globalization & Social Movements"],
          },
        ],
      },
      {
        name: "International Relations & Indian Politics",
        description: "Global politics, foreign policy, Indian constitution, federalism, and governance.",
        units: [
          {
            title: "International Relations & India's Foreign Policy",
            topics: ["Realism, Liberalism, Constructivism, Critical Theories & Conflict/Peace", "India's Foreign Policy Determinants, Neighbourhood, Major Powers & Multilateral Institutions"],
          },
          {
            title: "Political Institutions & Governance in India",
            topics: ["Making of Constitution, Fundamental Rights/DPSP, Parliament, Judiciary & Federalism", "Panchayati Raj, Statutory Commissions, Public Policy & Democratic Governance"],
          },
        ],
      },
    ],
  },
  {
    code: "03",
    slug: "ugc-net-subject-03-philosophy",
    name: "Philosophy",
    papers: [
      {
        name: "Indian & Western Philosophy",
        description: "Classical and modern schools of Indian and Western philosophical inquiry.",
        units: [
          {
            title: "Indian Philosophy",
            topics: ["Vedic & Upanishadic Thought, Charvaka, Jainism & Buddhism", "Nyaya, Vaisheshika, Samkhya, Yoga, Mimamsa, Advaita, Vishishtadvaita & Dvaita", "Contemporary Indian Thinkers"],
          },
          {
            title: "Western Philosophy",
            topics: ["Pre-Socratics, Plato, Aristotle, Rationalism, Empiricism & Kant", "Hegel, Existentialism, Phenomenology, Analytic Philosophy & Postmodernism"],
          },
        ],
      },
      {
        name: "Logic & Ethics",
        description: "Formal/informal logic and normative/applied ethical systems.",
        units: [
          {
            title: "Classical & Symbolic Logic",
            topics: ["Propositions, Syllogisms, Fallacies, Propositional & Predicate Logic", "Indian Nyaya Inference & Hetvabhasas"],
          },
          {
            title: "Ethics & Socio-Political Philosophy",
            topics: ["Virtue Ethics, Deontology, Utilitarianism, Meta-Ethics & Applied Ethics", "Justice, Liberty, Equality & Social Philosophy"],
          },
        ],
      },
    ],
  },
  {
    code: "04",
    slug: "ugc-net-subject-04-psychology",
    name: "Psychology",
    papers: [
      {
        name: "Foundations of Behavior & Cognition",
        description: "Research methods, biological bases, attention, perception, learning, memory, and development.",
        units: [
          {
            title: "Research Methods, Biological Bases & Cognition",
            topics: ["Psychological Research Design & Psychometrics", "Biological Bases of Behavior, Attention, Perception, Learning, Memory, Thinking & Intelligence"],
          },
          {
            title: "Human Development, Personality & Motivation",
            topics: ["Lifespan Development, Theories of Personality, Motivation & Emotion"],
          },
        ],
      },
      {
        name: "Clinical, Social & Organizational Psychology",
        description: "Psychopathology, therapeutic interventions, group processes, and applied domains.",
        units: [
          {
            title: "Abnormal & Counseling Psychology",
            topics: ["Classification of Mental Disorders, Etiology & Psychotherapy/Counseling Approaches"],
          },
          {
            title: "Social, Organizational & Emerging Areas",
            topics: ["Social Cognition, Attitudes, Group Dynamics, Leadership, Industrial/OB, Health & Wellbeing"],
          },
        ],
      },
    ],
  },
  {
    code: "05",
    slug: "ugc-net-subject-05-sociology",
    name: "Sociology",
    papers: [
      {
        name: "Sociological Theory & Research Methodology",
        description: "Classical/contemporary theorists and empirical social research methods.",
        units: [
          {
            title: "Classical & Contemporary Sociological Theory",
            topics: ["Comte, Durkheim, Weber, Marx, Parsons, Merton, Structuralism, Postmodernism & Symbolic Interactionism"],
          },
          {
            title: "Research Methodology & Methods",
            topics: ["Epistemology, Survey, Ethnography, Sampling, Reliability/Validity & Qualitative/Quantitative Analysis"],
          },
        ],
      },
      {
        name: "Indian Society, Institutions & Social Change",
        description: "Social structures, stratification, institutions, and processes of transformation in India.",
        units: [
          {
            title: "Social Institutions & Stratification",
            topics: ["Family, Kinship, Marriage, Religion, Economy, Polity, Caste, Class, Tribe & Gender"],
          },
          {
            title: "Social Change, Environment & Movements",
            topics: ["Rural/Urban Transformation, Industrialization, Globalization, State, Environment & Social Movements"],
          },
        ],
      },
    ],
  },
  {
    code: "06",
    slug: "ugc-net-subject-06-history",
    name: "History",
    papers: [
      {
        name: "Historiography & Ancient / Medieval India",
        description: "Historical methodology and political, economic, social, and cultural history up to the 18th century.",
        units: [
          {
            title: "Historical Method & Ancient India",
            topics: ["Sources, Historiography & Approaches", "Paleolithic to Harappan, Vedic, Mahajanapadas, Mauryas, Guptas, Sangam & Early Medieval India"],
          },
          {
            title: "Medieval India",
            topics: ["Delhi Sultanate, Vijayanagara/Bahmani, Mughal Empire, Marathas, Bhakti/Sufi & Indo-Islamic Culture"],
          },
        ],
      },
      {
        name: "Modern India & Contemporary World",
        description: "Colonial rule, national movement, post-independence India, and modern world history.",
        units: [
          {
            title: "Modern India (18th Century to Post-1947)",
            topics: ["Rise of British Power, Economic Impact, Socio-Religious Reforms, 1857 & Freedom Struggle", "Constitutional Milestones, Partition, Integration & Post-Independence Developments"],
          },
          {
            title: "Modern World & Research",
            topics: ["Enlightenment, Industrialization, Nationalism, World Wars, Decolonization & Cold War"],
          },
        ],
      },
    ],
  },
  {
    code: "07",
    slug: "ugc-net-subject-07-anthropology",
    name: "Anthropology",
    papers: [
      {
        name: "Social-Cultural & Biological Anthropology",
        description: "Human cultural systems, biological evolution, genetics, and ecological adaptation.",
        units: [
          {
            title: "Social & Cultural Anthropology",
            topics: ["Culture, Kinship, Marriage, Family, Economic/Political Organization, Religion, Symbolism & Anthropological Theories"],
          },
          {
            title: "Biological / Physical Anthropology",
            topics: ["Human Evolution, Primates, Human Genetics, Growth/Development, Demography & Nutritional/Medical Anthropology"],
          },
        ],
      },
      {
        name: "Archaeological Anthropology & Indian Anthropology",
        description: "Prehistoric cultures, field methods, and tribal/rural societies in India.",
        units: [
          {
            title: "Archaeological Anthropology & Ethnographic Methods",
            topics: ["Stone Age to Metal Age Cultures, Chronology & Fieldwork/Ethnographic Techniques"],
          },
          {
            title: "Anthropology in India & Tribal Development",
            topics: ["Racial/Linguistic Elements, Caste/Village Studies, Scheduled Tribes, PESA/Forest Rights & Development Policies"],
          },
        ],
      },
    ],
  },
  {
    code: "08",
    slug: "ugc-net-subject-08-commerce",
    name: "Commerce",
    pdfUrl: "https://ugcnetonline.in/NTA_All_R_Syllabus/08/Commerce_English.pdf",
    papers: [
      {
        name: "Business Environment, Accounting, Finance & Economics",
        description: "Economic/legal environment, accounting & auditing, financial management, and business economics.",
        units: [
          {
            title: "Business Environment, Economics & Statistics",
            topics: ["Business Environment, Corporate Governance & CSR", "Micro/Macro Economics, Demand/Production, Market Structures & Business Statistics"],
          },
          {
            title: "Accounting, Auditing & Financial Management",
            topics: ["Financial/Cost/Management Accounting, Partnership/Corporate Accounts, Auditing & Income Tax", "Capital Structure, Cost of Capital, Capital Budgeting, Working Capital & Financial Markets"],
          },
        ],
      },
      {
        name: "Management, Marketing, HRM, Banking & Legal Aspects",
        description: "Organizational management, marketing, human resources, banking/financial institutions, and business laws.",
        units: [
          {
            title: "Management, HRM & Marketing",
            topics: ["Principles of Management, OB, Staffing, Training, Performance, Industrial Relations", "Marketing Mix, Consumer Behavior, Product/Pricing/Promotion/Distribution & Digital Marketing"],
          },
          {
            title: "Banking, Financial Institutions & Business Laws",
            topics: ["RBI, Commercial Banks, NBFCs, Insurance & Financial Sector Reforms", "Contract Act, Sale of Goods, Negotiable Instruments, Companies Act, GST & Consumer/Competition Law"],
          },
        ],
      },
    ],
  },
  {
    code: "09",
    slug: "ugc-net-subject-09-education",
    name: "Education",
    papers: [
      {
        name: "Foundations, Learner, Research & Pedagogy",
        description: "Philosophical/sociological/psychological bases, educational research, and pedagogy.",
        units: [
          {
            title: "Philosophical, Sociological & Psychological Foundations",
            topics: ["Indian & Western Educational Philosophies, Socialization, Equity & Inclusion", "Learning Theories, Motivation, Intelligence, Creativity, Mental Health & Guidance"],
          },
          {
            title: "Educational Research & Pedagogy",
            topics: ["Qualitative/Quantitative Research, Sampling, Tools, Descriptive/Inferential Statistics", "Pedagogy, Andragogy, Instructional Design & Assessment"],
          },
        ],
      },
      {
        name: "Curriculum, Teacher Education, ICT & Management",
        description: "Curriculum studies, teacher preparation, educational technology, and educational leadership.",
        units: [
          {
            title: "Curriculum Studies & Teacher Education",
            topics: ["Curriculum Models, Transaction, Evaluation, Pre-service/In-service Teacher Education & NCTE/NEP"],
          },
          {
            title: "Educational Technology & Educational Management",
            topics: ["ICT, E-Learning, MOOCs, Open Education & Educational Planning/Leadership/Finance"],
          },
        ],
      },
    ],
  },
  {
    code: "10",
    slug: "ugc-net-subject-10-social-work",
    name: "Social Work",
    papers: [
      {
        name: "Social Work Profession, Human Behavior & Methods",
        description: "History and values of social work, human development, and primary/secondary methods.",
        units: [
          {
            title: "Nature, Ideology & Human Behavior",
            topics: ["Evolution of Social Work, Ethics, Human Rights & Lifespan Development/Psychopathology"],
          },
          {
            title: "Social Work Methods & Social Research",
            topics: ["Social Case Work, Group Work, Community Organization, Social Action, Social Welfare Administration & Research"],
          },
        ],
      },
      {
        name: "Social Policy, Law & Fields of Practice",
        description: "Welfare policies, legislation, and practice settings across social work.",
        units: [
          {
            title: "Social Policy & Social Legislation",
            topics: ["Constitutional Provisions, Social Policies & Protective/Social Security Laws"],
          },
          {
            title: "Specialized Fields of Social Work",
            topics: ["Family/Child/Youth, Medical/Psychiatric, Correctional, Rural/Urban, Labour/Industrial & Disaster Management"],
          },
        ],
      },
    ],
  },
  {
    code: "11",
    slug: "ugc-net-subject-11-defence-strategic-studies",
    name: "Defence and Strategic Studies",
    papers: [
      {
        name: "Strategic Thought, Warfare & National Security",
        description: "Evolution of strategic theory, forms of warfare, and national security frameworks.",
        units: [
          {
            title: "Strategic Thought & Evolution of Warfare",
            topics: ["Kautilya, Sun Tzu, Clausewitz, Jomini, Mahan, Douhet & Modern Strategic Thinkers", "Conventional, Asymmetric, Cyber, Space & Hybrid Warfare"],
          },
          {
            title: "National Security & Defence Management",
            topics: ["National Power, Threat Assessment, Civil-Military Relations, Defence Economics & Force Planning"],
          },
        ],
      },
      {
        name: "India's Security & International Security",
        description: "Regional security dynamics, arms control, peace processes, and global strategic affairs.",
        units: [
          {
            title: "India's Security Environment",
            topics: ["Border Management, Maritime Security, Internal Security, Counter-Terrorism & Defence Modernization"],
          },
          {
            title: "International Security, Arms Control & Conflict Resolution",
            topics: ["Non-Proliferation, Disarmament, UN Peacekeeping, Diplomacy & Conflict Resolution"],
          },
        ],
      },
    ],
  },
  {
    code: "12",
    slug: "ugc-net-subject-12-home-science",
    name: "Home Science",
    papers: [
      {
        name: "Food, Nutrition, Textiles & Human Development",
        description: "Nutritional science, textile/apparel studies, and human development across the lifespan.",
        units: [
          {
            title: "Food Science & Nutrition",
            topics: ["Food Chemistry, Food Microbiology/Safety, Clinical/Therapeutic Nutrition, Community Nutrition & Public Health"],
          },
          {
            title: "Textiles, Apparel & Human Development",
            topics: ["Textile Fibers, Yarns, Dyeing/Printing, Apparel Construction, Child/Adolescent/Adult Development & Family Studies"],
          },
        ],
      },
      {
        name: "Resource Management & Extension Education",
        description: "Family resource utilization, interior/ergonomic design, and extension communication.",
        units: [
          {
            title: "Resource Management & Consumer Studies",
            topics: ["Time/Energy/Money Management, Ergonomics, Housing/Space Design & Consumer Protection"],
          },
          {
            title: "Extension Education & Communication",
            topics: ["Extension Methods, Program Planning, Participatory Communication & Research Methods"],
          },
        ],
      },
    ],
  },
  {
    code: "14",
    slug: "ugc-net-subject-14-public-administration",
    name: "Public Administration",
    papers: [
      {
        name: "Administrative Theory, Governance & Public Policy",
        description: "Core theories of administration, governance paradigms, and policy cycle.",
        units: [
          {
            title: "Administrative Theory & Organizational Behavior",
            topics: ["Classical, Scientific, Bureaucratic, Human Relations, Decision-Making, Motivation, Leadership & New Public Management"],
          },
          {
            title: "Public Policy & Governance",
            topics: ["Policy Formulation, Implementation, Monitoring/Evaluation, Good Governance, Accountability, Ethics & E-Governance"],
          },
        ],
      },
      {
        name: "Indian Administration & Development Management",
        description: "Union, state, financial, personnel, and local administration in India.",
        units: [
          {
            title: "Union, State, Personnel & Financial Administration",
            topics: ["Cabinet, Ministries, Civil Services, Recruitment/Training, Budget, Audit, Parliamentary Committees & Centre-State Relations"],
          },
          {
            title: "Local Governance & Social Welfare Administration",
            topics: ["73rd & 74th Amendments, Panchayati Raj, Municipal Governance, Citizen Grievance Redressal & Welfare Programs"],
          },
        ],
      },
    ],
  },
  {
    code: "15",
    slug: "ugc-net-subject-15-population-studies",
    name: "Population Studies",
    papers: [
      {
        name: "Demographic Concepts, Theories & Components",
        description: "Population theories, fertility, mortality, nuptiality, and migration.",
        units: [
          {
            title: "Population Theories & Demographic Transition",
            topics: ["Malthusian, Optimum, Marxian, Sociological/Economic Theories & Demographic Transition Models"],
          },
          {
            title: "Fertility, Mortality, Nuptiality & Migration",
            topics: ["Fertility Determinants, Mortality/Life Tables, Marriage/Family Dynamics & Internal/International Migration"],
          },
        ],
      },
      {
        name: "Demographic Methods, Health & Population Policy",
        description: "Demographic techniques, population projections, reproductive health, and policy.",
        units: [
          {
            title: "Demographic Techniques & Data Sources",
            topics: ["Census, Vital Registration, Surveys, Standardization, Life Tables, Projections & Indirect Estimation"],
          },
          {
            title: "Population, Health, Environment & Policy",
            topics: ["Age-Sex Structure, Demographic Dividend, Urbanization, Reproductive/Child Health, Environment & Population Policies"],
          },
        ],
      },
    ],
  },
  {
    code: "16",
    slug: "ugc-net-subject-16-music",
    name: "Music",
    papers: [
      {
        name: "History, Theory & Aesthetics of Music",
        description: "Historical evolution, musicological grammar, notation, and aesthetic principles.",
        units: [
          {
            title: "Historical Evolution & Musicological Theory",
            topics: ["Vedic to Modern Period, Raga/Tala Classification, Shruti-Swara-Gram-Murchhana, Melakarta/That & Notation Systems"],
          },
          {
            title: "Aesthetics, Composers & Traditions",
            topics: ["Rasa Theory, Music Aesthetics, Composers, Gharanas & Hindustani/Carnatic/Folk Traditions"],
          },
        ],
      },
      {
        name: "Applied Performance & Musical Forms",
        description: "Compositional forms, improvisation, accompaniment, and comparative study.",
        units: [
          {
            title: "Forms, Compositions & Improvisation",
            topics: ["Dhrupad, Dhamar, Khayal, Tarana, Thumri/Dadra, Kriti/Kirtanam, Ragam-Tanam-Pallavi & Improvisational Techniques"],
          },
          {
            title: "Applied Analysis & Research",
            topics: ["Raga/Tala Analysis, Tuning/Acoustics & Research Methodology in Music"],
          },
        ],
      },
    ],
  },
  {
    code: "17",
    slug: "ugc-net-subject-17-management",
    name: "Management",
    papers: [
      {
        name: "Management Functions, OB, Economics, Finance & Marketing",
        description: "Core management disciplines across people, economics, finance, and markets.",
        units: [
          {
            title: "Management, OB & Managerial Economics",
            topics: ["Planning, Organizing, Controlling, Personality, Perception, Motivation, Group/Team Dynamics, Leadership & Managerial Economics"],
          },
          {
            title: "Financial Management & Marketing Management",
            topics: ["Capital Budgeting, Capital Structure, Dividend Policy, Working Capital, Market Segmentation, Branding, Pricing & Integrated Marketing"],
          },
        ],
      },
      {
        name: "HRM, Operations, Quantitative Methods & Strategy",
        description: "Human resources, supply/operations, quantitative decision tools, and strategic management.",
        units: [
          {
            title: "HRM, Operations & Quantitative Methods",
            topics: ["HR Planning, Recruitment, Appraisal, Training, Industrial Relations, Operations/Supply Chain, LPP, Queuing & Decision Theory"],
          },
          {
            title: "Strategic Management & Entrepreneurship",
            topics: ["Strategy Formulation/Implementation, Competitive Advantage, Corporate Governance, Business Ethics & Entrepreneurship"],
          },
        ],
      },
    ],
  },
  {
    code: "20",
    slug: "ugc-net-subject-20-hindi",
    name: "Hindi",
    papers: [
      {
        name: "हिंदी भाषा और साहित्य का इतिहास",
        description: "हिंदी भाषा का विकास, बोलियाँ, देवनागरी लिपि तथा आदिकाल से आधुनिक काल तक साहित्य का इतिहास।",
        units: [
          {
            title: "हिंदी भाषा और उसका विकास",
            topics: ["हिंदी की ऐतिहासिक पृष्ठभूमि, प्राचीन/मध्यकालीन/आधुनिक भारतीय आर्य भाषाएँ, बोलियाँ, राजभाषा/संपर्क भाषा और देवनागरी लिपि"],
          },
          {
            title: "हिंदी साहित्य का इतिहास",
            topics: ["आदिकाल, भक्तिकाल (निर्गुण एवं सगुण), रीतिकाल और आधुनिक काल (भारतेंदु, द्विवेदी, छायावाद, प्रगतिवाद, प्रयोगवाद, नई कविता एवं समकालीन साहित्य)"],
          },
        ],
      },
      {
        name: "काव्यशास्त्र, वैचारिक पृष्ठभूमि और हिंदी की गद्य विधाएँ",
        description: "भारतीय एवं पाश्चात्य काव्यशास्त्र, वैचारिक विमर्श तथा उपन्यास, कहानी, नाटक, निबंध व आलोचना।",
        units: [
          {
            title: "काव्यशास्त्र और वैचारिक पृष्ठभूमि",
            topics: ["रस, छंद, अलंकार, शब्द शक्ति, काव्य गुण/दोष, अरस्तू, प्लेटो, वर्ड्सवर्थ, कॉलरिज, टी. एस. इलियट, आई. ए. रिचर्ड्स एवं नई समीक्षा"],
          },
          {
            title: "गद्य साहित्य की विधाएँ",
            topics: ["हिंदी उपन्यास, कहानी, नाटक, निबंध, आलोचना और अन्य गद्य विधाएँ (रेखाचित्र, संस्मरण, यात्रा वृत्तांत, आत्मकथा, जीवनी, रिपोर्ताज)"],
          },
        ],
      },
    ],
  },
  {
    code: "23",
    slug: "ugc-net-subject-23-odia",
    name: "Oriya",
    papers: [
      {
        name: "History of Odia Literature & Odia Linguistics",
        description: "Chronological development of Odia literature and structure of the Odia language.",
        units: [
          {
            title: "History of Odia Literature",
            topics: ["Charyagiti & Sarala Das, Panchasakha, Upendra Bhanja & Riti Yuga, Fakir Mohan/Gangadhar/Radhanath, Satyabadi, Pragativadi & Post-Independence Odia Literature"],
          },
          {
            title: "Odia Linguistics & Grammar",
            topics: ["Origin & Evolution of Odia Language, Phonology, Morphology, Syntax, Semantics & Odia Grammar"],
          },
        ],
      },
      {
        name: "Literary Forms, Criticism & Folklore",
        description: "Poetry, fiction, drama, essay, poetics/criticism, and Odisha folklore.",
        units: [
          {
            title: "Poetry, Prose, Drama & Folklore",
            topics: ["Odia Kavita, Upanyasa, Galpa, Nataka, Prabandha, Atmajivani & Odisha Folk Literature/Culture"],
          },
          {
            title: "Poetics & Literary Criticism",
            topics: ["Sanskrit Poetics, Western Literary Criticism & Modern Odia Literary Criticism"],
          },
        ],
      },
    ],
  },
  {
    code: "25",
    slug: "ugc-net-subject-25-sanskrit",
    name: "Sanskrit",
    papers: [
      {
        name: "Vedic Literature, Vyakarana, Linguistics & Darshana",
        description: "Vedic texts, Sanskrit grammar/linguistics, and classical Indian philosophical schools.",
        units: [
          {
            title: "Vedic Literature, Vyakarana & Linguistics",
            topics: ["Samhitas, Brahmanas, Aranyakas, Upanishads, Vedangas, Panini Grammar, Karaka, Samasa & Indo-European/Sanskrit Linguistics"],
          },
          {
            title: "Indian Philosophy (Darshana)",
            topics: ["Nyaya, Vaisheshika, Samkhya, Yoga, Purva Mimamsa, Advaita/Vishishtadvaita/Dvaita Vedanta, Charvaka, Bauddha & Jaina Darshana"],
          },
        ],
      },
      {
        name: "Kavya, Nataka, Alamkara Shastra & Arthashastra",
        description: "Classical Sanskrit poetry, prose, drama, poetics, and polity/treatises.",
        units: [
          {
            title: "Sanskrit Kavya, Gadya & Nataka",
            topics: ["Mahakavyas, Khandakavyas, Katha/Akhyayika, Nataka & Rupaka Traditions"],
          },
          {
            title: "Alamkara Shastra & Allied Texts",
            topics: ["Rasa, Alamkara, Riti, Dhvani, Vakrokti, Auchitya, Natyashastra & Arthashastra/Dharmashastra"],
          },
        ],
      },
    ],
  },
  {
    code: "30",
    slug: "ugc-net-subject-30-english",
    name: "English",
    papers: [
      {
        name: "Literary History, Genres & World Literatures in English",
        description: "Chronological English literary periods, genres, and global anglophone literatures.",
        units: [
          {
            title: "British & World Literatures in English",
            topics: ["Old/Middle English, Renaissance, Neoclassical, Romantic, Victorian, Modern & Postmodern Literature", "American Literature, Indian English Literature, Commonwealth/Postcolonial Literatures, Drama, Fiction & Poetry"],
          },
          {
            title: "Cultural Studies & Non-Fictional Prose",
            topics: ["Essays, Biography/Autobiography, Travel Writing, Popular Culture & Cultural Studies"],
          },
        ],
      },
      {
        name: "Literary Criticism, Theory & Research Methods",
        description: "Critical traditions, contemporary theory, language/linguistics, and research methodology.",
        units: [
          {
            title: "Literary Criticism & Contemporary Theory",
            topics: ["Classical to Modern Criticism, Structuralism, Post-structuralism, Marxism, Feminism, Psychoanalysis, Ecocriticism & Postcolonial Theory"],
          },
          {
            title: "English Language, Linguistics & Research",
            topics: ["History of English Language, Phonetics/Phonology, Syntax, Pragmatics, Stylistics & Research Methodology"],
          },
        ],
      },
    ],
  },
  {
    code: "46",
    slug: "ugc-net-subject-46-adult-education",
    name: "Adult Education / Continuing Education / Andragogy",
    papers: [
      {
        name: "Andragogy, Lifelong Learning & Literacy",
        description: "Adult learning theory, literacy programs, and lifelong/continuing education.",
        units: [
          {
            title: "Principles of Andragogy & Lifelong Learning",
            topics: ["Adult Learning Theories, Self-Directed Learning, Lifelong Education, Continuing Education & Extension"],
          },
          {
            title: "Literacy & Community Education",
            topics: ["Functional Literacy, Post-Literacy, Neo-Literates, Digital Literacy & Community Empowerment"],
          },
        ],
      },
      {
        name: "Curriculum, Management, Research & Policy",
        description: "Program design, training/skill development, evaluation, and policy frameworks.",
        units: [
          {
            title: "Program Planning, Skill Development & Evaluation",
            topics: ["Need Assessment, Curriculum Development, Participatory Methods, Vocational/Skill Training & Monitoring/Evaluation"],
          },
          {
            title: "Policy, Institutions & Research",
            topics: ["National & International Adult/Lifelong Learning Policies, Institutions & Research Methodology"],
          },
        ],
      },
    ],
  },
  {
    code: "47",
    slug: "ugc-net-subject-47-physical-education",
    name: "Physical Education",
    papers: [
      {
        name: "Anatomy, Physiology, Biomechanics & Training",
        description: "Human movement sciences, physiological adaptations, and sports training principles.",
        units: [
          {
            title: "Anatomy, Physiology & Kinesiology/Biomechanics",
            topics: ["Musculoskeletal/Cardiorespiratory/Nervous Systems, Exercise Physiology, Energy Systems, Levers, Motion & Biomechanical Principles"],
          },
          {
            title: "Principles of Sports Training",
            topics: ["Strength, Speed, Endurance, Flexibility, Coordinative Abilities, Periodization & Load Adaptation"],
          },
        ],
      },
      {
        name: "Psychology, Management, Health & Research",
        description: "Sports psychology, administration, health/fitness testing, and research methods.",
        units: [
          {
            title: "Sports Psychology, Health & Yoga",
            topics: ["Motivation, Anxiety, Attention, Aggression, Group Cohesion, Health Education, Nutrition, Rehabilitation & Yoga"],
          },
          {
            title: "Sports Management, Test/Measurement & Research",
            topics: ["Organization/Administration, Facility/Event Management, Fitness/Skill Tests, Statistics & Research Methods"],
          },
        ],
      },
    ],
  },
  {
    code: "55",
    slug: "ugc-net-subject-55-labour-welfare-hrm",
    name: "Labour Welfare / Personnel Management / Industrial Relations / HRM",
    papers: [
      {
        name: "HRM, Organizational Behavior & Labour Economics",
        description: "People management systems, organizational behavior, and labour market economics.",
        units: [
          {
            title: "Human Resource Management & OB",
            topics: ["HRP, Recruitment/Selection, Learning/Development, Performance Management, Compensation, Career Planning, Motivation, Leadership & Change"],
          },
          {
            title: "Labour Economics & Labour Welfare",
            topics: ["Labour Markets, Wages, Employment/Unemployment, Productivity, Statutory/Non-Statutory Welfare & Social Security"],
          },
        ],
      },
      {
        name: "Industrial Relations & Labour Legislation",
        description: "Trade unions, collective bargaining, dispute resolution, and labour laws.",
        units: [
          {
            title: "Industrial Relations & Trade Unions",
            topics: ["IR Perspectives, Trade Unionism, Collective Bargaining, Workers' Participation, Discipline & Grievance Handling"],
          },
          {
            title: "Labour Laws & Social Security Frameworks",
            topics: ["Wage, Industrial Relations, Social Security & Occupational Safety/Working Conditions Frameworks"],
          },
        ],
      },
    ],
  },
  {
    code: "58",
    slug: "ugc-net-subject-58-law",
    name: "Law",
    pdfUrl: "https://ugcnetonline.in/NTA_All_R_Syllabus/58/Law_English.pdf",
    papers: [
      {
        name: "Constitutional Law, Administrative Law, Jurisprudence & PIL",
        description: "Constitutional principles, administrative law, legal theory, and public international law.",
        units: [
          {
            title: "Constitutional & Administrative Law",
            topics: ["Preamble, Fundamental Rights/Duties, DPSP, Union/State Executive/Legislature, Judiciary, Federalism, Emergency & Administrative Law/Judicial Review"],
          },
          {
            title: "Jurisprudence & Public International Law",
            topics: ["Schools of Jurisprudence, Rights, Persons, Property, Possession, Sources/Subjects of International Law, UN, Treaties & Human Rights"],
          },
        ],
      },
      {
        name: "Criminal, Commercial, Family, Environmental & IPR Laws",
        description: "Substantive/procedural laws, contracts/corporate law, family law, environment, and IPR.",
        units: [
          {
            title: "Law of Crimes, Torts & Contracts/Commercial Law",
            topics: ["Penal/Criminal Justice Principles, Law of Torts & Consumer Protection, Law of Contracts, Sale of Goods, Partnership, Negotiable Instruments & Company Law"],
          },
          {
            title: "Family Law, Environment, Human Rights & IPR",
            topics: ["Personal Laws (Marriage, Divorce, Maintenance, Adoption, Succession), Environmental Law, Protection of Human Rights & Intellectual Property Rights"],
          },
        ],
      },
    ],
  },
  {
    code: "59",
    slug: "ugc-net-subject-59-library-information-science",
    name: "Library and Information Science",
    papers: [
      {
        name: "Information Society, Sources, Organization & Retrieval",
        description: "Information systems, reference/information sources, knowledge organization, and retrieval.",
        units: [
          {
            title: "Information Universe & Information Sources",
            topics: ["Data/Information/Knowledge, Information Transfer Cycle, Library Legislation/Associations, Primary/Secondary/Tertiary Sources & Electronic Resources"],
          },
          {
            title: "Knowledge Organization & Information Retrieval",
            topics: ["Classification Schemes (DDC, UDC, CC), Cataloging/Metadata (AACR2, RDA, MARC21, Dublin Core), Indexing, Abstracting & Information Retrieval"],
          },
        ],
      },
      {
        name: "Library Management, ICT & Research Methodology",
        description: "Administration, digital libraries, library automation/ICT, and research methods.",
        units: [
          {
            title: "Management & ICT in Libraries",
            topics: ["Library Operations, HRM, Financial Management, TQM, Library Automation, Digital Libraries, Repositories, Networking & Web Technologies"],
          },
          {
            title: "Research Methodology & Academic Publishing",
            topics: ["Research Design, Data Analysis, Bibliometrics/Scientometrics, Open Access & Research Ethics"],
          },
        ],
      },
    ],
  },
  {
    code: "63",
    slug: "ugc-net-subject-63-mass-communication-journalism",
    name: "Mass Communication and Journalism",
    papers: [
      {
        name: "Communication Theories, Reporting, Editing & Media Laws",
        description: "Communication models, journalism craft, media history, and legal/ethical standards.",
        units: [
          {
            title: "Communication Models, Theories & Media History",
            topics: ["Intrapersonal to Mass Communication, Normative/Sociological/Effects Theories, Indian Media Evolution & Development Communication"],
          },
          {
            title: "Reporting, Editing, Media Law & Ethics",
            topics: ["News Gathering, Interviewing, Beat/Investigative/Feature Writing, Editing, Headline/Layout, Press/Broadcast Laws & Media Ethics"],
          },
        ],
      },
      {
        name: "Advertising, PR, Digital Media & Media Research",
        description: "Brand communication, public relations, new media ecosystems, and media research.",
        units: [
          {
            title: "Advertising, Public Relations & New Media",
            topics: ["Advertising Strategy, Media Planning, Campaign Execution, Corporate/Public Relations, Digital Journalism, Social Media & OTT/AI in Media"],
          },
          {
            title: "Media Management & Research",
            topics: ["Media Economics, Ownership, Audience Metrics, Content/Survey/Experimental Research & Data Interpretation"],
          },
        ],
      },
    ],
  },
  {
    code: "74",
    slug: "ugc-net-subject-74-women-studies",
    name: "Women Studies",
    papers: [
      {
        name: "Gender Concepts, Feminist Theories & Women's Movements",
        description: "Foundations of women's studies, feminist thought, and historical/contemporary movements.",
        units: [
          {
            title: "Gender Concepts & Feminist Theories",
            topics: ["Sex vs. Gender, Patriarchy, Intersectionality, Liberal/Radical/Marxist-Socialist/Black/Dalit/Postmodern Feminisms"],
          },
          {
            title: "Women's Movements & Legal Framework",
            topics: ["Social Reform & Freedom Struggle, Post-Independence Movements, Constitutional Guarantees & Laws Protecting Women"],
          },
        ],
      },
      {
        name: "Women in Economy, Health, Polity & Research",
        description: "Livelihoods, health/nutrition, political representation, and gender-sensitive research.",
        units: [
          {
            title: "Women, Work, Health & Empowerment",
            topics: ["Formal/Informal Labour, Unpaid Care Work, Reproductive/Mental Health, Education, Media Representation & Welfare Schemes"],
          },
          {
            title: "Political Participation & Feminist Methodology",
            topics: ["Panchayati Raj, Leadership, Gender Budgeting, SDGs & Feminist/Gender-Sensitive Research Methods"],
          },
        ],
      },
    ],
  },
  {
    code: "80",
    slug: "ugc-net-subject-80-geography",
    name: "Geography",
    papers: [
      {
        name: "Geomorphology, Climatology, Oceanography, Biogeography & Cartography",
        description: "Physical earth systems, environmental geography, and cartographic/spatial techniques.",
        units: [
          {
            title: "Physical & Environmental Geography",
            topics: ["Geomorphology, Climatology, Oceanography, Biogeography & Environmental Geography"],
          },
          {
            title: "Geographical Techniques & Spatial Analysis",
            topics: ["Maps, Projections, Statistical/Cartographic Methods, Remote Sensing, GIS & GNSS"],
          },
        ],
      },
      {
        name: "Human, Economic, Regional Geography & Geography of India",
        description: "Spatial organization of society, economy, regional planning, and Indian geography.",
        units: [
          {
            title: "Human, Economic, Settlement & Regional Geography",
            topics: ["Population/Settlement Geography, Cultural/Social/Political Geography, Economic/Agricultural/Industrial Geography & Regional Planning"],
          },
          {
            title: "Geographical Thought & Geography of India",
            topics: ["Evolution of Geographical Thought, Physiography, Drainage, Climate, Soils, Resources, Agriculture, Industries, Transport & Regional Issues of India"],
          },
        ],
      },
    ],
  },
  {
    code: "82",
    slug: "ugc-net-subject-82-forensic-science",
    name: "Forensic Science",
    papers: [
      {
        name: "Forensic Investigation, Biology, Serology & Chemistry",
        description: "Crime scene procedures, biological/DNA evidence, and chemical/toxicological analysis.",
        units: [
          {
            title: "Crime Scene & Forensic Biology/Serology",
            topics: ["Crime Scene Search/Documentation/Chain of Custody, Hair/Fibers, Blood/Body Fluids, Serology, Wildlife Forensics & Forensic DNA Profiling"],
          },
          {
            title: "Forensic Chemistry & Toxicology",
            topics: ["Petroleum Products, Explosives, Arson Residue, Narcotics/Psychotropic Substances, Alcohol & Poisons/Toxicology"],
          },
        ],
      },
      {
        name: "Forensic Physics, Ballistics, Documents & Cyber Forensics",
        description: "Physical trace analysis, firearms/ballistics, document examination, and digital forensics.",
        units: [
          {
            title: "Forensic Physics, Ballistics & Fingerprints",
            topics: ["Glass, Soil, Tool Marks, Tyre/Footwear Impressions, Internal/External/Terminal Ballistics, Firearms & Fingerprint Classification/Development"],
          },
          {
            title: "Questioned Documents, Digital Forensics & Jurisprudence",
            topics: ["Handwriting, Signatures, Ink/Paper Analysis, Security Features, Computer/Mobile/Network Forensics, Forensic Medicine & Court Testimony"],
          },
        ],
      },
    ],
  },
  {
    code: "87",
    slug: "ugc-net-subject-87-computer-science-applications",
    name: "Computer Science and Applications",
    papers: [
      {
        name: "Discrete Structures, Algorithms, Theory, OS, DBMS & Networks",
        description: "Mathematical foundations, algorithms, computation theory, systems, databases, and networking.",
        units: [
          {
            title: "Discrete Maths, Algorithms, TOC, Compilers & COA",
            topics: ["Logic, Sets, Graphs, Combinatorics, Asymptotic Analysis, Sorting/Searching, Graph/DP Algorithms, Automata/Formal Languages, Parsing, Code Generation & CPU/Memory Architecture"],
          },
          {
            title: "Operating Systems, DBMS, Software Engg & Networks",
            topics: ["Processes, Threads, Scheduling, Deadlocks, Memory/File Systems, ER/Relational Model, SQL, Normalization, Transactions, SDLC/Testing, OSI/TCP-IP, Routing & Network Security"],
          },
        ],
      },
      {
        name: "AI, Machine Learning, Graphics, Web & Cloud Computing",
        description: "Artificial intelligence, machine learning, data mining, web technologies, and distributed systems.",
        units: [
          {
            title: "Artificial Intelligence & Machine Learning",
            topics: ["Search, Knowledge Representation, Logic/Reasoning, Planning, Supervised/Unsupervised Learning, Neural Networks & Data Mining/Warehousing"],
          },
          {
            title: "Computer Graphics, Web & Cloud/Distributed Systems",
            topics: ["2D/3D Transformations, Clipping/Rendering, HTML/CSS/JS/Web APIs, Cloud Service Models, Virtualization & Distributed Computing"],
          },
        ],
      },
    ],
  },
  {
    code: "88",
    slug: "ugc-net-subject-88-electronic-science",
    name: "Electronic Science",
    papers: [
      {
        name: "Devices, Circuits, Signals, Electromagnetics & Microprocessors",
        description: "Solid-state devices, analog/digital circuits, signal processing, EM fields, and processors.",
        units: [
          {
            title: "Electronic Devices, Circuits & Microprocessors",
            topics: ["Semiconductor Physics, Diodes, BJT, FET/MOSFET, Amplifiers, Op-Amps, Oscillators, Combinational/Sequential Logic, 8085/8086/Microcontrollers & Embedded Systems"],
          },
          {
            title: "Signals, Systems & Electromagnetics",
            topics: ["Continuous/Discrete Signals, LTI Systems, Fourier/Laplace/Z-Transforms, Digital Filters, Maxwell's Equations, Transmission Lines, Waveguides & Antennas"],
          },
        ],
      },
      {
        name: "Communication Systems, Control & Instrumentation",
        description: "Analog/digital communications, control engineering, and electronic instrumentation.",
        units: [
          {
            title: "Analog & Digital Communication",
            topics: ["AM/FM, Sampling, PCM/DM, ASK/PSK/FSK, Information Theory, Error Control Coding, Optical/Satellite & Wireless/Mobile Communications"],
          },
          {
            title: "Control Systems & Measurements/Instrumentation",
            topics: ["Transfer Functions, Block Diagrams, Root Locus, Bode Plots, Stability, Transducers, Bridges, Oscilloscopes & Electronic Instruments"],
          },
        ],
      },
    ],
  },
  {
    code: "89",
    slug: "ugc-net-subject-89-environmental-sciences",
    name: "Environmental Sciences",
    papers: [
      {
        name: "Fundamentals, Earth/Atmospheric Processes & Environmental Chemistry",
        description: "Environmental principles, earth/climate systems, and chemical behavior in the environment.",
        units: [
          {
            title: "Environmental Fundamentals & Earth/Atmospheric Systems",
            topics: ["Environmental Principles, Ecology, Biodiversity, Biogeochemical Cycles, Earth Structure, Meteorology, Atmospheric Layers & Climate Systems"],
          },
          {
            title: "Environmental Chemistry & Environmental Biology",
            topics: ["Air/Water/Soil Chemistry, Toxic Chemicals, Stoichiometry, Microbiology, Bioremediation, Toxicology & Ecosystem Dynamics"],
          },
        ],
      },
      {
        name: "Pollution, Energy, EIA, Waste & Environmental Legislation",
        description: "Pollution control, energy resources, impact assessment, waste management, and laws.",
        units: [
          {
            title: "Environmental Pollution, Energy & Waste Management",
            topics: ["Air/Water/Soil/Noise/Thermal/Radiation Pollution, Conventional & Renewable Energy, Solid/Hazardous/E-Waste Treatment & Disposal"],
          },
          {
            title: "Environmental Impact Assessment, Economics & Laws",
            topics: ["EIA Process & Methods, Environmental Valuation, Sustainable Development, Environment Protection/Air/Water/Wildlife/Forest Acts & International Agreements"],
          },
        ],
      },
    ],
  },
  {
    code: "90",
    slug: "ugc-net-subject-90-politics-ir",
    name: "Politics including International Relations / International Studies",
    papers: [
      {
        name: "Political Theory, IR Theory & Global Governance",
        description: "Political concepts, international relations theories, and global institutions.",
        units: [
          {
            title: "Political & International Relations Theory",
            topics: ["Sovereignty, State, Power, Justice, Classical/Neo-Realism, Liberalism/Neo-Liberalism, English School, Constructivism, Marxism & Critical IR"],
          },
          {
            title: "International Organizations & Global Issues",
            topics: ["UN System, Global Economic/Financial Governance, Regionalism, Climate/Migration, Human Rights & Non-Traditional Security"],
          },
        ],
      },
      {
        name: "Foreign Policy, Area Studies & Strategic Affairs",
        description: "Major powers, regional/area studies, conflict/diplomacy, and Indian foreign policy.",
        units: [
          {
            title: "Indian Foreign Policy & Neighbourhood",
            topics: ["Evolution & Principles of Indian Foreign Policy, South Asia, Neighbourhood First, Act East & Strategic Partnerships"],
          },
          {
            title: "Area Studies & Security Dynamics",
            topics: ["Indo-Pacific, West Asia, Eurasia, Africa, Americas, Diplomacy, Arms Control & Conflict Resolution"],
          },
        ],
      },
    ],
  },
  {
    code: "92",
    slug: "ugc-net-subject-92-human-rights-duties",
    name: "Human Rights and Duties",
    papers: [
      {
        name: "Conceptual Foundations, International Law & Fundamental Duties",
        description: "Philosophical roots, international instruments, and rights-duties balance.",
        units: [
          {
            title: "Philosophical & Historical Foundations",
            topics: ["Evolution of Human Rights, Natural Rights, Generations of Rights, Cultural Relativism vs. Universality & Fundamental Duties"],
          },
          {
            title: "International Human Rights Instruments & Mechanisms",
            topics: ["UDHR, ICCPR, ICESCR, UN Human Rights Council, Treaty Bodies, Geneva Conventions & Refugee/International Humanitarian Law"],
          },
        ],
      },
      {
        name: "Indian Constitutional Framework, Commissions & Vulnerable Groups",
        description: "Constitutional remedies, statutory commissions, and protection of marginalized groups.",
        units: [
          {
            title: "Constitutional Safeguards & Enforcement",
            topics: ["Fundamental Rights, DPSP, Judicial Activism, PIL, NHRC, State Human Rights Commissions & Legal Aid"],
          },
          {
            title: "Rights of Vulnerable & Marginalized Groups",
            topics: ["Women, Children, Scheduled Castes, Scheduled Tribes, Minorities, Persons with Disabilities, Senior Citizens, Workers & Indigenous Peoples"],
          },
        ],
      },
    ],
  },
  {
    code: "93",
    slug: "ugc-net-subject-93-tourism-administration-management",
    name: "Tourism Administration and Management",
    papers: [
      {
        name: "Tourism Concepts, Geography, Heritage & Hospitality",
        description: "Tourism systems, destination geography, cultural/natural heritage, and hospitality.",
        units: [
          {
            title: "Tourism Concepts, Geography & Heritage Resources",
            topics: ["Tourism Demand/Supply, Typologies, Tourist Behavior, Destination Geography, World/Indian Heritage Sites, Monuments, Fairs/Festivals, Wildlife & Eco-Tourism"],
          },
          {
            title: "Hospitality & Travel Trade Operations",
            topics: ["Hotel/Resort Operations, Front Office, Housekeeping, Food & Beverage, Tour Operations, Itinerary Planning, Ticketing & Transport"],
          },
        ],
      },
      {
        name: "Tourism Marketing, Policy, Planning & Sustainability",
        description: "Destination marketing, tourism policy/governance, planning, and sustainable tourism.",
        units: [
          {
            title: "Tourism Marketing, Economics & Law",
            topics: ["Tourism Marketing Mix, Destination Branding, Digital Marketing, Tourism Multiplier/Forex Impact, Travel/Aviation/Hospitality Laws & Ethics"],
          },
          {
            title: "Tourism Planning, Policy & Sustainable Development",
            topics: ["Tourism Policy Frameworks, Carrying Capacity, Community-Based Tourism, Responsible/Sustainable Tourism & Crisis Management"],
          },
        ],
      },
    ],
  },
  {
    code: "95",
    slug: "ugc-net-subject-95-santali",
    name: "Santali",
    papers: [
      {
        name: "Santali Language, Ol Chiki Script & Linguistics",
        description: "Phonology, morphology, syntax, grammar, and Ol Chiki script heritage of Santali.",
        units: [
          {
            title: "Santali Linguistics & Grammar",
            topics: ["Austroasiatic/Munda Language Family, Phonetics/Phonology, Morphology, Case/Tense/Aspect, Syntax, Semantics & Lexicography"],
          },
          {
            title: "Ol Chiki Script & Literary Heritage",
            topics: ["Origin & Standardization of Ol Chiki Script, Orthography, Typography & Role in Preserving Santali Language"],
          },
        ],
      },
      {
        name: "Santali Folklore, Oral Traditions & Literature",
        description: "Oral narratives, traditional institutions/festivals, and Santali poetry, prose, and drama.",
        units: [
          {
            title: "Santali Folklore & Cultural Traditions",
            topics: ["Baha, Sohrae, Karam, Creation Myths (Binti), Folk Songs, Folk Tales, Proverbs, Riddles & Social/Cultural Customs"],
          },
          {
            title: "Modern Santali Literature",
            topics: ["History of Santali Literature, Poetry, Short Story, Novel, Drama, Essay & Literary Criticism"],
          },
        ],
      },
    ],
  },
  {
    code: "100",
    slug: "ugc-net-subject-100-yoga",
    name: "Yoga",
    papers: [
      {
        name: "History, Classical Yoga Texts & Applied Anatomy/Physiology",
        description: "Origins of yoga, Patanjali Yoga Sutras, Bhagavad Gita, Hatha texts, and physiological effects.",
        units: [
          {
            title: "History & Principal Yogic Texts",
            topics: ["Pre-Vedic/Vedic/Upanishadic Roots, Patanjali Yoga Sutras (Ashtanga Yoga, Chitta Vritti, Kleshas, Samadhi), Bhagavad Gita & Hatha Yoga Pradipika/Gheranda Samhita"],
          },
          {
            title: "Yogic Anatomy, Physiology & Psychology",
            topics: ["Effects of Asana, Pranayama, Mudra, Bandha & Shatkarma on Nervous, Respiratory, Cardiovascular, Endocrine & Digestive Systems and Stress/Mindfulness"],
          },
        ],
      },
      {
        name: "Yogic Practices, Therapy, Education & Research",
        description: "Teaching methodology, preventive/therapeutic yoga, lifestyle, and research methods.",
        units: [
          {
            title: "Yogic Practices & Teaching Methodology",
            topics: ["Shatkarma, Asana, Pranayama, Mudra, Bandha, Dhyana, Lesson Planning, Sequencing & Safety/Contraindications"],
          },
          {
            title: "Yoga Therapy, Wellness & Research",
            topics: ["Integrative Yoga for Lifestyle/Psychosomatic/Stress Disorders, Mental Health, Value Education & Research Methodology"],
          },
        ],
      },
    ],
  },
  {
    code: "102",
    slug: "ugc-net-subject-102-hindu-studies",
    name: "Hindu Studies",
    papers: [
      {
        name: "Vedic/Shastric Sources, Darshanas, Epics & Puranas",
        description: "Primary texts, philosophical systems, epics, Puranas, and Dharma traditions.",
        units: [
          {
            title: "Vedic Literature, Epics & Puranas",
            topics: ["Vedas, Upanishads, Vedangas, Ramayana, Mahabharata, Bhagavad Gita, Puranas & Itihasa-Purana Tradition"],
          },
          {
            title: "Darshanas, Dharma & Smriti/Agama Traditions",
            topics: ["Six Astika Darshanas, Purusharthas, Varnashrama/Dharma, Smritis, Tantras & Shaiva/Vaishnava/Shakta Agamas"],
          },
        ],
      },
      {
        name: "Art, Architecture, Rituals, Bhakti & Social Thought",
        description: "Sacred art/architecture, festivals/rituals, saint traditions, and social-cultural history.",
        units: [
          {
            title: "Temple Architecture, Iconography & Rituals",
            topics: ["Nagara, Dravida & Vesara Architecture, Iconography, Vratas, Festivals, Pilgrimage (Tirtha) & Samskaras"],
          },
          {
            title: "Bhakti/Saint Traditions & Modern Hindu Thought",
            topics: ["Alvars, Nayanars, Sant Tradition, Temple/Matha Institutions & Modern Thinkers"],
          },
        ],
      },
    ],
  },
  {
    code: "103",
    slug: "ugc-net-subject-103-indian-knowledge-system",
    name: "Indian Knowledge System",
    papers: [
      {
        name: "Philosophical, Linguistic, Literary & Textual Foundations",
        description: "Core epistemic traditions, language sciences, epics, and textual heritage of India.",
        units: [
          {
            title: "Epistemology, Darshana & Linguistics",
            topics: ["Pramanas, Indian Logic, Vyakarana, Nirukta, Shiksha, Chandas, Alamkara & Oral/Manuscript Traditions"],
          },
          {
            title: "Literature, Ethics & Statecraft",
            topics: ["Vedic/Upanishadic Heritage, Ramayana, Mahabharata, Panchatantra/Jataka, Dharma, Niti & Arthashastra"],
          },
        ],
      },
      {
        name: "Mathematics, Astronomy, Ayurveda, Architecture & Ecology",
        description: "Scientific, medical, architectural, and sustainable traditions in Indian knowledge systems.",
        units: [
          {
            title: "Mathematics, Astronomy & Natural Sciences",
            topics: ["Decimal/Place-Value System, Algebra, Trigonometry, Calculus Seeds, Aryabhata/Brahmagupta/Bhaskara, Siddhantas, Metallurgy, Chemistry & Agriculture"],
          },
          {
            title: "Ayurveda, Vastu/Architecture & Sustainability",
            topics: ["Charaka/Sushruta Samhita Principles, Dinacharya/Ritucharya, Temple/Town Planning, Water Harvesting & Ecological Ethos"],
          },
        ],
      },
    ],
  },
  {
    code: "104",
    slug: "ugc-net-subject-104-disaster-management",
    name: "Disaster Management",
    papers: [
      {
        name: "Hazard Typology, Vulnerability, Risk & Preparedness",
        description: "Natural and anthropogenic hazards, risk assessment, early warning, and mitigation.",
        units: [
          {
            title: "Hazards, Vulnerability & Risk Assessment",
            topics: ["Geological, Hydro-Meteorological, Biological, Industrial, Chemical & Cyber Hazards, Hazard Zonation, Vulnerability/Capacity & Risk Mapping"],
          },
          {
            title: "Prevention, Mitigation & Preparedness",
            topics: ["Structural & Non-Structural Mitigation, Early Warning Systems, Geospatial/Remote Sensing Tools, Community Preparedness & Mock Drills"],
          },
        ],
      },
      {
        name: "Response, Recovery, Governance & Disaster Law",
        description: "Emergency operations, rehabilitation, institutional frameworks, and disaster policy.",
        units: [
          {
            title: "Emergency Response, Relief & Build-Back-Better Recovery",
            topics: ["Incident Response System, Search/Rescue, Emergency Shelter/Health/WASH, Post-Disaster Needs Assessment & Resilient Reconstruction"],
          },
          {
            title: "Legal, Institutional & Global Frameworks",
            topics: ["Disaster Management Act, NDMA/SDMA/DDMA, NDRF, Sendai Framework, Climate Change Linkages & Research Methods"],
          },
        ],
      },
    ],
  },
  {
    code: "105",
    slug: "ugc-net-subject-105-ayurveda-biology",
    name: "Ayurveda Biology",
    papers: [
      {
        name: "Foundational Ayurveda Principles & Biological Correlations",
        description: "Classical Ayurveda concepts and modern biological/physiological perspectives.",
        units: [
          {
            title: "Panchamahabhuta, Tridosha, Prakriti & Sharira",
            topics: ["Panchamahabhuta Theory, Vata-Pitta-Kapha, Prakriti Classification, Agni, Ama, Dhatu, Mala, Srotas & Sharira Rachana/Kriya Correlations"],
          },
          {
            title: "Systems Biology, Genetics & Cellular Links",
            topics: ["Prakriti-Genomics/Phenomics Correlations, Homeostasis, Metabolism, Immunomodulation & Systems Approaches"],
          },
        ],
      },
      {
        name: "Dravyaguna, Pharmacology, Diagnostics & Research",
        description: "Medicinal plants, formulations, clinical/diagnostic concepts, and research design.",
        units: [
          {
            title: "Dravyaguna, Rasa Shastra & Bhaishajya Kalpana",
            topics: ["Rasa, Guna, Virya, Vipaka, Prabhava, Medicinal Plants/Pharmacognosy, Standardization, Quality Control & Rasayana/Pharmacology"],
          },
          {
            title: "Nidana, Swastha-Vritta & Ayurveda Research Methods",
            topics: ["Pathogenesis/Diagnostics Concepts, Preventive/Lifestyle Medicine, Clinical Trial Design, Ethnopharmacology & Evidence-Based Research"],
          },
        ],
      },
    ],
  },
];

const GENERATED_UGC_NET_SEEDS: ExamSeed[] = UGC_NET_SUBJECT_SPECS.map((spec) => ({
  id: spec.slug,
  title: `UGC NET ${spec.name} (Code ${spec.code})`,
  category: "UGC NET Subjects",
  stateCode: "ALL INDIA",
  conductingBody: "National Testing Agency (NTA)",
  description: `UGC NET syllabus for ${spec.name} (Subject Code ${spec.code}) covering core papers, units, and topics.`,
  qualification: "Master's degree or equivalent in relevant discipline",
  officialUrl: spec.pdfUrl || "https://www.ugcnetonline.in/syllabus-new.php",
  officialSyllabusPdfUrl: spec.pdfUrl,
  stages: ["Paper I — Teaching & Research Aptitude", `Paper II — ${spec.name} (Code ${spec.code})`],
  pyqTopicHint: `UGC NET ${spec.name} ${spec.papers.map((p) => p.name).join(" ")}`,
  highYieldFocus: [],
  pattern: [],
  papers: spec.papers,
}));

const SSC_EXAM_SEEDS: ExamSeed[] = [
  {
    id: "ssc-chsl",
    title: "SSC Combined Higher Secondary Level (SSC CHSL)",
    category: "SSC",
    stateCode: "ALL INDIA",
    conductingBody: "Staff Selection Commission (SSC)",
    description: "10+2 level recruitment examination for LDC, JSA, and DEO posts across central government ministries and departments.",
    qualification: "12th Standard (10+2) pass from a recognized board",
    officialUrl: "https://ssc.gov.in",
    stages: ["Tier I (CBT with Sectional Timing)", "Tier II (CBT + Skill Test / Typing Test)"],
    pyqTopicHint: "SSC CHSL English General Intelligence Quantitative Aptitude General Awareness",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Tier I — Objective CBT (4 Sections)",
        description: "English Language, General Intelligence, Quantitative Aptitude (Basic Arithmetic), and General Awareness.",
        units: [
          {
            title: "English Language & General Intelligence",
            topics: [
              "Reading Comprehension, Cloze Test, Fill in the Blanks, Error Spotting, Sentence Improvement, Active/Passive Voice & Direct/Indirect Narration",
              "Synonyms, Antonyms, Idioms/Phrases, One-Word Substitution, Spelling & Para Jumbles",
              "Semantic/Symbolic/Number Analogy & Classification, Series, Coding-Decoding, Syllogism, Venn Diagrams, Puzzles & Non-Verbal Reasoning",
            ],
          },
          {
            title: "Quantitative Aptitude & General Awareness",
            topics: [
              "Number System, Percentage, Ratio & Proportion, Averages, Profit/Loss/Discount, SI & CI, Time & Work, Time/Speed/Distance, Algebra, Geometry, Mensuration, Trigonometry & DI",
              "Current Affairs, India & Neighbouring Countries, History, Culture, Geography, Economic Scene, General Polity, Scientific Research & General Science",
            ],
          },
        ],
      },
      {
        name: "Tier II — Session I & Session II + Skill/Typing",
        description: "Mathematical Abilities, Reasoning & General Intelligence, English Language & Comprehension, General Awareness, Computer Knowledge, and Typing/DEST.",
        units: [
          {
            title: "Tier II Core Subjects, Computer Knowledge & Typing",
            topics: [
              "Mathematical Abilities & Reasoning/General Intelligence (Tier II standard)",
              "English Language & Comprehension, General Awareness, Computer Basics/Networking/Cyber Security & Typing/Data Entry Speed Test",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ssc-mts-havaldar",
    title: "SSC Multi-Tasking Staff & Havaldar (SSC MTS)",
    category: "SSC",
    stateCode: "ALL INDIA",
    conductingBody: "Staff Selection Commission (SSC)",
    description: "Matriculation-level recruitment examination for Multi-Tasking (Non-Technical) Staff and Havaldar (CBIC & CBN) posts.",
    qualification: "Matriculation (10th Class) pass from a recognized board",
    officialUrl: "https://ssc.gov.in",
    stages: ["Computer Based Examination (Session I & Session II)", "PET / PST (for Havaldar posts)"],
    pyqTopicHint: "SSC MTS Numerical Mathematical Ability Reasoning General Awareness English Comprehension",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Session I — Numerical & Mathematical Ability + Reasoning",
        description: "Foundational arithmetic, problem-solving, and logical/verbal/non-verbal reasoning.",
        units: [
          {
            title: "Numerical Ability & Reasoning",
            topics: [
              "Integers, Whole Numbers, LCM/HCF, Decimals/Fractions, Relationship Between Numbers, Basic Arithmetic, Percentage, Ratio/Proportion, Work/Time, Direct/Inverse Proportions, Averages, SI, Profit/Loss, Discount, Area/Perimeter & Simple Graphs",
              "Alpha-Numeric Series, Coding-Decoding, Analogy, Direction, Similarities/Differences, Jumbling, Problem Solving, Non-Verbal Reasoning, Age Calculations, Calendar & Clock",
            ],
          },
        ],
      },
      {
        name: "Session II — General Awareness & English Language",
        description: "General awareness and comprehension/vocabulary/grammar basics.",
        units: [
          {
            title: "General Awareness & English Language/Comprehension",
            topics: [
              "Social Studies (History, Geography, Art & Culture, Civics, Economics), General Science, Environmental Studies up to 10th Standard & Current Events",
              "Basics of English Language, Vocabulary, Grammar, Sentence Structure, Synonyms/Antonyms & Short Reading Comprehension",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ssc-cpo",
    title: "SSC Sub-Inspector in Delhi Police & CAPFs (SSC CPO)",
    category: "SSC",
    stateCode: "ALL INDIA",
    conductingBody: "Staff Selection Commission (SSC)",
    description: "Recruitment examination for Sub-Inspector (Executive) in Delhi Police and Sub-Inspector in Central Armed Police Forces (CAPFs).",
    qualification: "Bachelor's degree from a recognized university",
    officialUrl: "https://ssc.gov.in",
    stages: ["Paper I (CBT)", "PET / PST", "Paper II (CBT)", "Detailed Medical Examination"],
    pyqTopicHint: "SSC CPO General Intelligence Reasoning General Knowledge Quantitative Aptitude English Comprehension",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Paper I — Reasoning, GK, Quantitative Aptitude & English",
        description: "Four objective sections covering reasoning, general knowledge/awareness, quantitative aptitude, and English comprehension.",
        units: [
          {
            title: "Paper I Sections",
            topics: [
              "General Intelligence & Reasoning (Verbal, Non-Verbal, Analytical & Spatial)",
              "General Knowledge & General Awareness (History, Culture, Geography, Economic Scene, Polity, Constitution, Scientific Research & Current Affairs)",
              "Quantitative Aptitude & English Comprehension (Grammar, Vocabulary, Idioms, Error Spotting, Cloze Test & Reading Comprehension)",
            ],
          },
        ],
      },
      {
        name: "Paper II — English Language & Comprehension",
        description: "Focused 200-question English language and comprehension paper.",
        units: [
          {
            title: "English Language & Comprehension (Paper II)",
            topics: [
              "Reading Comprehension, Grammar & Usage, Vocabulary, Synonyms/Antonyms, Idioms/Phrases, Sentence Correction & Cloze Test",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ssc-gd",
    title: "SSC Constable (GD) in CAPFs, SSF, Rifleman (GD) & NCB",
    category: "SSC",
    stateCode: "ALL INDIA",
    conductingBody: "Staff Selection Commission (SSC)",
    description: "Recruitment examination for General Duty Constable posts across CAPFs, SSF, Assam Rifles, and NCB.",
    qualification: "Matriculation (10th Class) pass from a recognized board",
    officialUrl: "https://ssc.gov.in",
    stages: ["Computer Based Examination (CBE)", "Physical Efficiency Test (PET) & Physical Standard Test (PST)", "Medical Examination & Document Verification"],
    pyqTopicHint: "SSC GD General Intelligence Reasoning General Knowledge Elementary Mathematics English Hindi",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Computer Based Examination — Parts A, B, C & D",
        description: "General Intelligence & Reasoning, General Knowledge & General Awareness, Elementary Mathematics, and English or Hindi.",
        units: [
          {
            title: "Reasoning & Elementary Mathematics",
            topics: [
              "Analogies, Similarities/Differences, Spatial Visualization, Spatial Orientation, Visual Memory, Discrimination, Observation, Relationship Concepts, Arithmetical Reasoning, Figural Classification, Arithmetic Number Series & Non-Verbal Reasoning",
              "Number Systems, Computation of Whole Numbers, Decimals & Fractions, Relationship Between Numbers, Fundamental Arithmetical Operations, Percentages, Ratio & Proportion, Averages, Interest, Profit & Loss, Discount, Mensuration, Time & Distance, Ratio & Time, Time & Work",
            ],
          },
          {
            title: "General Knowledge/Awareness & English/Hindi",
            topics: [
              "General Knowledge & General Awareness (Sports, History, Culture, Geography, Economic Scene, General Polity, Indian Constitution, Scientific Research & Current Affairs)",
              "English or Hindi Comprehension, Grammar, Vocabulary, Idioms & Usage",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ssc-je",
    title: "SSC Junior Engineer (Civil, Mechanical & Electrical)",
    category: "SSC",
    stateCode: "ALL INDIA",
    conductingBody: "Staff Selection Commission (SSC)",
    description: "Technical recruitment examination for Junior Engineer posts in Civil, Mechanical, and Electrical engineering disciplines.",
    qualification: "Degree or Diploma in Civil / Mechanical / Electrical Engineering as notified",
    officialUrl: "https://ssc.gov.in",
    stages: ["Paper I (CBT)", "Paper II (CBT — Discipline Specific)"],
    pyqTopicHint: "SSC JE General Intelligence Reasoning General Awareness Civil Mechanical Electrical Engineering",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Paper I — General Intelligence, General Awareness & General Engineering",
        description: "Reasoning, general awareness, and discipline-specific engineering basics.",
        units: [
          {
            title: "General Intelligence, Reasoning & General Awareness",
            topics: [
              "Verbal & Non-Verbal Reasoning, Analogies, Similarities/Differences, Space Visualization, Problem Solving, Analysis, Judgment, Decision Making, Visual Memory, Discrimination, Observation, Relationship Concepts, Arithmetical Reasoning, Number Series & Coding-Decoding",
              "Current Affairs, India & Neighbouring Countries, History, Culture, Geography, Economic Scene, General Polity, Scientific Research & General Science",
            ],
          },
          {
            title: "General Engineering (Civil / Mechanical / Electrical)",
            topics: [
              "Civil: Building Materials, Estimating/Costing/Valuation, Surveying, Soil Mechanics, Hydraulics, Irrigation, Transportation, Environmental & Structural Engineering",
              "Mechanical: Theory of Machines/Machine Design, Engineering Mechanics, Strength of Materials, Thermodynamics, Boilers, IC Engines, Air Compressors, Refrigeration, Fluid Mechanics & Production Engineering",
              "Electrical: Basic Concepts, Circuit Law, AC Fundamentals, Measurement/Instruments, Electrical Machines, Synchronous Machines, Generation/Transmission/Distribution & Estimation/Utilization",
            ],
          },
        ],
      },
      {
        name: "Paper II — Core Engineering Discipline",
        description: "Dedicated technical CBT for Civil, Mechanical, or Electrical Engineering.",
        units: [
          {
            title: "Branch-Specific Paper II Syllabus",
            topics: [
              "In-depth analytical and numerical problem solving in Civil, Mechanical, or Electrical Engineering",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ssc-stenographer",
    title: "SSC Stenographer Grade 'C' & 'D'",
    category: "SSC",
    stateCode: "ALL INDIA",
    conductingBody: "Staff Selection Commission (SSC)",
    description: "Recruitment examination for Stenographer Grade 'C' and Grade 'D' posts in central government ministries and offices.",
    qualification: "12th Standard (10+2) pass from a recognized board",
    officialUrl: "https://ssc.gov.in",
    stages: ["Computer Based Test (CBT)", "Skill Test in Stenography (English / Hindi)"],
    pyqTopicHint: "SSC Stenographer General Intelligence Reasoning General Awareness English Language Comprehension",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Computer Based Test — Reasoning, General Awareness & English",
        description: "General Intelligence & Reasoning, General Awareness, and English Language & Comprehension.",
        units: [
          {
            title: "Reasoning & General Awareness",
            topics: [
              "Verbal & Non-Verbal Reasoning, Analogies, Similarities/Differences, Space Visualization, Problem Solving, Analysis, Judgment, Decision Making, Visual Memory, Discrimination, Observation, Relationship Concepts, Arithmetical Reasoning, Series & Coding-Decoding",
              "Current Affairs, India & Neighbouring Countries, History, Culture, Geography, Economic Scene, General Polity, Scientific Research & General Science",
            ],
          },
          {
            title: "English Language & Comprehension + Stenography Skill Test",
            topics: [
              "Vocabulary, Grammar, Sentence Structure, Synonyms/Antonyms, Correct Usage, Spot the Error, Fill in the Blanks, Spelling, Idioms/Phrases, One-Word Substitution, Voice/Narration, Sentence Shuffling & Reading Comprehension",
              "Stenography Dictation & Transcription Skill Test (Grade C & Grade D speed norms)",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ssc-selection-post",
    title: "SSC Selection Post Examination (Phase XIII / Latest)",
    category: "SSC",
    stateCode: "ALL INDIA",
    conductingBody: "Staff Selection Commission (SSC)",
    description: "Category-wise recruitment examination across Matriculation, Higher Secondary (10+2), and Graduate & above qualification levels.",
    qualification: "Matriculation (10th), 10+2, or Graduation & above depending on post category",
    officialUrl: "https://ssc.gov.in",
    stages: ["Computer Based Examination (CBE)", "Skill Test / Typing Test / Data Entry (where prescribed)"],
    pyqTopicHint: "SSC Selection Post General Intelligence General Awareness Quantitative Aptitude English Language",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Computer Based Examination — 4 Sections",
        description: "General Intelligence, General Awareness, Quantitative Aptitude (Basic Arithmetic), and English Language (Basic Knowledge) calibrated to 10th, 10+2, or Graduate level.",
        units: [
          {
            title: "General Intelligence & General Awareness",
            topics: [
              "Verbal & Non-Verbal Reasoning, Analogies, Coding-Decoding, Series, Spatial Orientation, Venn Diagrams & Problem Solving",
              "Current Affairs, History, Culture, Geography, Economic Scene, General Polity, Indian Constitution, Scientific Research & General Science",
            ],
          },
          {
            title: "Quantitative Aptitude & English Language",
            topics: [
              "Arithmetic Skills (Whole Numbers, Decimals, Fractions, Percentages, Ratio & Proportion, Averages, Interest, Profit & Loss, Discount, Mensuration, Time & Distance, Time & Work; plus Algebra/Geometry/Trigonometry at Graduate level)",
              "Reading Comprehension, Grammar, Vocabulary, Error Spotting, Cloze Test, Synonyms/Antonyms & Sentence Correction",
            ],
          },
        ],
      },
    ],
  },
];

const RAILWAY_EXAM_SEEDS: ExamSeed[] = [
  {
    id: "rrb-group-d",
    title: "RRB Group D (Level 1 Posts)",
    category: "Railways",
    stateCode: "ALL INDIA",
    conductingBody: "Railway Recruitment Board (RRB)",
    description: "Level 1 recruitment examination across Indian Railways covering General Science, Mathematics, Reasoning, and General Awareness & Current Affairs.",
    qualification: "10th Pass or ITI from recognized board/institute",
    officialUrl: "https://indianrailways.gov.in",
    stages: ["CBT", "PET", "Document Verification & Medical"],
    pyqTopicHint: "RRB Group D General Science Mathematics Reasoning General Awareness",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Computer Based Test (CBT)",
        description: "General Science (10th standard), Mathematics, General Intelligence & Reasoning, and General Awareness & Current Affairs.",
        units: [
          {
            title: "Science, Maths, Reasoning & GA",
            topics: [
              "Physics, Chemistry & Life Sciences (up to 10th Standard)",
              "Number System, BODMAS, Decimals, Fractions, LCM/HCF, Ratio & Proportion, Percentage, Mensuration, Time & Work, Time & Distance, SI/CI, Profit & Loss, Algebra, Geometry & Trigonometry",
              "Analogies, Series, Coding-Decoding, Mathematical Operations, Relationships, Syllogism, Venn Diagrams, DI, Conclusions, Similarities/Differences, Analytical Reasoning, Classification, Directions & Statements",
              "Current Affairs, Science & Technology, Sports, Culture, Personalities, Economics & Politics",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "rrb-alp",
    title: "RRB Assistant Loco Pilot (RRB ALP)",
    category: "Railways",
    stateCode: "ALL INDIA",
    conductingBody: "Railway Recruitment Board (RRB)",
    description: "Recruitment examination for Assistant Loco Pilots in Indian Railways across CBT Stage I, CBT Stage II (Part A & Part B), and CBAT.",
    qualification: "10th + ITI or Diploma/Degree in Engineering",
    officialUrl: "https://indianrailways.gov.in",
    stages: ["CBT Stage I", "CBT Stage II (Part A & B)", "CBAT"],
    pyqTopicHint: "RRB ALP Mathematics Reasoning General Science General Awareness Trade",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "CBT Stage I & Stage II (Part A & B)",
        description: "Mathematics, Mental Ability/Reasoning, General Science, General Awareness, and Relevant Trade.",
        units: [
          {
            title: "Stage I & Stage II Part A",
            topics: [
              "Number System, BODMAS, Decimals, Fractions, LCM/HCF, Ratio, Percentage, Mensuration, Time & Work, Time & Distance, SI/CI, Profit & Loss, Algebra, Geometry, Trigonometry & Statistics",
              "Reasoning, General Science (10th level) & General Awareness/Current Affairs",
            ],
          },
          {
            title: "Stage II Part B — Relevant Trade",
            topics: [
              "Qualifying trade test as per ITI/NCVT/SCVT or Engineering trade syllabus",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "rrb-je",
    title: "RRB Junior Engineer (RRB JE)",
    category: "Railways",
    stateCode: "ALL INDIA",
    conductingBody: "Railway Recruitment Board (RRB)",
    description: "Technical recruitment examination for Junior Engineer, DMS, and CMA posts in Indian Railways.",
    qualification: "Diploma/Degree in Engineering (or B.Sc for CMA)",
    officialUrl: "https://indianrailways.gov.in",
    stages: ["CBT Stage I", "CBT Stage II", "DV & Medical"],
    pyqTopicHint: "RRB JE Mathematics Reasoning General Awareness General Science Technical",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "CBT Stage I & Stage II",
        description: "Maths, Reasoning, GA, General Science, Physics & Chemistry, Computers, Environment, and Technical Abilities.",
        units: [
          {
            title: "Stage I & Stage II Core Modules",
            topics: [
              "Mathematics, General Intelligence & Reasoning, General Awareness & General Science",
              "Physics & Chemistry, Basics of Computers & Applications, Basics of Environment & Pollution Control, and Technical Abilities",
            ],
          },
        ],
      },
    ],
  },
];

const BANKING_EXAM_SEEDS: ExamSeed[] = [
  {
    id: "sbi-po",
    title: "SBI Probationary Officer (SBI PO)",
    category: "Banking",
    stateCode: "ALL INDIA",
    conductingBody: "State Bank of India (SBI)",
    description: "National banking recruitment examination for Probationary Officers across SBI branches in India.",
    qualification: "Bachelor's degree from a recognized university",
    officialUrl: "https://sbi.co.in/web/careers",
    stages: ["Preliminary Examination", "Main Examination (Objective + Descriptive)", "Group Exercise & Interview"],
    pyqTopicHint: "SBI PO Quantitative Aptitude Data Interpretation Reasoning English Banking Awareness",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Preliminary Examination Syllabus",
        description: "Screening test covering English Language, Quantitative Aptitude, and Reasoning Ability.",
        units: [
          {
            title: "English Language, Quant & Reasoning (Prelims)",
            topics: [
              "Reading Comprehension, Cloze Test, Fill in the Blanks, Error Spotting, Sentence Improvement & Para Jumbles",
              "Number Series, Quadratic Equations, Simplification/Approximation, Arithmetic Word Problems & Data Interpretation",
              "Seating Arrangement (Circular/Linear/Box/Floor), Puzzles, Syllogism, Inequalities, Coding-Decoding & Blood Relations",
            ],
          },
        ],
      },
      {
        name: "Main Examination Syllabus (Objective & Descriptive)",
        description: "Data analysis/interpretation, reasoning/computer aptitude, banking/economy awareness, English, and descriptive writing.",
        units: [
          {
            title: "Data Analysis & Interpretation + Reasoning & Computer Aptitude",
            topics: [
              "Tabular, Pie, Bar, Line, Radar, Caselet & Data Sufficiency DI Sets",
              "High-Level Puzzles & Seating Arrangements, Logical Reasoning, Input-Output, Data Sufficiency & Computer Basics/Networking",
            ],
          },
          {
            title: "General/Economy/Banking Awareness & English (Objective + Descriptive)",
            topics: [
              "Banking & Financial Awareness, RBI Monetary Policy, Budget, Economic Survey, Current Affairs & Static GK",
              "Reading Comprehension, Vocabulary, Grammar, Para Jumbles & Descriptive Letter and Essay Writing",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "sbi-clerk",
    title: "SBI Junior Associate (SBI Clerk)",
    category: "Banking",
    stateCode: "ALL INDIA",
    conductingBody: "State Bank of India (SBI)",
    description: "Clerical cadre recruitment examination for Junior Associates in State Bank of India.",
    qualification: "Bachelor's degree from a recognized university",
    officialUrl: "https://sbi.co.in/web/careers",
    stages: ["Preliminary Examination", "Main Examination"],
    pyqTopicHint: "SBI Clerk Numerical Ability Reasoning English General Awareness",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Preliminary & Main Examination Syllabus",
        description: "English Language, Numerical Ability/Quantitative Aptitude, Reasoning, and General/Financial Awareness.",
        units: [
          {
            title: "Prelims & Mains Core Sections",
            topics: [
              "Reading Comprehension, Cloze Test, Spotting Errors, Sentence Correction, Para Jumbles & Vocabulary",
              "Simplification/Approximation, Number Series, Ratio/Percentage/Profit-Loss/SI-CI/Time-Work & Data Interpretation",
              "Puzzles, Seating Arrangement, Syllogism, Inequalities, Coding-Decoding, Banking Awareness, Current Affairs & Computer Basics",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ibps-clerk",
    title: "IBPS Customer Service Associate (IBPS Clerk)",
    category: "Banking",
    stateCode: "ALL INDIA",
    conductingBody: "Institute of Banking Personnel Selection",
    description: "Clerical recruitment examination for participating public sector banks across India.",
    qualification: "Bachelor's degree from a recognized university",
    officialUrl: "https://www.ibps.in",
    stages: ["Preliminary Examination", "Main Examination"],
    pyqTopicHint: "IBPS Clerk Quantitative Aptitude Reasoning English General Awareness",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Preliminary & Main Examination Syllabus",
        description: "English Language, Numerical Ability/Quantitative Aptitude, Reasoning, and General/Financial Awareness.",
        units: [
          {
            title: "English, Numerical Ability & Reasoning",
            topics: [
              "Comprehension, Cloze Test, Grammar, Error Detection, Para Jumbles & Phrase Replacement",
              "Simplification, Number Series, Quadratic Equations, Arithmetic & Data Interpretation",
              "Seating Arrangements, Puzzles, Syllogism, Inequalities, Blood Relations, Direction & Coding-Decoding",
            ],
          },
          {
            title: "General/Financial Awareness & Computer Knowledge",
            topics: [
              "Banking Terminology, RBI Functions, Financial/Economic News, Current Affairs & Computer Basics",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ibps-rrb-po",
    title: "IBPS RRB Officer Scale I (RRB PO)",
    category: "Banking",
    stateCode: "ALL INDIA",
    conductingBody: "Institute of Banking Personnel Selection",
    description: "Regional Rural Banks recruitment examination for Officer Scale I (Assistant Manager).",
    qualification: "Bachelor's degree in any discipline from a recognized university",
    officialUrl: "https://www.ibps.in",
    stages: ["Preliminary Examination", "Main Examination", "Interview"],
    pyqTopicHint: "IBPS RRB PO Reasoning Quantitative Aptitude Financial Awareness English Hindi Computer",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Prelims & Mains Syllabus",
        description: "Reasoning, Quantitative Aptitude, General/Financial Awareness, English or Hindi Language, and Computer Knowledge.",
        units: [
          {
            title: "Reasoning & Quantitative Aptitude",
            topics: [
              "Puzzles, Seating Arrangement, Syllogism, Inequality, Coding-Decoding, Direction & Blood Relations",
              "Data Interpretation, Number Series, Quadratic Equations & Arithmetic (Ratio, Percentage, SI/CI, Profit-Loss, Mensuration)",
            ],
          },
          {
            title: "Financial Awareness, Language & Computer Knowledge",
            topics: [
              "Rural/Agricultural Banking, RRB Structure, RBI/Monetary Policy, Current Affairs & Basic Computer Knowledge",
              "English Language or Hindi Language (Comprehension, Grammar, Vocabulary & Usage)",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ibps-rrb-clerk",
    title: "IBPS RRB Office Assistant (RRB Clerk)",
    category: "Banking",
    stateCode: "ALL INDIA",
    conductingBody: "Institute of Banking Personnel Selection",
    description: "Regional Rural Banks clerical recruitment examination for Office Assistant (Multipurpose).",
    qualification: "Bachelor's degree in any discipline from a recognized university",
    officialUrl: "https://www.ibps.in",
    stages: ["Preliminary Examination", "Main Examination"],
    pyqTopicHint: "IBPS RRB Clerk Numerical Ability Reasoning General Awareness English Hindi Computer",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Prelims & Mains Syllabus",
        description: "Reasoning, Numerical Ability, General Awareness, English or Hindi, and Computer Knowledge.",
        units: [
          {
            title: "Reasoning & Numerical Ability",
            topics: [
              "Puzzles, Seating Arrangement, Syllogism, Inequalities, Series, Coding-Decoding & Ranking",
              "Simplification/Approximation, Number Series, Arithmetic & Data Interpretation",
            ],
          },
          {
            title: "General Awareness, Language & Computer Knowledge",
            topics: [
              "Banking/Economy Current Affairs, Static GK, English/Hindi Comprehension & Computer Fundamentals",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "rbi-grade-b",
    title: "RBI Grade B Officer (General / DEPR / DSIM)",
    category: "Banking",
    stateCode: "ALL INDIA",
    conductingBody: "Reserve Bank of India (RBI)",
    description: "Reserve Bank of India recruitment examination for Grade B Officers across General, DEPR, and DSIM streams.",
    qualification: "Bachelor's degree (or Master's in Economics/Statistics for DEPR/DSIM)",
    officialUrl: "https://opportunities.rbi.org.in",
    stages: ["Phase I Examination", "Phase II Examination", "Interview"],
    pyqTopicHint: "RBI Grade B General Awareness Economic Social Issues Finance Management",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Phase I — General Awareness, Quant, Reasoning & English",
        description: "Objective screening examination testing broad awareness and analytical aptitude.",
        units: [
          {
            title: "Phase I Core Syllabus",
            topics: [
              "General Awareness (Banking, Financial Markets, Economy & Current Affairs)",
              "Quantitative Aptitude, Data Interpretation, Reasoning & English Language",
            ],
          },
        ],
      },
      {
        name: "Phase II — ESI, Finance & Management + English Writing",
        description: "Economic and Social Issues, Finance and Management, and English (Writing Skills).",
        units: [
          {
            title: "Economic & Social Issues (ESI) and Finance & Management",
            topics: [
              "Growth/Development, Monetary/Fiscal Policy, Inflation, BoP, Poverty, Inclusion, Social Sectors & Sustainable Development",
              "Financial System, Financial Markets, Risk Management in Banking, Union Budget, Fundamentals of Management & Organizational Behavior",
            ],
          },
          {
            title: "English (Writing Skills — Descriptive)",
            topics: [
              "Essay Writing on Economic/Financial/Social Themes, Precis Writing & Business/Official Correspondence",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "rbi-assistant",
    title: "RBI Assistant Examination",
    category: "Banking",
    stateCode: "ALL INDIA",
    conductingBody: "Reserve Bank of India (RBI)",
    description: "Reserve Bank of India recruitment examination for Assistant posts across RBI offices.",
    qualification: "Bachelor's degree in any discipline with word processing proficiency",
    officialUrl: "https://opportunities.rbi.org.in",
    stages: ["Preliminary Examination", "Main Examination", "Language Proficiency Test (LPT)"],
    pyqTopicHint: "RBI Assistant English Quantitative Aptitude Reasoning General Awareness Computer",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Preliminary & Main Examination Syllabus",
        description: "English Language, Numerical Ability/Quantitative Aptitude, Reasoning, General Awareness, and Computer Knowledge.",
        units: [
          {
            title: "Prelims & Mains Subjects",
            topics: [
              "Reading Comprehension, Cloze Test, Sentence Completion/Correction, Para Jumbles & Vocabulary",
              "Number Series, Data Interpretation, Ratio, Percentage, Profit-Loss, SI-CI, Time-Work & Speed-Distance",
              "Puzzles, Seating Arrangement, Syllogism, Inequalities, General Awareness & Computer Basics",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "nabard-grade-a",
    title: "NABARD Grade A Officer (RDBS)",
    category: "Banking",
    stateCode: "ALL INDIA",
    conductingBody: "National Bank for Agriculture and Rural Development",
    description: "Development banking recruitment examination for Assistant Manager (Grade A) in Rural Development Banking Service.",
    qualification: "Bachelor's degree in any subject from a recognized university",
    officialUrl: "https://www.nabard.org",
    stages: ["Phase I (Preliminary)", "Phase II (Main)", "Interview"],
    pyqTopicHint: "NABARD Grade A Agriculture Rural Development Economic Social Issues General Awareness",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Phase I & Phase II Syllabus",
        description: "Reasoning, Quant, English, Computer, GA, Decision Making, Economic & Social Issues, and Agriculture & Rural Development.",
        units: [
          {
            title: "Economic & Social Issues (ESI) and Agriculture & Rural Development (ARD)",
            topics: [
              "Nature of Indian Economy, Inflation, Monetary/Fiscal Policy, BoP, Poverty, Inequality, Demography & Social Justice",
              "Agronomy, Soil & Water Conservation, Cropping Systems, Farm/Water Management, Animal Husbandry, Forestry & Rural Economy/Schemes",
            ],
          },
          {
            title: "Aptitude, General Awareness & English Writing",
            topics: [
              "Reasoning, Quantitative Aptitude, Data Interpretation, Computer Knowledge, Decision Making, Current Affairs & Descriptive Writing",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "idbi-jam-executive",
    title: "IDBI Bank JAM & Assistant Manager",
    category: "Banking",
    stateCode: "ALL INDIA",
    conductingBody: "IDBI Bank",
    description: "Banking recruitment examination for Junior Assistant Manager (JAM) and Assistant Manager posts in IDBI Bank.",
    qualification: "Bachelor's degree from a recognized university",
    officialUrl: "https://www.idbibank.in/idbi-bank-careers.aspx",
    stages: ["Online Test", "Personal Interview"],
    pyqTopicHint: "IDBI Bank Logical Reasoning Quantitative Aptitude English General Banking Awareness",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Online Test Syllabus",
        description: "Logical Reasoning/Data Analysis & Interpretation, Quantitative Aptitude, English Language, and General/Economy/Banking Awareness.",
        units: [
          {
            title: "Reasoning, Quant, English & Banking Awareness",
            topics: [
              "Puzzles, Seating Arrangement, Syllogism, Inequalities, Coding-Decoding & Data Sufficiency",
              "Arithmetic, DI, English Comprehension/Grammar & Banking/Financial/Economic Awareness",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "sidbi-grade-a",
    title: "SIDBI Grade A Officer",
    category: "Banking",
    stateCode: "ALL INDIA",
    conductingBody: "Small Industries Development Bank of India",
    description: "Recruitment examination for Assistant Manager (Grade A) in SIDBI.",
    qualification: "Bachelor's / Master's degree in relevant discipline as notified",
    officialUrl: "https://www.sidbi.in/en/careers",
    stages: ["Phase I (Online Exam)", "Phase II (Online Exam)", "Interview"],
    pyqTopicHint: "SIDBI Grade A MSME Finance Banking Economy English Reasoning Quant",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Phase I & Phase II Syllabus",
        description: "General Awareness, English, Reasoning, Quant, and Stream/Domain knowledge (MSME, Banking, Finance & Economy).",
        units: [
          {
            title: "MSME Ecosystem, Banking, Finance & Aptitude",
            topics: [
              "MSME Financing, Credit Schemes, Industrial/Economic Policies, Banking & Financial Markets",
              "English Language, Reasoning, Quantitative Aptitude & Descriptive English",
            ],
          },
        ],
      },
    ],
  },
];

const ODISHA_EXAM_SEEDS: ExamSeed[] = [
  {
    id: "opsc-oas-ocs",
    title: "OPSC Odisha Civil Services (OAS / OCS)",
    category: "Odisha",
    stateCode: "OD",
    conductingBody: "Odisha Public Service Commission (OPSC)",
    description: "State civil services recruitment examination for Odisha Administrative Service and allied Group A & Group B posts.",
    qualification: "Bachelor's degree from a recognized university",
    officialUrl: "https://www.opsc.gov.in",
    stages: ["Preliminary Examination", "Main Examination (Written)", "Interview / Personality Test"],
    pyqTopicHint: "OPSC OCS Prelims GS CSAT Mains English Odia Essay GS Papers Optional",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Preliminary Examination (Paper I GS & Paper II CSAT)",
        description: "National & Odisha current affairs, history, heritage, geography, polity, economy, environment, science, and CSAT.",
        units: [
          {
            title: "General Studies & Odisha Specifics (Prelims)",
            topics: [
              "Current Events of National & International Importance, History of India & Indian National Movement, Odisha History, Culture & Freedom Struggle",
              "Indian & Odisha Geography, Indian Polity & Governance, Economic & Social Development, Environment, Ecology & General Science",
              "CSAT: Comprehension, Logical Reasoning & Analytical Ability, Basic Numeracy & Data Interpretation",
            ],
          },
        ],
      },
      {
        name: "Main Examination (Languages, Essay, GS & Optional)",
        description: "Odia & English papers, Essay, General Studies Papers I & II, and Optional Subject.",
        units: [
          {
            title: "Languages, Essay, GS Papers & Optional",
            topics: [
              "Odia Language & English Language Papers, Essay Writing on National & Odisha Topics",
              "GS Paper I (History, Heritage, Society & Geography of India/Odisha) & GS Paper II (Constitution, Polity, Governance, IR, Economy & Science/Tech)",
              "Optional Subject (Two Papers)",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "opsc-aso",
    title: "OPSC Assistant Section Officer (ASO)",
    category: "Odisha",
    stateCode: "OD",
    conductingBody: "Odisha Public Service Commission (OPSC)",
    description: "Recruitment examination for Assistant Section Officer posts in Odisha Secretariat and OPSC.",
    qualification: "Bachelor's degree in any discipline with computer knowledge",
    officialUrl: "https://www.opsc.gov.in",
    stages: ["Written Examination", "Skill Test in Computer Application"],
    pyqTopicHint: "OPSC ASO General Awareness Reasoning Quantitative Aptitude English Odia",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Written Examination & Computer Skill Test",
        description: "General awareness (including Odisha), reasoning, quantitative aptitude, English & Odia language, and computer skill test.",
        units: [
          {
            title: "General Awareness, Reasoning, Quant & Languages",
            topics: [
              "National & Odisha History, Geography, Polity, Economy, Current Affairs, General Science & Environment",
              "Reasoning & Mental Ability, Quantitative Aptitude (Arithmetic, Algebra, Geometry, Mensuration, DI) & English/Odia Grammar, Comprehension, Translation & Precis",
              "Computer Skill Test: MS Word, Excel, PowerPoint & Basic Computer Operations",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "opsc-ojs",
    title: "OPSC Odisha Judicial Services (OJS — Civil Judge)",
    category: "Odisha",
    stateCode: "OD",
    conductingBody: "Odisha Public Service Commission (OPSC)",
    description: "Judicial recruitment examination for Civil Judge cadre in Odisha.",
    qualification: "Bachelor's degree in Law (LL.B) from a recognized university",
    officialUrl: "https://www.opsc.gov.in",
    stages: ["Preliminary Examination", "Main Written Examination", "Interview"],
    pyqTopicHint: "OPSC OJS Constitution CPC CrPC BNSS BNS IEA BSA Transfer of Property Contract Specific Relief",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Preliminary & Main Law Syllabus",
        description: "Constitution of India, Civil & Criminal procedural/substantive laws, evidence, contract, transfer of property, and personal laws.",
        units: [
          {
            title: "Constitutional, Civil & Criminal Laws",
            topics: [
              "Constitution of India, Civil Procedure Code, Transfer of Property Act, Limitation Act, Contract Act & Specific Relief Act",
              "Criminal Procedure / BNSS, Penal / BNS, Law of Evidence / BSA, Family Law & Jurisprudence",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "opsc-pgt",
    title: "OPSC Post Graduate Teacher (PGT — Odisha)",
    category: "Odisha",
    stateCode: "OD",
    conductingBody: "Odisha Public Service Commission (OPSC)",
    description: "Recruitment examination for Post Graduate Teachers in Odisha Higher Secondary Schools.",
    qualification: "Master's degree in relevant subject with B.Ed or equivalent as notified",
    officialUrl: "https://www.opsc.gov.in",
    stages: ["Written Examination (CBT / Objective)", "Document Verification & Interview (where applicable)"],
    pyqTopicHint: "OPSC PGT General Knowledge Current Affairs Reasoning Pedagogy Subject Syllabus",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "General Awareness, Reasoning, Pedagogy & Subject Paper",
        description: "Current events, Indian & Odisha GK, reasoning, educational psychology/pedagogy, and postgraduate subject syllabus.",
        units: [
          {
            title: "General Studies, Pedagogy & Subject Specialization",
            topics: [
              "General Knowledge, Current Affairs (India & Odisha), Logical Reasoning & Teaching/Pedagogy Concepts",
              "Subject-Specific Syllabus (English, Odia, Physics, Chemistry, Mathematics, Botany, Zoology, History, Political Science, Economics, Commerce, etc.)",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ossc-cgl",
    title: "OSSC Combined Graduate Level (OSSC CGL Group B & C)",
    category: "Odisha",
    stateCode: "OD",
    conductingBody: "Odisha Staff Selection Commission (OSSC)",
    description: "Graduate-level recruitment examination for Group B and Group C posts under Odisha Government.",
    qualification: "Bachelor's degree in relevant discipline as per post notification",
    officialUrl: "https://www.ossc.gov.in",
    stages: ["Preliminary Examination", "Main Written Examination", "Certificate Verification"],
    pyqTopicHint: "OSSC CGL Arithmetic Reasoning General Awareness Computer Odia English Mathematics",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Preliminary & Main Written Examination Syllabus",
        description: "Arithmetic, reasoning, general awareness (India & Odisha), computer/internet basics, and Odia/English.",
        units: [
          {
            title: "Prelims & Mains Core Subjects",
            topics: [
              "Arithmetic (10th standard), Data Interpretation, Logical Reasoning & Mental Ability",
              "General Studies & Current Events (India & Odisha), Basic Computer/IT Fundamentals & Odia/English Language",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ossc-je",
    title: "OSSC Junior Engineer (Civil, Mechanical & Electrical — Odisha)",
    category: "Odisha",
    stateCode: "OD",
    conductingBody: "Odisha Staff Selection Commission (OSSC)",
    description: "Technical recruitment examination for Junior Engineer posts across Odisha Government departments.",
    qualification: "Diploma or Degree in Civil / Mechanical / Electrical Engineering",
    officialUrl: "https://www.ossc.gov.in",
    stages: ["Preliminary / Main Written Examination", "Certificate Verification"],
    pyqTopicHint: "OSSC JE Civil Mechanical Electrical Engineering General Knowledge Odia English",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Technical Engineering & General Studies Syllabus",
        description: "Core Civil/Mechanical/Electrical engineering subjects along with general knowledge and language basics.",
        units: [
          {
            title: "Core Engineering & General Awareness",
            topics: [
              "Civil (Surveying, Strength of Materials, RCC/Steel, Hydraulics, Soil, Estimating & Costing), Mechanical (Thermodynamics, Fluid Mechanics, SOM, TOM, Manufacturing), Electrical (Circuits, Machines, Power Systems, Measurements)",
              "General Awareness (India & Odisha), Basic Reasoning, Computer & Odia/English",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ossc-combined-police-si",
    title: "OSSC / Odisha Police Sub-Inspector (SI) & Traffic Constable",
    category: "Odisha",
    stateCode: "OD",
    conductingBody: "Odisha Police / OSSC",
    description: "State police and traffic recruitment examination covering General English, Odia, General Knowledge, and Computer/Aptitude.",
    qualification: "Bachelor's degree or +2 as specified per post",
    officialUrl: "https://www.odishapolice.gov.in",
    stages: ["Computer Based Recruitment Examination (CBRE)", "Physical Standard Test (PST) & Physical Efficiency Test (PET)", "Medical Examination"],
    pyqTopicHint: "Odisha Police SI General English Odia General Knowledge Current Affairs Computer",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "CBRE — English, Odia, General Knowledge & Aptitude",
        description: "General English, Odia language, general knowledge (India & Odisha), and basic computer/quantitative/reasoning topics.",
        units: [
          {
            title: "Languages, General Knowledge & Aptitude",
            topics: [
              "General English & Odia (Grammar, Comprehension, Usage & Vocabulary)",
              "History, Geography, Polity, Economy, General Science, Current Affairs (India & Odisha) & Computer/Reasoning Basics",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "osssc-ri-ari-amin",
    title: "OSSSC Revenue Inspector, ARI & AMIN",
    category: "Odisha",
    stateCode: "OD",
    conductingBody: "Odisha Subordinate Staff Selection Commission (OSSSC)",
    description: "Combined recruitment examination for Revenue Inspector (RI), Assistant Revenue Inspector (ARI), and Amin in Odisha.",
    qualification: "+2 / 12th Pass (or Graduate as specified per post) with Odia proficiency",
    officialUrl: "https://www.osssc.gov.in",
    stages: ["Written Examination (MCQ)", "Practical Skill Test in Basic Computer Skills (where applicable)"],
    pyqTopicHint: "OSSSC RI ARI AMIN English Odia Mathematics General Knowledge Computer Awareness",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Written Examination — Language, Maths, GK & Computer",
        description: "English, Odia, Mathematics, General Knowledge (India & Odisha), and Computer/Internet knowledge.",
        units: [
          {
            title: "Language, Mathematics, GK & Computer",
            topics: [
              "English (Grammar, Vocabulary, Comprehension, Idioms) & Odia (Grammar, Translation, Comprehension)",
              "Elementary Mathematics (Percentage, Ratio, Average, Profit-Loss, Interest, Mensuration, Time & Work)",
              "General Knowledge (Odisha & India History, Geography, Polity, Economy, Science & Current Affairs) and Basic Computer Skills",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "osssc-forest-guard-forester",
    title: "OSSSC Forest Guard, Forester & Livestock Inspector",
    category: "Odisha",
    stateCode: "OD",
    conductingBody: "Odisha Subordinate Staff Selection Commission (OSSSC)",
    description: "Field and technical recruitment examination for Forest Guard, Forester, and Livestock Inspector in Odisha.",
    qualification: "10th / +2 / Science as specified per post",
    officialUrl: "https://www.osssc.gov.in",
    stages: ["Written Examination", "Physical Standard & Physical Efficiency Test", "Document Verification"],
    pyqTopicHint: "OSSSC Forest Guard Forester General Knowledge Mathematics General Science English Odia",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Written Examination Syllabus",
        description: "General Knowledge, Mathematics, General Science, English, and Odia.",
        units: [
          {
            title: "General Knowledge, Science, Maths & Languages",
            topics: [
              "General Knowledge (Odisha forests, wildlife, sanctuaries, geography, history, polity & current affairs)",
              "General Science (Physics, Chemistry, Biology & Environment) and Elementary Mathematics",
              "English & Odia Language Comprehension, Grammar & Vocabulary",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "osssc-peo-ja",
    title: "OSSSC Panchayat Executive Officer (PEO) & Junior Assistant",
    category: "Odisha",
    stateCode: "OD",
    conductingBody: "Odisha Subordinate Staff Selection Commission (OSSSC)",
    description: "District cadre recruitment examination for Panchayat Executive Officer and Junior Assistant posts across Odisha.",
    qualification: "12th (+2) Pass from a recognized board with Odia proficiency",
    officialUrl: "https://www.osssc.gov.in",
    stages: ["Written Examination (MCQ)", "Practical Skill Test in Basic Computer Skills"],
    pyqTopicHint: "OSSSC PEO Junior Assistant English Odia Mathematics General Knowledge Computer",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Written Examination & Computer Skill Test",
        description: "English, Odia, Mathematics, General Knowledge (India & Odisha), and Computer knowledge.",
        units: [
          {
            title: "Core Written & Computer Topics",
            topics: [
              "English & Odia Grammar, Comprehension & Vocabulary",
              "Arithmetic, General Knowledge (Odisha & India) & Basic Computer Applications",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "otet-osstet-odisha",
    title: "Odisha Teacher Eligibility Test (OTET & OSSTET)",
    category: "Odisha",
    stateCode: "OD",
    conductingBody: "Board of Secondary Education (BSE), Odisha",
    description: "Teacher eligibility examinations for primary, upper primary, and secondary school aspirants in Odisha.",
    qualification: "D.El.Ed / B.Ed with graduation/+2 as prescribed by BSE Odisha / NCTE",
    officialUrl: "https://www.bseodisha.ac.in",
    stages: ["Paper I (Primary / Elementary)", "Paper II (Upper Primary / Secondary)"],
    pyqTopicHint: "OTET OSSTET Child Development Pedagogy Odia English Mathematics Environmental Studies Science Social Studies",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Paper I & Paper II — Pedagogy, Languages & Subject Content",
        description: "Child Development & Pedagogy, Odia, English, and Mathematics/EVS/Science/Social Studies.",
        units: [
          {
            title: "Child Development, Pedagogy & Languages",
            topics: [
              "Child Development, Learning Theories, Inclusive Education & Classroom Pedagogy",
              "Odia & English Language Comprehension, Grammar & Language Pedagogy",
            ],
          },
          {
            title: "Subject Specific Sections (Paper I & Paper II)",
            topics: [
              "Mathematics & Environmental Studies (Paper I)",
              "Mathematics & Science or Social Studies (Paper II as per stream)",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ojee-odisha",
    title: "Odisha Joint Entrance Examination (OJEE)",
    category: "Odisha",
    stateCode: "OD",
    conductingBody: "Odisha Joint Entrance Examination Board (OJEE)",
    description: "State-level entrance exam for B.Pharm, MCA, M.Sc (Computer Sc.), MBA, Integrated MBA, and lateral entry admissions in Odisha.",
    qualification: "10+2 or Bachelor's degree depending on course",
    officialUrl: "https://ojee.nic.in",
    stages: ["Computer Based Test (CBT)", "OJEE Counselling & Seat Allotment"],
    pyqTopicHint: "OJEE Analytical Reasoning Verbal Reasoning Quantitative Aptitude Subject Specific Course Syllabus",
    highYieldFocus: [],
    pattern: [],
    papers: [
      {
        name: "Course-Specific CBT Syllabus",
        description: "Verbal & Analytical Reasoning, Quantitative Aptitude, and course-specific domain syllabus.",
        units: [
          {
            title: "Aptitude, Reasoning & Course Domain",
            topics: [
              "Analytical & Logical Reasoning, Verbal Reasoning & Quantitative/Numerical Aptitude",
              "Course-specific topics: Physics/Chemistry/Biology/Math (B.Pharm), Computer Awareness & Mathematics (MCA), or Business/Data/Verbal Skills (MBA)",
            ],
          },
        ],
      },
    ],
  },
];

export const ALL_EXAM_SYLLABI: ExamSyllabusRecord[] = [
  ...EXAM_SEEDS,
  ...GENERATED_UGC_NET_SEEDS,
  ...BANKING_EXAM_SEEDS,
  ...SSC_EXAM_SEEDS,
  ...RAILWAY_EXAM_SEEDS,
  ...ODISHA_EXAM_SEEDS,
].map((exam) => ({
  id: exam.id,
  slug: exam.id,
  contentType: "syllabus",
  title: `${exam.title} — Syllabus`,
  description: exam.description,
  category: exam.category,
  stateCode: exam.stateCode,
  conductingBody: exam.conductingBody,
  qualification: exam.qualification,
  officialUrl: exam.officialUrl,
  officialSyllabusPdfUrl: exam.officialSyllabusPdfUrl,
  updatedAt: "2026-11-20T00:00:00.000Z",
  stages: exam.stages,
  highYieldFocus: exam.highYieldFocus,
  pyqTopicHint: exam.pyqTopicHint,
  pattern: exam.pattern,
  metadata: {
    examId: exam.id,
    examName: exam.title,
    subject: exam.papers.flatMap((p: SyllabusPaper) => p.units.map((u: SyllabusUnit) => u.title)).slice(0, 6).join(", "),
    conductingBody: exam.conductingBody,
    papers: exam.papers,
  },
}));

export function getCatalogSyllabusById(idOrSlug: string): ExamSyllabusRecord | undefined {
  const normalized = decodeURIComponent(idOrSlug).trim().toLowerCase();
  return ALL_EXAM_SYLLABI.find(
    (item) =>
      item.id.toLowerCase() === normalized ||
      item.slug.toLowerCase() === normalized ||
      item.title.toLowerCase().includes(normalized),
  );
}