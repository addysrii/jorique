import { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Pencil,
  X,
  Check,
  Tag,
  Palette,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BadgeItem {
  id: string;
  label: string;
  color: string;
  text_color: string;
  description?: string;
  created_at: string;
}

// ─── Preset colour swatches for quick pick ────────────────────────────────────

const COLOR_PRESETS = [
  { bg: '#7A8B72', text: '#F5EDE3', name: 'Sage (Essential)' },
  { bg: '#243B64', text: '#F5EDE3', name: 'Royal Blue (Signature)' },
  { bg: '#641F2D', text: '#F5EDE3', name: 'Burgundy (Luxe)' },
  { bg: '#B9787D', text: '#1A1A1A', name: 'Dusty Rose (Souvenir)' },
  { bg: '#4B5563', text: '#FFFFFF', name: 'Slate (Hospitality)' },
  { bg: '#D4AF37', text: '#1A1208', name: 'Gold' },
  { bg: '#1A1816', text: '#D4AF37', name: 'Dark Gold' },
  { bg: '#FEF3C7', text: '#92400E', name: 'Amber' },
  { bg: '#DCFCE7', text: '#166534', name: 'Green' },
  { bg: '#E0F2FE', text: '#075985', name: 'Sky' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function BadgeManager() {
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Form state
  const [newLabel, setNewLabel] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newBg, setNewBg] = useState('#FEF3C7');
  const [newText, setNewText] = useState('#92400E');

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editBg, setEditBg] = useState('');
  const [editText, setEditText] = useState('');

  // ── Fetch ────────────────────────────────────────────────────────────────

  const fetchBadges = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('label');
      if (error) throw error;
      if (data) setBadges(data as BadgeItem[]);
    } catch {
      showToast('error', 'Failed to load badges.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBadges(); }, []);

  // ── Toast ────────────────────────────────────────────────────────────────

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Add ──────────────────────────────────────────────────────────────────

  const handleAdd = async () => {
    const label = newLabel.trim();
    if (!label) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('badges')
        .insert({ label, color: newBg, text_color: newText, description: newDesc.trim() || null })
        .select()
        .single();
      if (error) throw error;
      setBadges(prev => [...prev, data as BadgeItem].sort((a, b) => a.label.localeCompare(b.label)));
      setNewLabel('');
      setNewDesc('');
      showToast('success', `Badge "${label}" added.`);
    } catch (err: any) {
      showToast('error', err?.message ?? 'Failed to add badge.');
    } finally {
      setSaving(false);
    }
  };

  // ── Rename/Update ─────────────────────────────────────────────────────────

  const handleUpdate = async (id: string) => {
    const label = editLabel.trim();
    if (!label) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('badges')
        .update({ label, color: editBg, text_color: editText })
        .eq('id', id);
      if (error) throw error;
      setBadges(prev =>
        prev.map(b => b.id === id ? { ...b, label, color: editBg, text_color: editText } : b)
          .sort((a, b) => a.label.localeCompare(b.label))
      );
      setEditingId(null);
      showToast('success', 'Badge updated.');
    } catch (err: any) {
      showToast('error', err?.message ?? 'Failed to update badge.');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────

  const handleDelete = async (id: string, label: string) => {
    if (!window.confirm(`Delete badge "${label}"? Products using it will lose this badge label.`)) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('badges').delete().eq('id', id);
      if (error) throw error;
      setBadges(prev => prev.filter(b => b.id !== id));
      showToast('success', `Badge "${label}" deleted.`);
    } catch (err: any) {
      showToast('error', err?.message ?? 'Failed to delete badge.');
    } finally {
      setSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center gap-3">
        <Loader2 size={28} className="animate-spin text-primary dark:text-[#D4AF37]" />
        <p className="text-xs uppercase tracking-widest text-secondary dark:text-white/50">Loading badges...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold backdrop-blur-sm border ${
          toast.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
            : 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── LEFT: Add New Badge Form ── */}
        <div className="rounded-3xl border border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] overflow-hidden shadow-sm">

          {/* Header */}
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border dark:border-[#2E2925] bg-cream/40 dark:bg-[#151311]">
            <Plus size={16} className="text-primary dark:text-[#D4AF37]" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary dark:text-white">Add New Badge</h2>
          </div>

          <div className="p-6 space-y-5">

            {/* Label */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">Badge Label *</label>
              <input
                type="text"
                placeholder="e.g. Bestseller, New Arrival, Limited..."
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                className="w-full text-sm bg-cream/30 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] rounded-xl px-4 py-3 outline-none text-primary dark:text-white placeholder-secondary dark:placeholder-white/30 focus:border-primary dark:focus:border-[#D4AF37] transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">Description (optional)</label>
              <input
                type="text"
                placeholder="e.g. For top 10 selling products"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                className="w-full text-sm bg-cream/30 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] rounded-xl px-4 py-3 outline-none text-primary dark:text-white placeholder-secondary dark:placeholder-white/30 focus:border-primary dark:focus:border-[#D4AF37] transition"
              />
            </div>

            {/* Colour presets */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-2 flex items-center gap-2">
                <Palette size={12} /> Badge Colour
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {COLOR_PRESETS.map(p => (
                  <button
                    key={p.name}
                    title={p.name}
                    onClick={() => { setNewBg(p.bg); setNewText(p.text); }}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border-2 transition-all ${newBg === p.bg ? 'scale-110 shadow-md border-primary dark:border-[#D4AF37]' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: p.bg, color: p.text }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
              {/* Custom colour pickers */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-[10px] text-secondary dark:text-white/40 mb-1 uppercase tracking-wider">Background</label>
                  <div className="flex items-center gap-2 bg-cream/30 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] rounded-xl px-3 py-2">
                    <input type="color" value={newBg} onChange={e => setNewBg(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent" />
                    <span className="text-xs font-mono text-primary dark:text-white">{newBg}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] text-secondary dark:text-white/40 mb-1 uppercase tracking-wider">Text</label>
                  <div className="flex items-center gap-2 bg-cream/30 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] rounded-xl px-3 py-2">
                    <input type="color" value={newText} onChange={e => setNewText(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent" />
                    <span className="text-xs font-mono text-primary dark:text-white">{newText}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Preview */}
            {newLabel && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-2">Preview</label>
                <div className="flex items-center gap-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold tracking-wider shadow-sm"
                    style={{ backgroundColor: newBg, color: newText }}
                  >
                    {newLabel}
                  </span>
                  <span className="text-xs text-secondary dark:text-white/40">as it appears on product cards</span>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleAdd}
              disabled={saving || !newLabel.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary dark:bg-[#D4AF37] text-white dark:text-black py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary/90 dark:hover:bg-[#E5C158] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm mt-1"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Add Badge
            </button>
          </div>
        </div>

        {/* ── RIGHT: Badge List ── */}
        <div className="rounded-3xl border border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] overflow-hidden shadow-sm">

          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border dark:border-[#2E2925] bg-cream/40 dark:bg-[#151311]">
            <Tag size={16} className="text-primary dark:text-[#D4AF37]" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary dark:text-white">All Badges</h2>
            <span className="text-[10px] bg-primary/10 dark:bg-[#D4AF37]/10 text-primary dark:text-[#D4AF37] rounded-full px-2 py-0.5 font-bold ml-auto">{badges.length}</span>
          </div>

          {/* List */}
          <ul className="divide-y divide-border dark:divide-[#2E2925] max-h-[520px] overflow-y-auto">
            {badges.length === 0 && (
              <li className="py-16 text-center">
                <Tag size={32} className="mx-auto mb-3 opacity-20 text-primary dark:text-white" />
                <p className="text-xs text-secondary dark:text-white/40">No badges yet. Add your first one.</p>
              </li>
            )}
            {badges.map(badge => (
              <li key={badge.id} className="px-5 py-4 group hover:bg-cream/30 dark:hover:bg-white/3 transition-colors">
                {editingId === badge.id ? (
                  /* Inline edit mode */
                  <div className="space-y-3">
                    <input
                      autoFocus
                      value={editLabel}
                      onChange={e => setEditLabel(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleUpdate(badge.id); if (e.key === 'Escape') setEditingId(null); }}
                      className="w-full text-xs bg-white dark:bg-[#221F1C] border border-primary dark:border-[#D4AF37] rounded-lg px-3 py-2 outline-none text-primary dark:text-white font-semibold"
                    />
                    {/* Quick colour presets */}
                    <div className="flex flex-wrap gap-1.5">
                      {COLOR_PRESETS.map(p => (
                        <button
                          key={p.name}
                          onClick={() => { setEditBg(p.bg); setEditText(p.text); }}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border-2 transition-all ${editBg === p.bg ? 'scale-105 border-primary dark:border-[#D4AF37]' : 'border-transparent'}`}
                          style={{ backgroundColor: p.bg, color: p.text }}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                    {/* Live preview */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-secondary dark:text-white/40 uppercase tracking-wider">Preview:</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold" style={{ backgroundColor: editBg, color: editText }}>
                        {editLabel || badge.label}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(badge.id)} className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 dark:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition hover:bg-emerald-700">
                        <Check size={13} /> Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="px-4 py-2 border border-border dark:border-[#2E2925] rounded-xl text-xs font-semibold text-secondary dark:text-white/60 hover:bg-cream dark:hover:bg-white/10 transition">
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Display mode */
                  <div className="flex items-center gap-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold tracking-wider shadow-sm shrink-0"
                      style={{ backgroundColor: badge.color, color: badge.text_color }}
                    >
                      {badge.label}
                    </span>
                    <div className="flex-1 min-w-0">
                      {badge.description && (
                        <p className="text-[11px] text-secondary dark:text-white/40 truncate">{badge.description}</p>
                      )}
                      <p className="text-[10px] font-mono text-secondary/60 dark:text-white/25">{badge.color} / {badge.text_color}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingId(badge.id); setEditLabel(badge.label); setEditBg(badge.color); setEditText(badge.text_color); }}
                        className="p-1.5 rounded-lg hover:bg-cream dark:hover:bg-white/10 text-secondary dark:text-white/50 transition"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(badge.id, badge.label)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 dark:text-rose-400 transition"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Badges', value: badges.length },
          { label: 'Custom Colours', value: badges.filter(b => !COLOR_PRESETS.some(p => p.bg === b.color)).length },
          { label: 'Preset Colours', value: badges.filter(b => COLOR_PRESETS.some(p => p.bg === b.color)).length },
        ].map(stat => (
          <div key={stat.label} className="p-5 rounded-2xl bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary dark:text-white/50 mb-2">{stat.label}</p>
            <p className="text-2xl font-light text-primary dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
