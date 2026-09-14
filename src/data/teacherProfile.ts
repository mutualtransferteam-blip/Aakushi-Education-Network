export interface TeacherProfile {
  title: string;
  name: string;
  role: string;
  primarySubject: string;
  specialization: string;
  classesTaught: string[];
  boardCurriculums: string[];
  teachingApproach: {
    philosophy: string;
    corePrinciples: { title: string; description: string }[];
    classroomPacing: string;
    doubtClearingMethod: string;
  };
  onlineCoachingFormat: {
    batchType: string;
    batchSize: string;
    platform: string;
    toolsUsed: string[];
    scheduleNotice: string;
    homeworkPolicy: string;
  };
  studentSupport: {
    diagnosticAssessment: string;
    personalizedCorrection: string;
    parentCommunication: string;
    revisionStructure: string;
  };
  availabilityStatus: string;
  availabilityDetails: string;
  contactMethods: {
    email: string;
    whatsappNote: string;
    workingHours: string;
    responseTime: string;
  };
}

export const teacherProfileData: TeacherProfile = {
  title: "Independent Mathematics Educator",
  name: "Teacher (Profile Placeholder - Set in Admin)",
  role: "Mathematics Teacher & Educational Content Creator",
  primarySubject: "Mathematics",
  specialization: "Conceptual Foundations, Step-by-Step Derivations, and Systematic Problem-Solving",
  classesTaught: ["Class 9", "Class 10", "Class 11", "Class 12"],
  boardCurriculums: ["CBSE", "ICSE", "State Boards"],
  teachingApproach: {
    philosophy:
      "Mathematics is learned by doing and understanding the 'why' behind formulas, not through rote memorization. Every worksheet and lesson is structured to build confidence from first principles before advancing to complex multi-step problems.",
    corePrinciples: [
      {
        title: "From Concrete to Abstract",
        description: "Introducing geometrical or algebraic intuition before mechanical symbol manipulation.",
      },
      {
        title: "Error-Analysis as Learning",
        description: "Carefully pointing out common student traps and misconceptions rather than just penalizing mistakes.",
      },
      {
        title: "Systematic Step-by-Step Rigor",
        description: "Training students to write clean mathematical working suitable for board examiners.",
      },
      {
        title: "Self-Paced Practice Scaffolding",
        description: "Progressive difficulty gradations: Level 1 (Fundamentals), Level 2 (Application), Level 3 (Exemplar/HOTS).",
      },
    ],
    classroomPacing:
      "Interactive sessions with live digital whiteboarding, synchronous question-solving intervals, and immediate clarification of foundational doubts.",
    doubtClearingMethod:
      "Dedicated doubt window after each lesson topic, plus written step-by-step corrections on submitted homework PDFs.",
  },
  onlineCoachingFormat: {
    batchType: "Micro-Batches (Focus on Individual Student Attention)",
    batchSize: "Maximum 6–8 students per batch",
    platform: "Live Interactive Video via Google Meet / Zoom with Digital Pen Tablet",
    toolsUsed: [
      "High-resolution digital stylus whiteboard",
      "Printable companion worksheets provided 24 hours prior to class",
      "Class PDF annotation notes shared immediately after every session",
      "Weekly diagnostic checkpoint tests",
    ],
    scheduleNotice: "Batches run on weekday evenings and weekend mornings.",
    homeworkPolicy:
      "Structured 30-minute practice assignment after every session with answer keys provided after submission.",
  },
  studentSupport: {
    diagnosticAssessment:
      "Initial 25-minute diagnostic test to identify foundational gaps in prior-year prerequisite topics.",
    personalizedCorrection:
      "Each submitted worksheet receives handwritten digital annotations indicating where signs, steps, or units were missed.",
    parentCommunication:
      "Bi-weekly progress summaries covering attendance, assignment completion, and accuracy trends.",
    revisionStructure:
      "Spaced revision cycles 2 weeks before periodic tests and full mock tests simulated under strict board time limits.",
  },
  availabilityStatus: "Admissions Open for Next Term Batches",
  availabilityDetails: "Limited seats available for Class 10 & Class 12 Board batches. Class 9 foundations open for enrolment.",
  contactMethods: {
    email: "teacher@aakushieducation.network (Placeholder)",
    whatsappNote: "Enquiry form submissions are directly routed and responded to within 24 hours.",
    workingHours: "Monday to Saturday, 4:00 PM – 8:30 PM IST",
    responseTime: "Within 24 hours on working days",
  },
};
