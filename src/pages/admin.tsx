import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import {
  getReports,
  adminApproveAndAwardDualRewards,
  updateReportStatus,
  getCurrentUser,
} from '@/lib/store';
import type { Report, User } from '@/lib/types';
import {
  Shield,
  Clock,
  CheckCircle2,
  Eye,
  MapPin,
  Image as ImageIcon,
  ExternalLink,
  X,
  AlertTriangle,
  Sparkles,
  Award,
  Filter,
  Download,
  Volume2,
  Camera,
  CheckCheck,
  Truck,
  User as UserIcon,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '@/lib/translations';

export default function AdminPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();

  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending_admin_approval' | 'in_progress' | 'pending_assignment' | 'resolved'>('all');

  // Side-by-Side Dual Rewards Verification Modal
  const [verifyingReport, setVerifyingReport] = useState<Report | null>(null);
  const [citizenPointsReward, setCitizenPointsReward] = useState(50);
  const [officerBountyReward, setOfficerBountyReward] = useState(250);
  const [adminInspectionNotes, setAdminInspectionNotes] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.replace('/login');
      return;
    }
    if (u.role !== 'admin') {
      router.replace('/dashboard');
      return;
    }
    setUser(u);
    setReports(getReports());
  }, [router]);

  const handleOpenVerifyModal = (report: Report) => {
    setVerifyingReport(report);
    setCitizenPointsReward(50);
    setOfficerBountyReward(250);
    setAdminInspectionNotes(
      lang === 'hi'
        ? 'ज़ोनल कमिश्नर द्वारा सत्यापित: स्थल पूर्णतः स्वच्छ है एवं कचरा वैज्ञानिक रूप से प्रसंस्कृत किया गया।'
        : 'Verified by Zonal Commissioner: 100% remediation standard achieved.'
    );
  };

  const handleApproveDualRewards = () => {
    if (!verifyingReport) return;
    adminApproveAndAwardDualRewards(
      verifyingReport.id,
      citizenPointsReward,
      officerBountyReward,
      adminInspectionNotes
    );
    setReports(getReports());
    setVerifyingReport(null);
    setSuccessToast(t.adminApprovalSuccess);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  const exportAuditCSV = () => {
    const headers = [
      'Report ID',
      'Citizen Name',
      'Waste Category',
      'Severity',
      'Address',
      'Latitude',
      'Longitude',
      'Status',
      'Assigned Officer',
      'Citizen Points Awarded',
      'Officer Bounty Awarded (INR)',
      'Created At',
      'Completed At',
    ];
    const rows = reports.map((r) => [
      r.id,
      `"${r.userName}"`,
      r.wasteCategory,
      r.severity,
      `"${r.address || ''}"`,
      r.lat,
      r.lng,
      r.status,
      `"${r.assignedOfficerName || r.assignedTipper || 'Unassigned'}"`,
      r.citizenRewardAwarded || 0,
      r.officerBountyAwarded || 0,
      r.createdAt,
      r.completedAt || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Swachh_Bharat_Municipal_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user || user.role !== 'admin') return null;

  const counts = {
    all: reports.length,
    pending_admin_approval: reports.filter((r) => r.status === 'pending_admin_approval').length,
    in_progress: reports.filter((r) => r.status === 'in_progress' || r.status === 'assigned').length,
    pending_assignment: reports.filter((r) => r.status === 'pending_assignment' || r.status === 'pending').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
  };

  const filteredReports = reports.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'pending_admin_approval') return r.status === 'pending_admin_approval';
    if (filter === 'in_progress') return r.status === 'in_progress' || r.status === 'assigned';
    if (filter === 'pending_assignment') return r.status === 'pending_assignment' || r.status === 'pending';
    if (filter === 'resolved') return r.status === 'resolved';
    return true;
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ── Admin Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-purple-900 bg-purple-100 px-3 py-1 rounded-full mb-2">
              <Shield size={14} />
              <span>{lang === 'hi' ? 'ज़ोनल कमिश्नर नियंत्रण प्राधिकरण' : 'Zonal Commissioner Control Authority'}</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {t.adminTitle}
            </h1>
            <p className="text-gray-600 text-sm mt-0.5">
              {t.adminSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportAuditCSV}
              className="clay-card-3d hover:bg-purple-50 text-purple-950 font-extrabold px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs border border-purple-300 shadow-sm transition"
            >
              <Download size={15} />
              <span>{t.exportCsvBtn}</span>
            </button>
          </div>
        </div>

        {/* ── Success Toast ── */}
        {successToast && (
          <div className="p-4 bg-emerald-600 text-white rounded-2xl text-xs font-black flex items-center gap-3 shadow-lg">
            <Sparkles size={18} />
            <span>{successToast}</span>
          </div>
        )}

        {/* ── KPI Stat Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="clay-card-3d p-5 bg-white rounded-2xl border border-purple-100 space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              {t.totalIncidents}
            </span>
            <span className="text-3xl font-black text-gray-900">{counts.all}</span>
          </div>

          <div className="clay-card-3d p-5 bg-purple-50 border-2 border-purple-300 rounded-2xl space-y-1">
            <span className="text-[11px] font-black text-purple-900 uppercase tracking-wider block">
              ⚡ {t.awaitingReview}
            </span>
            <span className="text-3xl font-black text-purple-900">{counts.pending_admin_approval}</span>
          </div>

          <div className="clay-card-3d p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
              🚛 In Progress
            </span>
            <span className="text-3xl font-black text-amber-800">{counts.in_progress}</span>
          </div>

          <div className="clay-card-3d p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
            <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">
              ✓ {t.resolvedVerified}
            </span>
            <span className="text-3xl font-black text-emerald-800">{counts.resolved}</span>
          </div>
        </div>

        {/* ── Status Filter Tabs ── */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition ${
              filter === 'all' ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {lang === 'hi' ? 'सभी घटनाएं' : 'All Reports'} ({counts.all})
          </button>
          <button
            onClick={() => setFilter('pending_admin_approval')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition ${
              filter === 'pending_admin_approval'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-purple-900 hover:bg-purple-50'
            }`}
          >
            ⚡ {t.awaitingReview} ({counts.pending_admin_approval})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition ${
              filter === 'in_progress' ? 'bg-amber-500 text-white shadow-sm' : 'bg-white text-amber-900 hover:bg-amber-50'
            }`}
          >
            🚛 {lang === 'hi' ? 'सफाई जारी' : 'In Progress'} ({counts.in_progress})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition ${
              filter === 'resolved' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            ✓ {t.resolvedVerified} ({counts.resolved})
          </button>
        </div>

        {/* ── Reports Incident Table / Cards ── */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="clay-card-3d p-12 text-center bg-white rounded-3xl space-y-2">
              <span className="text-3xl">📋</span>
              <p className="text-sm font-black text-gray-700">
                {lang === 'hi' ? 'इस श्रेणी में कोई घटना नहीं मिली।' : 'No reports found matching this filter.'}
              </p>
            </div>
          ) : (
            filteredReports.map((report) => {
              const isAwaiting = report.status === 'pending_admin_approval';
              return (
                <div
                  key={report.id}
                  className={`clay-card-3d p-5 rounded-2xl bg-white border-2 transition-all space-y-4 shadow-sm ${
                    isAwaiting
                      ? 'border-purple-300 bg-purple-50/20 shadow-md'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black uppercase tracking-wider bg-gray-100 text-gray-800 px-2.5 py-1 rounded-lg">
                        {report.wasteCategory}
                      </span>
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-full ${
                          report.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : isAwaiting
                            ? 'bg-purple-100 text-purple-900 border border-purple-300 animate-pulse'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {report.status === 'resolved'
                          ? '✓ ' + t.resolved
                          : isAwaiting
                          ? '⚡ ' + t.awaitingAdmin
                          : '🚛 ' + report.status}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 font-bold">
                      {new Date(report.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    {/* Before Photo */}
                    <div className="sm:col-span-3 flex items-center gap-3">
                      <div
                        onClick={() => setLightboxImg(report.photoDataUrl)}
                        className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer relative group border border-gray-200"
                      >
                        <img
                          src={report.photoDataUrl}
                          alt="Citizen Dump"
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <span className="absolute bottom-1 left-1 text-[8px] font-black bg-black/60 text-white px-1 rounded">
                          Before
                        </span>
                      </div>

                      {/* After Photo Preview (If uploaded by Officer) */}
                      {report.officerProofPhoto && (
                        <div
                          onClick={() => setLightboxImg(report.officerProofPhoto || null)}
                          className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer relative group border-2 border-emerald-300"
                        >
                          <img
                            src={report.officerProofPhoto}
                            alt="After Proof"
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                          <span className="absolute bottom-1 left-1 text-[8px] font-black bg-emerald-700 text-white px-1 rounded">
                            After ✓
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Incident Details */}
                    <div className="sm:col-span-6 space-y-1">
                      <p className="text-xs font-black text-gray-900">
                        {report.address || report.description}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Citizen: <b>{report.userName}</b> • Assigned: <b>{report.assignedOfficerName || report.assignedTipper || 'Pending'}</b>
                      </p>
                      {report.officerNotes && (
                        <p className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 font-medium">
                          Officer Note: {report.officerNotes}
                        </p>
                      )}
                      {report.citizenRewardAwarded && (
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Citizen Awarded: +{report.citizenRewardAwarded} pts
                          </span>
                          <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                            Officer Bounty: ₹{report.officerBountyAwarded}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="sm:col-span-3 flex justify-end">
                      {isAwaiting ? (
                        <button
                          type="button"
                          onClick={() => handleOpenVerifyModal(report)}
                          className="clay-btn-green text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 shine-sweep-effect shadow-md"
                        >
                          <Sparkles size={14} />
                          <span>{lang === 'hi' ? 'समीक्षा एवं दोहरे पुरस्कार' : 'Verify & Award Rewards'}</span>
                        </button>
                      ) : report.status === 'resolved' ? (
                        <span className="text-xs font-black text-emerald-800 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <CheckCheck size={15} /> Verified
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl">
                          {report.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ════════ SIDE-BY-SIDE BEFORE / AFTER VERIFICATION MODAL ════════ */}
        {verifyingReport && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="clay-card-3d bg-white w-full max-w-4xl p-6 sm:p-8 rounded-3xl space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">
                    🏆
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-gray-900">
                      {lang === 'hi' ? 'सफाई सत्यापन एवं दोहरे पुरस्कार निर्धारण' : 'Dual Role Verification & Reward Desk'}
                    </h2>
                    <p className="text-xs text-gray-500">Incident #{verifyingReport.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setVerifyingReport(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Before Cleanup (Citizen) */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-gray-800">
                      1. {t.beforeCleanup}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500">
                      By: {verifyingReport.userName}
                    </span>
                  </div>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black/5 border border-gray-300">
                    <img
                      src={verifyingReport.photoDataUrl}
                      alt="Before Cleanup"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[11px] text-gray-600 font-medium">
                    {verifyingReport.address || verifyingReport.description}
                  </p>
                </div>

                {/* Right: After Cleanup (Officer) */}
                <div className="p-4 bg-emerald-50/70 rounded-2xl border-2 border-emerald-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-950">
                      2. {t.afterCleanup}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800">
                      Officer: {verifyingReport.assignedOfficerName || 'Ramesh Kumar'}
                    </span>
                  </div>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black/5 border border-emerald-300">
                    <img
                      src={verifyingReport.officerProofPhoto || verifyingReport.resolvedPhotoDataUrl || verifyingReport.photoDataUrl}
                      alt="After Cleanup Proof"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[11px] text-emerald-900 font-medium">
                    {verifyingReport.officerNotes || 'Remediation completed.'}
                  </p>
                </div>
              </div>

              {/* Dual Role Rewards Allocation */}
              <div className="p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-emerald-50 rounded-2xl border border-purple-200 space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-purple-950 block">
                  🎁 Role-Based Dual Reward Allocation
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Citizen Reward */}
                  <div className="p-3 bg-white rounded-xl border border-purple-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800">Citizen Award</span>
                      <span className="text-xs font-black text-emerald-700">+{citizenPointsReward} Points</span>
                    </div>
                    <p className="text-[10px] text-gray-500">
                      Awarded to {verifyingReport.userName} for tax rebates and free compost.
                    </p>
                  </div>

                  {/* Officer Bounty */}
                  <div className="p-3 bg-white rounded-xl border border-purple-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800">Officer Bounty</span>
                      <span className="text-xs font-black text-amber-600">₹{officerBountyReward} Direct Payout</span>
                    </div>
                    <p className="text-[10px] text-gray-500">
                      Credited to sanitation driver wallet for cleanup execution.
                    </p>
                  </div>
                </div>

                {/* Commissioner Remarks */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 block">
                    {t.adminNotesLabel}
                  </label>
                  <input
                    type="text"
                    value={adminInspectionNotes}
                    onChange={(e) => setAdminInspectionNotes(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setVerifyingReport(null)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleApproveDualRewards}
                  className="clay-btn-green text-white text-xs font-black px-6 py-3 rounded-xl flex items-center gap-2 shine-sweep-effect"
                >
                  <Award size={16} />
                  <span>{t.approveDualRewardsBtn}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        {lightboxImg && (
          <div
            onClick={() => setLightboxImg(null)}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl">
              <img src={lightboxImg} alt="Enlarged view" className="w-full h-full object-contain" />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
