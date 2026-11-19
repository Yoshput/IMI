"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Instagram,
  Video,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Package,
  Calendar,
  Save,
  AlertCircle,
  HelpCircle,
  Shield,
  Layers,
} from "lucide-react";
import {
  Creator,
  PlatformType,
  ContentCategoryType,
  PriorityLevelType,
  PartnershipType,
  PipelineStage,
} from "../types";
import {
  PIPELINE_STAGES,
  CONTENT_CATEGORIES,
  LOCATIONS_LIST,
} from "../constants";

interface CreatorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (creator: Creator) => void;
  initialData?: Creator | null;
}

export const CreatorFormModal: React.FC<CreatorFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState<"identity" | "audience" | "evaluation" | "collaboration">("identity");

  // Form states
  const [name, setName] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [tiktokHandle, setTiktokHandle] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [city, setCity] = useState("Purwokerto");
  const [customCity, setCustomCity] = useState("");
  const [contactWa, setContactWa] = useState("");
  const [email, setEmail] = useState("");

  // Audience
  const [platform, setPlatform] = useState<PlatformType>("instagram");
  const [instagramFollowers, setInstagramFollowers] = useState<number>(25000);
  const [tiktokFollowers, setTiktokFollowers] = useState<number>(0);
  const [avgViews, setAvgViews] = useState<number>(12000);
  const [avgLikes, setAvgLikes] = useState<number>(1500);
  const [avgComments, setAvgComments] = useState<number>(75);
  const [engagementRate, setEngagementRate] = useState<number>(5.5);
  const [primaryAudience, setPrimaryAudience] = useState("Audiens Jawa Tengah & Gen Z (18–26 thn)");
  const [category, setCategory] = useState<ContentCategoryType>("aesthetic_lifestyle");

  // Evaluation
  const [visualScore, setVisualScore] = useState<number>(8);
  const [brandingScore, setBrandingScore] = useState<number>(8);
  const [reachScore, setReachScore] = useState<number>(7);
  const [contentQualityScore, setContentQualityScore] = useState<number>(8);
  const [priorityLevel, setPriorityLevel] = useState<PriorityLevelType>("visual");
  const [internalNotes, setInternalNotes] = useState("");

  // Collaboration
  const [partnershipType, setPartnershipType] = useState<PartnershipType>("product_barter");
  const [productSent, setProductSent] = useState("1 Paket Kacamata Lengkap (Frame Pilihan + Lensa Anti-Radiasi Blue Ray)");
  const [estimatedProductValue, setEstimatedProductValue] = useState<number>(450000);
  const [shippingCost, setShippingCost] = useState<number>(25000);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [courierReceipt, setCourierReceipt] = useState("");
  const [contactDate, setContactDate] = useState("2026-11-19");
  const [stage, setStage] = useState<PipelineStage>("candidate_identified");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [contentDeadline, setContentDeadline] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [publishedUrl, setPublishedUrl] = useState("");
  const [deliverables, setDeliverables] = useState("1 Video Reels Try-On/Review + 2 Instagram Stories + Tag @iseeyou.glasses");

  // Error validation
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Synchronize initialData when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setInstagramHandle(initialData.instagramHandle || "");
      setInstagramUrl(initialData.instagramUrl || "");
      setTiktokHandle(initialData.tiktokHandle || "");
      setTiktokUrl(initialData.tiktokUrl || "");
      setProfileImg(initialData.profileImg || "");

      const isPresetCity = LOCATIONS_LIST.includes(initialData.city);
      if (isPresetCity) {
        setCity(initialData.city);
        setCustomCity("");
      } else {
        setCity("Lainnya");
        setCustomCity(initialData.city || "");
      }

      setContactWa(initialData.contactWa || "");
      setEmail(initialData.email || "");

      setPlatform(initialData.platform || "instagram");
      setInstagramFollowers(initialData.instagramFollowers || 0);
      setTiktokFollowers(initialData.tiktokFollowers || 0);
      setAvgViews(initialData.avgViews || 0);
      setAvgLikes(initialData.avgLikes || 0);
      setAvgComments(initialData.avgComments || 0);
      setEngagementRate(initialData.engagementRate || 0);
      setPrimaryAudience(initialData.primaryAudience || "Audiens Jawa Tengah & Gen Z");
      setCategory(initialData.category || "aesthetic_lifestyle");

      if (initialData.evaluation) {
        setVisualScore(initialData.evaluation.visualScore || 8);
        setBrandingScore(initialData.evaluation.brandingScore || 8);
        setReachScore(initialData.evaluation.reachScore || 7);
        setContentQualityScore(initialData.evaluation.contentQualityScore || 8);
        setPriorityLevel(initialData.evaluation.priorityLevel || "visual");
        setInternalNotes(initialData.evaluation.internalNotes || "");
      }

      if (initialData.collaboration) {
        setPartnershipType(initialData.collaboration.partnershipType || "product_barter");
        setProductSent(initialData.collaboration.productSent || "");
        setEstimatedProductValue(initialData.collaboration.estimatedProductValue || 450000);
        setShippingCost(initialData.collaboration.shippingCost || 25000);
        setDeliveryAddress(initialData.collaboration.deliveryAddress || "");
        setRecipientPhone(initialData.collaboration.recipientPhone || "");
        setCourierReceipt(initialData.collaboration.courierReceipt || "");
        setContactDate(initialData.collaboration.contactDate || "2026-11-19");
        setStage(initialData.collaboration.stage || "candidate_identified");
        setNextFollowUpDate(initialData.collaboration.nextFollowUpDate || "");
        setContentDeadline(initialData.collaboration.contentDeadline || "");
        setPublicationDate(initialData.collaboration.publicationDate || "");
        setPublishedUrl(initialData.collaboration.publishedUrl || "");
        setDeliverables(initialData.collaboration.deliverables || "");
      }
    } else {
      // Reset form to defaults
      setName("");
      setInstagramHandle("");
      setInstagramUrl("");
      setTiktokHandle("");
      setTiktokUrl("");
      setProfileImg("");
      setCity("Purwokerto");
      setCustomCity("");
      setContactWa("");
      setEmail("");
      setPlatform("instagram");
      setInstagramFollowers(25000);
      setTiktokFollowers(0);
      setAvgViews(12000);
      setAvgLikes(1500);
      setAvgComments(75);
      setEngagementRate(5.5);
      setPrimaryAudience("Audiens Jawa Tengah & Gen Z (18–26 thn)");
      setCategory("aesthetic_lifestyle");
      setVisualScore(8);
      setBrandingScore(8);
      setReachScore(7);
      setContentQualityScore(8);
      setPriorityLevel("visual");
      setInternalNotes("");
      setPartnershipType("product_barter");
      setProductSent("1 Paket Kacamata Lengkap (Frame Pilihan + Lensa Anti-Radiasi Blue Ray)");
      setEstimatedProductValue(450000);
      setShippingCost(25000);
      setDeliveryAddress("");
      setRecipientPhone("");
      setCourierReceipt("");
      setContactDate(new Date().toISOString().slice(0, 10));
      setStage("candidate_identified");
      setNextFollowUpDate("");
      setContentDeadline("");
      setPublicationDate("");
      setPublishedUrl("");
      setDeliverables("1 Video Reels Try-On/Review + 2 Instagram Stories + Tag @iseeyou.glasses");
    }
    setErrorMsg(null);
  }, [initialData, isOpen]);

  // Handle IG change auto URL
  const handleIgChange = (val: string) => {
    const clean = val.replace(/[@]/g, "").trim();
    setInstagramHandle(clean);
    if (clean) {
      setInstagramUrl(`https://www.instagram.com/${clean}/`);
    } else {
      setInstagramUrl("");
    }
  };

  // Handle TikTok change auto URL
  const handleTiktokChange = (val: string) => {
    const clean = val.replace(/[@]/g, "").trim();
    setTiktokHandle(clean);
    if (clean) {
      setTiktokUrl(`https://www.tiktok.com/@${clean}`);
    } else {
      setTiktokUrl("");
    }
  };

  // Calculate potential score (0–100)
  // Bobot: 35% visual, 25% branding, 20% reach, 20% content quality
  const calculatedPotential = Math.min(
    100,
    Math.round(
      visualScore * 3.5 +
        brandingScore * 2.5 +
        reachScore * 2.0 +
        contentQualityScore * 2.0
    )
  );

  // Auto suggestion for followersFormatted
  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg("Nama Creator wajib diisi.");
      setActiveTab("identity");
      return;
    }
    if (!instagramHandle.trim()) {
      setErrorMsg("Username Instagram wajib diisi.");
      setActiveTab("identity");
      return;
    }

    const finalCity = city === "Lainnya" ? (customCity.trim() || "Nasional") : city;
    const finalWa = contactWa.trim() || "-";

    const updatedCreator: Creator = {
      id: initialData?.id || `kol-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      instagramHandle: instagramHandle.trim(),
      instagramUrl: instagramUrl.trim() || `https://www.instagram.com/${instagramHandle.trim()}/`,
      tiktokHandle: tiktokHandle.trim() || undefined,
      tiktokUrl: tiktokUrl.trim() || undefined,
      profileImg: profileImg.trim() || undefined,
      city: finalCity,
      contactWa: finalWa,
      email: email.trim() || undefined,

      platform,
      instagramFollowers: Number(instagramFollowers) || 0,
      tiktokFollowers: Number(tiktokFollowers) || 0,
      followersFormatted: formatFollowers(Number(instagramFollowers) || 0),
      avgViews: Number(avgViews) || 0,
      avgLikes: Number(avgLikes) || 0,
      avgComments: Number(avgComments) || 0,
      engagementRate: Number(engagementRate) || 0,
      primaryAudience: primaryAudience.trim(),
      category,

      evaluation: {
        visualScore: Number(visualScore),
        brandingScore: Number(brandingScore),
        reachScore: Number(reachScore),
        contentQualityScore: Number(contentQualityScore),
        potentialScore: calculatedPotential,
        internalNotes: internalNotes.trim(),
        priorityLevel,
        evaluatedAt: initialData?.evaluation?.evaluatedAt || new Date().toISOString().slice(0, 10),
        evaluatedBy: initialData?.evaluation?.evaluatedBy || "Tim Marketing Optik I See You",
      },

      collaboration: {
        partnershipType,
        productSent: productSent.trim() || "1 Paket Kacamata Lengkap",
        estimatedProductValue: Number(estimatedProductValue) || 450000,
        shippingCost: Number(shippingCost) || 25000,
        deliveryAddress: deliveryAddress.trim() || undefined,
        recipientPhone: recipientPhone.trim() || (finalWa !== "-" ? finalWa : undefined),
        courierReceipt: courierReceipt.trim() || undefined,
        contactDate: contactDate || new Date().toISOString().slice(0, 10),
        responseStatus: stage === "candidate_identified" ? "not_contacted" : "replied",
        stage,
        nextFollowUpDate: nextFollowUpDate || undefined,
        contentDeadline: contentDeadline || undefined,
        publicationDate: publicationDate || undefined,
        publishedUrl: publishedUrl.trim() || undefined,
        deliverables: deliverables.trim() || "1 Video Reels Try-On/Review + 2 Stories",
        viewsCount: initialData?.collaboration?.viewsCount,
        likesCount: initialData?.collaboration?.likesCount,
        commentsCount: initialData?.collaboration?.commentsCount,
        statusHistory: initialData?.collaboration?.statusHistory || [
          {
            stage,
            timestamp: new Date().toLocaleString("id-ID"),
            note: "Registrasi creator baru ke database",
            updatedBy: "Marketing Staff",
          },
        ],
      },

      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedCreator);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {initialData ? "Edit Data KOL & Creator" : "Tambah Creator Baru"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pusat data profil, scoring evaluasi visual vs jangkauan, dan rencana barter produk
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 px-6 pt-2 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("identity")}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "identity"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            1. Profil & Identitas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("audience")}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "audience"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            2. Audiens & Metrik
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("evaluation")}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "evaluation"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            3. Evaluasi & Prioritas ({calculatedPotential}/100)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("collaboration")}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "collaboration"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            4. Barter Produk & Alamat
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: IDENTITAS */}
          {activeTab === "identity" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap / Panggilan Creator <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Salma Nabilla"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kota Domisili <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                    >
                      {LOCATIONS_LIST.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                      <option value="Lainnya">Lainnya (Tulis Manual)</option>
                    </select>

                    {city === "Lainnya" && (
                      <input
                        type="text"
                        placeholder="Nama Kota/Daerah"
                        value={customCity}
                        onChange={(e) => setCustomCity(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Instagram Handle <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
                    <input
                      type="text"
                      required
                      value={instagramHandle}
                      onChange={(e) => handleIgChange(e.target.value)}
                      placeholder="salmanabilla"
                      className="w-full pl-8 pr-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Link Profil Instagram
                  </label>
                  <input
                    type="url"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://www.instagram.com/username/"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    TikTok Handle (Opsional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
                    <input
                      type="text"
                      value={tiktokHandle}
                      onChange={(e) => handleTiktokChange(e.target.value)}
                      placeholder="salmanabilla.daily"
                      className="w-full pl-8 pr-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor WhatsApp / Kontak <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={contactWa}
                      onChange={(e) => setContactWa(e.target.value)}
                      placeholder="081234567890"
                      className="w-full pl-10 pr-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    URL Foto Profil (Opsional)
                  </label>
                  <input
                    type="url"
                    value={profileImg}
                    onChange={(e) => setProfileImg(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email (Opsional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contact@creator.com"
                      className="w-full pl-10 pr-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUDIENCE */}
          {activeTab === "audience" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Platform Utama
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as PlatformType)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="multi">Multiplatform (IG + TikTok)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Followers Instagram
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={instagramFollowers}
                    onChange={(e) => setInstagramFollowers(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Followers TikTok (Jika Ada)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={tiktokFollowers}
                    onChange={(e) => setTiktokFollowers(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rata-rata Views
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={avgViews}
                    onChange={(e) => setAvgViews(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rata-rata Likes
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={avgLikes}
                    onChange={(e) => setAvgLikes(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rata-rata Komentar
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={avgComments}
                    onChange={(e) => setAvgComments(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Engagement Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={engagementRate}
                    onChange={(e) => setEngagementRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Konten Utama
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ContentCategoryType)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                  >
                    {CONTENT_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Karakteristik Audiens Utama
                  </label>
                  <input
                    type="text"
                    value={primaryAudience}
                    onChange={(e) => setPrimaryAudience(e.target.value)}
                    placeholder="Contoh: Wanita Hijabers & Mahasiswa 18–25 thn"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EVALUATION & PRIORITAS */}
          {activeTab === "evaluation" && (
            <div className="space-y-5">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Strategi Seleksi & Kategori Prioritas</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Total Skor Potensial:</span>
                    <span className="ml-2 text-base font-bold text-emerald-600 dark:text-emerald-400">
                      {calculatedPotential}/100
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      priorityLevel === "visual"
                        ? "bg-purple-500/10 border-purple-500/30 ring-2 ring-purple-500/20"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <input
                      type="radio"
                      name="priorityLevel"
                      checked={priorityLevel === "visual"}
                      onChange={() => setPriorityLevel("visual")}
                      className="mt-1 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <p className="text-xs font-bold text-purple-700 dark:text-purple-300">
                        Category A — Visual Priority
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Daya tarik visual kuat, estetik, fotogenik, personal branding cocok dengan kacamata. Micro-influencer sangat diterima!
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      priorityLevel === "reach"
                        ? "bg-blue-500/10 border-blue-500/30 ring-2 ring-blue-500/20"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <input
                      type="radio"
                      name="priorityLevel"
                      checked={priorityLevel === "reach"}
                      onChange={() => setPriorityLevel("reach")}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="text-xs font-bold text-blue-700 dark:text-blue-300">
                        Category B — Reach Priority
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Followers besar dan sebaran jangkauan luas untuk awareness massal kampanye kacamata di media sosial.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* 4 Score Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Visual Appeal Score (Bobot 35%)
                    </span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{visualScore}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={visualScore}
                    onChange={(e) => setVisualScore(Number(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                  <p className="text-[11px] text-slate-400">
                    Kesesuaian wajah, fotogenik, dan look saat memakai frame kacamata
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Branding Compatibility (Bobot 25%)
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{brandingScore}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={brandingScore}
                    onChange={(e) => setBrandingScore(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <p className="text-[11px] text-slate-400">
                    Kesesuaian persona creator dengan identitas modern Optik I See You
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Audience Reach Score (Bobot 20%)
                    </span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{reachScore}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={reachScore}
                    onChange={(e) => setReachScore(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <p className="text-[11px] text-slate-400">
                    Jumlah pengikut aktif dan sebaran audiens di daerah target
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Content Quality (Bobot 20%)
                    </span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{contentQualityScore}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={contentQualityScore}
                    onChange={(e) => setContentQualityScore(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                  <p className="text-[11px] text-slate-400">
                    Kualitas video, lighting, artikulasi bicara, dan konsistensi posting
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Evaluasi Internal Tim Marketing
                </label>
                <textarea
                  rows={2}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Contoh: Cocok untuk campaign kacamata anti radiasi mahasiswa atau hijab fashion..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* TAB 4: BARTER PRODUK & ALAMAT */}
          {activeTab === "collaboration" && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-emerald-600" />
                  SOP Barter Produk Optik I See You
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Produk kacamata resmi dikirimkan langsung ke alamat rumah creator. Creator <strong>tidak perlu datang / visit ke toko</strong> dan dapat berpartisipasi dari seluruh wilayah Indonesia.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tahapan Pipeline Saat Ini
                  </label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as PipelineStage)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                  >
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipe Kemitraan
                  </label>
                  <select
                    value={partnershipType}
                    onChange={(e) => setPartnershipType(e.target.value as PartnershipType)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                  >
                    <option value="product_barter">Product Barter (Kacamata Gratis Kirim ke Rumah)</option>
                    <option value="paid">Paid Collaboration</option>
                    <option value="hybrid">Hybrid (Barter Produk + Fee Tambahan)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Paket Produk yang Dikirimkan
                  </label>
                  <input
                    type="text"
                    value={productSent}
                    onChange={(e) => setProductSent(e.target.value)}
                    placeholder="1 Frame Hexagonal Pastel + Lensa Blue Ray"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Estimasi Nilai Produk (Rp)
                    </label>
                    <input
                      type="number"
                      step="10000"
                      value={estimatedProductValue}
                      onChange={(e) => setEstimatedProductValue(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Ongkir (Rp)
                    </label>
                    <input
                      type="number"
                      step="5000"
                      value={shippingCost}
                      onChange={(e) => setShippingCost(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Alamat Pengiriman Rumah Creator (Akses Internal Terbatas)
                  </label>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Privasi Terproteksi
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Jl. Merdeka No. 12, RT 02/04, Kel. Bancarkembar, Kec. Purwokerto Utara, Kab. Banyumas 53121"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    No HP Penerima Paket
                  </label>
                  <input
                    type="text"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor Resi Pengiriman
                  </label>
                  <input
                    type="text"
                    value={courierReceipt}
                    onChange={(e) => setCourierReceipt(e.target.value)}
                    placeholder="Contoh: JP123456789"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Deadline Tayang Konten
                  </label>
                  <input
                    type="date"
                    value={contentDeadline}
                    onChange={(e) => setContentDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Deliverables yang Disepakati
                </label>
                <input
                  type="text"
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  placeholder="Contoh: 1 Reels IG Try-On + 2 Stories + Tag @iseeyou.glasses"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Link Konten yang Sudah Tayang (Jika Ada)
                  </label>
                  <input
                    type="url"
                    value={publishedUrl}
                    onChange={(e) => setPublishedUrl(e.target.value)}
                    placeholder="https://www.instagram.com/reel/..."
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Konten Terbit
                  </label>
                  <input
                    type="date"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              {activeTab === "identity" && "Langkah 1 dari 4: Identitas & Media Sosial"}
              {activeTab === "audience" && "Langkah 2 dari 4: Statistik & Metrik Audiens"}
              {activeTab === "evaluation" && "Langkah 3 dari 4: Scoring & Penentuan Prioritas"}
              {activeTab === "collaboration" && "Langkah 4 dari 4: Barter Produk Kacamata & Ekspedisi"}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{initialData ? "Simpan Perubahan" : "Simpan Creator"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
