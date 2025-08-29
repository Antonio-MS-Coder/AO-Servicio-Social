// User types
export type UserRole = 'worker' | 'employer' | 'admin';

export interface User {
  id: string;
  email: string;
  phone?: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Worker profile
export interface WorkerProfile {
  userId: string;
  name: string;
  trade: Trade;
  secondaryTrades?: Trade[];
  experience: number;
  location: string;
  bio?: string;
  photoUrl?: string;
  certifications: Certification[];
  rating: number;
  totalRatings: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Employer profile
export interface EmployerProfile {
  userId: string;
  companyName: string;
  contactName: string;
  businessType: string;
  location: string;
  description?: string;
  logoUrl?: string;
  rating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}

// Trade enum
export enum Trade {
  WAITER = 'waiter',
  COOK = 'cook',
  BARTENDER = 'bartender',
  CLEANER = 'cleaner',
  SECURITY = 'security',
  DRIVER = 'driver',
  TRANSLATOR = 'translator',
  GUIDE = 'guide',
  ELECTRICIAN = 'electrician',
  PLUMBER = 'plumber',
  CARPENTER = 'carpenter',
  PAINTER = 'painter',
  GARDENER = 'gardener',
  TECHNICIAN = 'technician',
  OTHER = 'other'
}

// Certification
export interface Certification {
  id: string;
  name: string;
  type?: string; // food_handling, first_aid, driver_license, etc.
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  fileUrl?: string;
  verified: boolean;
}

// Job posting
export interface JobPosting {
  id: string;
  employerId: string;
  employerName: string;
  title: string;
  description: string;
  trade: Trade;
  salary: {
    amount: number;
    period: 'hour' | 'day' | 'week' | 'month' | 'project';
  };
  duration?: string;
  location: string;
  requirements?: string[];
  status: 'open' | 'closed' | 'in_progress';
  createdAt: Date;
  updatedAt: Date;
  applicants?: string[];
}

// Job application
export interface JobApplication {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  workerPhoto?: string;
  workerRating?: number;
  workerExperience?: number;
  workerTrade?: string;
  coverLetter?: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: Date | any;
  updatedAt: Date | any;
}

// Rating
export interface Rating {
  id: string;
  fromUserId: string;
  toUserId: string;
  jobId: string;
  score: number;
  comment?: string;
  createdAt: Date;
}

// Message
export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}