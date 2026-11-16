import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AiPlantScannerModal from './components/AiPlantScannerModal';
import { SparklesIcon, ScanIcon, CameraIcon, LeafIcon } from './Icons';
import { POPULAR_SAMPLES } from '../services/aiPlantService';

export default function AiPlantScannerPage() {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7]">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl border border-[#e2ece0] p-8 sm:p-12 text-center shadow-lg">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-600 to-green-800 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-900/10">
            <SparklesIcon className="w-8 h-8 text-emerald-200" />
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
            GreenNest Botanical Vision AI
          </span>

          <h1 className="text-3xl font-extrabold text-[#142e1b] mt-3 tracking-tight">
            AI Plant Scanner & Care Doctor
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-md mx-auto">
            Take or upload a photo of any houseplant to instantly identify its botanical species, check leaf health, and get custom watering and sunlight requirements.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto bg-[#1e4d2b] hover:bg-[#163b21] text-white px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <CameraIcon className="w-4 h-4 text-emerald-300" />
              <span>Launch AI Scanner</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
              Sample Plants You Can Scan Instantly:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {POPULAR_SAMPLES.map(s => (
                <span
                  key={s.id}
                  onClick={() => setModalOpen(true)}
                  className="text-xs bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-gray-700 px-3 py-1.5 rounded-full cursor-pointer transition-colors"
                >
                  🌿 {s.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>

      <AiPlantScannerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <Footer />
    </div>
  );
}

