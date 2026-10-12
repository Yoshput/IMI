"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { formatDateIndo } from "@/lib/utils";
import type { Event } from "@/lib/venue-types";
import {
  Plus,
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  Users,
  Target,
  Loader2,
  Save,
} from "lucide-react";

const STATUS_BADGE: Record<string, string> = {
  perencanaan: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  persiapan: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  berlangsung: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  selesai: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  dibatalkan: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const STATUS_LABELS: Record<string, string> = {
  perencanaan: "Perencanaan",
  persiapan: "Persiapan",
  berlangsung: "Berlangsung",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

export const EventPlannerTab: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formObjective, setFormObjective] = useState("");
  const [formAudience, setFormAudience] = useState("");
  const [formTarget, setFormTarget] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formDuration, setFormDuration] = useState("");
  const [formConcept, setFormConcept] = useState("");
  const [formCapacity, setFormCapacity] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/venue-events");
      const json = await res.json();
      if (json.success) setEvents(json.data || []);
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/venue-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          businessObjective: formObjective,
          targetAudience: formAudience.split(",").map(s => s.trim()).filter(Boolean),
          targetAttendees: parseInt(formTarget) || 0,
          date: formDate,
          time: formTime,
          duration: formDuration,
          concept: formConcept,
          capacity: parseInt(formCapacity) || 0,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowForm(false);
        setFormName(""); setFormObjective(""); setFormAudience(""); setFormTarget("");
        setFormDate(""); setFormTime(""); setFormDuration(""); setFormConcept(""); setFormCapacity("");
        fetchEvents();
      }
    } catch { /* empty */ }
    setSaving(false);
  };

  const inputCls = "w-full px-3 py-2 bg-surface-secondary border border-border rounded-control text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand/40";
  const labelCls = "block text-[11px] font-semibold text-foreground-secondary mb-1";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">Daftar Event</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-2 bg-foreground text-surface text-xs font-semibold rounded-control hover:opacity-90"
        >
          <Plus className="w-3.5 h-3.5" />
          Buat Event
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-surface rounded-container border border-border p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground">Event Baru</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2"><label className={labelCls}>Nama Event *</label><input value={formName} onChange={(e) => setFormName(e.target.value)} className={inputCls} required /></div>
            <div className="sm:col-span-2"><label className={labelCls}>Tujuan Bisnis</label><input value={formObjective} onChange={(e) => setFormObjective(e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Target Audiens (koma)</label><input value={formAudience} onChange={(e) => setFormAudience(e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Target Peserta</label><input value={formTarget} onChange={(e) => setFormTarget(e.target.value)} className={inputCls} type="number" /></div>
            <div><label className={labelCls}>Tanggal</label><input value={formDate} onChange={(e) => setFormDate(e.target.value)} className={inputCls} type="date" /></div>
            <div><label className={labelCls}>Waktu</label><input value={formTime} onChange={(e) => setFormTime(e.target.value)} className={inputCls} type="time" /></div>
            <div><label className={labelCls}>Durasi</label><input value={formDuration} onChange={(e) => setFormDuration(e.target.value)} className={inputCls} placeholder="cth: 4 jam" /></div>
            <div><label className={labelCls}>Kapasitas</label><input value={formCapacity} onChange={(e) => setFormCapacity(e.target.value)} className={inputCls} type="number" /></div>
            <div className="sm:col-span-2"><label className={labelCls}>Konsep</label><textarea value={formConcept} onChange={(e) => setFormConcept(e.target.value)} className={cn(inputCls, "h-16 resize-none")} /></div>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 text-xs border border-border rounded-control text-foreground-secondary">Batal</button>
            <button type="submit" disabled={saving} className="flex items-center gap-1 px-4 py-1.5 bg-foreground text-surface text-xs font-semibold rounded-control disabled:opacity-50">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Simpan
            </button>
          </div>
        </form>
      )}

      {/* Loading */}
      {loading && <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>}

      {/* Empty */}
      {!loading && events.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <Calendar className="w-10 h-10 text-foreground-muted mb-3" />
          <h3 className="text-sm font-semibold text-foreground">Belum Ada Event</h3>
          <p className="text-xs text-foreground-muted mt-1">Klik &quot;Buat Event&quot; untuk merencanakan kegiatan baru.</p>
        </div>
      )}

      {/* Event Cards */}
      {!loading && events.map((ev) => {
        const isExpanded = expanded === ev.id;
        return (
          <div key={ev.id} className="bg-surface rounded-container border border-border overflow-hidden">
            <button
              onClick={() => setExpanded(isExpanded ? null : ev.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-secondary/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-foreground">{ev.name}</h3>
                  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", STATUS_BADGE[ev.status] || STATUS_BADGE.perencanaan)}>
                    {STATUS_LABELS[ev.status] || ev.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-[10px] text-foreground-muted">
                  {ev.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDateIndo(ev.date)}</span>}
                  {ev.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ev.duration}</span>}
                  {ev.targetAttendees > 0 && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{ev.targetAttendees} peserta</span>}
                </div>
              </div>
              {isExpanded ? <ChevronDown className="w-4 h-4 text-foreground-muted shrink-0" /> : <ChevronRight className="w-4 h-4 text-foreground-muted shrink-0" />}
            </button>

            {isExpanded && (
              <div className="border-t border-border px-5 py-4 space-y-4 text-xs">
                {ev.businessObjective && (
                  <div><span className="font-semibold text-foreground-secondary">Tujuan:</span> <span className="text-foreground">{ev.businessObjective}</span></div>
                )}
                {ev.concept && (
                  <div><span className="font-semibold text-foreground-secondary">Konsep:</span> <span className="text-foreground">{ev.concept}</span></div>
                )}
                {ev.targetAudience.length > 0 && (
                  <div><span className="font-semibold text-foreground-secondary">Audiens:</span> <span className="text-foreground">{ev.targetAudience.join(", ")}</span></div>
                )}
                {ev.location && (
                  <div><span className="font-semibold text-foreground-secondary">Lokasi:</span> <span className="text-foreground">{ev.location}</span></div>
                )}

                {/* Tasks */}
                <div>
                  <h4 className="font-semibold text-foreground-secondary mb-2 flex items-center gap-1"><Target className="w-3 h-3" /> Tugas ({ev.tasks.length})</h4>
                  {ev.tasks.length === 0 ? (
                    <p className="text-foreground-muted italic">Belum ada tugas ditambahkan</p>
                  ) : (
                    <div className="bg-surface-secondary/50 rounded-control overflow-hidden">
                      <table className="w-full text-[10px]">
                        <thead><tr className="border-b border-border/50">
                          <th className="text-left px-3 py-2 font-semibold">Tugas</th>
                          <th className="text-left px-3 py-2 font-semibold">PIC</th>
                          <th className="text-left px-3 py-2 font-semibold">Status</th>
                        </tr></thead>
                        <tbody>
                          {ev.tasks.map((t) => (
                            <tr key={t.id} className="border-b border-border/30">
                              <td className="px-3 py-1.5">{t.title}</td>
                              <td className="px-3 py-1.5">{t.pic}</td>
                              <td className="px-3 py-1.5">{t.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Rundown */}
                {ev.rundown.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground-secondary mb-2">Rundown</h4>
                    <div className="space-y-1">
                      {ev.rundown.map((r, i) => (
                        <div key={i} className="flex gap-3 text-[10px]">
                          <span className="font-mono text-foreground-muted w-12 shrink-0">{r.time}</span>
                          <span className="text-foreground">{r.activity}</span>
                          <span className="text-foreground-muted ml-auto">{r.pic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
