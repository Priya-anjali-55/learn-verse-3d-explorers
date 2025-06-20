
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RotateCcw, BookOpen, Gamepad2 } from 'lucide-react';
import { getSubjectById } from '@/data/subjects';

interface HeaderProps {
  selectedSubject: string | null;
  mode: 'learn' | 'play';
  onResetScene: () => void;
  onModeChange: (mode: 'learn' | 'play') => void;
}

const Header: React.FC<HeaderProps> = ({ selectedSubject, mode, onResetScene, onModeChange }) => {
  const currentSubject = selectedSubject ? getSubjectById(selectedSubject) : null;

  return (
    <div className="bg-slate-800 border-b border-slate-700 p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onResetScene}
            className="border-slate-600 text-gray-300 hover:bg-slate-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Back to Subjects
          </Button>
          
          <Separator orientation="vertical" className="h-6 bg-slate-600" />
          
          <div className="flex items-center gap-2">
            {currentSubject && (
              <>
                <div className={`p-1.5 rounded ${currentSubject.color}`}>
                  <currentSubject.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-medium">{currentSubject.name}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={mode === 'learn' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModeChange('learn')}
            className={mode === 'learn' ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-600 text-gray-300 hover:bg-slate-700'}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Learn Mode
          </Button>
          <Button
            variant={mode === 'play' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModeChange('play')}
            className={mode === 'play' ? 'bg-purple-600 hover:bg-purple-700' : 'border-slate-600 text-gray-300 hover:bg-slate-700'}
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            Play Mode
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
