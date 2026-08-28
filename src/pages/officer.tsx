import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import {
  getCurrentUser,
  getNearbyOfficerTasks,
  acceptOfficerTask,
  submitOfficerProof,
  getReports,
  SEED_OFFICER_REWARDS,
  redeemReward,
  getRedeemedRewards,
  compressImage,
} from '@/lib/store';
import type { Report, User, RewardVoucher } from '@/lib/types';
import {
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  Navigation,
  Camera,
  Upload,
  Zap,
  Award,
  Wallet,
  Shield,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  Radio,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/lib/translations';

export default function OfficerPage() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const fileRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [nearbyTasks, setNearbyTasks] = useState<Report[]>([]);
  const [activeTask, setActiveTask] = useState<Report | null>(null);
  const [hasArrived, setHasArrived] = useState(false);
  const [proofPhoto, setProofPhoto] = useState<string | null>(null);
  const [officerNotes, setOfficerNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'radar' | 'wallet'>('radar');

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.replace('/login');
      return;
    }
    if (u.role !== 'officer' && u.role !== 'admin' && u.role !== 'ward_officer') {
      router.replace('/dashboard');
      return;
    }
    setUser(u);
    refreshTasks(u);
  }, [router]);

  const refreshTasks = (currentUser: User) => {
    const all = getReports();
    // Check if current officer already has an active task in progress
    const active = all.find(
      (r) =>
        (r.status === 'in_progress' || r.status === 'assigned') &&
        (r.assignedOfficerId === currentUser.id || r.assignedOfficerEmployerId === currentUser.employerId)
    );

    if (active) {
      setActiveTask(active);
      setHasArrived(true);
    } else {
      setActiveTask(null);
      setNearbyTasks(getNearbyOfficerTasks(12.9716, 77.5946));
    }
  };

  const handleAcceptTask = (task: Report) => {
    if (!user) return;
    try {
      const updated = acceptOfficerTask(task.id, user);
      setActiveTask(updated);
      setHasArrived(false);
      setProofPhoto(null);
      setSuccessToast(t.taskAcceptedToast);
      setTimeout(() => setSuccessToast(null), 4000);
      refreshTasks(user);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const compressed = await compressImage(reader.result as string, 800, 0.65);
        setProofPhoto(compressed);
      } catch {
        setProofPhoto(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitCompletion = () => {
    if (!activeTask || !proofPhoto) {
      alert(lang === 'hi' ? 'कृपया सफाई के बाद की फोटो अपलोड करें।' : 'Please upload after-cleanup photo proof.');
      return;
    }
    setSubmitting(true);
    try {
      submitOfficerProof(
        activeTask.id,
        proofPhoto,
        officerNotes || (lang === 'hi' ? 'कचरा साफ कर टिपर में लोड किया गया और चूना छिड़का गया।' : 'Site fully cleared and loaded into tipper.')
      );
      setSuccessToast(
        lang === 'hi'
          ? 'मिशन पूरा हुआ! सत्यापन के लिए प्रशासन को प्रेषित किया गया।'
          : 'Mission completed! Sent to Municipal Admin for final verification and bounty release.'
      );
      setTimeout(() => setSuccessToast(null), 5000);
      setActiveTask(null);
      setProofPhoto(null);
      setOfficerNotes('');
      if (user) refreshTasks(user);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRedeemOfficerReward = (reward: RewardVoucher) => {
    try {
      redeemReward(reward);
      const updatedUser = getCurrentUser();
      if (updatedUser) setUser(updatedUser);
      setSuccessToast(
        lang === 'hi'
          ? `वाउचर सफलतापूर्वक भुनाया गया! कोड: ${reward.code}`
          : `Reward redeemed successfully! Voucher code: ${reward.code}`
      );
      setTimeout(() => setSuccessToast(null), 5000);
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* ── Officer Command Header ── */}
        <div className="clay-card-3d p-6 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white rounded-3xl relative overflow-hidden shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl shadow-inner">
                🚛
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full">
                    {user.employerId || 'EMP-KA33-902'}
                  </span>
                  <span className="text-xs font-bold text-amber-100">
                    Tipper KA-33-E-1042
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight">{user.name}</h1>
                <p className="text-xs text-amber-100 font-medium">
                  {lang === 'hi' ? 'नगर निगम स्वच्छता प्रेषण एवं फील्ड ऑपरेटर' : 'Municipal Sanitation Driver & Field Operator'}
                </p>
              </div>
            </div>

            {/* Duty Status Switch */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsOnDuty(!isOnDuty)}
                className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all shadow-md ${
                  isOnDuty
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600 border border-emerald-300'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                }`}
              >
                <Radio size={14} className={isOnDuty ? 'animate-pulse text-white' : ''} />
                <span>{isOnDuty ? t.dutyOnline : t.dutyOffline}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Toast Notification ── */}
        {successToast && (
          <div className="p-4 bg-emerald-600 text-white rounded-2xl text-xs font-black flex items-center gap-3 shadow-lg animate-bounce-short">
            <Sparkles size={18} />
            <span>{successToast}</span>
          </div>
        )}

        {/* ── Sub Navigation Tabs ── */}
        <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'radar'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Radio size={14} />
            <span>{lang === 'hi' ? 'टास्क रडार एवं सक्रिय मिशन' : 'Task Radar & Active Mission'}</span>
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'wallet'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Wallet size={14} />
            <span>{lang === 'hi' ? 'कमाई वॉलेट एवं लाभ' : 'Earnings Wallet & Benefits'}</span>
          </button>
        </div>

        {/* ════════ TAB 1: RADAR & ACTIVE MISSION ════════ */}
        {activeTab === 'radar' && (
          <div className="space-y-6">
            {/* ── Active Task HUD (If Assigned) ── */}
            {activeTask && (
              <div className="clay-card-3d p-6 sm:p-8 bg-gradient-to-br from-amber-50 via-white to-orange-50 border-2 border-amber-300 rounded-3xl space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 pb-4">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-3 py-1 rounded-full">
                      ⚡ {t.activeTaskTitle}
                    </span>
                    <h2 className="text-xl font-black text-gray-900 mt-2">
                      {activeTask.wasteCategory.toUpperCase()} Blackspot Remediation
                    </h2>
                    <p className="text-xs text-gray-600 flex items-center gap-1.5 mt-1">
                      <MapPin size={13} className="text-amber-600" />
                      <span>{activeTask.address || `${activeTask.lat}, ${activeTask.lng}`}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-500 block">Bounty Payout</span>
                    <span className="text-2xl font-black text-amber-600">₹250</span>
                  </div>
                </div>

                {/* 3 Step Action HUD */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Step 1: Navigation */}
                  <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm space-y-3">
                    <span className="text-xs font-black text-gray-700 block">{t.taskStep1}</span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${activeTask.lat},${activeTask.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 bg-blue-50 text-blue-800 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-blue-200 transition"
                    >
                      <Navigation size={14} />
                      <span>Google Maps Navigation</span>
                    </a>
                    {!hasArrived ? (
                      <button
                        type="button"
                        onClick={() => setHasArrived(true)}
                        className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black transition"
                      >
                        {t.arrivedBtn}
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 size={13} /> On Site Active
                      </span>
                    )}
                  </div>

                  {/* Step 2: Site Photo Preview */}
                  <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm space-y-2">
                    <span className="text-xs font-black text-gray-700 block">Citizen Report Photo</span>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                      <img
                        src={activeTask.photoDataUrl}
                        alt="Dump Before"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium truncate">
                      Reported by: <b>{activeTask.userName}</b>
                    </p>
                  </div>

                  {/* Step 3: Upload Proof Photo */}
                  <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm space-y-3">
                    <span className="text-xs font-black text-gray-700 block">{t.taskStep3}</span>
                    <input
                      type="file"
                      ref={fileRef}
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />

                    {proofPhoto ? (
                      <div className="space-y-2">
                        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-emerald-300 relative">
                          <img
                            src={proofPhoto}
                            alt="After Cleanup Proof"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                            ✓ Proof Ready
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="w-full py-1.5 text-[11px] font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          {t.reuploadProofPhotoBtn}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="w-full py-6 border-2 border-dashed border-amber-300 rounded-xl flex flex-col items-center justify-center gap-1.5 text-amber-800 hover:bg-amber-50/50 transition cursor-pointer"
                      >
                        <Camera size={24} className="text-amber-600" />
                        <span className="text-xs font-black">{t.uploadProofPhotoBtn}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Remediation Notes & Submit */}
                <div className="space-y-3 pt-2">
                  <textarea
                    rows={2}
                    placeholder={t.officerNotesPlaceholder}
                    value={officerNotes}
                    onChange={(e) => setOfficerNotes(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-300 rounded-2xl text-xs font-medium focus:border-amber-500 focus:outline-none"
                  />

                  <button
                    type="button"
                    disabled={submitting || !proofPhoto}
                    onClick={handleSubmitCompletion}
                    className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition ${
                      proofPhoto
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-700 hover:to-teal-800 cursor-pointer'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <FileCheck size={18} />
                    <span>{submitting ? t.loading : t.completeMissionBtn}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ── Nearby Task Radar Queue (Rapido Style) ── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <Radio size={18} className="text-amber-600 animate-pulse" />
                    <span>{t.radarNearbyTitle}</span>
                  </h2>
                  <p className="text-xs text-gray-500">
                    {lang === 'hi'
                      ? 'निकटतम दूरी और कचरे की गंभीरता के आधार पर क्रमबद्ध'
                      : 'Sorted by live proximity radius and waste severity'}
                  </p>
                </div>
                <span className="text-xs font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
                  {nearbyTasks.length} {lang === 'hi' ? 'उपलब्ध डंप' : 'Available'}
                </span>
              </div>

              {nearbyTasks.length === 0 ? (
                <div className="clay-card-3d p-12 text-center bg-white rounded-3xl space-y-3">
                  <span className="text-4xl">🎉</span>
                  <h3 className="text-lg font-black text-gray-800">{t.radarNoTasks}</h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    {lang === 'hi'
                      ? 'जैसे ही कोई नागरिक नए कचरे की रिपोर्ट करेगा, आपका प्रेषण रडार तुरंत सूचना देगा।'
                      : 'As soon as citizens report new illegal dump sites, they will appear here with live distance indicators.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nearbyTasks.map((task) => (
                    <div
                      key={task.id}
                      className="clay-card-3d p-5 bg-white rounded-2xl border-2 border-amber-100 hover:border-amber-400 transition-all space-y-4 shadow-md flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                            📍 {task.distanceKm || 0.8} km away
                          </span>
                          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            +₹250 Bounty
                          </span>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                            <img
                              src={task.photoDataUrl}
                              alt="Dump Thumbnail"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-0.5 flex-1">
                            <h3 className="text-sm font-black text-gray-900 leading-tight">
                              {task.wasteCategory.toUpperCase()} Dump Site
                            </h3>
                            <p className="text-[11px] text-gray-500 font-medium line-clamp-2">
                              {task.address || task.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                        <span className="text-[10px] text-gray-400 font-bold">
                          Reported by: {task.userName}
                        </span>
                        <button
                          type="button"
                          disabled={!!activeTask}
                          onClick={() => handleAcceptTask(task)}
                          className={`py-2 px-4 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm ${
                            activeTask
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer'
                          }`}
                        >
                          <span>{t.acceptTaskBtn}</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════ TAB 2: OFFICER EARNINGS & REWARDS WALLET ════════ */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            {/* Wallet Balance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="clay-card-3d p-6 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl space-y-2 shadow-lg">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-100">
                  {t.officerTotalEarned}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">₹{user.officerEarnings || 1250}</span>
                </div>
                <p className="text-xs text-emerald-100">
                  {lang === 'hi' ? 'प्रत्यक्ष बैंक ट्रांसफर हेतु उपलब्ध शेष' : 'Available for direct instant bank withdrawal'}
                </p>
              </div>

              <div className="clay-card-3d p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl space-y-2 shadow-lg">
                <span className="text-xs font-black uppercase tracking-wider text-amber-100">
                  {t.officerBountiesCount}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">{user.officerBountiesCount || 5}</span>
                </div>
                <p className="text-xs text-amber-100">
                  {lang === 'hi' ? '100% नगरपालिका सत्यापन दर' : '100% Municipal SLA Compliance Rate'}
                </p>
              </div>
            </div>

            {/* Officer Rewards Catalog */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-gray-900">{t.officerRewardsTitle}</h2>
                <p className="text-xs text-gray-500">{t.officerRewardsSubtitle}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SEED_OFFICER_REWARDS.map((reward) => (
                  <div
                    key={reward.id}
                    className="clay-card-3d p-5 bg-white rounded-2xl border border-gray-200 flex flex-col justify-between space-y-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl p-2 rounded-xl bg-amber-50 border border-amber-100">
                        {reward.icon}
                      </span>
                      <div className="space-y-1">
                        <h3 className="text-sm font-black text-gray-900">{reward.title}</h3>
                        <p className="text-xs text-gray-500">{reward.description}</p>
                        <span className="inline-block text-[11px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          {reward.discountValue}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs font-black text-gray-800">
                        Cost: ₹{reward.costValue} Bounty
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRedeemOfficerReward(reward)}
                        className="clay-btn-green text-white text-xs font-black px-4 py-2 rounded-xl"
                      >
                        {lang === 'hi' ? 'वाउचर भुनाएं' : 'Redeem Payout'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
