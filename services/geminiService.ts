
import { GoogleGenAI, Type } from "@google/genai";
import { UnifiedResponse } from "../types";

const API_KEY = process.env.API_KEY || "";

/**
 * Procesa TODO en una sola llamada: extracción, optimización Harvard y Coaching.
 * Se han añadido parámetros específicos para Empresa y Rubro para un coaching quirúrgico.
 */
export const processUnifiedData = async (
  input: string, 
  targetRole: string,
  companyName: string,
  industry: string,
  isConfidential: boolean,
  isImage: boolean = false
): Promise<UnifiedResponse> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const targetCompany = isConfidential ? "una empresa confidencial del sector" : companyName;

  const systemInstruction = `Eres un Career Coach senior de élite. 
  Tu misión es transformar a un candidato para que sea el perfil ideal para:
  - CARGO: ${targetRole}
  - EMPRESA: ${targetCompany}
  - RUBRO: ${industry}

  TU TAREA:
  1. CV STYLE HARVARD: Reescribe la información del usuario siguiendo estrictamente el formato Harvard:
     - Logros cuantificables y verbos de acción.
     - Sin "Yo" o "Mi".
     - Enfoque total en resultados medibles.

  2. COACHING DE ALTO NIVEL:
     - Análisis de Empresa/Rubro: Explica qué busca específicamente ${targetCompany} en el rubro de ${industry}.
     - Simulación de Entrevista: Genera preguntas conductuales (STAR) y técnicas basadas en este rol específico.
     - Ajuste de Perfil: Indica qué partes del CV del usuario brillan más para este cargo y qué debe enfatizar.

  Idioma: Español. Responde estrictamente en JSON.`;

  const prompt = `
    DATOS DEL CANDIDATO: ${input}
    CARGO OBJETIVO: ${targetRole}
    EMPRESA OBJETIVO: ${targetCompany}
    RUBRO: ${industry}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: isImage 
      ? { 
          parts: [
            { inlineData: { data: input.split(',')[1], mimeType: 'image/jpeg' } }, 
            { text: `Analiza esta imagen de CV y genera el perfil para el cargo de ${targetRole} en ${targetCompany}.` }
          ] 
        }
      : prompt,
    config: {
      systemInstruction,
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cv: {
            type: Type.OBJECT,
            properties: {
              fullName: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              location: { type: Type.STRING },
              linkedin: { type: Type.STRING },
              experiences: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    company: { type: Type.STRING },
                    role: { type: Type.STRING },
                    location: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    description: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
                }
              },
              education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    institution: { type: Type.STRING },
                    degree: { type: Type.STRING },
                    graduationDate: { type: Type.STRING }
                  }
                }
              },
              skills: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    items: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
                }
              }
            },
            required: ["fullName", "email", "experiences", "education"]
          },
          analysis: {
            type: Type.OBJECT,
            properties: {
              industry: { type: Type.STRING },
              roleFit: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              interviewTips: { type: Type.ARRAY, items: { type: Type.STRING } },
              commonQuestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    sampleAnswer: { type: Type.STRING }
                  }
                }
              }
            }
          }
        },
        required: ["cv", "analysis"]
      }
    }
  });

  return JSON.parse(response.text);
};
