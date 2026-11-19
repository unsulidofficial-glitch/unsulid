'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Package,
  Edit2,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Save,
  Tag,
  Boxes,
  Plus,
  Trash2,
  Upload,
  Sparkles,
  X,
  ImageIcon,
} from 'lucide-react';
import { api } from '@/lib/api';

const PRESET_FLACONS = [
  { label: 'HIGH CLASS (Burgundy)', url: '/images/products/high-class-front.jpg' },
  { label: 'BLACK (Obsidian)', url: '/images/products/black-front.jpg' },
  { label: 'ROYAL OUD (Amber Noir)', url: '/images/collections/col-unisex.jpg' },
  { label: 'FLORAL ESSENCE (Ivory)', url: '/images/collections/col-women.jpg' },
  { label: 'DUO SET (Signature Vault)', url: '/images/banners/hero-desktop-4k.jpg' },
];

export default function AdminProductsClient() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState<string | null>(null);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    category: 'Everyday Fragrance',
    bottleSize: '50ml Eau de Parfum',
    sellingPrice: '',
    mrp: '',
    discountPrice: '',
    stock: '150',
    status: 'ACTIVE',
    occasion: 'Daily Wear, Special Occasions',
    brandPersonality: 'Sophisticated, Long Lasting, Regal',
    description: '',
    imageUrl: '/images/products/high-class-front.jpg',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadProducts = () => {
    setLoading(true);
    api.admin
      .getProducts()
      .then((res) => {
        if (res?.products) setProducts(res.products);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Auto-generate slug when name changes
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setNewProduct((prev) => ({
      ...prev,
      name,
      slug: prev.slug === '' || prev.slug === prev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') ? slug : prev.slug,
    }));
  };

  // Handle local image file upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: 'Image file size must be under 5MB', isError: true });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setNewProduct((prev) => ({ ...prev, imageUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setMessage(null);

    try {
      const sellingPriceNum = Number(newProduct.sellingPrice);
      const mrpNum = newProduct.mrp ? Number(newProduct.mrp) : Math.round(sellingPriceNum * 1.35);
      const stockNum = Number(newProduct.stock) || 100;

      const res = await api.admin.createProduct({
        name: newProduct.name.trim(),
        slug: newProduct.slug.trim(),
        description: newProduct.description.trim(),
        sellingPrice: sellingPriceNum,
        mrp: mrpNum,
        discountPrice: newProduct.discountPrice ? Number(newProduct.discountPrice) : undefined,
        category: newProduct.category,
        occasion: newProduct.occasion,
        brandPersonality: newProduct.brandPersonality,
        bottleSize: newProduct.bottleSize,
        stock: stockNum,
        status: newProduct.status,
        imageUrl: newProduct.imageUrl,
        images: [
          {
            url: newProduct.imageUrl,
            altText: `${newProduct.name} Luxury Fragrance`,
            isPrimary: true,
          },
        ],
      });

      if (res?.success) {
        setMessage({ text: res.message || 'Product created successfully!', isError: false });
        setIsAddModalOpen(false);
        // Reset form
        setNewProduct({
          name: '',
          slug: '',
          category: 'Everyday Fragrance',
          bottleSize: '50ml Eau de Parfum',
          sellingPrice: '',
          mrp: '',
          discountPrice: '',
          stock: '150',
          status: 'ACTIVE',
          occasion: 'Daily Wear, Special Occasions',
          brandPersonality: 'Sophisticated, Long Lasting, Regal',
          description: '',
          imageUrl: '/images/products/high-class-front.jpg',
        });
        loadProducts();
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to create product', isError: true });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProduct = async (slug: string) => {
    try {
      const res = await api.admin.deleteProduct(slug);
      if (res?.success) {
        setMessage({ text: res.message || 'Product removed successfully', isError: false });
        setDeleteConfirmSlug(null);
        loadProducts();
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to delete product', isError: true });
    }
  };

  const handleEditClick = (prod: any) => {
    setEditingProduct({
      ...prod,
      sellingPrice: prod.sellingPrice,
      mrp: prod.mrp,
      discountPrice: prod.discountPrice || '',
      stock: prod.stock,
      status: prod.status,
    });
    setMessage(null);
  };

  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await api.admin.updatePrice(editingProduct.slug, {
        sellingPrice: Number(editingProduct.sellingPrice),
        mrp: Number(editingProduct.mrp),
        discountPrice: editingProduct.discountPrice
          ? Number(editingProduct.discountPrice)
          : undefined,
        stock: Number(editingProduct.stock),
        status: editingProduct.status,
      });

      if (res?.success) {
        setMessage({ text: res.message, isError: false });
        setEditingProduct(null);
        loadProducts();
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to update product pricing', isError: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C6A15B] font-bold block mb-1">
            CATALOG CONTROL
          </span>
          <h1 className="font-serif text-3xl font-medium text-white">
            Product Pricing &amp; Inventory Management
          </h1>
          <p className="text-xs text-white/50 font-sans mt-1">
            Manage fragrances, add new perfumes with photos, adjust pricing, and maintain inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsAddModalOpen(true);
              setMessage(null);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B0F18] hover:bg-[#741522] text-xs font-semibold text-[#F8F1E7] border border-[#C6A15B]/30 shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C6A15B]" />
            <span>Add New Product</span>
          </button>

          <button
            onClick={loadProducts}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white border border-white/10 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload Catalog</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-sans flex items-center justify-between gap-2 shadow-lg ${
            message.isError
              ? 'bg-red-950/80 border border-red-800 text-red-200'
              : 'bg-emerald-950/80 border border-emerald-800 text-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.isError ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-white/60 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="p-6 rounded-2xl bg-[#141414] border border-white/10 shadow-sm flex flex-col justify-between hover:border-white/20 transition-all"
          >
            <div>
              <div className="flex items-start gap-4 mb-4">
                <div className="relative w-20 h-24 rounded-xl bg-black/60 overflow-hidden shrink-0 border border-white/10">
                  <Image
                    src={prod.images?.[0]?.url || `/images/products/${prod.slug}-front.jpg`}
                    alt={prod.name}
                    fill
                    unoptimized={prod.images?.[0]?.url?.startsWith('data:')}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#C6A15B] font-bold truncate">
                      {prod.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#5B0F18] text-white shrink-0">
                      {prod.status}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-white truncate">{prod.name}</h2>
                  <p className="text-xs text-white/50 font-sans mt-0.5">{prod.bottleSize}</p>
                </div>
              </div>

              {/* Pricing & Stock Details */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-black/40 border border-white/5 mb-4 text-xs font-sans">
                <div>
                  <span className="text-white/40 block text-[10px]">MRP</span>
                  <strong className="text-white font-mono text-sm">
                    ₹{prod.mrp?.toLocaleString('en-IN') || 0}
                  </strong>
                </div>
                <div>
                  <span className="text-[#C6A15B] block text-[10px] font-bold">SELLING PRICE</span>
                  <strong className="text-[#C6A15B] font-mono text-base font-bold">
                    ₹{prod.sellingPrice?.toLocaleString('en-IN') || 0}
                  </strong>
                </div>
                <div>
                  <span className="text-white/40 block text-[10px]">CURRENT STOCK</span>
                  <strong className="text-white font-mono text-sm">{prod.stock || 0} units</strong>
                </div>
              </div>

              <p className="text-xs text-white/60 font-sans line-clamp-2 leading-relaxed">
                {prod.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
              <span className="text-[11px] text-white/40 font-mono truncate">
                Slug: <code className="text-white/70">{prod.slug}</code>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmSlug(prod.slug)}
                  className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 transition-colors"
                  title="Delete product"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleEditClick(prod)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5B0F18] hover:bg-[#741522] text-white text-xs font-sans font-semibold transition-colors shadow-sm"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>Edit Price &amp; Stock</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#141414] rounded-3xl border border-red-900/50 p-6 shadow-2xl text-white">
            <h3 className="font-serif text-xl font-medium text-white mb-2">Delete Product</h3>
            <p className="text-xs text-white/60 mb-6 font-sans">
              Are you sure you want to remove <strong className="text-white font-mono">{deleteConfirmSlug}</strong> from the catalog? This action will immediately remove it from the storefront.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmSlug(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/15 text-xs font-semibold hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteProduct(deleteConfirmSlug)}
                className="flex-1 py-2.5 rounded-xl bg-red-800 hover:bg-red-700 text-white text-xs font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#141414] rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5B0F18] text-[#C6A15B] flex items-center justify-center border border-[#C6A15B]/30 shadow-md">
                  <Sparkles className="w-5 h-5 stroke-[1.75]" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-medium text-white">Add New Fragrance</h2>
                  <p className="text-xs text-white/50 font-sans">
                    Publish a new perfume to the UNSULID catalog
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-5 text-xs font-sans">
              {/* Image Upload & Photo Selection */}
              <div>
                <label className="block text-white/80 font-medium mb-1.5">
                  Product Photo / Flacon Image *
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Live Image Preview */}
                  <div className="relative w-28 h-32 rounded-2xl bg-black/60 border border-white/15 overflow-hidden shrink-0 flex items-center justify-center group shadow-md">
                    {newProduct.imageUrl ? (
                      <Image
                        src={newProduct.imageUrl}
                        alt="Product Preview"
                        fill
                        unoptimized={newProduct.imageUrl.startsWith('data:')}
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-center p-2 text-white/40">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 text-white/30" />
                        <span className="text-[10px]">No Photo</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-3">
                    {/* File Upload Button */}
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-2 transition-colors border border-white/10"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#C6A15B]" />
                        <span>Upload Photo from Device</span>
                      </button>
                      <span className="text-[11px] text-white/40 font-mono">PNG, JPG up to 5MB</span>
                    </div>

                    {/* Or URL input */}
                    <div>
                      <input
                        type="text"
                        value={newProduct.imageUrl}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, imageUrl: e.target.value })
                        }
                        placeholder="Or enter image URL (e.g. /images/products/...)"
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C6A15B]"
                      />
                    </div>

                    {/* Quick Preset Selector */}
                    <div>
                      <span className="text-[10px] uppercase font-mono text-[#C6A15B] tracking-wider block mb-1">
                        Or select brand flacon design:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_FLACONS.map((p) => (
                          <button
                            key={p.url}
                            type="button"
                            onClick={() => setNewProduct({ ...newProduct, imageUrl: p.url })}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-sans transition-colors ${
                              newProduct.imageUrl === p.url
                                ? 'bg-[#5B0F18] text-[#C6A15B] border border-[#C6A15B]/50 font-bold'
                                : 'bg-black/40 text-white/60 hover:text-white border border-white/10'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 font-medium mb-1">
                    Fragrance Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. ROYAL OUD, VELVET ROSE"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.slug}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''),
                      })
                    }
                    placeholder="e.g. royal-oud"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white/90 placeholder:text-white/30 focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
              </div>

              {/* Category & Concentration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 font-medium mb-1">Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                  >
                    <option value="Everyday Fragrance">Everyday Fragrance</option>
                    <option value="Evening Fragrance">Evening Fragrance</option>
                    <option value="Unisex Fragrance">Unisex Fragrance</option>
                    <option value="Niche Fragrance">Niche Fragrance</option>
                    <option value="Luxury Series">Luxury Series</option>
                    <option value="Limited Edition">Limited Edition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">
                    Bottle Size &amp; Concentration *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.bottleSize}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, bottleSize: e.target.value })
                    }
                    placeholder="e.g. 50ml Eau de Parfum"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#C6A15B] font-bold mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newProduct.sellingPrice}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, sellingPrice: e.target.value })
                    }
                    placeholder="e.g. 1799"
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-base font-mono font-bold text-[#C6A15B] focus:outline-none focus:border-[#C6A15B]"
                  />
                  <p className="text-[10px] text-white/40 mt-1">Customer checkout price</p>
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">
                    MRP / List Price (₹)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newProduct.mrp}
                    onChange={(e) => setNewProduct({ ...newProduct, mrp: e.target.value })}
                    placeholder="e.g. 2499"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-[#C6A15B]"
                  />
                  <p className="text-[10px] text-white/40 mt-1">Strikethrough original price</p>
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Initial Stock *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="e.g. 150"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-[#C6A15B]"
                  />
                  <p className="text-[10px] text-white/40 mt-1">Surat warehouse units</p>
                </div>
              </div>

              {/* Status & Occasion */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 font-medium mb-1">Storefront Status</label>
                  <select
                    value={newProduct.status}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, status: e.target.value as any })
                    }
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                  >
                    <option value="ACTIVE">ACTIVE (Live on Storefront)</option>
                    <option value="COMING_SOON">COMING_SOON (Upcoming Preview)</option>
                    <option value="INACTIVE">INACTIVE (Hidden / Draft)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Occasion / Best For</label>
                  <input
                    type="text"
                    value={newProduct.occasion}
                    onChange={(e) => setNewProduct({ ...newProduct, occasion: e.target.value })}
                    placeholder="e.g. Parties, Office, Celebrations"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white/80 font-medium mb-1">
                  Editorial Description / Fragrance Story *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Describe the perfume's olfactory character, mood, and presence..."
                  className="w-full bg-black/60 border border-white/15 rounded-xl p-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C6A15B] leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-white/15 text-xs font-semibold hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-3 rounded-xl bg-[#5B0F18] text-[#F8F1E7] font-semibold text-xs hover:bg-[#741522] transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  {creating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-[#C6A15B]" />
                      <span>Publish to Storefront</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Price & Stock Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#141414] rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
              <h2 className="font-serif text-2xl font-medium">
                Edit {editingProduct.name} Pricing
              </h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePrice} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 font-medium mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingProduct.sellingPrice}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, sellingPrice: e.target.value })
                    }
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-base font-mono font-bold text-[#C6A15B] focus:outline-none focus:border-[#C6A15B]"
                  />
                  <p className="text-[10px] text-white/40 mt-1">
                    Price charged to customer at checkout.
                  </p>
                </div>

                <div>
                  <label className="block text-white/70 font-medium mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingProduct.mrp}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, mrp: e.target.value })
                    }
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#C6A15B]"
                  />
                  <p className="text-[10px] text-white/40 mt-1">Strikethrough list price.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 font-medium mb-1">
                    Inventory Stock (Units) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: e.target.value })
                    }
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-medium mb-1">Status</label>
                  <select
                    value={editingProduct.status}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, status: e.target.value })
                    }
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                  >
                    <option value="ACTIVE">ACTIVE (Purchasable)</option>
                    <option value="COMING_SOON">COMING_SOON</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-3 rounded-xl border border-white/15 text-xs font-semibold hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-[#5B0F18] text-[#F8F1E7] font-semibold text-xs hover:bg-[#741522] flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save &amp; Update Live Storefront</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
