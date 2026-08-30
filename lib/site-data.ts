export type SearchItem = {
  title: string;
  description: string;
  category: string;
  href: string;
  keywords: string[];
};

export type MegaMenuGroup = {
  title: string;
  links: {
    label: string;
    href: string;
    description?: string;
  }[];
};

export const megaMenus: Record<string, MegaMenuGroup[]> = {
  Academics: [
    {
      title: "Programs",
      links: [
        {
          label: "B.Tech",
          href: "/academics",
          description: "Engineering programs",
        },
        {
          label: "BCA",
          href: "/academics",
          description: "Computer Applications",
        },
        {
          label: "BBA",
          href: "/academics",
          description: "Business Administration",
        },
        {
          label: "MBA",
          href: "/academics",
          description: "Management studies",
        },
      ],
    },
    {
      title: "Student Resources",
      links: [
        {
          label: "Syllabus",
          href: "/academics",
          description: "Program curriculum",
        },
        {
          label: "Time Table",
          href: "/academics",
          description: "Class schedules",
        },
        {
          label: "Academic Calendar",
          href: "/academics",
          description: "Important academic dates",
        },
        {
          label: "Examinations",
          href: "/academics",
          description: "Exam information",
        },
      ],
    },
    {
      title: "Research",
      links: [
        {
          label: "Research & Development",
          href: "/academics",
          description: "Research initiatives",
        },
        {
          label: "Publications",
          href: "/academics",
          description: "Academic publications",
        },
        {
          label: "Innovation",
          href: "/academics",
          description: "Projects and innovation",
        },
      ],
    },
  ],

  Admissions: [
    {
      title: "Start Here",
      links: [
        {
          label: "Admission Overview",
          href: "/admissions",
        },
        {
          label: "Programs Offered",
          href: "/admissions",
        },
        {
          label: "Eligibility",
          href: "/admissions",
        },
      ],
    },
    {
      title: "Information",
      links: [
        {
          label: "Fee Information",
          href: "/admissions",
        },
        {
          label: "Scholarships",
          href: "/admissions",
        },
        {
          label: "Counselling",
          href: "/admissions",
        },
      ],
    },
    {
      title: "Help",
      links: [
        {
          label: "Admission Notices",
          href: "/notices",
        },
        {
          label: "Contact",
          href: "/admissions",
        },
      ],
    },
  ],

  Departments: [
    {
      title: "Engineering",
      links: [
        {
          label: "Computer Science & Engineering",
          href: "/departments",
        },
        {
          label: "Information Technology",
          href: "/departments",
        },
        {
          label: "Electrical & Computer Engineering",
          href: "/departments",
        },
        {
          label: "Mechanical Engineering",
          href: "/departments",
        },
      ],
    },
    {
      title: "Computer Applications",
      links: [
        {
          label: "BCA",
          href: "/departments",
        },
        {
          label: "Computer Applications",
          href: "/departments",
        },
      ],
    },
    {
      title: "Management",
      links: [
        {
          label: "BBA",
          href: "/departments",
        },
        {
          label: "MBA",
          href: "/departments",
        },
      ],
    },
  ],

  Placements: [
    {
      title: "Placement Cell",
      links: [
        {
          label: "Placement Overview",
          href: "/placements",
        },
        {
          label: "Placement Process",
          href: "/placements",
        },
        {
          label: "Placement Notices",
          href: "/placements",
        },
      ],
    },
    {
      title: "Students",
      links: [
        {
          label: "Career Resources",
          href: "/placements",
        },
        {
          label: "Training",
          href: "/placements",
        },
        {
          label: "Placement Preparation",
          href: "/placements",
        },
      ],
    },
    {
      title: "Recruiters",
      links: [
        {
          label: "Recruiting Partners",
          href: "/placements",
        },
        {
          label: "Placement Contact",
          href: "/placements",
        },
      ],
    },
  ],

  "Campus Life": [
    {
      title: "Facilities",
      links: [
        {
          label: "Hostels",
          href: "/campus-life",
        },
        {
          label: "Library",
          href: "/campus-life",
        },
        {
          label: "Laboratories",
          href: "/campus-life",
        },
        {
          label: "Auditorium",
          href: "/campus-life",
        },
      ],
    },
    {
      title: "Student Life",
      links: [
        {
          label: "Clubs",
          href: "/campus-life",
        },
        {
          label: "Sports",
          href: "/campus-life",
        },
        {
          label: "Events",
          href: "/campus-life",
        },
      ],
    },
    {
      title: "Community",
      links: [
        {
          label: "NSS",
          href: "/campus-life",
        },
        {
          label: "NCC",
          href: "/campus-life",
        },
        {
          label: "Entrepreneurship",
          href: "/campus-life",
        },
      ],
    },
  ],
};


