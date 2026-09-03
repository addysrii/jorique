import { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Tag,
  FolderOpen,
  Pencil,
  X,
  Check,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

// ─── Slug helper ──────────────────────────────────────────────────────────────

const toSlug = (text: string) =>
  text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');

// ─── Component ────────────────────────────────────────────────────────────────

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // New category form
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // New subcategory form
  const [newSubName, setNewSubName] = useState('');
  const [newSubDesc, setNewSubDesc] = useState('');

  // Inline rename state
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editingSubName, setEditingSubName] = useState('');

  // ── Data fetching ─────────────────────────────────────────────────────────

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [{ data: cats }, { data: subs }] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('subcategories').select('*').order('name'),
      ]);
      if (cats) setCategories(cats as Category[]);
      if (subs) setSubcategories(subs as Subcategory[]);
    } catch (err) {
      showToast('error', 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // ── Toast helper ──────────────────────────────────────────────────────────

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Category CRUD ─────────────────────────────────────────────────────────

  const handleAddCategory = async () => {
    const name = newCatName.trim();
    if (!name) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({ name, slug: toSlug(name), description: newCatDesc.trim() || null })
        .select()
        .single();
      if (error) throw error;
      setCategories(prev => [...prev, data as Category].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCatName('');
      setNewCatDesc('');
      showToast('success', `Category "${name}" added.`);
    } catch (err: any) {
      showToast('error', err?.message ?? 'Failed to add category.');
    } finally {
      setSaving(false);
    }
  };

  const handleRenameCategory = async (id: string) => {
    const name = editingCatName.trim();
    if (!name) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('categories').update({ name, slug: toSlug(name) }).eq('id', id);
      if (error) throw error;
      setCategories(prev =>
        prev.map(c => (c.id === id ? { ...c, name, slug: toSlug(name) } : c)).sort((a, b) => a.name.localeCompare(b.name))
      );
      setEditingCatId(null);
      showToast('success', 'Category renamed.');
    } catch (err: any) {
      showToast('error', err?.message ?? 'Failed to rename.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}" and ALL its subcategories? This cannot be undone.`)) return;
    setSaving(true);
    try {
      await supabase.from('subcategories').delete().eq('category_id', id);
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      setCategories(prev => prev.filter(c => c.id !== id));
      setSubcategories(prev => prev.filter(s => s.category_id !== id));
      if (selectedCategoryId === id) setSelectedCategoryId(null);
      showToast('success', `Category "${name}" deleted.`);
    } catch (err: any) {
      showToast('error', err?.message ?? 'Failed to delete category.');
    } finally {
      setSaving(false);
    }
  };

  // ── Subcategory CRUD ──────────────────────────────────────────────────────

  const handleAddSubcategory = async () => {
    const name = newSubName.trim();
    if (!name || !selectedCategoryId) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .insert({ category_id: selectedCategoryId, name, slug: toSlug(name), description: newSubDesc.trim() || null })
        .select()
        .single();
      if (error) throw error;
      setSubcategories(prev => [...prev, data as Subcategory].sort((a, b) => a.name.localeCompare(b.name)));
      setNewSubName('');
      setNewSubDesc('');
      showToast('success', `Subcategory "${name}" added.`);
    } catch (err: any) {
      showToast('error', err?.message ?? 'Failed to add subcategory.');
    } finally {
      setSaving(false);
    }
  };

  const handleRenameSubcategory = async (id: string) => {
    const name = editingSubName.trim();
    if (!name) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('subcategories').update({ name, slug: toSlug(name) }).eq('id', id);
      if (error) throw error;
      setSubcategories(prev =>
        prev.map(s => (s.id === id ? { ...s, name, slug: toSlug(name) } : s)).sort((a, b) => a.name.localeCompare(b.name))
      );
      setEditingSubId(null);
      showToast('success', 'Subcategory renamed.');
    } catch (err: any) {
      showToast('error', err?.message ?? 'Failed to rename.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSubcategory = async (id: string, name: string) => {
    if (!window.confirm(`Delete subcategory "${name}"?`)) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('subcategories').delete().eq('id', id);
      if (error) throw error;
      setSubcategories(prev => prev.filter(s => s.id !== id));
      showToast('success', `Subcategory "${name}" deleted.`);
    } catch (err: any) {
      showToast('error', err?.message ?? 'Failed to delete subcategory.');
    } finally {
      setSaving(false);
    }
  };

  // ── Derived state ─────────────────────────────────────────────────────────

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const visibleSubs = subcategories.filter(s => s.category_id === selectedCategoryId);

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center gap-3 text-secondary dark:text-white/50">
        <Loader2 size={28} className="animate-spin text-primary dark:text-[#D4AF37]" />
        <p className="text-xs uppercase tracking-widest">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold backdrop-blur-sm border transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT PANEL: Categories */}
        <div className="rounded-3xl border border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border dark:border-[#2E2925] bg-cream/40 dark:bg-[#151311]">
            <div className="flex items-center gap-2.5">
              <FolderOpen size={16} className="text-primary dark:text-[#D4AF37]" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary dark:text-white">Categories</h2>
              <span className="text-[10px] bg-primary/10 dark:bg-[#D4AF37]/10 text-primary dark:text-[#D4AF37] rounded-full px-2 py-0.5 font-bold">{categories.length}</span>
            </div>
          </div>

          {/* Add category form */}
          <div className="p-4 border-b border-border dark:border-[#2E2925] bg-cream/20 dark:bg-[#151311]/60 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New category name..."
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                className="flex-1 text-xs bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-xl px-4 py-2.5 outline-none text-primary dark:text-white placeholder-secondary dark:placeholder-white/30 focus:border-primary dark:focus:border-[#D4AF37] transition"
              />
              <button
                onClick={handleAddCategory}
                disabled={saving || !newCatName.trim()}
                className="inline-flex items-center gap-1.5 bg-primary dark:bg-[#D4AF37] text-white dark:text-black px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/90 dark:hover:bg-[#E5C158] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                Add
              </button>
            </div>
            <input
              type="text"
              placeholder="Description (optional)"
              value={newCatDesc}
              onChange={e => setNewCatDesc(e.target.value)}
              className="w-full text-xs bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-xl px-4 py-2 outline-none text-primary dark:text-white placeholder-secondary dark:placeholder-white/30 focus:border-primary dark:focus:border-[#D4AF37] transition"
            />
          </div>

          {/* Category list */}
          <ul className="divide-y divide-border dark:divide-[#2E2925] max-h-[420px] overflow-y-auto">
            {categories.length === 0 && (
              <li className="py-10 text-center text-xs text-secondary dark:text-white/40">No categories yet. Add your first one above.</li>
            )}
            {categories.map(cat => (
              <li
                key={cat.id}
                className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer group transition-colors ${
                  selectedCategoryId === cat.id
                    ? 'bg-primary/5 dark:bg-[#D4AF37]/5 border-l-2 border-primary dark:border-[#D4AF37]'
                    : 'hover:bg-cream/60 dark:hover:bg-white/3 border-l-2 border-transparent'
                }`}
                onClick={() => { if (editingCatId !== cat.id) setSelectedCategoryId(cat.id); }}
              >
                {editingCatId === cat.id ? (
                  <input
                    autoFocus
                    value={editingCatName}
                    onChange={e => setEditingCatName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleRenameCategory(cat.id); if (e.key === 'Escape') setEditingCatId(null); }}
                    className="flex-1 text-xs bg-white dark:bg-[#221F1C] border border-primary dark:border-[#D4AF37] rounded-lg px-3 py-1.5 outline-none text-primary dark:text-white"
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-primary dark:text-white truncate">{cat.name}</p>
                    <p className="text-[10px] text-secondary dark:text-white/40 font-mono truncate">{cat.slug}</p>
                  </div>
                )}

                <span className="text-[10px] text-secondary dark:text-white/40 shrink-0">
                  {subcategories.filter(s => s.category_id === cat.id).length} sub
                </span>

                <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                  {editingCatId === cat.id ? (
                    <>
                      <button onClick={() => handleRenameCategory(cat.id)} className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 transition"><Check size={12} /></button>
                      <button onClick={() => setEditingCatId(null)} className="p-1.5 rounded-lg hover:bg-cream dark:hover:bg-white/10 text-secondary dark:text-white/50 transition"><X size={12} /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setEditingCatId(cat.id); setEditingCatName(cat.name); }} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-cream dark:hover:bg-white/10 text-secondary dark:text-white/50 transition" title="Rename"><Pencil size={12} /></button>
                      <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 dark:text-rose-400 transition" title="Delete"><Trash2 size={12} /></button>
                    </>
                  )}
                </div>

                {selectedCategoryId === cat.id && editingCatId !== cat.id && (
                  <ChevronRight size={14} className="text-primary dark:text-[#D4AF37] shrink-0" />
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT PANEL: Subcategories */}
        <div className="rounded-3xl border border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] overflow-hidden shadow-sm">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border dark:border-[#2E2925] bg-cream/40 dark:bg-[#151311]">
            <Tag size={16} className="text-primary dark:text-[#D4AF37]" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary dark:text-white">Subcategories</h2>
            {selectedCategory && (
              <span className="text-[10px] bg-primary/10 dark:bg-[#D4AF37]/10 text-primary dark:text-[#D4AF37] rounded-full px-2 py-0.5 font-bold truncate max-w-[140px]">{selectedCategory.name}</span>
            )}
            {selectedCategory && (
              <span className="ml-auto text-[10px] bg-primary/10 dark:bg-[#D4AF37]/10 text-primary dark:text-[#D4AF37] rounded-full px-2 py-0.5 font-bold">{visibleSubs.length}</span>
            )}
          </div>

          {/* Add subcategory form */}
          {selectedCategory ? (
            <div className="p-4 border-b border-border dark:border-[#2E2925] bg-cream/20 dark:bg-[#151311]/60 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`New subcategory in "${selectedCategory.name}"...`}
                  value={newSubName}
                  onChange={e => setNewSubName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddSubcategory()}
                  className="flex-1 text-xs bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-xl px-4 py-2.5 outline-none text-primary dark:text-white placeholder-secondary dark:placeholder-white/30 focus:border-primary dark:focus:border-[#D4AF37] transition"
                />
                <button
                  onClick={handleAddSubcategory}
                  disabled={saving || !newSubName.trim()}
                  className="inline-flex items-center gap-1.5 bg-primary dark:bg-[#D4AF37] text-white dark:text-black px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/90 dark:hover:bg-[#E5C158] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                  Add
                </button>
              </div>
              <input
                type="text"
                placeholder="Description (optional)"
                value={newSubDesc}
                onChange={e => setNewSubDesc(e.target.value)}
                className="w-full text-xs bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-xl px-4 py-2 outline-none text-primary dark:text-white placeholder-secondary dark:placeholder-white/30 focus:border-primary dark:focus:border-[#D4AF37] transition"
              />
            </div>
          ) : (
            <div className="p-4 border-b border-border dark:border-[#2E2925] bg-cream/20 dark:bg-[#151311]/60">
              <p className="text-xs text-secondary dark:text-white/40 text-center py-2">Left arrow: Select a category to manage its subcategories</p>
            </div>
          )}

          {/* Subcategory list */}
          <ul className="divide-y divide-border dark:divide-[#2E2925] max-h-[420px] overflow-y-auto">
            {!selectedCategory ? (
              <li className="py-14 text-center text-xs text-secondary dark:text-white/30">
                <FolderOpen size={28} className="mx-auto mb-3 opacity-30" />
                Select a category to view subcategories
              </li>
            ) : visibleSubs.length === 0 ? (
              <li className="py-10 text-center text-xs text-secondary dark:text-white/40">No subcategories yet. Add one above.</li>
            ) : (
              visibleSubs.map(sub => (
                <li key={sub.id} className="flex items-center gap-3 px-5 py-3.5 group hover:bg-cream/40 dark:hover:bg-white/3 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 dark:bg-[#D4AF37]/40 shrink-0" />

                  {editingSubId === sub.id ? (
                    <input
                      autoFocus
                      value={editingSubName}
                      onChange={e => setEditingSubName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleRenameSubcategory(sub.id); if (e.key === 'Escape') setEditingSubId(null); }}
                      className="flex-1 text-xs bg-white dark:bg-[#221F1C] border border-primary dark:border-[#D4AF37] rounded-lg px-3 py-1.5 outline-none text-primary dark:text-white"
                    />
                  ) : (
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-primary dark:text-white truncate">{sub.name}</p>
                      <p className="text-[10px] text-secondary dark:text-white/40 font-mono truncate">{sub.slug}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-1 shrink-0">
                    {editingSubId === sub.id ? (
                      <>
                        <button onClick={() => handleRenameSubcategory(sub.id)} className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 transition"><Check size={12} /></button>
                        <button onClick={() => setEditingSubId(null)} className="p-1.5 rounded-lg hover:bg-cream dark:hover:bg-white/10 text-secondary dark:text-white/50 transition"><X size={12} /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditingSubId(sub.id); setEditingSubName(sub.name); }} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-cream dark:hover:bg-white/10 text-secondary dark:text-white/50 transition"><Pencil size={12} /></button>
                        <button onClick={() => handleDeleteSubcategory(sub.id, sub.name)} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 dark:text-rose-400 transition"><Trash2 size={12} /></button>
                      </>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Categories', value: categories.length, icon: <FolderOpen size={15} /> },
          { label: 'Total Subcategories', value: subcategories.length, icon: <Tag size={15} /> },
          {
            label: 'Largest Category',
            value: categories.length
              ? categories.reduce((a, b) =>
                  subcategories.filter(s => s.category_id === a.id).length >= subcategories.filter(s => s.category_id === b.id).length ? a : b
                ).name
              : 'N/A',
            icon: <ChevronRight size={15} />,
          },
          {
            label: 'Empty Categories',
            value: categories.filter(c => subcategories.filter(s => s.category_id === c.id).length === 0).length,
            icon: <AlertCircle size={15} />,
          },
        ].map(stat => (
          <div key={stat.label} className="p-5 rounded-2xl bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] shadow-sm">
            <div className="flex items-center justify-between text-secondary dark:text-white/50 mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest">{stat.label}</span>
              <span className="text-primary dark:text-[#D4AF37]">{stat.icon}</span>
            </div>
            <p className="text-xl font-light text-primary dark:text-white truncate">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* SQL Setup hint */}

    </div>
  );
}
