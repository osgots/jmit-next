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
      title: "Academic Resources",
      links: [
        {
          label: "Academic Calendar",
          href: "/explore/academic-calendar",
          description: "Official academic schedules",
        },
        {
          label: "Time Tables",
          href: "/resources/timetable",
          description: "Department-wise class schedules",
        },
        {
          label: "Syllabus",
          href: "/resources/syllabus",
          description: "Department-wise curriculum",
        },
        {
          label: "Research & Development",
          href: "/explore/research-and-development-rd",
          description: "Research initiatives",
        },
      ],
    },

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
      title: "Other Programs",
      links: [
        {
          label: "MBA",
          href: "/explore/overview122",
        },
        {
          label: "BBA",
          href: "/explore/overview153",
        },
        {
          label: "BCA",
          href: "/explore/overview174",
        },
      ],
    },
  ],

  Admissions: [
    {
      title: "Admissions",
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
          label: "Fee Structure",
          href: "/explore/fee-structure",
        },
      ],
    },

    {
      title: "Student Support",
      links: [
        {
          label: "Admission Counselling",
          href: "/explore/admission-counselling",
        },
        {
          label: "Scholarships",
          href: "/explore/scholarships",
        },
        {
          label: "Admission Notices",
          href: "/notices?category=Admissions",
        },
      ],
    },

    {
      title: "Contact",
      links: [
        {
          label: "Contact Address",
          href: "/explore/contact-address",
        },
        {
          label: "All Admission Information",
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
      title: "Training & Placement",
      links: [
        {
          label: "Placement Cell & Record",
          href: "/explore/placementcell-and-record",
        },
        {
          label: "Placement Rules",
          href: "/directory?q=Placement%20Rules",
        },
        {
          label: "Placement Highlights",
          href: "/directory?q=Placement%20Highlights",
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
      title: "Updates",
      links: [
        {
          label: "Placement Notices",
          href: "/notices?category=Placement",
        },
        {
          label: "All Placement Information",
          href: "/placements",
        },
      ],
    },
  ],

  "Campus Life": [
    {
      title: "Infrastructure",
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
      title: "Students",
      links: [
        {
          label: "Clubs & Societies",
          href: "/explore/clubssocieties",
        },
        {
          label: "Sports",
          href: "/explore/sports",
        },
        {
          label: "NCC / NSS",
          href: "/directory?q=NCC%20NSS",
        },
      ],
    },

    {
      title: "Explore",
      links: [
        {
          label: "Campus Life",
          href: "/campus-life",
        },
        {
          label: "Career Counselling",
          href: "/directory?q=Career%20Counselling",
        },
      ],
    },
  ],
};
