
import { 
  BookOpen, 
  Gamepad2, 
  Atom, 
  Globe, 
  Calculator, 
  Telescope, 
  Heart, 
  Lightbulb
} from 'lucide-react';

export interface Subject {
  id: string;
  name: string;
  icon: typeof BookOpen;
  color: string;
  description: string;
  examples: string[];
}

export const subjects: Subject[] = [
  {
    id: 'biology',
    name: 'Biology',
    icon: Heart,
    color: 'bg-green-500',
    description: 'Explore DNA, cells, and human anatomy in 3D',
    examples: ['DNA Helix', 'Human Heart', 'Plant Cell']
  },
  {
    id: 'space',
    name: 'Space Science',
    icon: Telescope,
    color: 'bg-purple-500',
    description: 'Journey through the solar system and beyond',
    examples: ['Solar System', 'Planetary Orbits', 'Galaxies']
  },
  {
    id: 'math',
    name: 'Mathematics',
    icon: Calculator,
    color: 'bg-blue-500',
    description: 'Visualize geometric shapes and mathematical concepts',
    examples: ['3D Shapes', 'Vectors', 'Fractals']
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: Globe,
    color: 'bg-emerald-500',
    description: 'Explore Earth\'s features and continents',
    examples: ['3D Globe', 'Continents', 'Volcanoes']
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: Atom,
    color: 'bg-orange-500',
    description: 'Interact with molecules and atomic structures',
    examples: ['Molecules', 'Atomic Models', 'Reactions']
  },
  {
    id: 'physics',
    name: 'Physics',
    icon: Lightbulb,
    color: 'bg-yellow-500',
    description: 'Understand forces, energy, and physical laws',
    examples: ['Pendulum', 'Light Rays', 'Circuits']
  }
];

export const getSubjectById = (id: string): Subject | undefined => {
  return subjects.find(subject => subject.id === id);
};

export const getSubjectFactById = (id: string): string => {
  const facts: Record<string, string> = {
    biology: "DNA contains the genetic instructions for all living organisms!",
    space: "Jupiter is so large that all other planets could fit inside it!",
    math: "The golden ratio appears frequently in nature and art!",
    geography: "Earth's continents are constantly moving due to plate tectonics!",
    chemistry: "Water molecules are polar, which gives water its unique properties!",
    physics: "Atoms are 99.9% empty space!"
  };
  return facts[id] || "Science is amazing!";
};
