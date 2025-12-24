
import React from 'react';
import { CVData } from '../types';

interface HarvardCVProps {
  data: CVData;
}

const HarvardCV: React.FC<HarvardCVProps> = ({ data }) => {
  return (
    <div 
      id="cv-to-download"
      className="cv-container bg-white shadow-2xl mx-auto p-12 md:p-16 min-h-[1050px] max-w-[800px] border border-slate-200 font-serif-cv text-[#0a0a0a] leading-relaxed print:shadow-none print:border-none print:p-0 print:m-0"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Header - Tradicional Harvard: Centrado, nombre en negrita grande */}
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold uppercase tracking-[0.15em] mb-2">{data.fullName}</h1>
        <div className="text-[11px] flex flex-wrap justify-center gap-x-2 text-slate-800 font-medium">
          <span>{data.location}</span>
          <span className="font-bold">•</span>
          <span>{data.phone}</span>
          <span className="font-bold">•</span>
          <a href={`mailto:${data.email}`} className="hover:underline">{data.email}</a>
          {data.linkedin && (
            <>
              <span className="font-bold">•</span>
              <span className="break-all">{data.linkedin.replace(/https?:\/\/(www\.)?/, '')}</span>
            </>
          )}
        </div>
      </div>

      {/* Education */}
      <section className="mb-8 avoid-page-break">
        <h2 className="text-sm font-bold uppercase border-b-[1.5px] border-black mb-3 tracking-wider pb-0.5">Educación</h2>
        {data.education.map((edu, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex justify-between font-bold text-[13px] leading-tight">
              <span>{edu.institution}</span>
              <span>{edu.location || ''}</span>
            </div>
            <div className="flex justify-between italic text-[12px] mt-0.5">
              <span>{edu.degree}</span>
              <span>{edu.graduationDate}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Experience */}
      <section className="mb-8">
        <h2 className="text-sm font-bold uppercase border-b-[1.5px] border-black mb-4 tracking-wider pb-0.5">Experiencia Profesional</h2>
        {data.experiences.map((exp, idx) => (
          <div key={idx} className="mb-6 avoid-page-break">
            <div className="flex justify-between font-bold text-[13px] leading-tight">
              <span>{exp.company}</span>
              <span>{exp.location}</span>
            </div>
            <div className="flex justify-between italic mb-2 text-[12px] mt-0.5">
              <span>{exp.role}</span>
              <span>{exp.startDate} – {exp.endDate}</span>
            </div>
            <ul className="list-disc ml-5 text-[12px] space-y-1.5 text-justify leading-snug">
              {exp.description.map((bullet, bIdx) => (
                <li key={bIdx} className="pl-1">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Skills & Additional Info */}
      <section className="avoid-page-break">
        <h2 className="text-sm font-bold uppercase border-b-[1.5px] border-black mb-3 tracking-wider pb-0.5">Información Adicional</h2>
        <div className="text-[12px] space-y-2">
          {data.skills.map((skill, idx) => (
            <div key={idx} className="flex">
              <span className="font-bold min-w-[120px]">{skill.category}: </span>
              <span className="flex-1 text-slate-800">{skill.items.join(', ')}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HarvardCV;