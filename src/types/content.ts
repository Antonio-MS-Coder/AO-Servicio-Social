export interface SuccessStory {
  id: string;
  name: string;
  initials: string;
  role: string;
  company: string;
  testimonial: string;
  rating: number;
  verified: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeeklyStory {
  id: string;
  name: string;
  initials: string;
  beforeTitle: string;
  afterTitle: string;
  story: string;
  beforeSalary: number;
  afterSalary: number;
  jobsCompleted: number;
  rating: number;
  timeFrame: string; // e.g., "En solo 6 meses"
  isActive: boolean;
  weekStartDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface HomeContent {
  successStories: SuccessStory[];
  weeklyStory: WeeklyStory | null;
}