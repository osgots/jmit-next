export type NavigationLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavigationGroup = {
  title: string;
  links: NavigationLink[];
};

export const mainNavigation = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Academics",
    href: "/academics",
  },
  {
    label: "Admissions",
    href: "/admissions",
  },
  {
    label: "Departments",
    href: "/departments",
  },
  {
    label: "Placements",
    href: "/placements",
  },
  {
    label: "Campus Life",
    href: "/campus-life",
  },
];

export const megaMenus: Record<string, NavigationGroup[]> = {
  Academics: [
    {
      title: "Academics",
      links: [
        {
          label: "Academic Calendar",
          href: "/explore/academic-calendar",
        },
        {
          label: "Research & Development",
          href: "/directory?q=Research%20and%20Development",
        },
        {
          label: "Rules & Regulations",
          href: "/directory?q=Rules%20Regulations",
        },
      ],
    },
    {
      title: "Student Resources",
      links: [
        {
          label: "Time Tables",
          href: "/directory?q=Time%20Table",
        },
        {
          label: "Syllabus",
          href: "/directory?q=Syllabus",
        },
        {
          label: "Faculty",
          href: "/directory?q=Faculty",
        },
        {
          label: "Lesson Plans",
          href: "/directory?q=Lesson%20Plan",
        },
      ],
    },
    {
      title: "Programs",
      links: [
        {
          label: "B.Tech",
          href: "/departments",
        },
        {
          label: "BCA",
          href: "/explore/overview174",
        },
        {
          label: "BBA",
          href: "/explore/overview153",
        },
        {
          label: "MBA",
          href: "/explore/overview122",
        },
      ],
    },
  ],

  Admissions: [
    {
      title: "Apply",
      links: [
        {
          label: "Admission Procedure",
          href: "/explore/admission-procedure",
        },
        {
          label: "Courses & Intake",
          href: "/directory?q=Courses%20and%20Intake",
        },
        {
          label: "Admission Counselling",
          href: "/directory?q=Admission%20Counselling",
        },
      ],
    },
    {
      title: "Financial",
      links: [
        {
          label: "Fee Structure",
          href: "/directory?q=Fee%20Structure",
        },
        {
          label: "Scholarships",
          href: "/directory?q=Scholarships",
        },
        {
          label: "Study Loan",
          href: "/directory?q=Study%20Loan",
        },
      ],
    },
    {
      title: "Help",
      links: [
        {
          label: "Admission Notices",
          href: "/notices?category=Admissions",
        },
        {
          label: "Contact JMIT",
          href: "/directory?q=Contact%20Address",
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
          href: "/explore/overview",
        },
        {
          label: "Information Technology",
          href: "/explore/overview90",
        },
        {
          label: "Mechanical Engineering",
          href: "/explore/overview98",
        },
        {
          label: "Electrical & Computer Engineering",
          href: "/explore/overview114",
        },
      ],
    },
    {
      title: "Management",
      links: [
        {
          label: "MBA",
          href: "/explore/overview122",
        },
        {
          label: "BBA",
          href: "/explore/overview153",
        },
      ],
    },
    {
      title: "Computer Applications",
      links: [
        {
          label: "BCA",
          href: "/explore/overview174",
        },
        {
          label: "All Departments",
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
          label: "Placement Cell & Record",
          href: "/explore/placementcell-and-record",
        },
        {
          label: "Placement Rules",
          href: "/directory?q=Placement%20Rules",
        },
      ],
    },
    {
      title: "Industry",
      links: [
        {
          label: "Industry Interaction",
          href: "/directory?q=Industry%20Interaction",
        },
        {
          label: "Placement Associates",
          href: "/directory?q=Placement%20Associates",
        },
      ],
    },
    {
      title: "Results",
      links: [
        {
          label: "Placement Highlights",
          href: "/directory?q=Placement%20Highlights",
        },
        {
          label: "Placement Notices",
          href: "/notices?category=Placement",
        },
      ],
    },
  ],

  "Campus Life": [
    {
      title: "Facilities",
      links: [
        {
          label: "Hostel Accommodation",
          href: "/explore/hostel-accommodation",
        },
        {
          label: "Library",
          href: "/explore/library",
        },
        {
          label: "Internet Labs",
          href: "/directory?q=Internet%20Labs",
        },
        {
          label: "Auditorium",
          href: "/directory?q=Auditorium",
        },
      ],
    },
    {
      title: "Student Life",
      links: [
        {
          label: "Clubs & Societies",
          href: "/directory?q=Clubs%20Societies",
        },
        {
          label: "Sports",
          href: "/directory?q=Sports",
        },
        {
          label: "NCC / NSS",
          href: "/directory?q=NCC%20NSS",
        },
      ],
    },
    {
      title: "Innovation",
      links: [
        {
          label: "Entrepreneurship",
          href: "/directory?q=Entrepreneurship",
        },
        {
          label: "Startups",
          href: "/directory?q=Startups",
        },
        {
          label: "Career Counselling",
          href: "/directory?q=Career%20Counselling",
        },
      ],
    },
  ],
};
