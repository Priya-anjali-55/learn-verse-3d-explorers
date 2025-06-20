
import React, { useState } from 'react';
import { BookOpen, Gamepad2, Volume2 } from 'lucide-react';
import SubjectGrid from '@/components/SubjectGrid';
import Header from '@/components/Header';
import ThreeViewport from '@/components/ThreeViewport';
import ControlsOverlay from '@/components/ControlsOverlay';
import SidePanel from '@/components/SidePanel';

const Index = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [mode, setMode] = useState<'learn' | 'play'>('learn');
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState(0);

  const handleSubjectSelect = (subjectId: string) => {
    setIsLoading(true);
    setCurrentModel(0);
    setTimeout(() => {
      setSelectedSubject(subjectId);
      setIsLoading(false);
    }, 500);
  };

  const resetScene = () => {
    setSelectedSubject(null);
    setMode('learn');
    setCurrentModel(0);
  };

  const nextModel = () => {
    const maxModels = 3;
    setCurrentModel((prev) => (prev + 1) % maxModels);
  };

  if (selectedSubject === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              EduVerse 3D
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Interactive Web-Based Learning and Gaming Platform
            </p>
            <p className="text-gray-400">
              Explore complex concepts through immersive 3D visualizations and interactive games
            </p>
          </div>

          {/* Features */}
          <div className="flex justify-center gap-8 mb-12">
            <div className="flex items-center gap-2 text-gray-300">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span>Learn Mode</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Gamepad2 className="w-5 h-5 text-purple-400" />
              <span>Play Mode</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Volume2 className="w-5 h-5 text-green-400" />
              <span>Audio Narration</span>
            </div>
          </div>

          {/* Subject Selection */}
          <SubjectGrid onSubjectSelect={handleSubjectSelect} />

          {/* Footer */}
          <div className="text-center mt-16 text-gray-400">
            <p>Built with Three.js • React • TypeScript</p>
            <p className="mt-2">Click and drag to rotate • Scroll to zoom • Interactive learning awaits!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header 
        selectedSubject={selectedSubject}
        mode={mode}
        onResetScene={resetScene}
        onModeChange={setMode}
      />

      <div className="flex-1 flex">
        <div className="flex-1 relative">
          <ThreeViewport 
            selectedSubject={selectedSubject}
            currentModel={currentModel}
            isLoading={isLoading}
          />
          <ControlsOverlay />
        </div>

        <SidePanel 
          mode={mode}
          selectedSubject={selectedSubject}
          currentModel={currentModel}
          onNextModel={nextModel}
        />
      </div>
    </div>
  );
};

export default Index;
