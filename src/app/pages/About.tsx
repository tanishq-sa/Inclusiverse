import React from "react";
import { m } from "motion/react";

export function About() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-surface py-24">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h1 className="text-5xl sm:text-6xl font-display font-bold text-text-main mb-6">
            Where Everyone <span className="text-primary">Belongs</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Inclusiverse is a student-led initiative at Christ University, Pune Lavasa Campus, built
            on a simple belief: everyone deserves to feel included, heard, respected, and valued.
          </p>
        </m.div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg max-w-none text-gray-700"
          >
            <p className="text-lg leading-relaxed">
              We are more than just a club. We are a community of students who believe that inclusion
              is not merely about creating opportunities for people—it is about{" "}
              <span className="font-semibold text-primary">
                creating spaces where people feel comfortable enough to participate, express
                themselves, discover their strengths, and simply be themselves.
              </span>
            </p>
            <p className="text-lg leading-relaxed mt-6">
              Our journey began with a vision to bridge gaps between people of different abilities,
              backgrounds, and experiences. Today, Inclusiverse works towards creating meaningful
              opportunities for{" "}
              <span className="font-semibold text-primary">
                specially-abled individuals and the wider community
              </span>{" "}
              through sports, cultural activities, awareness initiatives, creative events, and social
              engagement.
            </p>
          </m.div>
        </div>
      </section>

      {/* Our Purpose Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-display font-bold mb-8 text-text-main">Our Purpose</h2>
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <p className="text-lg font-semibold text-primary mb-6">
                We believe that differences should never become barriers.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Through our initiatives, we aim to challenge stereotypes, encourage empathy, and
                build a culture where accessibility and inclusion become a part of everyday life.
                Whether it is bringing specially-abled children to campus, organising inclusive games,
                conducting awareness activities, collaborating with schools and organisations, or
                creating platforms for students to express themselves, every initiative is driven by
                the same purpose—to make inclusion something we{" "}
                <span className="font-semibold">experience</span>, not just something we talk about.
              </p>
            </div>
          </m.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-display font-bold mb-6 text-text-main">What We Do</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              At Inclusiverse, we believe that change can happen through both big movements and small
              moments.
            </p>

            <div className="space-y-4 mb-8">
              {[
                "Inclusive sports and recreational activities that encourage participation, teamwork, and confidence.",
                "Cultural and creative initiatives that provide everyone with a platform to express themselves.",
                "Awareness and sensitisation programmes that encourage conversations around disability, accessibility, empathy, and equality.",
                "Community outreach initiatives in collaboration with schools, organisations, and individuals working towards inclusion.",
                "Student-led events and campaigns that turn ideas into meaningful action.",
                "Collaborative projects and competitions that use creativity, technology, and innovation to address real-world challenges.",
              ].map((item, index) => (
                <m.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-gray-700 leading-relaxed">{item}</p>
                </m.div>
              ))}
            </div>

            <p className="text-gray-700 leading-relaxed text-lg italic bg-surface p-6 rounded-2xl border-l-4 border-primary">
              From the <span className="font-semibold">State Unified Championship</span> and
              inclusive campus activities to our outreach initiatives and collaborations with
              organisations such as{" "}
              <span className="font-semibold">Special Olympics Bharat Maharashtra</span> and schools
              supporting specially-abled children, our work is rooted in participation, connection,
              and impact.
            </p>
          </m.div>
        </div>
      </section>

      {/* More Than Inclusion Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-display font-bold mb-8 text-text-main">
              More Than Inclusion
            </h2>
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl p-8 border border-primary/20">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                For us, inclusion is not about asking people to fit into an existing space.
              </p>
              <p className="text-xl font-semibold text-primary mb-6">
                It is about changing the space so that everyone has a place in it.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We want to create an environment where a person's ability does not define their
                opportunities, where differences are met with curiosity rather than judgement, and
                where every individual has the confidence to participate without feeling like an
                outsider.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mt-8 text-lg">
              We know that meaningful change does not happen overnight. It begins with awareness,
              grows through understanding, and becomes real through consistent action.
            </p>
          </m.div>
        </div>
      </section>

      {/* Our Community Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-display font-bold mb-8 text-text-main">Our Community</h2>
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Inclusiverse is powered by students who bring different ideas, talents, perspectives,
                and experiences to the table. It is a space where students learn not only how to
                organise events, but also how to listen, collaborate, understand different
                perspectives, and contribute to something larger than themselves.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Every volunteer, participant, collaborator, faculty member, and community partner
                becomes a part of our journey.
              </p>
              <p className="text-lg font-semibold text-primary bg-surface p-6 rounded-2xl">
                Because ultimately,{" "}
                <span className="text-gray-900">
                  Inclusiverse is not defined by the events we conduct. It is defined by the people we
                  bring together.
                </span>
              </p>
            </div>
          </m.div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-24 bg-gradient-to-b from-surface to-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 text-text-main">
              Our Vision
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-12">
              We envision a community where{" "}
              <span className="font-semibold text-primary">
                inclusion is the norm, accessibility is a shared responsibility, and every
                individual has the opportunity to participate, grow, and thrive.
              </span>
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              We are working towards a future where no one has to ask,{" "}
              <span className="italic font-medium">"Do I belong here?"</span>
            </p>
            <p className="text-lg text-gray-700 mb-12">Because the answer should always be:</p>
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-primary text-white text-3xl md:text-4xl font-display font-bold py-8 px-6 rounded-3xl shadow-lg mb-12"
            >
              Yes. You do.
            </m.div>
            <p className="text-gray-600 text-lg italic">
              <span className="font-semibold text-primary">Inclusiverse</span> — Different abilities.
              Different stories. One community.
            </p>
          </m.div>
        </div>
      </section>
    </div>
  );
}