export const searchItems: SearchItem[] = [
  {
    title: "Complete JMIT Directory",
    description: "Search all imported JMIT institutional information.",
    category: "Directory",
    href: "/directory",
    keywords: ["everything", "all", "directory", "jmit", "information"],
  },
  {
    title: "Computer Science & Engineering",
    description: "Explore the CSE department, programs and resources.",
    category: "Department",
    href: "/departments",
    keywords: ["cse", "computer science", "engineering"],
  },
  {
    title: "Information Technology",
    description: "Explore the Information Technology department.",
    category: "Department",
    href: "/departments",
    keywords: ["it", "information technology", "engineering"],
  },
  {
    title: "Mechanical Engineering",
    description: "Explore Mechanical Engineering programs and resources.",
    category: "Department",
    href: "/departments",
    keywords: ["mechanical", "me"],
  },
  {
    title: "Electrical & Computer Engineering",
    description: "Explore electrical and computing studies.",
    category: "Department",
    href: "/departments",
    keywords: ["electrical", "ece", "computer engineering"],
  },
  {
    title: "B.Tech Programs",
    description: "View undergraduate engineering programs.",
    category: "Academics",
    href: "/academics",
    keywords: ["btech", "engineering", "degree"],
  },
  {
    title: "BCA",
    description: "Bachelor of Computer Applications.",
    category: "Academics",
    href: "/academics",
    keywords: ["bca", "computer applications"],
  },
  {
    title: "BBA",
    description: "Bachelor of Business Administration.",
    category: "Academics",
    href: "/academics",
    keywords: ["bba", "business"],
  },
  {
    title: "MBA",
    description: "Master of Business Administration.",
    category: "Academics",
    href: "/academics",
    keywords: ["mba", "management"],
  },
  {
    title: "Syllabus",
    description: "Find course curriculum and academic syllabus.",
    category: "Student Resource",
    href: "/academics",
    keywords: [
      "syllabus",
      "curriculum",
      "semester",
      "subjects",
      "course",
    ],
  },
  {
    title: "Time Table",
    description: "Find class schedules and academic timetable information.",
    category: "Student Resource",
    href: "/academics",
    keywords: ["timetable", "time table", "schedule", "classes"],
  },
  {
    title: "Academic Calendar",
    description: "Important academic dates and schedules.",
    category: "Academics",
    href: "/academics",
    keywords: ["calendar", "dates", "semester"],
  },
  {
    title: "Admissions",
    description: "Admission procedure, eligibility and program information.",
    category: "Admissions",
    href: "/admissions",
    keywords: [
      "admission",
      "apply",
      "eligibility",
      "counselling",
      "fees",
    ],
  },
  {
    title: "Scholarships",
    description: "Explore scholarship information.",
    category: "Admissions",
    href: "/admissions",
    keywords: ["scholarship", "financial", "fee"],
  },
  {
    title: "Placement Cell",
    description: "Placement resources, training and career opportunities.",
    category: "Placements",
    href: "/placements",
    keywords: [
      "placement",
      "jobs",
      "companies",
      "career",
      "recruitment",
    ],
  },
  {
    title: "Latest Notices",
    description: "Important announcements and institute updates.",
    category: "Notices",
    href: "/notices",
    keywords: [
      "notice",
      "announcement",
      "news",
      "latest",
      "update",
    ],
  },
  {
    title: "Library",
    description: "Library services and academic resources.",
    category: "Campus",
    href: "/campus-life",
    keywords: ["library", "books", "resources"],
  },
  {
    title: "Hostels",
    description: "Hostel and residential facility information.",
    category: "Campus",
    href: "/campus-life",
    keywords: [
      "hostel",
      "boys hostel",
      "girls hostel",
      "residence",
    ],
  },
  {
    title: "Sports",
    description: "Sports and recreation facilities.",
    category: "Campus",
    href: "/campus-life",
    keywords: ["sports", "games", "ground"],
  },
];


export const sectionPages = {
  academics: {
    eyebrow: "ACADEMICS",
    title: "Academic resources, simplified.",
    description:
      "Explore programs, curriculum, academic schedules and student resources through a clearer information architecture.",
    cards: [
      "Engineering Programs",
      "Computer Applications",
      "Management Programs",
      "Syllabus",
      "Time Table",
      "Academic Calendar",
    ],
  },

  admissions: {
    eyebrow: "ADMISSIONS",
    title: "Everything applicants need in one place.",
    description:
      "Programs, eligibility, counselling, scholarship and admission information will be organized into a single streamlined experience.",
    cards: [
      "Programs Offered",
      "Eligibility",
      "Admission Procedure",
      "Fee Information",
      "Scholarships",
      "Admission Notices",
    ],
  },

  departments: {
    eyebrow: "DEPARTMENTS",
    title: "Explore JMIT departments.",
    description:
      "A central directory for academic departments, faculty information, curriculum, laboratories and department resources.",
    cards: [
      "Computer Science & Engineering",
      "Information Technology",
      "Electrical & Computer Engineering",
      "Mechanical Engineering",
      "Computer Applications",
      "Management Studies",
    ],
  },

  placements: {
    eyebrow: "PLACEMENTS",
    title: "From campus to career.",
    description:
      "Placement information, training, opportunities and recruitment resources organized into a dedicated career portal.",
    cards: [
      "Placement Cell",
      "Placement Notices",
      "Training",
      "Career Resources",
      "Recruiting Partners",
      "Placement Contact",
    ],
  },

  "campus-life": {
    eyebrow: "CAMPUS LIFE",
    title: "Discover life beyond classrooms.",
    description:
      "Facilities, student communities, hostels, sports and campus activities available from one central destination.",
    cards: [
      "Hostels",
      "Library",
      "Sports",
      "Clubs",
      "Laboratories",
      "Student Activities",
    ],
  },

  notices: {
    eyebrow: "NOTICES",
    title: "Important information, without the clutter.",
    description:
      "This section will soon be connected directly to our database-backed notice management system.",
    cards: [
      "Academic Notices",
      "Admission Notices",
      "Placement Notices",
      "Examination Notices",
      "General Notices",
      "Archived Notices",
    ],
  },
} as const;

