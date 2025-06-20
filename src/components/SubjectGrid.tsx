
import React from 'react';
import { subjects } from '@/data/subjects';
import SubjectCard from './SubjectCard';

interface SubjectGridProps {
  onSubjectSelect: (subjectId: string) => void;
}

const SubjectGrid: React.FC<SubjectGridProps> = ({ onSubjectSelect }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-white mb-8">
        Choose Your Learning Adventure
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <SubjectCard 
            key={subject.id}
            subject={subject}
            onSelect={onSubjectSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default SubjectGrid;
