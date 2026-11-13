/*
  YOUR PROJECTS
  -------------
  One { ... } block per project. The order here is the order on the page.

  image     : a screenshot in images/projects/ (1600 x 1000 px, .jpg or .webp).
              It is shown inside a browser window frame.
  live/code : links. The live link (or the code link) is shown in the window's address bar.
              Leave as "" to hide one.
  category  : used for the filter tabs, like "Web app", "Mobile" or "Tool".
  featured  : true shows it larger at the top. Use it on one project.
  mock      : only for the sample projects. It draws a stand-in screen until
              the screenshot exists. Delete it once you add a real image.
*/

window.PROJECTS = [
  {
    title: "Tiffin",
    year: "2026",
    role: "Solo, ongoing",
    category: "Web app",
    featured: true,
    image: "images/projects/tiffin.jpg",
    mock: "tiffin",
    description:
      "Orders, pauses and payments for a home kitchen that sends lunch to about 60 families a day. It replaced a notebook, a WhatsApp group and most of the phone calls.",
    tags: ["Next.js", "PostgreSQL", "Prisma", "Razorpay"],
    live: "https://tiffin.example.com",
    code: "https://github.com/your-username/tiffin"
  },
  {
    title: "Queueless",
    year: "2025",
    role: "Solo",
    category: "Web app",
    image: "images/projects/queueless.jpg",
    mock: "queueless",
    description:
      "A token display for a small clinic. The receptionist taps one button, the waiting-room TV updates, and patients stop crowding the desk to ask how many are left.",
    tags: ["React", "Node.js", "WebSockets", "SQLite"],
    live: "",
    code: "https://github.com/your-username/queueless"
  },
  {
    title: "Mess Feedback",
    year: "2025",
    role: "Team of 3",
    category: "Mobile",
    image: "images/projects/mess-feedback.jpg",
    mock: "mess",
    description:
      "A hostel app for rating meals and reporting problems. Built at a hackathon, then kept running for two semesters because the warden read the weekly summary.",
    tags: ["React Native", "Express", "MongoDB"],
    live: "",
    code: "https://github.com/your-username/mess-feedback"
  },
  {
    title: "Paperboy",
    year: "2024",
    role: "Solo",
    category: "Tool",
    image: "images/projects/paperboy.jpg",
    mock: "paperboy",
    description:
      "A command-line tool that collects my RSS feeds every morning and prints them into one PDF I read with breakfast. My first Go project.",
    tags: ["Go", "CLI"],
    live: "",
    code: "https://github.com/your-username/paperboy"
  }
];
