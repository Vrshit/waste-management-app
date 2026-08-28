import {
  User,
  Report,
  Facility,
  TrainingQuestion,
  UserRole,
  RewardVoucher,
  WardRanking,
  WasteItemGuide,
  ScrapRate,
  TipperVehicle,
} from './types';
import { v4 as uuidv4 } from 'uuid';
import {
  insertReportToSupabase,
  updateReportInSupabase,
  fetchReportsFromSupabase,
  isSupabaseConfigured,
} from './supabase';

// ──── Seed Facilities ────

export const SEED_FACILITIES: Facility[] = [
  {
    id: '1',
    name: 'Hyderabad Biomethanisation Plant',
    type: 'biomethanisation',
    lat: 17.385,
    lng: 78.4867,
    address: 'Jawaharlal Nehru Road, Hyderabad',
    contact: '+91-40-1234-5678',
    operatingHours: '8:00 AM – 6:00 PM',
    capacityUtilization: 68,
  },
  {
    id: '2',
    name: 'Delhi Waste-to-Energy Facility',
    type: 'waste-to-energy',
    lat: 28.6139,
    lng: 77.209,
    address: 'Okhla Phase III, New Delhi',
    contact: '+91-11-9876-5432',
    operatingHours: '24/7',
    capacityUtilization: 84,
  },
  {
    id: '3',
    name: 'Bangalore Recycling Centre',
    type: 'recycling',
    lat: 12.9716,
    lng: 77.5946,
    address: 'Koramangala, Bengaluru',
    contact: '+91-80-5555-1234',
    operatingHours: '9:00 AM – 5:00 PM',
    capacityUtilization: 52,
  },
  {
    id: '4',
    name: 'Mumbai Scrap Collection Hub',
    type: 'scrap-collection',
    lat: 19.076,
    lng: 72.8777,
    address: 'Dharavi, Mumbai',
    contact: '+91-22-4444-7890',
    operatingHours: '7:00 AM – 8:00 PM',
    capacityUtilization: 75,
  },
  {
    id: '5',
    name: 'Chennai Recycling Centre',
    type: 'recycling',
    lat: 13.0827,
    lng: 80.2707,
    address: 'Guindy, Chennai',
    contact: '+91-44-3333-2222',
    operatingHours: '9:00 AM – 6:00 PM',
    capacityUtilization: 60,
  },
  {
    id: '6',
    name: 'Pune Biomethanisation Plant',
    type: 'biomethanisation',
    lat: 18.5204,
    lng: 73.8567,
    address: 'Hadapsar, Pune',
    contact: '+91-20-6666-5555',
    operatingHours: '8:00 AM – 5:00 PM',
    capacityUtilization: 70,
  },
];

// ──── AI Waste Segregation Database ────

