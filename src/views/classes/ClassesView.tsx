import React from 'react';
import { ClassesPage, Product } from '../../types';
import { teacherProfileData } from '../../data/teacherProfile';
import { ProductCard } from '../../components/ProductCard';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  CheckCircle2,
  Users,
  Video,
  FileCheck2,
  Mail,
  HelpCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface ClassesViewProps {
  currentPage: ClassesPage;
  onNavigate: (page: ClassesPage) => void;
  products: Product[];
  onPreviewProduct: (product: Product) => void;
  onOpenEnquiry: () => void;
}

export const ClassesView: React.FC<ClassesViewProps> = ({
  currentPage,
  onNavigate,
  products,
  onPreviewProduct,
  onOpenEnquiry,
}) => {
  // Only products marked visible for classes and published
  const classVisibleProducts = products.filter(
    (p) => p.visibility.classes && p.publicationStatus === 'published'
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Visual Identity Hero Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-md overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-medium">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Online Mathematics Coaching for Secondary & Senior Secondary</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Aakushi Classes: Concept-First Mathematics Coaching
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {teacherProfileData.teachingApproach.philosophy}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenEnquiry}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Submit Coaching Enquiry</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('resources')}
              className="px-4 py-2.5 text-xs sm:text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Explore Selected Resources ({classVisibleProducts.length})</span>
            </button>
          </div>

          {/* Current Availability Badge */}
          <div className="pt-2 flex items-center gap-2 text-xs text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">{teacherProfileData.availabilityStatus}:</span>
            <span className="text-slate-300">{teacherProfileData.availabilityDetails}</span>
          </div>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      </div>

      {/* PAGE: HOME */}
      {currentPage === 'home' && (
        <div className="space-y-10">
          {/* 3 Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Micro-Batch Attention</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Small focused groups of maximum 6 to 8 students ensure no student gets lost in a crowd, allowing active question-solving and immediate doubt intervention.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Handwritten Step Annotations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every homework submission and diagnostic test is reviewed with handwritten digital markup identifying where algebraic signs, reasoning, or geometry diagrams need precision.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Original Graded Worksheets</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students receive curated worksheets directly from the Aakushi Central Educational Library with Level 1 (Basics), Level 2 (Application), and Level 3 (Exemplar/HOTS).
              </p>
            </div>
          </div>

          {/* Quick Teacher Intro Preview */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-600">
                Meet the Teacher
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Systematic Problem Solving for CBSE & ICSE Mathematics
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Teaching Classes 9, 10, 11, and 12 with a strict focus on understanding core principles rather than shortcut formulas. Learn more about the pedagogy, classroom tools, and schedule policy.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={() => onNavigate('about')}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer text-center"
              >
                Teacher Profile & Background
              </button>
              <button
                onClick={() => onNavigate('coaching')}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer text-center"
              >
                Coaching Format & Batches
              </button>
            </div>
          </div>

          {/* Featured Selected Resources from Library */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Selected Classroom Resources</h3>
                <p className="text-xs text-slate-500">
                  Materials curated from the Central Library for active coaching batches
                </p>
              </div>
              <button
                onClick={() => onNavigate('resources')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({classVisibleProducts.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {classVisibleProducts.slice(0, 3).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPreview={onPreviewProduct}
                  variant="classes"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PAGE: ABOUT THE TEACHER */}
      {currentPage === 'about' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Teacher Profile
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Mathematics Teacher & Content Author
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Note: Factual presentation of teaching subjects, curriculums, and instructional format. No unverified claims or marketing hype.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">Subjects & Specialization</h4>
                <p className="text-slate-600 leading-relaxed">
                  {teacherProfileData.primarySubject} — {teacherProfileData.specialization}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">Classes Taught</h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {teacherProfileData.classesTaught.map((cls) => (
                    <span key={cls} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md font-medium">
                      {cls}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">Curriculums Covered</h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {teacherProfileData.boardCurriculums.map((board) => (
                    <span key={board} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md font-medium">
                      {board}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs bg-slate-50 p-5 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-800 text-sm">Instructional Commitment</h4>
              <p className="text-slate-600 leading-relaxed">
                As a teacher who creates all educational worksheets and question papers from scratch, materials used in class reflect real syllabus changes and board exam patterns.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">All materials are original PDFs with verified step-by-step solutions.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Classes are strictly limited to micro-batches so individual work is inspected.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Diagnostic gap-analysis conducted before starting advanced topics.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE: TEACHING APPROACH */}
      {currentPage === 'approach' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Teaching Philosophy & Pedagogy
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              How Mathematics is Taught at Aakushi Classes
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Guiding students from conceptual intuition to clean, exam-ready mathematical reasoning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {teacherProfileData.teachingApproach.corePrinciples.map((principle, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Pillar 0{idx + 1}
                </span>
                <h3 className="font-bold text-slate-900 text-sm">{principle.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{principle.description}</p>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-3 text-xs">
            <h4 className="font-bold text-indigo-950 text-sm">Classroom Pace & Doubt Clearing Method</h4>
            <p className="text-indigo-900 leading-relaxed">
              {teacherProfileData.teachingApproach.classroomPacing}
            </p>
            <p className="text-indigo-900 leading-relaxed">
              {teacherProfileData.teachingApproach.doubtClearingMethod}
            </p>
          </div>
        </div>
      )}

      {/* PAGE: ONLINE COACHING FORMAT */}
      {currentPage === 'coaching' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Coaching Structure
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Online Mathematics Coaching Batches
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Live, interactive classes with dedicated digital stylus whiteboarding and structured practice schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div className="p-5 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                Batch Type & Size
              </h4>
              <p className="text-slate-600">{teacherProfileData.onlineCoachingFormat.batchType}</p>
              <p className="text-slate-800 font-semibold">{teacherProfileData.onlineCoachingFormat.batchSize}</p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Video className="w-4 h-4 text-emerald-600" />
                Delivery Platform
              </h4>
              <p className="text-slate-600">{teacherProfileData.onlineCoachingFormat.platform}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 text-sm">Instructional Tools & Student Workflow</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {teacherProfileData.onlineCoachingFormat.toolsUsed.map((tool, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="text-slate-700">{tool}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <h5 className="font-bold">Homework & Practice Commitment</h5>
            <p>{teacherProfileData.onlineCoachingFormat.homeworkPolicy}</p>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onOpenEnquiry}
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Enquire for an Available Batch
            </button>
          </div>
        </div>
      )}

      {/* PAGE: STUDENT LEARNING SUPPORT */}
      {currentPage === 'support' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Support Mechanisms
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Student Learning Support & Parent Updates
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Structured diagnostic testing, regular feedback cycles, and transparent parent communication.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-800 text-sm">1. Diagnostic Initial Assessment</h4>
              <p className="text-slate-600 leading-relaxed">
                {teacherProfileData.studentSupport.diagnosticAssessment}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-800 text-sm">2. Personalized Assignment Correction</h4>
              <p className="text-slate-600 leading-relaxed">
                {teacherProfileData.studentSupport.personalizedCorrection}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-800 text-sm">3. Parent Communication & Progress Feedback</h4>
              <p className="text-slate-600 leading-relaxed">
                {teacherProfileData.studentSupport.parentCommunication}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-800 text-sm">4. Revision & Mock Board Structure</h4>
              <p className="text-slate-600 leading-relaxed">
                {teacherProfileData.studentSupport.revisionStructure}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PAGE: SELECTED RESOURCES */}
      {currentPage === 'resources' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900">Selected Educational Resources</h2>
            <p className="text-xs text-slate-500 mt-1">
              These worksheets and test papers from the Central Educational Library are selected to support our active coaching curricula.
            </p>
          </div>

          {classVisibleProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              No products are currently marked visible for Aakushi Classes. Toggle visibility in the Admin Dashboard.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {classVisibleProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onPreview={onPreviewProduct}
                  variant="classes"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* PAGE: CONTACT */}
      {currentPage === 'contact' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Get in Touch
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Contact & Coaching Enquiries</h2>
            <p className="text-xs text-slate-500 mt-1">
              Parents and students may submit batch enquiries or contact via official channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-sm">Working Hours & Response Time</h4>
                <p className="text-slate-600">{teacherProfileData.contactMethods.workingHours}</p>
                <p className="text-slate-600">{teacherProfileData.contactMethods.responseTime}</p>
                <p className="text-slate-500 text-[11px] pt-1">
                  Email: {teacherProfileData.contactMethods.email}
                </p>
              </div>

              <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
                <h4 className="font-bold text-indigo-900 text-sm">How Enquiries are Handled</h4>
                <p className="text-indigo-950 leading-relaxed">
                  Once you submit an enquiry, it is instantly filed in the Teacher Admin Dashboard. We review the student's current grade and topics of difficulty before scheduling a brief introductory call.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center space-y-4 flex flex-col items-center justify-center">
              <Mail className="w-10 h-10 text-indigo-600" />
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-base">Submit an Enquiry Online</h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  Fill out the 1-minute student intake form with class level and topic needs.
                </p>
              </div>
              <button
                onClick={onOpenEnquiry}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Open Coaching Enquiry Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
