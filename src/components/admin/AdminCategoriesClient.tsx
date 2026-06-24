"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Tag, Trash2, X, Check } from "lucide-react";

interface Category {
  id: string;
  nameEn: string;
  nameUz: string;
  nameNo: string;
  nameSv: string;
  nameEs: string;
  _count: { products: number };
}

interface AdminCategoriesClientProps {
  categories: Category[];
}

const LANGS = [
  { code: "En", label: "English 🇬🇧" },
  { code: "Uz", label: "O'zbek 🇺🇿" },
  { code: "No", label: "Norsk 🇳🇴" },
  { code: "Sv", label: "Svenska 🇸🇪" },
  { code: "Es", label: "Español 🇪🇸" },
];

export function AdminCategoriesClient({ categories: initial }: AdminCategoriesClientProps) {
  const [categories, setCategories] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nameEn: "", nameUz: "", nameNo: "", nameSv: "", nameEs: "" });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!form.nameEn.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const cat = await res.json();
        setCategories((prev) => [...prev, { ...cat, _count: { products: 0 } }]);
        setForm({ nameEn: "", nameUz: "", nameNo: "", nameSv: "", nameEs: "" });
        setShowForm(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Products in it will be uncategorized.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) setCategories((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-gray-400 text-sm mt-1">{categories.length} categories</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add Category"}
        </button>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-semibold">New Category</h3>
              {LANGS.map((lang) => {
                const key = `name${lang.code}` as keyof typeof form;
                return (
                  <div key={lang.code}>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">
                      {lang.label} {lang.code === "En" && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      value={form[key]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder={`Category name in ${lang.label.split(" ")[0]}`}
                      className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 text-sm"
                    />
                  </div>
                );
              })}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={saving || !form.nameEn.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-800 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  {saving ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Create
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories List */}
      <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-12 text-center">
            <Tag className="w-12 h-12 mx-auto mb-3 text-gray-600" />
            <p className="text-gray-400 mb-2">No categories yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-brand-400 hover:text-brand-300 text-sm"
            >
              Create your first category →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 px-6 py-4"
              >
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Tag className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">{cat.nameEn}</p>
                  <p className="text-gray-500 text-xs">
                    {cat._count.products} products
                    {cat.nameUz && ` · ${cat.nameUz}`}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  disabled={deletingId === cat.id}
                  className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                >
                  {deletingId === cat.id ? (
                    <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
