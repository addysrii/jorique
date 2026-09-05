import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Layers,
  ArrowRight,
  RefreshCw,
  Hash,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Pencil,
  Tag,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SkuSeries } from '../types/skuSeries';
import { formatSeriesSku, generateSeriesSample } from '../types/skuSeries';
import {
  fetchSkuSeriesList,
  saveSkuSeries,
  deleteSkuSeries,
  incrementSeriesCounter,
} from '../lib/utils/skuSeriesStorage';

interface SkuSeriesManagerProps {
  onSelectSeriesForNewProduct?: (seriesId: string) => void;
}

export default function SkuSeriesManager({ onSelectSeriesForNewProduct }: SkuSeriesManagerProps) {
  const [seriesList, setSeriesList] = useState<SkuSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formPrefix, setFormPrefix] = useState('JR');
  const [formSeparator, setFormSeparator] = useState('-');
  const [formIncludeYear, setFormIncludeYear] = useState(true);
  const [formPadding, setFormPadding] = useState(3);
  const [formCounter, setFormCounter] = useState(1);
  const [formSuffix, setFormSuffix] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Counter quick edit
  const [editingCounterId, setEditingCounterId] = useState<string | null>(null);
  const [newCounterValue, setNewCounterValue] = useState(1);

  const loadSeries = async () => {
    setLoading(true);
    try {
      const data = await fetchSkuSeriesList();
      setSeriesList(data);
    } catch {
      showToast('error', 'Failed to load SKU series.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeries();
  }, []);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const handleCopySku = (sku: string, id: string) => {
    navigator.clipboard.writeText(sku);
    setCopiedId(id);
    showToast('success', `Copied SKU "${sku}" to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormName('');
    setFormPrefix('JR');
    setFormSeparator('-');
    setFormIncludeYear(true);
    setFormPadding(3);
    setFormCounter(1);
    setFormSuffix('');
    setFormCategory('');
    setFormDescription('');
    setShowCreateModal(true);
  };

  const openEditModal = (series: SkuSeries) => {
    setEditingId(series.id);
    setFormName(series.name);
    setFormPrefix(series.prefix);
    setFormSeparator(series.separator);
    setFormIncludeYear(series.includeYear);
    setFormPadding(series.padding);
    setFormCounter(series.currentCounter);
    setFormSuffix(series.suffix || '');
    setFormCategory(series.category || '');
    setFormDescription(series.description || '');
    setShowCreateModal(true);
  };

  const handleSaveSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrefix.trim()) {
      showToast('error', 'Series name and prefix are required.');
      return;
    }

    setIsSaving(true);
    try {
      const saved = await saveSkuSeries({
        id: editingId || undefined,
        name: formName.trim(),
        prefix: formPrefix.trim().toUpperCase(),
        separator: formSeparator,
        includeYear: formIncludeYear,
        padding: Number(formPadding) || 3,
        currentCounter: Number(formCounter) || 1,
        suffix: formSuffix.trim().toUpperCase() || undefined,
        category: formCategory.trim() || undefined,
        description: formDescription.trim() || undefined,
        isActive: true,
      });

      showToast('success', `Series "${saved.name}" saved successfully!`);
      setShowCreateModal(false);
      await loadSeries();
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to save series.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the SKU series "${name}"?`)) return;
    try {
      await deleteSkuSeries(id);
      showToast('success', `Series "${name}" deleted.`);
      await loadSeries();
    } catch {
      showToast('error', 'Failed to delete series.');
    }
  };

  const handleQuickAdvanceCounter = async (series: SkuSeries) => {
    try {
      const next = await incrementSeriesCounter(series.id);
      setSeriesList((prev) =>
        prev.map((s) => (s.id === series.id ? { ...s, currentCounter: next } : s))
      );
      showToast('success', `Counter advanced to #${next}`);
    } catch {
      showToast('error', 'Failed to advance counter.');
    }
  };

  const handleUpdateCounter = async (id: string) => {
    try {
      const target = seriesList.find((s) => s.id === id);
      if (!target) return;
      await saveSkuSeries({
        ...target,
        currentCounter: Math.max(1, newCounterValue),
      });
      setEditingCounterId(null);
      await loadSeries();
      showToast('success', `Counter updated to #${newCounterValue}`);
    } catch {
      showToast('error', 'Failed to update counter.');
    }
  };

  // Preview for active form inputs
  const previewSample = generateSeriesSample(
    {
      prefix: formPrefix,
      separator: formSeparator,
      includeYear: formIncludeYear,
      padding: formPadding,
      suffix: formSuffix,
      currentCounter: formCounter,
    },
    3
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md transition-all animate-bounce ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Top Banner / Metrics */}
      <div className="rounded-3xl border border-border dark:border-[#2E2925] bg-gradient-to-r from-cream/60 via-cream/30 to-transparent dark:from-white/5 dark:via-white/[0.02] dark:to-transparent p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[11px] font-bold uppercase tracking-widest border border-[#D4AF37]/20 mb-3">
            <Sparkles size={12} />
            Inventory & Serial Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-primary dark:text-white tracking-wide">
            Manual SKU Series Manager
          </h2>
          <p className="text-xs text-secondary dark:text-white/60 mt-1 max-w-xl leading-relaxed">
            Create custom sequential numbering rules for different luxury collections, material categories, or limited editions. These series automatically format SKUs, sequential barcode tags, and QR certificates when adding new products.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-primary dark:bg-[#D4AF37] text-white dark:text-black px-5 py-3 rounded-2xl hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-all text-xs font-bold uppercase tracking-wider shadow-lg"
          >
            <Plus size={16} />
            Create SKU Series
          </button>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 border border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] text-primary dark:text-white px-4 py-3 rounded-2xl hover:bg-cream dark:hover:bg-white/5 transition-all text-xs font-semibold uppercase tracking-wider"
          >
            <ArrowRight size={14} />
            Add Product With Series
          </Link>
        </div>
      </div>

      {/* Series Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <RefreshCw size={24} className="animate-spin text-[#D4AF37]" />
          <p className="text-xs text-secondary dark:text-white/60">Loading SKU series...</p>
        </div>
      ) : seriesList.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-border dark:border-[#2E2925] bg-white/40 dark:bg-white/[0.02]">
          <Hash size={36} className="mx-auto text-secondary/40 dark:text-white/30 mb-3" />
          <h3 className="text-base font-medium text-primary dark:text-white">No Custom Series Defined Yet</h3>
          <p className="text-xs text-secondary dark:text-white/60 mt-1 mb-4">
            Click below to create your first customized SKU series pattern.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-primary dark:bg-[#D4AF37] text-white dark:text-black px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            <Plus size={14} />
            Create First Series
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {seriesList.map((series) => {
            const nextSku = formatSeriesSku(series, series.currentCounter);
            const isCopied = copiedId === series.id;

            return (
              <div
                key={series.id}
                className="group relative rounded-3xl border border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-primary dark:text-white">
                          {series.name}
                        </h3>
                        {series.category && (
                          <span className="px-2.5 py-0.5 rounded-full bg-cream dark:bg-white/5 border border-border dark:border-[#2E2925] text-[10px] font-medium text-secondary dark:text-white/70">
                            {series.category}
                          </span>
                        )}
                      </div>
                      {series.description && (
                        <p className="text-xs text-secondary dark:text-white/60 mt-1 line-clamp-2">
                          {series.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(series)}
                        title="Edit Series Configuration"
                        className="p-1.5 rounded-lg text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white hover:bg-cream dark:hover:bg-white/5 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(series.id, series.name)}
                        title="Delete Series"
                        className="p-1.5 rounded-lg text-secondary dark:text-white/60 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Next SKU Box */}
                  <div className="my-4 p-4 rounded-2xl bg-cream/40 dark:bg-white/5 border border-border/70 dark:border-[#2E2925] flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-secondary dark:text-white/50 block mb-0.5">
                        Next Assigned SKU
                      </span>
                      <span className="font-mono text-base font-bold text-primary dark:text-[#D4AF37]">
                        {nextSku}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopySku(nextSku, series.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-[#100E0D] border border-border dark:border-[#2E2925] text-xs font-mono text-secondary dark:text-white/80 hover:text-primary dark:hover:text-white hover:border-primary/40 transition-colors shadow-xs"
                      title="Copy Next SKU"
                    >
                      {isCopied ? (
                        <>
                          <Check size={13} className="text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Format Pattern Details */}
                  <div className="grid grid-cols-3 gap-2 text-xs py-2 border-t border-border/60 dark:border-[#2E2925]/60 mb-2">
                    <div>
                      <span className="text-[10px] text-secondary dark:text-white/40 block">Prefix</span>
                      <span className="font-mono font-semibold text-primary dark:text-white">
                        {series.prefix}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-secondary dark:text-white/40 block">Delimiter</span>
                      <span className="font-mono font-semibold text-primary dark:text-white">
                        {series.separator === '' ? '(None)' : `"${series.separator}"`}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-secondary dark:text-white/40 block">Format Rule</span>
                      <span className="font-mono text-[11px] text-secondary dark:text-white/70">
                        {series.prefix}
                        {series.separator}
                        {series.includeYear ? `YYYY${series.separator}` : ''}
                        {'0'.repeat(series.padding)}
                        {series.suffix ? `${series.separator}${series.suffix}` : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions & Counter */}
                <div className="pt-3 border-t border-border/70 dark:border-[#2E2925] flex items-center justify-between gap-3 text-xs">
                  {/* Counter display and edit */}
                  <div className="flex items-center gap-2">
                    {editingCounterId === series.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-secondary dark:text-white/60">Seq #:</span>
                        <input
                          type="number"
                          min={1}
                          value={newCounterValue}
                          onChange={(e) => setNewCounterValue(parseInt(e.target.value) || 1)}
                          className="w-16 px-2 py-1 text-xs font-mono rounded-lg border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] text-primary dark:text-white outline-none"
                        />
                        <button
                          onClick={() => handleUpdateCounter(series.id)}
                          className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 text-[10px]"
                        >
                          <Check size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="text-secondary dark:text-white/50 text-[11px]">Current Counter:</span>
                        <span className="font-mono font-bold text-primary dark:text-white">
                          #{series.currentCounter}
                        </span>
                        <button
                          onClick={() => {
                            setEditingCounterId(series.id);
                            setNewCounterValue(series.currentCounter);
                          }}
                          className="text-[10px] text-secondary dark:text-white/40 hover:text-primary dark:hover:text-[#D4AF37] underline ml-1"
                        >
                          Set
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuickAdvanceCounter(series)}
                      title="Advance sequence counter by 1"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white px-2 py-1 rounded-lg border border-border/60 dark:border-[#2E2925] hover:bg-cream dark:hover:bg-white/5 transition-colors"
                    >
                      <Plus size={11} /> +1
                    </button>

                    <Link
                      to={`/admin/products/new?seriesId=${series.id}`}
                      onClick={() => onSelectSeriesForNewProduct?.(series.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary dark:text-[#D4AF37] hover:underline"
                    >
                      Use in Batch <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create / Edit SKU Series */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1A1816] rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-border dark:border-[#2E2925] animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="p-6 border-b border-border dark:border-[#2E2925] flex items-center justify-between">
              <div>
                <h3 className="text-xl font-light text-primary dark:text-white tracking-wide">
                  {editingId ? 'Edit SKU Series' : 'Define New SKU Series'}
                </h3>
                <p className="text-xs text-secondary dark:text-white/60 mt-0.5">
                  Configure custom series rules, delimiters, and sequence counters.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-full hover:bg-cream dark:hover:bg-white/10 text-secondary dark:text-white/70"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSaveSeries} className="p-6 overflow-y-auto space-y-5">
              {/* Series Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">
                  Series Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Royal Heritage Silk, Limited Edition 2026"
                  className="w-full rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                />
              </div>

              {/* Prefix & Separator */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">
                    Prefix Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={formPrefix}
                    onChange={(e) => setFormPrefix(e.target.value.toUpperCase())}
                    placeholder="e.g. JR, BED, RHS, LUX"
                    className="w-full font-mono uppercase rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">
                    Separator Delimiter
                  </label>
                  <select
                    value={formSeparator}
                    onChange={(e) => setFormSeparator(e.target.value)}
                    className="w-full rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                  >
                    <option value="-">Hyphen ( - )</option>
                    <option value="_">Underscore ( _ )</option>
                    <option value="/">Slash ( / )</option>
                    <option value=".">Dot ( . )</option>
                    <option value="">None (Concatenated)</option>
                  </select>
                </div>
              </div>

              {/* Year Toggle & Sequence Padding */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">
                    Include Year
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer mt-2.5">
                    <input
                      type="checkbox"
                      checked={formIncludeYear}
                      onChange={(e) => setFormIncludeYear(e.target.checked)}
                      className="rounded text-[#D4AF37] focus:ring-[#D4AF37] h-4 w-4"
                    />
                    <span className="text-xs text-primary dark:text-white">
                      Include current year ({new Date().getFullYear()})
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">
                    Zero-Padding
                  </label>
                  <select
                    value={formPadding}
                    onChange={(e) => setFormPadding(Number(e.target.value))}
                    className="w-full rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                  >
                    <option value={2}>2 Digits (01, 02...)</option>
                    <option value={3}>3 Digits (001, 002...)</option>
                    <option value={4}>4 Digits (0001, 0002...)</option>
                    <option value={5}>5 Digits (00001, 00002...)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">
                    Starting Sequence
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formCounter}
                    onChange={(e) => setFormCounter(parseInt(e.target.value) || 1)}
                    className="w-full font-mono rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Suffix & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">
                    Optional Suffix
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    value={formSuffix}
                    onChange={(e) => setFormSuffix(e.target.value.toUpperCase())}
                    placeholder="e.g. LUX, ED1, QC"
                    className="w-full font-mono uppercase rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">
                    Category Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="e.g. Bedsheets, Curtains, Pillows"
                    className="w-full rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">
                  Series Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Notes on where and when to use this SKU series..."
                  className="w-full rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-2.5 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37] resize-none"
                />
              </div>

              {/* Live Preview Box */}
              <div className="p-4 rounded-2xl bg-cream/50 dark:bg-white/5 border border-border dark:border-[#2E2925]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary dark:text-white mb-2">
                  <Sparkles size={13} className="text-[#D4AF37]" />
                  Live Series Preview (Next 3 SKUs)
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {previewSample.map((sample, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#100E0D] border border-border dark:border-[#2E2925] font-mono text-xs font-bold text-primary dark:text-[#D4AF37] shadow-xs"
                    >
                      {sample}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border dark:border-[#2E2925]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-border dark:border-[#2E2925] text-xs font-semibold text-secondary dark:text-white/70 hover:bg-cream dark:hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-primary dark:bg-[#D4AF37] text-white dark:text-black px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-all shadow-md disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : editingId ? 'Update Series' : 'Save & Activate Series'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
