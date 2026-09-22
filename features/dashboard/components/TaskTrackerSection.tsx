"use client";

import React, { useState } from "react";
import {
  CheckSquare,
  Clock,
  User,
  Calendar,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ListTodo,
  Palette,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  INITIAL_MARKETING_TASKS,
  MarketingTaskItem,
  TaskStatus,
} from "@/lib/tasks";

export const TaskTrackerSection: React.FC = () => {
  const [tasks, setTasks] = useState<MarketingTaskItem[]>(INITIAL_MARKETING_TASKS);
  const [activeTab, setActiveTab] = useState<"all" | "yanuar">("all");

  const toggleChecklist = (taskId: string, checkId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedChecklist = t.checklist.map((item) =>
          item.id === checkId ? { ...item, completed: !item.completed } : item
        );
        return { ...t, checklist: updatedChecklist };
      })
    );
  };

  const updateStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "in_progress":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
            Sedang Dikerjakan
          </span>
        );
      case "review":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20">
            Review Lead Marketing
          </span>
        );
      case "done":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            Selesai
          </span>
        );
      case "todo":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-secondary text-foreground-muted border border-border">
            Belum Dimulai
          </span>
        );
    }
  };

  const filteredTasks = tasks.filter((t) =>
    activeTab === "yanuar" ? t.assignee === "Yanuar" : true
  );

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-subtle space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1">
              <Palette className="w-3 h-3" /> CREATIVE PLANNER
            </span>
            <span className="text-xs text-foreground-muted">Tim Desain Grafis & Konten</span>
          </div>
          <h2 className="text-base font-bold text-foreground">
            Task Tracker: Produksi Desain & Materi Konten
          </h2>
          <p className="text-xs text-foreground-secondary">
            Tracking pengerjaan desain grafis feed Instagram, materi visual promosi, dan aset video marketing.
          </p>
        </div>

        {/* Tab Filter */}
        <div className="flex items-center gap-1 p-1 bg-surface-secondary rounded-xl border border-border shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "all"
                ? "bg-foreground text-surface shadow-subtle"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            Semua Task
          </button>
          <button
            onClick={() => setActiveTab("yanuar")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "yanuar"
                ? "bg-foreground text-surface shadow-subtle"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            <User className="w-3 h-3" />
            <span>Yanuar (Desain Feed)</span>
          </button>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => {
          const completedCount = task.checklist.filter((c) => c.completed).length;
          const progressPercent =
            task.checklist.length > 0
              ? Math.round((completedCount / task.checklist.length) * 100)
              : 0;

          const isYanuarTask = task.assignee === "Yanuar";

          return (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isYanuarTask
                  ? "border-purple-500/40 bg-purple-500/5 shadow-subtle"
                  : "border-border bg-surface-secondary/20"
              }`}
            >
              <div className="space-y-3">
                {/* Top Task Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xs">
                      {task.avatarInitials}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-foreground block">
                        {task.assignee}
                      </span>
                      <span className="text-[10px] text-foreground-muted block">
                        {task.role}
                      </span>
                    </div>
                  </div>

                  {getStatusBadge(task.status)}
                </div>

                {/* Title */}
                <h3 className="text-xs font-bold text-foreground leading-snug">
                  {task.title}
                </h3>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-foreground-muted">
                    <span>Progress Checklist</span>
                    <span className="font-semibold text-foreground tabular-nums">
                      {completedCount} / {task.checklist.length} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Checklist items */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase text-foreground-muted block">
                    Checklist Subtask:
                  </span>
                  {task.checklist.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-surface-secondary cursor-pointer transition-colors text-xs text-foreground group"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleChecklist(task.id, item.id)}
                        className="mt-0.5 rounded border-border text-purple-600 focus:ring-purple-500 shrink-0"
                      />
                      <span
                        className={`text-[11px] leading-snug transition-all ${
                          item.completed
                            ? "line-through text-foreground-muted"
                            : "text-foreground group-hover:text-purple-700 dark:group-hover:text-purple-300"
                        }`}
                      >
                        {item.text}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Notes */}
                {task.notes && (
                  <p className="text-[10px] text-foreground-muted leading-relaxed bg-surface p-2 rounded-lg border border-border/60">
                    💡 <strong>Brief:</strong> {task.notes}
                  </p>
                )}
              </div>

              {/* Bottom footer: Deadline & Status switch */}
              <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[10px] text-foreground-muted">
                  <Calendar className="w-3 h-3" />
                  <span>Deadline: {task.deadline}</span>
                </div>

                <select
                  value={task.status}
                  onChange={(e: any) => updateStatus(task.id, e.target.value)}
                  className="px-2 py-1 rounded bg-surface border border-border text-[11px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
