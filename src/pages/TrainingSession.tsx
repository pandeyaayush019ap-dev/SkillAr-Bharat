import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/Button';
import { getSkillById, saveTrainingSession } from '../services/db';
import { Skill } from '../types';
import { useAuth } from '../context/AuthContext';
import { Camera, CheckCircle, XCircle, AlertCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';

export const TrainingSession: React.FC = () => {
  const { skillId } = useParams<{ skillId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [skill, setSkill] = useState<Skill | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'neutral', message: string } | null>(null);
  const [sessionScore, setSessionScore] = useState(0);
  const [stepScores, setStepScores] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Skill Data
  useEffect(() => {
    const fetchSkill = async () => {
      if (!skillId) return;
      try {
        const data = await getSkillById(skillId);
        if (data) {
          setSkill(data);
        } else {
          setFeedback({ type: 'error', message: 'Skill not found' });
        }
      } catch (error) {
        console.error("Error fetching skill:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkill();
  }, [skillId]);

  // Initialize Camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setFeedback({ type: 'error', message: "Camera access denied. Please enable camera permissions." });
      }
    };

    startCamera();

    return () => {
      // Cleanup stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureAndAnalyze = () => {
    if (!videoRef.current || !canvasRef.current || !skill) return;

    setIsAnalyzing(true);
    setFeedback(null);

    // Draw video frame to canvas
    const context = canvasRef.current.getContext('2d');
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
    }

    // Simulate AI Analysis
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% success rate for demo
      const score = isSuccess ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 40) + 20;

      if (isSuccess) {
        setFeedback({ 
          type: 'success', 
          message: `Excellent! Step verified. Accuracy: ${score}%` 
        });
        setStepScores(prev => [...prev, score]);
      } else {
        setFeedback({ 
          type: 'error', 
          message: "Incorrect technique detected. Please adjust your angle and try again." 
        });
      }
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleNextStep = () => {
    if (!skill) return;
    
    setFeedback(null);
    if (currentStepIndex < skill.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeSession();
    }
  };

  const completeSession = async () => {
    if (!user || !skill) return;

    const averageScore = Math.round(stepScores.reduce((a, b) => a + b, 0) / stepScores.length) || 0;
    setSessionScore(averageScore);

    try {
      await saveTrainingSession({
        userId: user.uid,
        skillId: skill.id,
        timestamp: Date.now(),
        accuracyScore: averageScore,
        feedback: averageScore > 80 ? "Great job! You've mastered this skill." : "Good effort, but needs more practice.",
        completed: true
      });
      
      // Show completion modal or redirect
      // For now, we'll just set a completion state in UI
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!skill) return <div className="flex justify-center items-center h-screen">Skill not found</div>;

  const currentStep = skill.steps[currentStepIndex];
  const isSessionComplete = stepScores.length === skill.steps.length;

  if (isSessionComplete) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-10 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Training Completed!</h2>
            <p className="text-gray-600 mb-6">
              You have successfully completed the <strong>{skill.title}</strong> module.
            </p>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Final Score</div>
              <div className="text-4xl font-bold text-indigo-600">{sessionScore}%</div>
            </div>

            <div className="space-y-3">
              <Button onClick={() => navigate('/dashboard')} className="w-full">
                Return to Dashboard
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" /> Retry Module
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top Bar */}
      <div className="bg-black/50 backdrop-blur-md text-white p-4 flex justify-between items-center fixed top-0 w-full z-10">
        <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => navigate('/dashboard')}>
          &larr; Exit
        </Button>
        <div className="font-semibold">{skill.title}</div>
        <div className="text-sm px-3 py-1 bg-white/20 rounded-full">
          Step {currentStepIndex + 1}/{skill.steps.length}
        </div>
      </div>

      {/* Main AR View */}
      <div className="flex-grow relative overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* AR Overlay Guidelines (Simulated) */}
        <div className="absolute inset-0 pointer-events-none border-2 border-white/30 m-8 rounded-3xl flex items-center justify-center">
          <div className="w-64 h-64 border-2 border-dashed border-white/50 rounded-xl opacity-50"></div>
        </div>

        {/* Scanning Animation */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-indigo-500/20 z-20 flex items-center justify-center">
            <div className="w-full h-1 bg-indigo-400 absolute top-1/2 animate-pulse shadow-[0_0_20px_rgba(99,102,241,0.8)]"></div>
            <div className="text-white font-bold text-xl drop-shadow-md animate-bounce">Analyzing...</div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="bg-white rounded-t-3xl p-6 pb-10 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {currentStep.title}
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            {currentStep.description}
          </p>

          {feedback && (
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
              feedback.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' : 
              feedback.type === 'error' ? 'bg-red-50 text-red-800 border border-red-100' : 
              'bg-gray-50 text-gray-800'
            }`}>
              {feedback.type === 'success' ? <CheckCircle className="shrink-0" /> : 
               feedback.type === 'error' ? <XCircle className="shrink-0" /> : 
               <AlertCircle className="shrink-0" />}
              <div>
                <p className="font-medium">{feedback.type === 'success' ? 'Success!' : 'Try Again'}</p>
                <p className="text-sm mt-1">{feedback.message}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {feedback?.type === 'success' ? (
              <Button onClick={handleNextStep} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                Next Step <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            ) : (
              <Button 
                onClick={captureAndAnalyze} 
                disabled={isAnalyzing} 
                className="w-full" 
                size="lg"
              >
                <Camera className="mr-2 w-5 h-5" />
                {isAnalyzing ? 'Analyzing...' : 'Verify Step'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
