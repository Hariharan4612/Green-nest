import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  POPULAR_SAMPLES, 
  scanPlantImage 
} from '../../services/aiPlantService';
import { 
  LeafIcon, 
  SparklesIcon, 
  CameraIcon, 
  ScanIcon, 
  XIcon, 
  CheckIcon, 
  AlertTriangleIcon, 
  BagIcon, 
  RefreshIcon 
} from '../Icons';

export default function AiPlantScannerModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { addToCart, showToast } = useApp();

  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera();
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setSelectedImage(dataUrl);
        runScan(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSampleClick = (sample) => {
    stopCamera();
    setSelectedImage(sample.image);
    runScan(sample.image);
  };

  const startCamera = async () => {
    try {
      setSelectedImage(null);
      setScanResult(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      showToast('Camera access unavailable. Please upload a photo instead.', 'error');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraPhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const photoUrl = canvas.toDataURL('image/jpeg');
      stopCamera();
      setSelectedImage(photoUrl);
      runScan(photoUrl);
    }
  };

  const runScan = async (imageSrc) => {
    setScanning(true);
    setScanResult(null);
    setScanStep(1);

    const stepInterval = setInterval(() => {
      setScanStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 450);

    try {
      const result = await scanPlantImage({ 
        imageSrc, 
        geminiApiKey: apiKey 
      });
      clearInterval(stepInterval);
      setScanResult(result);
      showToast(`Plant identified: ${result.commonName}!`, 'success');
    } catch (err) {
      clearInterval(stepInterval);
      showToast('Analysis error: ' + err.message, 'error');
    } finally {
      setScanning(false);
      setScanStep(0);
    }
  };

  const handleReset = () => {
    stopCamera();
    setSelectedImage(null);
    setScanResult(null);
    setScanning(false);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={handleClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn relative my-auto"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-800 text-white flex items-center justify-center shadow-md shadow-emerald-900/10">
              <SparklesIcon className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-gray-900 text-base sm:text-lg tracking-tight">
                  GreenNest AI Plant Scanner
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  100% Free
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Upload or capture any plant photo for instant species identification & care guide
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">

          {/* Camera View Mode */}
          {isCameraActive && (
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border-2 border-emerald-500 shadow-md">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none border-2 border-white/40 rounded-2xl m-4 flex flex-col justify-between p-4">
                <span className="text-xs text-white bg-black/60 px-3 py-1 rounded-full self-center backdrop-blur-xs">
                  Center plant leaf in the frame
                </span>
                <div className="w-16 h-16 border-2 border-emerald-400/80 rounded-full self-center animate-ping" />
              </div>
              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={stopCamera}
                  className="bg-gray-800/80 hover:bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={captureCameraPhoto}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <CameraIcon className="w-4 h-4" />
                  Snap Photo
                </button>
              </div>
            </div>
          )}

          {/* Main Upload & Drop Zone (When no active image) */}
          {!selectedImage && !isCameraActive && (
            <div className="space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-emerald-300 hover:border-emerald-600 bg-emerald-50/40 hover:bg-emerald-50/70 transition-all rounded-3xl p-8 text-center cursor-pointer group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-2xl bg-white border border-emerald-200 text-[#1e4d2b] flex items-center justify-center mx-auto mb-3 shadow-xs group-hover:scale-110 transition-transform">
                  <ScanIcon className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="text-sm font-bold text-gray-900">
                  Click to Upload or Drag & Drop Plant Photo
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Supports JPG, PNG, WEBP from your device or camera roll
                </p>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-[11px] font-semibold text-[#1e4d2b] bg-white px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
                    🌱 Instant AI Recognition
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
                    🩺 Free Health Diagnosis
                  </span>
                </div>
              </div>

              {/* Action Buttons: Live Camera capture */}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  <CameraIcon className="w-4 h-4 text-emerald-700" />
                  Use Live Camera
                </button>
              </div>

              {/* Popular Sample Plants for Instant 1-Click Testing */}
              <div className="pt-2">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <LeafIcon className="w-3.5 h-3.5 text-emerald-600" />
                  Or Try With One-Click Botanical Samples:
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {POPULAR_SAMPLES.map(sample => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSampleClick(sample)}
                      className="group relative rounded-2xl overflow-hidden aspect-square border border-gray-200 hover:border-emerald-600 transition-all shadow-2xs cursor-pointer text-left"
                    >
                      <img
                        src={sample.image}
                        alt={sample.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-1.5">
                        <span className="text-[10px] font-bold text-white leading-tight line-clamp-1">
                          {sample.name.split(' ')[0]}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Image Preview & AI Scanner Overlay */}
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-gray-900 max-h-72 flex items-center justify-center border border-gray-200 shadow-md">
                <img
                  src={selectedImage}
                  alt="Scanned plant"
                  className="w-full h-full max-h-72 object-contain"
                />

                {/* Animated Scanner Laser Beam when Scanning */}
                {scanning && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce" />
                    <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-2xs flex items-center justify-center">
                      <div className="bg-black/80 text-white px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl border border-emerald-500/50">
                        <RefreshIcon className="w-4 h-4 text-emerald-400 animate-spin" />
                        <span>
                          {scanStep === 1 && 'Extracting foliage contours...'}
                          {scanStep === 2 && 'Comparing botanical taxon databases...'}
                          {scanStep >= 3 && 'Analyzing leaf health & care requirements...'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reset / Rescan button */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-xl text-xs backdrop-blur-md transition-colors cursor-pointer"
                  title="Scan another photo"
                >
                  <RefreshIcon className="w-4 h-4" />
                </button>
              </div>

              {/* AI Recognition Results Card */}
              {scanResult && !scanning && (
                <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200 p-5 space-y-4 animate-fadeIn">
                  
                  {/* Top Identification Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-200/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-extrabold text-[#142e1b] tracking-tight">
                          {scanResult.commonName}
                        </h4>
                        <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase shadow-xs">
                          {scanResult.confidence}% Match
                        </span>
                      </div>
                      <p className="text-xs font-medium text-emerald-800 italic mt-0.5">
                        {scanResult.scientificName} • Family: {scanResult.family}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[11px] font-semibold text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 inline-flex items-center gap-1">
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                        {scanResult.healthStatus}
                      </span>
                    </div>
                  </div>

                  {/* AI Botanical Health Diagnosis */}
                  <div className="bg-white rounded-xl p-3.5 border border-emerald-200/80 text-xs">
                    <p className="font-bold text-gray-900 flex items-center gap-1.5 mb-1 text-xs">
                      🩺 AI Health & Care Diagnosis:
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {scanResult.diagnosis}
                    </p>
                  </div>

                  {/* Essential Care Specifications Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-emerald-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">☀️ Sunlight</span>
                      <p className="font-semibold text-gray-800 mt-0.5 text-xs line-clamp-2">{scanResult.light}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">💧 Water</span>
                      <p className="font-semibold text-gray-800 mt-0.5 text-xs line-clamp-2">{scanResult.water}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">💨 Humidity</span>
                      <p className="font-semibold text-gray-800 mt-0.5 text-xs line-clamp-2">{scanResult.humidity}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">🐾 Pet Safety</span>
                      <p className={`font-semibold mt-0.5 text-xs ${scanResult.isPetFriendly ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {scanResult.isPetFriendly ? 'Pet Safe' : 'Toxic to Pets'}
                      </p>
                    </div>
                  </div>

                  {/* Botanical Fun Fact */}
                  <div className="bg-emerald-100/60 p-3 rounded-xl text-xs text-emerald-950 flex items-start gap-2">
                    <span className="text-base">💡</span>
                    <p className="leading-relaxed">
                      <strong>Botanical Fact:</strong> {scanResult.funFact}
                    </p>
                  </div>

                  {/* Store Link & Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-gray-500">
                      Engine: <span className="font-semibold text-emerald-800">{scanResult.engine}</span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Scan Another
                      </button>

                      {scanResult.storePlantId && (
                        <button
                          type="button"
                          onClick={() => {
                            handleClose();
                            navigate(`/plants/${scanResult.storePlantId}`);
                          }}
                          className="bg-[#1e4d2b] hover:bg-[#163b21] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer flex-1 sm:flex-initial justify-center"
                        >
                          <BagIcon className="w-4 h-4 text-emerald-300" />
                          <span>View in GreenNest (${scanResult.storePrice?.toFixed(2)})</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Predefined AI FAQ & Optional Gemini Key Accordion */}
          <div className="pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowApiSettings(!showApiSettings)}
              className="text-xs font-semibold text-[#1e4d2b] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <span>⚙️ Free AI Predefined Models & Optional Google Gemini Key</span>
              <span className="text-[10px] text-gray-400">({showApiSettings ? 'Hide' : 'Show'})</span>
            </button>

            {showApiSettings && (
              <div className="mt-3 p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-3">
                <div className="space-y-1">
                  <p className="font-bold text-gray-800">1. Is this AI plant recognition completely free?</p>
                  <p className="text-gray-600 leading-relaxed">
                    <strong>Yes!</strong> GreenNest comes with a built-in neural botanical vision classifier that runs 100% free right in the browser with zero subscription or backend requirement.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="font-bold text-gray-800">2. Free Google Gemini 1.5 Flash Vision (Optional):</p>
                  <p className="text-gray-600">
                    You can also connect Google's free Gemini API (1,500 requests/day free at{' '}
                    <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold">
                      aistudio.google.com
                    </a>) for live conversational vision:
                  </p>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Paste optional Gemini API key (AIzaSy...)"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#1e4d2b] bg-white font-mono"
                  />
                  <p className="text-[11px] text-gray-400">
                    If left blank, the built-in GreenNest Botanical AI engine will be used automatically for free.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

