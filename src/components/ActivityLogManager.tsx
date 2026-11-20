import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  MessageCircle,
  ShoppingCart,
  Boxes,
  Receipt,
  Search,
  RefreshCw,
  Trash2,
  Download,
  Clock,
  CheckCircle2,
  Bot,
  ShieldAlert,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { getActivityLogsRequest, clearActivityLogsRequest, ActivityLogItem } from '../lib/api';

interface ActivityLogManagerProps {
  token?: string | null;
}

export default function ActivityLogManager({ token }: ActivityLogManagerProps) {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchLogs = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await getActivityLogsRequest(token, {
        type: filterType === 'all' ? undefined : filterType,
        search: searchQuery.trim() || undefined,
        limit: 100,
      });
      if (res.success && Array.isArray(res.data)) {
        setLogs(res.data);
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.warn('Failed to fetch activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [token, filterType]);

  const handleClearLogs = async () => {
    if (!token) return;
    if (!window.confirm('Are you sure you want to clear the activity log stream?')) return;
    try {
      await clearActivityLogsRequest(token);
      setLogs([]);
      setFeedback('Activity logs cleared.');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      alert('Could not clear logs.');
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `jorique-activity-audit-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const q = searchQuery.toLowerCase();
    return logs.filter((log) => {
      return (
        log.title?.toLowerCase().includes(q) ||
        log.description?.toLowerCase().includes(q) ||
        log.action?.toLowerCase().includes(q) ||
        log.actor?.toLowerCase().includes(q)
      );
    });
  }, [logs, searchQuery]);

  const getLogTypeBadge = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return {
          icon: <MessageCircle size={14} className="text-[#25D366]" />,
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          label: 'WhatsApp',
        };
      case 'order':
        return {
          icon: <ShoppingCart size={14} className="text-blue-500" />,
          bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
          label: 'Order',
        };
      case 'product':
        return {
          icon: <Boxes size={14} className="text-purple-500" />,
          bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
          label: 'Catalogue',
        };
      case 'pos':
        return {
          icon: <Receipt size={14} className="text-amber-500" />,
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          label: 'In-Store POS',
        };
      default:
        return {
          icon: <Activity size={14} className="text-secondary" />,
          bg: 'bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/20',
          label: 'System',
        };
    }
  };

  const formatTimestamp = (isoDate: string) => {
    try {
      const date = new Date(isoDate);
      const diffMinutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
      return date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoDate;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-card dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-lg font-serif tracking-wide text-primary dark:text-[#E8DCC4] flex items-center gap-2">
                <Activity size={18} className="text-[#D4AF37]" />
                Store Activity & Action Logs
              </h2>
            </div>
            <p className="text-xs text-secondary dark:text-white/60">
              Live audit trail of WhatsApp bot inquiries, customer order dispatches, product catalogue edits, and POS billing events.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-cream/70 dark:bg-white/5 hover:bg-cream dark:hover:bg-white/10 text-primary dark:text-white transition-all border border-border/80 dark:border-white/10"
              title="Refresh log stream"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportJSON}
              disabled={logs.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-cream/70 dark:bg-white/5 hover:bg-cream dark:hover:bg-white/10 text-primary dark:text-white transition-all border border-border/80 dark:border-white/10"
              title="Export logs as JSON"
            >
              <Download size={13} />
              <span>Export Audit</span>
            </button>

            <button
              onClick={handleClearLogs}
              disabled={logs.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-all border border-rose-500/20"
              title="Clear activity log stream"
            >
              <Trash2 size={13} />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {feedback && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 size={14} />
            <span>{feedback}</span>
          </div>
        )}

        {/* Filter Pills & Search */}
        <div className="mt-6 pt-5 border-t border-border/60 dark:border-[#2E2925] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Activities', icon: <Layers size={13} /> },
              { id: 'whatsapp', label: 'WhatsApp Concierge', icon: <MessageCircle size={13} className="text-[#25D366]" /> },
              { id: 'order', label: 'Orders & Fulfillment', icon: <ShoppingCart size={13} className="text-blue-500" /> },
              { id: 'product', label: 'Catalogue & Products', icon: <Boxes size={13} className="text-purple-500" /> },
              { id: 'pos', label: 'In-Store POS', icon: <Receipt size={13} className="text-amber-500" /> },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => setFilterType(pill.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterType === pill.id
                    ? 'bg-primary dark:bg-[#D4AF37] text-white dark:text-black font-semibold shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800/60 text-secondary dark:text-white/70 hover:bg-stone-200 dark:hover:bg-stone-800'
                }`}
              >
                {pill.icon}
                <span>{pill.label}</span>
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/60 dark:text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search actions, SKUs, phones..."
              className="w-full pl-9 pr-3 py-1.5 bg-stone-50 dark:bg-black/30 border border-border dark:border-[#2E2925] rounded-xl text-xs text-primary dark:text-white placeholder:text-secondary/50 focus:outline-hidden focus:border-[#D4AF37]"
            />
          </div>
        </div>
      </div>

      {/* Activity Timeline Feed */}
      <div className="bg-card dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-2xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 bg-stone-50/70 dark:bg-white/5 border-b border-border/80 dark:border-[#2E2925] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-[#E8DCC4]">
            Live Event Stream ({filteredLogs.length})
          </span>
          <span className="text-[11px] text-secondary dark:text-white/50">
            Last updated: {lastRefreshed.toLocaleTimeString()}
          </span>
        </div>

        {loading && logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-secondary dark:text-white/60 flex flex-col items-center gap-3">
            <RefreshCw size={24} className="animate-spin text-[#D4AF37]" />
            <span>Loading activity audit stream...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-secondary dark:text-white/60 flex flex-col items-center gap-2">
            <Activity size={28} className="text-secondary/40 stroke-1" />
            <p className="font-medium text-primary dark:text-white">No activity records found</p>
            <p className="text-[11px]">Events will automatically populate as orders, WhatsApp messages, or catalog edits occur.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/60 dark:divide-[#2E2925]">
            {filteredLogs.map((log) => {
              const badge = getLogTypeBadge(log.type);
              const isExpanded = expandedLogId === log.id;
              const hasMetadata = log.metadata && Object.keys(log.metadata).length > 0;

              return (
                <div
                  key={log.id}
                  className="p-4 hover:bg-stone-50/50 dark:hover:bg-white/2 transition-colors flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`mt-0.5 p-2 rounded-xl border flex-shrink-0 ${badge.bg}`}>
                        {badge.icon}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          <span className="text-xs font-semibold text-primary dark:text-[#E8DCC4] truncate">
                            {log.title}
                          </span>
                          {log.actor && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-secondary dark:text-white/60">
                              by {log.actor}
                            </span>
                          )}
                        </div>

                        {log.description && (
                          <p className="text-xs text-secondary dark:text-white/70 mt-1 break-words">
                            {log.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] text-secondary/70 dark:text-white/40 flex items-center gap-1">
                        <Clock size={11} />
                        {formatTimestamp(log.created_at)}
                      </span>

                      {hasMetadata && (
                        <button
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-800 text-secondary dark:text-white/60 transition-colors"
                          title="Toggle details"
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Metadata JSON Drawer */}
                  {isExpanded && hasMetadata && (
                    <div className="mt-2 ml-11 p-3 rounded-xl bg-stone-100 dark:bg-black/50 border border-border/80 dark:border-[#2E2925] text-[11px] font-mono text-secondary dark:text-white/80 overflow-x-auto">
                      <pre className="whitespace-pre-wrap">{JSON.stringify(log.metadata, null, 2)}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
