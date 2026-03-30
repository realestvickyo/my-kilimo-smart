export enum Language {
  ENGLISH = 'en',
  SWAHILI = 'sw'
}

export enum AppView {
  HOME = 'HOME',
  ANALYTICS = 'ANALYTICS',
  MARKET = 'MARKET',
  SCAN = 'SCAN',
  ALERTS = 'ALERTS',
  SETTINGS = 'SETTINGS',
  ADMIN = 'ADMIN',
  SEARCH = 'SEARCH',
  SUPPORT = 'SUPPORT',
  GUIDE = 'GUIDE'
}

export interface SoilMetrics {
  moisture: number;
  ph: number;
  nitrogen: string;
  temp: number;
}

export interface Crop {
  id: string;
  name: string;
  stage: string;
  health: number;
  location: string;
  lastWatered?: string;
}

export interface WeatherDay {
  date: string;
  high: number;
  low: number;
  condition: string;
  precipitation: number;
  icon: string;
}

export interface Recommendation {
  id: string;
  title: string;
  content: string;
  type: 'soil' | 'crop' | 'water' | 'pest';
  timestamp: string;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  phoneNumber: string;
  timestamp: string;
}

export interface FarmerProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  county?: string;
  subCounty?: string;
  ward?: string;
  crops: Crop[];
  farmSize: number;
  isPremium: boolean;
  role?: 'admin' | 'user';
  completeness: number;
  createdAt: string;
}

export interface MarketPrice {
  id?: string;
  crop: string;
  market: string;
  price: number;
  unit: string;
  category?: string;
  trend?: 'up' | 'down';
  change?: string;
  verified: boolean;
  upvotes: number;
  timestamp: any;
}

export interface PestAlert {
  id: string;
  title: string;
  severity: 'low' | 'moderate' | 'high';
  description: string;
  location: string;
  timestamp: any;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: any;
  read: boolean;
}
