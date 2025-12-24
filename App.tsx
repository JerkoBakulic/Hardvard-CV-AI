
import React, { useState } from 'react';
import { AppState, CVData, JobAnalysis } from './types';
import { processUnifiedData } from './services/geminiService';
import HarvardCV from './components/HarvardCV';
import InterviewCoach from './components/InterviewCoach';

// Declaración para el objeto global de html2pdf
declare var html2pdf: any;

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('input');
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  
  const [targetRole, setTargetRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [isConfidential, setIsConfidential] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'cv' | 'coach'>('cv');

  const startProcessing = async (input: string, isImage: boolean = false) => {
    if (!input.trim() && !isImage) return;
    if (!targetRole.trim()) {
      setError("Por favor, ingresa el cargo al que postulas.");
      return;
    }
    
    setState('processing');
    setError(null);
    try {
      const result = await processUnifiedData(input, targetRole, companyName, industry, isConfidential, isImage);
      setCvData(result.cv);
      setAnalysis(result.analysis || null);
      setState('result');
      setActiveTab('cv');
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al procesar tu información. Intenta ser más descriptivo.");
      setState('input');
    }
  };

  const loadExample = () => {
    setUserInput(`Roberto Gómez, Ingeniero Civil Industrial con 5 años de experiencia en gestión de operaciones. Trabajé en Logística Global como analista de datos mejorando rutas un 12%. Sé usar Python, Tableau y hablo inglés fluido.`);
    setTargetRole('Data Scientist Senior');
    setCompanyName('Google');
    setIndustry('Tecnología / Big Data');
    setIsConfidential(false);
  };

  const handleDownloadPDF = async () => {
    if (!cvData) return;
    
    const wasInCoach = activeTab === 'coach';
    if (wasInCoach) setActiveTab('cv');
    
    setIsExporting(true);
    
    // Esperar un momento para asegurar que las fuentes estén renderizadas
    setTimeout(() => {
      const element = document.getElementById('cv-to-download');
      if (!element) {
        alert("Error al encontrar el contenido del CV");
        setIsExporting(false);
        return;
      }

      const opt = {
        margin: [5, 5, 5, 5],
        filename: `CV_Harvard_${cvData.fullName.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
          scale: 4, // Ultra alta resolución para que el texto sea nítido
          useCORS: true, 
          letterRendering: true,
          logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().from(element).set(opt).save().then(() => {
        setIsExporting(false);
        if (wasInCoach) setActiveTab('coach');
      }).catch((err: any) => {
        console.error("PDF Error:", err);
        setIsExporting(false);
        alert("Ocurrió un error. Si el problema persiste, usa el menú de impresión (Ctrl+P) y selecciona 'Guardar como PDF'.");
      });
    }, 800);
  };

  if (state === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Diseñando tu perfil...</h2>
          <p className="text-sm text-slate-500 italic font-medium">Optimizando CV para "{targetRole}"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans-ui text-slate-900">
      {isExporting && (
        <div className="fixed inset-0 z-[200] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in text-center p-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h3 className="font-bold text-xl text-slate-800 mb-2">Exportando en Alta Resolución</h3>
          <p className="text-slate-500 max-w-xs mx-auto">Estamos procesando tu CV con tipografía premium Harvard. Esto tomará solo unos segundos...</p>
        </div>
      )}

      <header className="bg-white border-b border-slate-200 py-4 px-6 no-print sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setState('input')}>
            <div className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">H</div>
            <span className="font-bold text-slate-800 tracking-tight">Harvard CV AI</span>
          </div>
          {state === 'result' && (
            <div className="flex gap-3 items-center">
              <button onClick={() => setState('input')} className="text-sm font-bold text-slate-500 px-3 py-1 hover:text-blue-600 transition-colors">Modificar</button>
              <button 
                onClick={handleDownloadPDF}
                className="bg-blue-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-100 flex items-center gap-2 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Descargar PDF
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-10">
        {state === 'input' ? (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Crea tu CV de Élite</h1>
              <p className="text-slate-500 text-base font-medium">Transformamos tu experiencia al formato Harvard en segundos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all">
                <label className="block text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-3">Cargo Objetivo</label>
                <input 
                  type="text" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="Ej: Gerente de Ventas"
                  className="w-full text-sm font-semibold text-slate-800 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                />
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-[10px] font-bold text-blue-700 uppercase tracking-widest">Empresa</label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={isConfidential}
                      onChange={(e) => setIsConfidential(e.target.checked)}
                      className="w-3 h-3 rounded-full border-2 border-slate-300 checked:bg-blue-600 checked:border-blue-600 appearance-none cursor-pointer transition-all focus:ring-2 focus:ring-blue-100"
                    />
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors">Confidencial</span>
                  </label>
                </div>
                <input 
                  type="text" 
                  disabled={isConfidential}
                  value={isConfidential ? 'Confidencial' : companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ej: Amazon"
                  className={`w-full text-sm font-semibold text-slate-800 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all ${isConfidential ? 'opacity-40 cursor-not-allowed' : ''}`}
                />
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all">
                <label className="block text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-3">Industria</label>
                <input 
                  type="text" 
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Ej: Finanzas / IT"
                  className="w-full text-sm font-semibold text-slate-800 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
              <div className="p-1 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contenido del CV</span>
                  <button onClick={loadExample} className="text-[10px] font-bold text-blue-600 uppercase hover:text-blue-800 underline underline-offset-4 transition-all">Ejemplo</button>
                </div>
              </div>
              
              <textarea 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Escribe tu trayectoria o pega tu CV antiguo aquí..."
                className="w-full h-80 p-8 text-base border-none focus:ring-0 outline-none resize-none placeholder:text-slate-300 leading-relaxed bg-white text-slate-700 font-medium"
              />
              
              <div className="p-6 bg-slate-50/20 border-t border-slate-100">
                <button 
                  onClick={() => startProcessing(userInput)}
                  disabled={!userInput.trim() || !targetRole.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold text-base transition-all shadow-xl shadow-blue-100 disabled:opacity-30 flex items-center justify-center gap-3 active:scale-95"
                >
                  Generar CV Profesional
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 animate-fade-in">
                <p className="text-xs text-red-600 font-bold uppercase">{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-center no-print gap-3">
              <button 
                onClick={() => setActiveTab('cv')}
                className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'cv' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-200'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                CV Harvard
              </button>
              <button 
                onClick={() => setActiveTab('coach')}
                className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'coach' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-200'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Coach de Carrera
              </button>
            </div>

            <div className={`${activeTab === 'cv' ? 'block' : 'hidden'} print:block`}>
              {cvData && <HarvardCV data={cvData} />}
            </div>
            
            <div className={`${activeTab === 'coach' ? 'block' : 'hidden'} max-w-3xl mx-auto no-print`}>
              {analysis && <InterviewCoach analysis={analysis} />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
