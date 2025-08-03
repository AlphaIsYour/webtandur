"use client";

import { useState } from "react";
import {
  CircleDashed,
  Sprout,
  Wheat,
  Handshake,
  Leaf,
  ChevronDown,
  ChevronUp,
  Droplets,
} from "lucide-react";

export default function ProjectPhase({ proyek }: { proyek: any }) {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  const togglePhase = (phaseId: string) => {
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Leaf className="w-6 h-6 mr-2 text-green-600" />
        Tahapan Proyek
      </h2>
      <div className="space-y-4">
        {proyek.fase
          .sort((a: any, b: any) => a.urutan - b.urutan)
          .map((fase: any) => (
            <div
              key={fase.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => togglePhase(fase.id)}
                className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    {fase.urutan === 1 && (
                      <CircleDashed className="w-5 h-5 text-green-600" />
                    )}
                    {fase.urutan === 2 && (
                      <Sprout className="w-5 h-5 text-green-600" />
                    )}

                    {fase.urutan === 3 && (
                      <Droplets className="w-5 h-5 text-green-600" />
                    )}
                    {fase.urutan === 4 && (
                      <Wheat className="w-5 h-5 text-green-600" />
                    )}
                    {fase.urutan === 5 && (
                      <Handshake className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <h3 className="text-lg font-medium">{fase.nama}</h3>
                </div>
                {expandedPhase === fase.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {expandedPhase === fase.id && (
                <div className="p-4 pt-0 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-line">{fase.cerita}</p>
                    </div>
                    {fase.gambar.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {fase.gambar
                          .slice(0, 4)
                          .map((gambar: string, index: number) => (
                            <div
                              key={index}
                              className="aspect-square bg-gray-100 rounded overflow-hidden"
                            >
                              <img
                                src={gambar}
                                alt={`Fase ${fase.urutan} - ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </section>
  );
}
