export type UserRole = 'citizen' | 'officer' | 'admin' | 'green_champion' | 'ward_officer';

export type WasteCategory =
  | 'wet_organic'
  | 'dry_recyclable'
  | 'hazardous'
  | 'e_waste'
  | 'construction'
  | 'mixed';

export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ReportStatus =
  | 'pending_assignment'
  | 'assigned'
  | 'in_progress'
  | 'pending_admin_approval'
  | 'resolved'
  | 'rejected'
  | 'pending'
  | 'reviewed'; // backward compat

export type Language = 'en' | 'hi';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  aadharNumber?: string; // Formatted e.g. "5432-9876-1234"
  employerId?: string; // Formatted e.g. "EMP-KA33-902"
  trainingCompleted: boolean;
  trainingScore: number;
  reportsCount: number;
  civicPoints?: number; // For Citizen
  officerEarnings?: number; // In ₹ for Officer
  officerBountiesCount?: number;
  badge: 'none' | 'reporter' | 'champion' | 'hero';
  createdAt: string;
}

export interface Report {
  id: string;
  userId: string;
  userName: string;
  photoDataUrl: string;
  audioDataUrl?: string; // Voice note landmark recording
  resolvedPhotoDataUrl?: string; // "After Cleanup" evidence
  officerProofPhoto?: string; // Officer uploaded cleanup photo
  officerNotes?: string;
  lat: number;
  lng: number;
  address?: string; // Live geocoded street address
  accuracy?: number; // GPS accuracy in meters
  description: string;
  wasteCategory: WasteCategory;
  severity: ReportSeverity;
  status: ReportStatus;
  distanceKm?: number; // Calculated dynamic distance for officer radar
  assignedTipper?: string; // e.g. "Tipper-KA33-104"
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  assignedOfficerEmployerId?: string;
  etaMinutes?: number;
  adminNotes?: string;
  citizenRewardAwarded?: number; // e.g. 50 Civic Points
  officerBountyAwarded?: number; // e.g. ₹250 Cash Bounty
  createdAt: string;
  assignedAt?: string;
  completedAt?: string;
  updatedAt?: string;
}

export interface Facility {
  id: string;
  name: string;
  type: 'biomethanisation' | 'waste-to-energy' | 'recycling' | 'scrap-collection';
  lat: number;
  lng: number;
  address: string;
  contact: string;
  operatingHours?: string;
  capacity?: string;
  capacityUtilization?: number; // percentage (e.g. 68%)
  acceptedWaste?: string[];
}

export interface TrainingQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface RewardVoucher {
  id: string;
  title: string;
  targetRole: 'citizen' | 'officer' | 'all';
  category: 'tax_rebate' | 'compost' | 'metro_pass' | 'bin_kit' | 'cash_payout' | 'uniform_kit' | 'fuel_allowance' | 'health_insurance';
  costValue: number; // Civic points for Citizen, or ₹ bounty for Officer
  costType: 'points' | 'rupees';
  description: string;
  discountValue: string;
  code: string;
  expiresAt: string;
  icon: string;
}

export interface WardRanking {
  id: string;
  wardNumber: number;
  name: string;
  zone: string;
  cleanlinessIndex: number; // e.g. 4.8 / 5.0
  cleanupRate: number; // percentage (e.g. 96%)
  avgResponseHours: number; // e.g. 2.8 hrs
  activeChampions: number;
  rank: number;
}

export interface WasteItemGuide {
  id: string;
  name: string;
  category: WasteCategory;
  binColor: 'green' | 'blue' | 'red' | 'black';
  binName: string;
  decompositionTime: string;
  disposalTip: string;
  icon: string;
}

export interface ScrapRate {
  id: string;
  material: string;
  pricePerKg: number;
  trend: 'up' | 'stable' | 'down';
  icon: string;
}

export interface TipperVehicle {
  id: string;
  vehicleNumber: string;
  plateNumber?: string;
  driverName: string;
  currentLat: number;
  currentLng: number;
  status: 'en_route' | 'collecting' | 'unloading' | 'standby';
  assignedWard: string;
  currentWard?: string;
  batteryLevel: number;
  batteryPercent?: number;
  capacityKg?: number;
}