export const WASTE_GUIDE_DATABASE: WasteItemGuide[] = [
  {
    id: '1',
    name: 'Coconut Shell & Husk',
    category: 'wet_organic',
    binColor: 'green',
    binName: 'Green Bin (Wet / Organic)',
    decompositionTime: '5 – 6 months',
    disposalTip: 'Chop into smaller pieces for faster home or municipal biomethanisation composting.',
    icon: '🥥',
  },
  {
    id: '2',
    name: 'Milk Pouch / Polybag',
    category: 'dry_recyclable',
    binColor: 'blue',
    binName: 'Blue Bin (Dry Recyclable)',
    decompositionTime: '400 – 500 years',
    disposalTip: 'Rinse with clean water, cut corner without detaching small tip to prevent microplastic litter, drop in dry bin.',
    icon: '🥛',
  },
  {
    id: '3',
    name: 'Medicines & Blister Packs',
    category: 'hazardous',
    binColor: 'red',
    binName: 'Red Bin (Domestic Hazardous)',
    decompositionTime: 'Non-biodegradable',
    disposalTip: 'Wrap expired pills in paper and place in Red Hazardous bin. Never flush down sink or toilet.',
    icon: '💊',
  },
  {
    id: '4',
    name: 'Batteries & Lithium Cells',
    category: 'hazardous',
    binColor: 'red',
    binName: 'Red Bin (Hazardous)',
    decompositionTime: '100+ years (toxic leaching)',
    disposalTip: 'Tape battery terminals and deposit at designated municipal e-hazard collection booths.',
    icon: '🔋',
  },
  {
    id: '5',
    name: 'Smartphone / Charger / E-Waste',
    category: 'e_waste',
    binColor: 'black',
    binName: 'Black Bin (E-Waste Recovery)',
    decompositionTime: '1,000+ years',
    disposalTip: 'Hand over to authorized scrap recovery centres or e-waste deposit kiosks for precious metal extraction.',
    icon: '📱',
  },
  {
    id: '6',
    name: 'Cardboard Box & Delivery Cartons',
    category: 'dry_recyclable',
    binColor: 'blue',
    binName: 'Blue Bin (Dry Recyclable)',
    decompositionTime: '2 – 3 months',
    disposalTip: 'Flatten boxes to save space in collection vehicles and ensure paper is kept dry.',
    icon: '📦',
  },
  {
    id: '7',
    name: 'Tea Leaves & Coffee Grounds',
    category: 'wet_organic',
    binColor: 'green',
    binName: 'Green Bin (Wet Waste)',
    decompositionTime: '2 – 4 weeks',
    disposalTip: 'Excellent nitrogen booster for home compost pits and municipal aerobic digesters.',
    icon: '🍵',
  },
  {
    id: '8',
    name: 'Thermocol / EPS Styrofoam',
    category: 'dry_recyclable',
    binColor: 'blue',
    binName: 'Blue Bin (Dry Waste)',
    decompositionTime: '500+ years',
    disposalTip: 'Never burn thermocol. Store in dry bin for specialized compaction.',
    icon: '📦',
  },
  {
    id: '9',
    name: 'Plastic Water Bottles (PET)',
    category: 'dry_recyclable',
    binColor: 'blue',
    binName: 'Blue Bin (Dry Recyclable)',
    decompositionTime: '450 years',
    disposalTip: 'Crush the bottle and recap before disposing in dry bin.',
    icon: '🧴',
  },
  {
    id: '10',
    name: 'Diapers & Sanitary Napkins',
    category: 'hazardous',
    binColor: 'red',
    binName: 'Red Bin (Sanitary / Hazardous)',
    decompositionTime: '500+ years',
    disposalTip: 'Wrap securely in newspaper marked with red dot (●) as mandated under MSW Rules 2016.',
    icon: '🩹',
  },
];

export function lookupWasteItem(query: string): WasteItemGuide | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  return (
    WASTE_GUIDE_DATABASE.find(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.disposalTip.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    ) || null
  );
}

// ──── Rewards Catalogs (Role-Specific) ────

export const SEED_CITIZEN_REWARDS: RewardVoucher[] = [
  {
    id: 'rew_cit_1',
    title: '5% Municipal Property Tax Rebate',
    targetRole: 'citizen',
    category: 'tax_rebate',
    costValue: 150,
    costType: 'points',
    description: 'Direct deduction voucher valid for annual urban municipal property tax filing.',
    discountValue: '5% OFF (Max ₹500)',
    code: 'SWACHH-TAX-5OFF',
    expiresAt: '31 Dec 2026',
    icon: '🏛️',
  },
  {
    id: 'rew_cit_2',
    title: '5kg Bio-Compost Organic Bag',
    targetRole: 'citizen',
    category: 'compost',
    costValue: 80,
    costType: 'points',
    description: 'Free collection token for nutrient-rich organic compost from municipal biomethanisation plants.',
    discountValue: '100% Free (1 Bag)',
    code: 'SWACHH-COMPOST-FREE',
    expiresAt: '30 Nov 2026',
    icon: '🪴',
  },
  {
    id: 'rew_cit_3',
    title: 'City Metro / Green Bus Pass',
    targetRole: 'citizen',
    category: 'metro_pass',
    costValue: 120,
    costType: 'points',
    description: 'Discount coupon for urban electric public transit and metro smart card recharge.',
    discountValue: '₹100 Transit Credit',
    code: 'SWACHH-METRO-100',
    expiresAt: '15 Jan 2027',
    icon: '🚌',
  },
  {
    id: 'rew_cit_4',
    title: 'Dual-Bin Home Segregation Kit',
    targetRole: 'citizen',
    category: 'bin_kit',
    costValue: 200,
    costType: 'points',
    description: 'Color-coded Green & Blue household pedal bin set delivered by ward committee.',
    discountValue: 'Free Dual-Bin Kit',
    code: 'SWACHH-DUALBIN-2026',
    expiresAt: '28 Feb 2027',
    icon: '🪣',
  },
];

