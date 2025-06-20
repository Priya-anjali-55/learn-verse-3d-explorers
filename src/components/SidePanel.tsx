
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Play, Volume2 } from 'lucide-react';
import { getSubjectFactById } from '@/data/subjects';

interface SidePanelProps {
  mode: 'learn' | 'play';
  selectedSubject: string | null;
  currentModel: number;
  onNextModel: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ mode, selectedSubject, currentModel, onNextModel }) => {
  return (
    <div className="w-80 bg-slate-800 border-l border-slate-700 p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {mode === 'learn' ? 'Learning Mode' : 'Game Mode'}
          </h3>
          <p className="text-gray-300 text-sm">
            {mode === 'learn' 
              ? 'Explore and interact with 3D models to understand concepts better.'
              : 'Test your knowledge with interactive challenges and games.'
            }
          </p>
        </div>

        <Separator className="bg-slate-700" />

        <div>
          <h4 className="text-white font-medium mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start border-slate-600 text-gray-300 hover:bg-slate-700"
              onClick={onNextModel}
            >
              <Play className="w-4 h-4 mr-2" />
              Next Model ({currentModel + 1}/3)
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start border-slate-600 text-gray-300 hover:bg-slate-700"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Audio Guide
            </Button>
          </div>
        </div>

        {mode === 'play' && (
          <>
            <Separator className="bg-slate-700" />
            <div>
              <h4 className="text-white font-medium mb-3">Game Challenge</h4>
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-3">
                  Click on the correct object when prompted!
                </p>
                <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                  Start Challenge
                </Button>
              </div>
            </div>
          </>
        )}

        <Separator className="bg-slate-700" />

        <div>
          <h4 className="text-white font-medium mb-3">Did You Know?</h4>
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-gray-300 text-sm">
              {selectedSubject ? getSubjectFactById(selectedSubject) : "Select a subject to learn amazing facts!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
