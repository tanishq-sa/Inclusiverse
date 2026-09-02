import React, { useState } from "react";
import { 
  Linkedin, 
  Instagram, 
  ArrowRight
} from "lucide-react";
import { m } from "motion/react";
import { TEAM_MEMBERS, TeamMember } from "../../data/team";
import type { Page } from "../App";

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const [imgError, setImgError] = useState(false);
  const hasValidImage = Boolean(member.image && member.image.trim() !== "" && !imgError);

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center group"
    >
      {/* Avatar Container with Clean Placeholder */}
      <div className="relative mb-4 w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 bg-surface border-2 border-gray-100 group-hover:border-primary/30 transition-colors duration-300">
        <div className="w-full h-full rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
          {hasValidImage ? (
            <img
              src={member.image}
              alt={member.name}
              onError={() => setImgError(true)}
              style={{
                objectPosition: member.imagePosition || "center 15%",
                transform: member.imageScale ? `scale(${member.imageScale})` : undefined,
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-surface select-none">
              <span className="text-3xl font-bold font-display text-primary tracking-wider">
                {member.initials}
              </span>
              <span className="text-[10px] uppercase font-medium text-gray-400 tracking-wider mt-1">
                Photo
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Name and Role */}
      <h3 className="text-xl font-display font-bold text-text-main">
        {member.name}
      </h3>
      <p className="text-sm font-medium text-primary mt-1 mb-3">
        {member.role}
      </p>

      {/* Bio */}
      <p className="text-sm text-gray-600 leading-relaxed mb-6">
        {member.bio}
      </p>

      {/* Social Links (LinkedIn & Instagram) */}
      {(member.linkedin || member.instagram) && (
        <div className="mt-auto pt-4 border-t border-gray-100 w-full flex items-center justify-center gap-3">
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              title={`${member.name} on LinkedIn`}
              className="w-9 h-9 rounded-full bg-surface hover:bg-primary hover:text-white border border-gray-200 flex items-center justify-center text-gray-600 transition-colors duration-200"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {member.instagram && (
            <a
              href={member.instagram}
              target="_blank"
              rel="noopener noreferrer"
              title={`${member.name} on Instagram`}
              className="w-9 h-9 rounded-full bg-surface hover:bg-primary hover:text-white border border-gray-200 flex items-center justify-center text-gray-600 transition-colors duration-200"
            >
              <Instagram className="w-4 h-4" />
            </a>
          )}
        </div>
      )}
    </m.div>
  );
}

export function TeamPage({ onNavigate }: { onNavigate?: (page: Page) => void }) {
  const facultyMembers = TEAM_MEMBERS.filter(
    (m) => m.category === "Faculty Coordinators"
  );
  const leadershipMembers = TEAM_MEMBERS.filter(
    (m) => m.category === "Core Leadership"
  );
  const advisoryMembers = TEAM_MEMBERS.filter(
    (m) => m.category === "Advisory Board"
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-surface py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl sm:text-6xl font-display font-bold text-text-main mb-6">
              Meet the <span className="text-primary">Team</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Inclusiverse is a 100% student-led initiative at Christ University, Pune Lavasa Campus. Our entire team consists of passionate student leaders and advisors driven to make inclusion a reality, guided by our dedicated faculty mentors.
            </p>
          </m.div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Faculty Coordinators Section */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-text-main mb-3">
                Faculty Coordinators
              </h2>
              <p className="text-gray-600 text-sm max-w-xl mx-auto leading-relaxed">
                Providing institutional mentorship, guidance, and unwavering support to our student-led chapter.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {facultyMembers.map((member, idx) => (
                <MemberCard key={member.id} member={member} index={idx} />
              ))}
            </div>
          </div>

          {/* Core Student Leadership Section */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-text-main mb-3">
                Student Leadership
              </h2>
              <p className="text-gray-600 text-sm max-w-xl mx-auto leading-relaxed">
                Student leaders spearheading day-to-day operations, flagship campus events, and community mobilization.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {leadershipMembers.map((member, idx) => (
                <MemberCard key={member.id} member={member} index={idx} />
              ))}
            </div>
          </div>

          {/* Student Advisory Board Section */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-text-main mb-3">
                Student Advisory Board
              </h2>
              <p className="text-gray-600 text-sm max-w-xl mx-auto leading-relaxed">
                Student advisors guiding long-term strategy, youth outreach, and digital platforms for sustainable impact.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {advisoryMembers.map((member, idx) => (
                <MemberCard key={member.id} member={member} index={idx} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Purpose / Value Highlight Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6 text-text-main">
              Driven by Students, Guided by Purpose
            </h2>
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100 text-left">
              <p className="text-lg font-semibold text-primary mb-4">
                "Inclusiverse is not defined by the events we conduct. It is defined by the people we bring together."
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                From sports championships to creative expression drives, every milestone is conceptualized, organized, and executed by student volunteers under the mentorship of our faculty coordinators.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500 font-medium">
                  Want to join our student volunteer team?
                </span>
                <button
                  onClick={() => onNavigate && onNavigate("join")}
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm inline-flex items-center gap-2 text-sm"
                >
                  <span>Join Our Movement</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </m.div>
        </div>
      </section>
    </div>
  );
}

export default TeamPage;