export const SEED_OFFICER_REWARDS: RewardVoucher[] = [
  {
    id: 'rew_off_1',
    title: 'Direct Bank Cash Payout Voucher',
    targetRole: 'officer',
    category: 'cash_payout',
    costValue: 500,
    costType: 'rupees',
    description: 'Instant direct bank account credit payout for verified dump remediation bounties.',
    discountValue: '₹500 Direct Bank Transfer',
    code: 'OFFICER-CASH-500',
    expiresAt: '31 Dec 2026',
    icon: '💵',
  },
  {
    id: 'rew_off_2',
    title: 'Heavy-Duty PPE Safety Boots & Kit',
    targetRole: 'officer',
    category: 'uniform_kit',
    costValue: 400,
    costType: 'rupees',
    description: 'Steel-toe puncture-proof waterproof boots, puncture-resistant gloves, and high-vis safety jacket.',
    discountValue: 'Free PPE Equipment Kit',
    code: 'OFFICER-PPE-2026',
    expiresAt: '31 Dec 2026',
    icon: '🦺',
  },
  {
    id: 'rew_off_3',
    title: 'Monthly EV/Fuel Energy Allowance',
    targetRole: 'officer',
    category: 'fuel_allowance',
    costValue: 300,
    costType: 'rupees',
    description: 'Digital fuel token valid at Indian Oil / HPCL municipal partner stations for tipper vehicles.',
    discountValue: '₹300 Fuel Allowance',
    code: 'OFFICER-FUEL-300',
    expiresAt: '31 Dec 2026',
    icon: '⛽',
  },
  {
    id: 'rew_off_4',
    title: 'Ayushman Supplementary Health Coverage',
    targetRole: 'officer',
    category: 'health_insurance',
    costValue: 800,
    costType: 'rupees',
    description: 'Quarterly family health checkup and sanitation worker insurance premium waiver.',
    discountValue: '100% Health Premium Waiver',
    code: 'OFFICER-HEALTH-CARE',
    expiresAt: '31 Dec 2026',
    icon: '🩺',
  },
];

// ──── Leaderboard & Scrap Rates ────

export const SEED_WARD_RANKINGS: WardRanking[] = [
  {
    id: 'w1',
    wardNumber: 14,
    name: 'Koramangala Ward',
    zone: 'South Zone',
    cleanlinessIndex: 4.9,
    cleanupRate: 98,
    avgResponseHours: 2.3,
    activeChampions: 142,
    rank: 1,
  },
  {
    id: 'w2',
    wardNumber: 7,
    name: 'Indiranagar Ward',
    zone: 'East Zone',
    cleanlinessIndex: 4.8,
    cleanupRate: 95,
    avgResponseHours: 2.8,
    activeChampions: 118,
    rank: 2,
  },
  {
    id: 'w3',
    wardNumber: 22,
    name: 'Yadgir Central Model Ward',
    zone: 'North Zone',
    cleanlinessIndex: 4.7,
    cleanupRate: 94,
    avgResponseHours: 3.1,
    activeChampions: 96,
    rank: 3,
  },
];

