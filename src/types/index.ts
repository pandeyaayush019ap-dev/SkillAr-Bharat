export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  enrolledSkills: string[]; // Array of skill IDs
}

export interface SkillStep {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  imageUrl: string;
  steps: SkillStep[];
  createdAt: number;
}

export interface TrainingSession {
  id: string;
  userId: string;
  skillId: string;
  timestamp: number;
  accuracyScore: number;
  feedback: string;
  completed: boolean;
}
