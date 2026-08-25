export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: "Faculty Coordinators" | "Core Leadership" | "Advisory Board";
  bio: string;
  image: string;
  imagePosition?: string;
  imageScale?: number;
  badge?: string;
  email?: string;
  linkedin?: string;
  instagram?: string;
  initials: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  // Faculty Coordinators
  {
    id: "avichal-sharma",
    name: "Avichal Sharma",
    role: "Faculty Coordinator",
    category: "Faculty Coordinators",
    bio: "Guiding and mentoring the student team, fostering inclusivity, community engagement, and youth leadership across the campus.",
    image: "https://media.licdn.com/dms/image/v2/D4D03AQFbFlRd5qadyA/profile-displayphoto-scale_400_400/B4DZ33yKWWKgAg-/0/1777978617761?e=1788998400&v=beta&t=hyndOOQK-PfgiYNzusRY-j5WL4KwQ8BLKLwrQFMOM00", // Placeholder - user will upload image later
    email: "avichal.sharma@christuniversity.in",
    linkedin: "https://www.linkedin.com/in/avichal-sharma-eco01/",
    initials: "AS"
  },
  {
    id: "nishita-sharma",
    name: "Nishita Sharma",
    role: "Faculty Coordinator",
    category: "Faculty Coordinators",
    bio: "Supporting student initiatives to drive meaningful social impact, accessibility awareness, and institutional collaboration.",
    image: "https://kp.christuniversity.in/KnowledgePro/images/EmployeePhotos/E6079.jpg", // Placeholder - user will upload image later
    imagePosition: "center 15%",
    email: "nishita.sharma@christuniversity.in",
    linkedin: "https://www.linkedin.com/in/nishita-sharma-4a2901171/",
    initials: "NS"
  },
  // Core Leadership (Students)
  {
    id: "mayank-sharma",
    name: "Mayank Sharma",
    role: "President",
    category: "Core Leadership",
    bio: "Student leader directing the vision and operations of Inclusiverse, orchestrating flagship initiatives, partnerships, and championing the cause of inclusion.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6ywsa7uRI26sVNZ7wqPeaEdJ9BkRWQVEvfPslJXUbCw&s",
    imagePosition: "82% 90%",
    imageScale: 4.2,
    email: "mayank.sharma@inclusiverse.org",
    linkedin: "https://linkedin.com",
    initials: "MS"
  },
  {
    id: "nishita-gupta",
    name: "Nishita Gupta",
    role: "Secretary",
    category: "Core Leadership",
    bio: "Student leader overseeing administrative coordination, strategic communications, event planning, and student volunteer mobilization.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJCbGLzh63kFqiM3T4bUdwYObSTFV89RYE6cO0pjAoRlIbEHxir4QYY58&s=10",
    imagePosition: "72% 54%",
    imageScale: 2.3,
    email: "nishita.gupta@inclusiverse.org",
    linkedin: "https://linkedin.com",
    initials: "NG"
  },
  // Advisory Board (Students)
  {
    id: "nitya-gupta",
    name: "Nitya Gupta",
    role: "Advisory Board Member",
    category: "Advisory Board",
    bio: "Student advisor providing strategic guidance, youth advocacy, and mentorship to scale inclusive events and impactful community programs.",
    image: "https://media.licdn.com/dms/image/v2/D4D03AQEbboHe3pYm6Q/profile-displayphoto-shrink_200_200/B4DZaq019zGwAY-/0/1746622703820?e=2147483647&v=beta&t=Q1GUltj3K_33ECGkcHijNLAl5M0troqBv9SBRlM4UpY", // Placeholder - user will upload image later
    email: "nitya.gupta@inclusiverse.org",
    linkedin: "https://linkedin.com",
    initials: "NG"
  },
  {
    id: "ashish",
    name: "Ashish",
    role: "Advisory Board Member",
    category: "Advisory Board",
    bio: "Student advisor contributing to community outreach, student engagement, and logistics to expand the reach and accessibility of our social initiatives.",
    image: "https://media.licdn.com/dms/image/v2/D5603AQFrUz3Ul72dvQ/profile-displayphoto-scale_200_200/B56Z3DbfzyIUAY-/0/1777100261111?e=2147483647&v=beta&t=3AmHmvPKDOMie5mTyJNCUz9Hy1bplklpIIDx6FNRIno", // Placeholder - user will upload image later
    email: "ashish@inclusiverse.org",
    linkedin: "https://linkedin.com",
    initials: "A"
  },
  {
    id: "tanishq-saini",
    name: "Tanishq Saini",
    role: "Advisory Board Member",
    category: "Advisory Board",
    bio: "Student advisor guiding digital initiatives, technical infrastructure, creative storytelling, and continuous innovation for Inclusiverse.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCyUoANsrmMKLkl7NayHtPUzyUgGvKsGPYYDe-rZnuxQ&s", // Placeholder - user will upload image later
    email: "tanishq.saini@inclusiverse.org",
    linkedin: "https://linkedin.com",
    initials: "TS"
  }
];
