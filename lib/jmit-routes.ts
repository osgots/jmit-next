export const jmitRoutes: Record<string, string> = {
  // ==========================================================
  // HOMEPAGE QUICK ACCESS
  // ==========================================================

  "Notices":
    "/notices",

  "Time Table":
    "/resources/timetable",

  "Syllabus":
    "/resources/syllabus",

  "Library":
    "/explore/library",

  "Placements":
    "/explore/placementcell-and-record",

  "Departments":
    "/departments",


  // ==========================================================
  // AUDIENCE HUBS
  // ==========================================================

  "Students":
    "/audience/students",

  "Applicants":
    "/audience/applicants",

  "Parents":
    "/audience/parents",

  "Alumni":
    "/audience/alumni",


  // ==========================================================
  // DEPARTMENTS / PROGRAMS
  // ==========================================================

  "Computer Science & Engineering":
    "/explore/overview",

  "Information Technology":
    "/explore/overview90",

  "Mechanical Engineering":
    "/explore/overview98",

  "Electrical & Computer Engineering":
    "/explore/overview114",

  "Bachelor of Computer Applications":
    "/explore/overview174",

  "Master of Business Administration":
    "/explore/overview122",

  "BCA":
    "/explore/overview174",

  "BBA":
    "/explore/overview153",

  "MBA":
    "/explore/overview122",


  // ==========================================================
  // ACADEMICS
  // ==========================================================

  "Engineering Programs":
    "/directory?q=B.Tech",

  "Computer Applications":
    "/explore/overview174",

  "Management Programs":
    "/explore/overview122",

  "Management Studies":
    "/explore/overview122",

  "Academic Calendar":
    "/explore/academic-calendar",

  "Research & Development":
    "/explore/research-and-development-rd",

  "Publications":
    "/directory?q=Publications",

  "Innovation":
    "/directory?q=Innovation",


  // ==========================================================
  // ADMISSIONS
  // ==========================================================

  "Programs Offered":
    "/directory?q=Courses%20and%20Intake",

  "Eligibility":
    "/explore/admission-procedure",

  "Admission Overview":
    "/admissions",

  "Admission Procedure":
    "/explore/admission-procedure",

  "Fee Information":
    "/explore/fee-structure",

  "Fee Structure":
    "/explore/fee-structure",

  "Scholarships":
    "/explore/scholarships",

  "Counselling":
    "/explore/admission-counselling",

  "Admission Counselling":
    "/explore/admission-counselling",

  "Admission Notices":
    "/notices?category=Admissions",

  "Contact":
    "/explore/contact-address",

  "Contact JMIT":
    "/explore/contact-address",


  // ==========================================================
  // PLACEMENTS
  // ==========================================================

  "Placement Cell":
    "/explore/placementcell-and-record",

  "Placement Overview":
    "/explore/placementcell-and-record",

  "Placement Process":
    "/explore/placementcell-and-record",

  "Placement Notices":
    "/notices?category=Placement",

  "Placement Rules":
    "/directory?q=Placement%20Rules",

  "Placement Highlights":
    "/directory?q=Placement%20Highlights",

  "Training":
    "/directory?q=Training%20Placement",

  "Career Resources":
    "/directory?q=Career",

  "Placement Preparation":
    "/directory?q=Placement%20Preparation",

  "Recruiting Partners":
    "/directory?q=Placement%20Associates",

  "Placement Contact":
    "/explore/contact-address",

  "Industry Interaction":
    "/directory?q=Industry%20Interaction",

  "Placement Associates":
    "/directory?q=Placement%20Associates",


  // ==========================================================
  // CAMPUS LIFE
  // ==========================================================

  "Hostels":
    "/explore/hostel-accommodation",

  "Hostel Accommodation":
    "/explore/hostel-accommodation",

  "Sports":
    "/explore/sports",

  "Clubs":
    "/explore/clubssocieties",

  "Clubs & Societies":
    "/explore/clubssocieties",

  "Laboratories":
    "/directory?q=Laboratories",

  "Student Activities":
    "/directory?q=Student%20Activities",

  "Auditorium":
    "/directory?q=Auditorium",

  "Internet Labs":
    "/directory?q=Internet%20Labs",

  "NCC / NSS":
    "/directory?q=NCC%20NSS",

  "Entrepreneurship":
    "/directory?q=Entrepreneurship",


  // ==========================================================
  // NOTICE CATEGORIES
  // ==========================================================

  "Academic Notices":
    "/notices?category=Academic",

  "Examination Notices":
    "/notices?category=Examination",

  "General Notices":
    "/notices?category=General",

  "Archived Notices":
    "/notices",


  // ==========================================================
  // ALUMNI
  // ==========================================================

  "Alumni List":
    "/explore/alumni-list",

  "Registration Form":
    "/explore/registration-form",

  "Alumni Meet":
    "/directory?q=Alumni%20Meet",

  "Alumni Chapters":
    "/directory?q=Alumni%20Chapters",

  "Distinguished Alumni":
    "/directory?q=Distinguished%20Alumni",

  "Alumni Entrepreneurs":
    "/directory?q=Alumni%20Entrepreneurs",
};


export function routeForLabel(
  label: string,
) {
  return (
    jmitRoutes[label] ??
    `/directory?q=${encodeURIComponent(label)}`
  );
}
