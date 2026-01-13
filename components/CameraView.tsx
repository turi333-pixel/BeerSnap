
import React, { useRef, useEffect, useState } from 'react';
import { X, Camera as CameraIcon } from 'lucide-react';

interface Props {
  onCapture: (base64: string) => void;
  onCancel: () => void;
}

const CameraView: React.FC<Props> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1080 }, height: { ideal: 1920 } },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsReady(true);
        }
      } catch (err) {
        setError("Camera access denied. Please allow camera permissions.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/jpeg', 0.85);
      onCapture(base64);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      <div className="absolute top-6 left-6 z-10">
        <button onClick={onCancel} className="p-2 bg-slate-900/50 rounded-full text-white">
          <X size={24} />
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Viewfinder overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-80 border-2 border-white/30 rounded-3xl relative">
             <div className="absolute inset-0 bg-white/5 animate-pulse rounded-3xl" />
             <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500 -mt-px -ml-px rounded-tl-lg" />
             <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500 -mt-px -mr-px rounded-tr-lg" />
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-500 -mb-px -ml-px rounded-bl-lg" />
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500 -mb-px -mr-px rounded-br-lg" />
          </div>
        </div>
      </div>

      <div className="p-8 bg-black flex justify-center items-center">
        <button 
          onClick={takePhoto} 
          disabled={!isReady}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-transform active:scale-90 disabled:opacity-50"
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
             <CameraIcon size={32} className="text-black" />
          </div>
        </button>
      </div>
      
      {error && (
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center p-8 text-center">
          <div>
            <p className="text-white mb-4">{error}</p>
            <button onClick={onCancel} className="bg-amber-500 px-6 py-2 rounded-lg text-slate-900 font-bold">Go Back</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraView;
