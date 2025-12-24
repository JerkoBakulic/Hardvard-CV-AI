
import React from 'react';
import { JobAnalysis } from '../types';

interface InterviewCoachProps {
  analysis: JobAnalysis;
}

const InterviewCoach: React.FC<InterviewCoachProps> = ({ analysis }) => {
  return (
    <div className="space-y-8 no-print font-sans-ui">
      {/* Análisis de Industria */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-800 px-6 py-4">
          <h3 className="text-white font-bold text-lg flex items-center">
            <span className="mr-2">💡</span> Análisis de Industria y Cargo
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-blue-600 mb-2 uppercase text-[10px] tracking-widest">Sector</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{analysis.industry}</p>
            </div>
            <div>
              <h4 className="font-bold text-blue-600 mb-2 uppercase text-[10px] tracking-widest">Ajuste con el Rol</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{analysis.roleFit}</p>
            </div>
          </div>
          <div className="mt-8">
            <h4 className="font-bold text-blue-600 mb-2 uppercase text-[10px] tracking-widest">Keywords Clave para este Cargo</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords.map((k, i) => (
                <span key={i} className="bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200">
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tips de Entrevista */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h3 className="text-white font-bold text-lg flex items-center">
            <span className="mr-2">🎯</span> Tips de Entrevista
          </h3>
        </div>
        <div className="p-6">
          <ul className="space-y-4">
            {analysis.interviewTips.map((tip, i) => (
              <li key={i} className="flex items-start text-sm text-slate-600">
                <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                </div>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Preguntas Probables */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
          <h3 className="text-slate-800 font-bold text-lg flex items-center">
            <span className="mr-2">❓</span> Preguntas Probables
          </h3>
        </div>
        <div className="p-6 space-y-8">
          {analysis.commonQuestions.map((q, i) => (
            <div key={i} className="group border-b border-slate-100 last:border-0 pb-8 last:pb-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">Pregunta {i+1}</span>
              </div>
              <h5 className="font-bold text-slate-800 text-base mb-2 group-hover:text-blue-700 transition-colors">{q.question}</h5>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide mb-4 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Propósito: {q.purpose}
              </p>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 relative">
                <div className="absolute top-0 left-4 -translate-y-1/2 bg-white px-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 rounded">Respuesta Sugerida</div>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "{q.sampleAnswer}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewCoach;