export const SEED_SCRAP_RATES: ScrapRate[] = [
  { id: 'sc_1', material: 'PET Plastic Bottles', pricePerKg: 18, trend: 'up', icon: '🧴' },
  { id: 'sc_2', material: 'Cardboard & Cartons', pricePerKg: 12, trend: 'stable', icon: '📦' },
  { id: 'sc_3', material: 'Aluminum Cans & Foil', pricePerKg: 110, trend: 'up', icon: '🥫' },
  { id: 'sc_4', material: 'Old Newspapers (ONP)', pricePerKg: 14, trend: 'stable', icon: '📰' },
  { id: 'sc_5', material: 'E-Waste (Circuit Boards)', pricePerKg: 85, trend: 'up', icon: '🔌' },
];

export const SEED_TIPPERS: TipperVehicle[] = [
  {
    id: 'tip_1',
    vehicleNumber: 'KA-33-E-1042',
    driverName: 'Ramesh Kumar',
    currentLat: 12.972,
    currentLng: 77.595,
    status: 'en_route',
    assignedWard: 'Ward 14',
    batteryLevel: 82,
  },
  {
    id: 'tip_2',
    vehicleNumber: 'DL-01-GB-4421',
    driverName: 'Suresh Patil',
    currentLat: 28.614,
    currentLng: 77.21,
    status: 'collecting',
    assignedWard: 'Ward 07',
    batteryLevel: 67,
  },
];

export const TRAINING_QUESTIONS: TrainingQuestion[] = [
  {
    id: 1,
    question: 'Which bin should you use for vegetable peels and food scraps?',
    options: ['Dry Waste (Blue)', 'Wet Waste (Green)', 'Hazardous Waste (Red)', 'Any bin'],
    correctAnswer: 1,
    explanation: 'Vegetable peels and food scraps are biodegradable organic waste going into Green (Wet) bin.',
  },
  {
    id: 2,
    question: 'Which of the following is classified as domestic hazardous waste?',
    options: ['Newspaper', 'Banana peel', 'Used batteries', 'Cardboard box'],
    correctAnswer: 2,
    explanation: 'Used batteries contain toxic heavy metals and must be disposed in the Red Hazardous bin.',
  },
  {
    id: 3,
    question: 'What is source segregation?',
    options: ['Collecting waste together', 'Separating waste at point of generation', 'Dumping in landfills', 'Open burning'],
    correctAnswer: 1,
    explanation: 'Source segregation means separating waste into dry, wet, and hazardous categories where generated.',
  },
];

// ──── localStorage keys & helpers ────

const USERS_KEY = 'wm_users';
const REPORTS_KEY = 'wm_reports';
const FACILITIES_KEY = 'wm_facilities';
const CURRENT_USER_KEY = 'wm_current_user';
const REDEEMED_REWARDS_KEY = 'wm_redeemed_rewards';

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e: any) {
    if (e?.name === 'QuotaExceededError') {
      const reports = getItem<Report[]>(REPORTS_KEY, []);
      if (reports.length > 5) {
        localStorage.setItem(REPORTS_KEY, JSON.stringify(reports.slice(reports.length - 5)));
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch {}
      }
    }
  }
}

// ──── Image Compression ────

export function compressImage(dataUrl: string, maxWidth = 800, quality = 0.6): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = dataUrl;
  });
}

// ──── Distance Utility ────

export function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ──── Users & Multi-Role Authentication ────

export function getUsers(): User[] {
  return getItem<User[]>(USERS_KEY, []);
}

export function getCurrentUser(): User | null {
  return getItem<User | null>(CURRENT_USER_KEY, null);
}

export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function updateUser(updated: User): void {
  const users = getUsers().map((u) => (u.id === updated.id ? updated : u));
  setItem(USERS_KEY, users);
  setItem(CURRENT_USER_KEY, updated);
}

export function computeBadge(user: User): User['badge'] {
  if (user.reportsCount >= 10) return 'hero';
  if (user.reportsCount >= 5) return 'champion';
  if (user.reportsCount >= 1) return 'reporter';
  return 'none';
}

/**
 * 1. Citizen Login via 12-Digit Aadhaar
 */
