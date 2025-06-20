
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Subject } from '@/data/subjects';

interface SubjectCardProps {
  subject: Subject;
  onSelect: (subjectId: string) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onSelect }) => {
  const IconComponent = subject.icon;

  return (
    <Card 
      className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm"
      onClick={() => onSelect(subject.id)}
    >
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-lg ${subject.color}`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-white">{subject.name}</CardTitle>
        </div>
        <CardDescription className="text-gray-300">
          {subject.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {subject.examples.map((example) => (
            <Badge key={example} variant="secondary" className="bg-slate-700 text-gray-300">
              {example}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectCard;