export function loginCitizenWithAadhar(aadharInput: string, otpInput = '123456', nameInput?: string): User {
  const cleanedAadhar = aadharInput.replace(/\D/g, '');
  if (cleanedAadhar.length !== 12) {
    throw new Error('Please enter a valid 12-digit Aadhaar number.');
  }

  const formattedAadhar = `${cleanedAadhar.slice(0, 4)}-${cleanedAadhar.slice(4, 8)}-${cleanedAadhar.slice(8, 12)}`;
  const users = getUsers();
  let user = users.find((u) => u.aadharNumber === formattedAadhar || u.aadharNumber?.replace(/\D/g, '') === cleanedAadhar);

  if (!user) {
    user = {
      id: `usr_cit_${uuidv4().slice(0, 8)}`,
      name: nameInput?.trim() || 'Aarav Sharma (Citizen)',
      email: `citizen_${cleanedAadhar.slice(-4)}@swachh.in`,
      role: 'citizen',
      aadharNumber: formattedAadhar,
      trainingCompleted: true,
      trainingScore: 100,
      reportsCount: 3,
      civicPoints: 180,
      badge: 'champion',
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    setItem(USERS_KEY, users);
  }

  setItem(CURRENT_USER_KEY, user);
  return user;
}

/**
 * 2. Officer Login via Employer ID & Password
 */
export function loginOfficerWithEmployerId(employerIdInput: string, passwordInput = 'officer123', nameInput?: string): User {
  const empId = employerIdInput.trim().toUpperCase();
  if (!empId || empId.length < 3) {
    throw new Error('Please enter a valid Employer ID (e.g. EMP-KA33-902).');
  }

  const users = getUsers();
  let officer = users.find((u) => u.employerId === empId || u.employerId?.replace(/[^A-Z0-9]/g, '') === empId.replace(/[^A-Z0-9]/g, ''));

  if (!officer) {
    officer = {
      id: `usr_off_${uuidv4().slice(0, 8)}`,
      name: nameInput?.trim() || 'Ramesh Kumar (Sanitation Officer)',
      email: `${empId.toLowerCase()}@sanitation.gov.in`,
      password: passwordInput,
      role: 'officer',
      employerId: empId,
      trainingCompleted: true,
      trainingScore: 100,
      reportsCount: 0,
      civicPoints: 0,
      officerEarnings: 1250, // ₹1,250 starter bounty balance
      officerBountiesCount: 5,
      badge: 'hero',
      createdAt: new Date().toISOString(),
    };
    users.push(officer);
    setItem(USERS_KEY, users);
  }

  setItem(CURRENT_USER_KEY, officer);
  return officer;
}

/**
 * 3. Admin Login via Secure Passkey
 */
export function loginAdminWithPasskey(passkeyInput: string): User {
  const passkey = passkeyInput.trim();
  if (!passkey) {
    throw new Error('Please enter the Admin Passkey.');
  }

  const users = getUsers();
  let admin = users.find((u) => u.role === 'admin');

  if (!admin) {
    admin = {
      id: 'usr_admin_master',
      name: 'Dr. Priya Rao (Zonal Commissioner)',
      email: 'commissioner@swachh.gov.in',
      role: 'admin',
      trainingCompleted: true,
      trainingScore: 100,
      reportsCount: 0,
      civicPoints: 500,
      badge: 'hero',
      createdAt: new Date().toISOString(),
    };
    users.push(admin);
    setItem(USERS_KEY, users);
  }

  setItem(CURRENT_USER_KEY, admin);
  return admin;
}

/**
 * Legacy loginUser for backward compatibility
 */
export function loginUser(email: string, password?: string): User {
  const users = getUsers();
  const user = users.find((u) => u.email === email);
  if (user) {
    setItem(CURRENT_USER_KEY, user);
    return user;
  }
  // Default to citizen
  return loginCitizenWithAadhar('5432-9876-1234', '123456', 'Aarav Sharma');
}

export function registerUser(name: string, email: string, password?: string, role: UserRole = 'citizen'): User {
  if (role === 'officer') {
    return loginOfficerWithEmployerId('EMP-KA33-902', password, name);
  }
  return loginCitizenWithAadhar('5432-9876-1234', '123456', name);
}

export function completeTraining(score: number): User {
  const user = getCurrentUser();
  if (!user) throw new Error('Not logged in');
  user.trainingCompleted = score >= 3;
  user.trainingScore = score;
  user.badge = computeBadge(user);
  updateUser(user);
  return user;
}

// ──── Pre-seeded Demo Accounts & Incidents ────

export function ensureDemoAccounts(): void {
  const users = getUsers();
  if (!users.find((u) => u.aadharNumber === '5432-9876-1234')) {
    loginCitizenWithAadhar('5432-9876-1234', '123456', 'Aarav Sharma');
  }
  if (!users.find((u) => u.employerId === 'EMP-KA33-902')) {
    loginOfficerWithEmployerId('EMP-KA33-902', 'officer123', 'Ramesh Kumar (Sanitation Officer)');
  }
  if (!users.find((u) => u.role === 'admin')) {
    loginAdminWithPasskey('SWACHH-ADMIN-2026');
  }

  // Pre-seed mock incidents if empty for instant Rapido radar demo
  const reports = getReports();
  if (reports.length === 0) {
    const seedReports: Report[] = [
      {
        id: 'rep_demo_1',
        userId: 'usr_cit_demo',
        userName: 'Aarav Sharma',
        photoDataUrl: '/hero-3d.jpg',
        lat: 12.9716,
        lng: 77.5946,
        address: '5th Block, Koramangala 80ft Road, Bengaluru, Karnataka',
        accuracy: 8.5,
        description: 'Illegal plastic crates and mixed food waste dumped next to storm-water drain.',
        wasteCategory: 'dry_recyclable',
        severity: 'high',
        status: 'pending_assignment',
        createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      },
      {
        id: 'rep_demo_2',
        userId: 'usr_cit_demo2',
        userName: 'Pooja Hegde',
        photoDataUrl: '/hero-3d.jpg',
        lat: 12.9782,
        lng: 77.6012,
        address: '100 Feet Road, Indiranagar, Bengaluru, Karnataka',
        accuracy: 6.2,
        description: 'Overflowing commercial organic waste blackspot causing foul odor.',
        wasteCategory: 'wet_organic',
        severity: 'critical',
        status: 'in_progress',
        assignedOfficerId: 'usr_off_demo',
        assignedOfficerName: 'Ramesh Kumar (Sanitation Officer)',
        assignedOfficerEmployerId: 'EMP-KA33-902',
        assignedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      },
      {
        id: 'rep_demo_3',
        userId: 'usr_cit_demo3',
        userName: 'Vikas Rao',
        photoDataUrl: '/hero-3d.jpg',
        resolvedPhotoDataUrl: '/hero-3d.jpg',
        officerProofPhoto: '/hero-3d.jpg',
        officerNotes: 'Cleaned with Tipper KA-33-E-1042 and disinfected with bleaching lime.',
        lat: 12.9698,
        lng: 77.5891,
        address: 'Yadgir Municipal Circle Blackspot #4',
        accuracy: 5.0,
        description: 'Mixed hazardous medical blister packs and broken bottles cleared.',
        wasteCategory: 'hazardous',
        severity: 'high',
        status: 'pending_admin_approval',
        assignedOfficerId: 'usr_off_demo',
        assignedOfficerName: 'Ramesh Kumar (Sanitation Officer)',
        assignedOfficerEmployerId: 'EMP-KA33-902',
        completedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      },
    ];
    setItem(REPORTS_KEY, seedReports);
  }
}

// ──── Reports & Rapido Dispatch Operations ────

export function getReports(): Report[] {
  return getItem<Report[]>(REPORTS_KEY, []);
}

export async function syncReportsWithSupabase(): Promise<Report[]> {
  if (isSupabaseConfigured()) {
    const cloudReports = await fetchReportsFromSupabase();
    if (cloudReports && cloudReports.length > 0) {
      setItem(REPORTS_KEY, cloudReports);
      return cloudReports;
    }
  }
  return getReports();
}

/**
 * Citizen Submits Incident -> Creates Task in 'pending_assignment'
 */
export function addReport(
  data: Omit<Report, 'id' | 'userId' | 'userName' | 'status' | 'createdAt'>
): Report {
  const user = getCurrentUser();
  if (!user) throw new Error('Not logged in. Please authenticate with Aadhaar.');

  const report: Report = {
    ...data,
    id: `rep_${uuidv4().slice(0, 8)}`,
    userId: user.id,
    userName: user.name,
    status: 'pending_assignment',
    createdAt: new Date().toISOString(),
  };

  const reports = getReports();
  reports.unshift(report);
  setItem(REPORTS_KEY, reports);

  if (isSupabaseConfigured()) {
    insertReportToSupabase(report).catch((err) =>
      console.warn('Background Supabase insert error:', err)
    );
  }

  // Update citizen civic points
  user.reportsCount = (user.reportsCount || 0) + 1;
  user.civicPoints = (user.civicPoints || 50) + 15;
  user.badge = computeBadge(user);
  updateUser(user);

  return report;
}

/**
 * Officer Rapido-Style Task Operations
 */
export function getNearbyOfficerTasks(officerLat = 12.9716, officerLng = 77.5946): Report[] {
  const reports = getReports();
  return reports
    .filter((r) => r.status === 'pending_assignment' || r.status === 'pending')
    .map((r) => {
      const distanceKm = getDistanceKm(officerLat, officerLng, r.lat, r.lng);
      return {
        ...r,
        distanceKm: Math.round(distanceKm * 10) / 10,
      };
    })
    .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
}

export function acceptOfficerTask(reportId: string, officer: User): Report {
  const reports = getReports();
  let updatedReport: Report | null = null;

  const newReports = reports.map((r) => {
    if (r.id === reportId) {
      updatedReport = {
        ...r,
        status: 'in_progress' as const,
        assignedOfficerId: officer.id,
        assignedOfficerName: officer.name,
        assignedOfficerEmployerId: officer.employerId || 'EMP-OFFICER',
        assignedTipper: 'Tipper-KA33-E-1042',
        assignedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return updatedReport;
    }
    return r;
  });

  if (!updatedReport) throw new Error('Report not found');
  setItem(REPORTS_KEY, newReports);

  if (isSupabaseConfigured()) {
    updateReportInSupabase(reportId, 'in_progress').catch(console.warn);
  }

  return updatedReport;
}

export function submitOfficerProof(
  reportId: string,
  proofPhotoDataUrl: string,
  officerNotes?: string
): Report {
  const reports = getReports();
  let updatedReport: Report | null = null;

  const newReports = reports.map((r) => {
    if (r.id === reportId) {
      updatedReport = {
        ...r,
        status: 'pending_admin_approval' as const,
        officerProofPhoto: proofPhotoDataUrl,
        resolvedPhotoDataUrl: proofPhotoDataUrl,
        officerNotes: officerNotes || 'Cleanup complete. Waste segregated and loaded into municipal tipper.',
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return updatedReport;
    }
    return r;
  });

  if (!updatedReport) throw new Error('Report not found');
  setItem(REPORTS_KEY, newReports);

  if (isSupabaseConfigured()) {
    updateReportInSupabase(reportId, 'pending_admin_approval', officerNotes, proofPhotoDataUrl).catch(console.warn);
  }

  return updatedReport;
}

/**
 * Admin Verifies Side-by-Side & Awards Dual Rewards to Both Roles
 */
export function adminApproveAndAwardDualRewards(
  reportId: string,
  citizenRewardPoints = 50,
  officerBountyRupees = 250,
  adminNotes = 'Verified by Zonal Commissioner. 100% compliance met.'
): Report {
  const reports = getReports();
  let targetReport: Report | null = null;

  const updatedReports = reports.map((r) => {
    if (r.id === reportId) {
      targetReport = {
        ...r,
        status: 'resolved' as const,
        citizenRewardAwarded: citizenRewardPoints,
        officerBountyAwarded: officerBountyRupees,
        adminNotes,
        updatedAt: new Date().toISOString(),
      };
      return targetReport;
    }
    return r;
  });

  if (!targetReport) throw new Error('Report not found');
  setItem(REPORTS_KEY, updatedReports);

  // 1. Award Citizen Civic Points
  const users = getUsers();
  const reportingCitizen = users.find((u) => u.id === (targetReport as any).userId || u.name === (targetReport as any).userName);
  if (reportingCitizen) {
    reportingCitizen.civicPoints = (reportingCitizen.civicPoints || 50) + citizenRewardPoints;
    reportingCitizen.badge = computeBadge(reportingCitizen);
    updateUser(reportingCitizen);
  }

  // 2. Award Officer Cash Bounty & Bounties Count
  const assignedOfficer = users.find(
    (u) => u.id === (targetReport as any).assignedOfficerId || u.employerId === (targetReport as any).assignedOfficerEmployerId
  );
  if (assignedOfficer) {
    assignedOfficer.officerEarnings = (assignedOfficer.officerEarnings || 0) + officerBountyRupees;
    assignedOfficer.officerBountiesCount = (assignedOfficer.officerBountiesCount || 0) + 1;
    updateUser(assignedOfficer);
  }

  if (isSupabaseConfigured()) {
    updateReportInSupabase(reportId, 'resolved', adminNotes, (targetReport as any).resolvedPhotoDataUrl).catch(console.warn);
  }

  return targetReport;
}

export function updateReportStatus(
  reportId: string,
  status: Report['status'],
  adminNotes?: string,
  resolvedPhotoDataUrl?: string
): void {
  const reports = getReports().map((r) =>
    r.id === reportId
      ? {
          ...r,
          status,
          adminNotes: adminNotes || r.adminNotes,
          resolvedPhotoDataUrl: resolvedPhotoDataUrl || r.resolvedPhotoDataUrl,
          updatedAt: new Date().toISOString(),
        }
      : r
  );
  setItem(REPORTS_KEY, reports);

  if (isSupabaseConfigured()) {
    updateReportInSupabase(reportId, status, adminNotes, resolvedPhotoDataUrl).catch(console.warn);
  }
}

// ──── Facilities & Rewards Redemptions ────

export function getFacilities(): Facility[] {
  const stored = getItem<Facility[]>(FACILITIES_KEY, []);
  if (stored.length === 0) {
    setItem(FACILITIES_KEY, SEED_FACILITIES);
    return SEED_FACILITIES;
  }
  return stored;
}

export function getRedeemedRewards(): RewardVoucher[] {
  return getItem<RewardVoucher[]>(REDEEMED_REWARDS_KEY, []);
}

export function redeemReward(reward: RewardVoucher): void {
  const user = getCurrentUser();
  if (!user) throw new Error('Not logged in');

  if (reward.targetRole === 'citizen') {
    const points = user.civicPoints || 50;
    if (points < reward.costValue) {
      throw new Error(`Insufficient Civic Points (Needed: ${reward.costValue}, Have: ${points}).`);
    }
    user.civicPoints = points - reward.costValue;
    updateUser(user);
  } else if (reward.targetRole === 'officer') {
    const earnings = user.officerEarnings || 0;
    if (earnings < reward.costValue) {
      throw new Error(`Insufficient Bounty Balance (Needed: ₹${reward.costValue}, Have: ₹${earnings}).`);
    }
    user.officerEarnings = earnings - reward.costValue;
    updateUser(user);
  }

  const existing = getRedeemedRewards();
  existing.unshift({
    ...reward,
    id: `red_${uuidv4().slice(0, 8)}`,
    code: `SWACHH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  });
  setItem(REDEEMED_REWARDS_KEY, existing);
}
