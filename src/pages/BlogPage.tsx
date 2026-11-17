import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Calendar,
  Clock,
  User,
  ArrowRight,
  X,
  Image as ImageIcon,
  Upload,
  Trash2,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { BlogPost } from '../types';
import {
  getBlogPosts,
  saveBlogPost,
  deleteBlogPost,
  slugifyBlogTitle,
  resolveAssetUrl
} from '../lib/storeService';
import { FALLBACK_PUBLIC_ASSETS } from '../lib/assetLibrary';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSEO } from '../hooks/useSEO';

const BLOG_CATEGORIES = [
  'All',
  'Industry & Market',
  'Leadership & Media',
  'Hygiene Essentials',
  'Skin Care',
  'Personal Care',
  'Beauty Rituals',
  'Home Hygiene',
  'Wellness'
];

const QUICK_COVER_PRESETS = [
  { label: 'Hygiene Startups', path: '/assets/aistudio/Reetesh-Sir-01_7339a95e.jpg' },
  { label: 'Women Leadership', path: '/assets/aistudio/Manish-Maam_d22e9dde.jpg' },
  { label: 'Handwashing Day', path: '/assets/aistudio/Handwash-Day_19b06b7d.jpg' },
  { label: 'Wet Wipes Care', path: '/assets/products/Rose Water Wet Wipes in Bloom.png' },
  { label: 'Bodywash Care', path: '/assets/products/Bodywash-M1.jpg' },
  { label: 'Handwash Care', path: '/assets/products/Fresh Orange Hand Wash Advertisement-1.png' }
];

export const BlogPage: React.FC = () => {
  useSEO({
    title: 'Journal & Blog | WiZ Home Hygiene & Personal Care',
    description:
      'Explore skincare rituals, pH-balanced hygiene guides, and home care articles from WiZ. Read and publish articles to the WiZ journal.'
  });

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Add New Blog Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [publishedBanner, setPublishedBanner] = useState<BlogPost | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [titleInput, setTitleInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('Skin Care');
  const [authorInput, setAuthorInput] = useState('WiZ Editorial Team');
  const [readTimeInput, setReadTimeInput] = useState('4 min read');
  const [tagsInput, setTagsInput] = useState('Hydration, Hygiene, Daily Care');
  const [imageInput, setImageInput] = useState('/assets/Blog01.jpg');
  const [excerptInput, setExcerptInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await getBlogPosts();
      setPosts(data.filter((p) => p.published !== false));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const availableCategories = useMemo(() => {
    const dynamicCats = new Set(BLOG_CATEGORIES);
    posts.forEach((p) => {
      if (p.category) dynamicCats.add(p.category);
    });
    return Array.from(dynamicCats);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        post.category.toLowerCase() === selectedCategory.toLowerCase();
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q)) ||
        post.category.toLowerCase().includes(q)
      );
    });
  }, [posts, selectedCategory, searchQuery]);

  const handleResetForm = () => {
    setTitleInput('');
    setCategoryInput('Skin Care');
    setAuthorInput('WiZ Editorial Team');
    setReadTimeInput('4 min read');
    setTagsInput('Hydration, Hygiene, Daily Care');
    setImageInput('/assets/Blog01.jpg');
    setExcerptInput('');
    setContentInput('');
    setFormError(null);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      setFormError('Please select an image under 500 KB or pick a WiZ preset cover image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageInput(reader.result);
        setFormError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanTitle = titleInput.trim();
    const cleanContent = contentInput.trim();
    const cleanExcerpt =
      excerptInput.trim() ||
      (cleanContent.length > 150 ? `${cleanContent.slice(0, 147)}...` : cleanContent);

    if (!cleanTitle) {
      setFormError('Please enter a blog title.');
      return;
    }
    if (!cleanContent) {
      setFormError('Please enter the blog article content.');
      return;
    }

    setIsSaving(true);
    try {
      const formattedDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 8);

      const newPost: BlogPost = {
        id: `blog-${Date.now()}`,
        slug: `${slugifyBlogTitle(cleanTitle)}-${Date.now().toString().slice(-4)}`,
        title: cleanTitle,
        excerpt: cleanExcerpt,
        content: cleanContent,
        author: authorInput.trim() || 'WiZ Editorial Team',
        date: formattedDate,
        readTime: readTimeInput.trim() || '4 min read',
        category: categoryInput.trim() || 'Personal Care',
        tags: parsedTags.length > 0 ? parsedTags : ['WiZ Care', 'Hygiene'],
        image: imageInput.trim() || '/assets/Blog01.jpg',
        imagePosition: posts.length % 2 === 0 ? 'bottom' : 'top',
        published: true,
        createdAt: new Date().toISOString()
      };

      const saved = await saveBlogPost(newPost);
      setPosts((prev) => [saved, ...prev]);
      setPublishedBanner(saved);
      setIsAddModalOpen(false);
      handleResetForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to save blog post.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    await deleteBlogPost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setConfirmDeleteId(null);
  };

  return (
    <div className="bg-white min-h-screen pb-20 font-['Poppins',sans-serif]">
      <Breadcrumbs items={[{ label: 'Blog' }]} />

      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-[180px] xl:px-[200px] pt-4 flex flex-col">
        {/* Top Editorial Banner with "Add New Blog" CTA */}
        <div className="bg-[#f8f0fc] border border-[#ecdcf8] p-8 sm:p-12 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-left max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#7a49a6] block mb-1.5">
              WiZ Journal &amp; Guides
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-gray-900 tracking-tight leading-tight">
              Skin Care, Hygiene &amp; Wellness Blog
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
              Practical hydration rituals, clean beauty routines, and science-backed home hygiene guides crafted for everyday confidence.
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => {
                setFormError(null);
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center space-x-2 bg-[#5f3786] hover:bg-black text-white px-6 py-3.5 text-xs sm:text-[13px] font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Blog</span>
            </button>
          </div>
        </div>

        {/* Success Banner when a new blog post is published */}
        {publishedBanner && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs sm:text-sm">
                <strong>Published:</strong> &ldquo;{publishedBanner.title}&rdquo; is now live on the Blog page and Homepage.
              </div>
            </div>
            <div className="flex items-center space-x-4 shrink-0">
              <Link
                to={`/blog/${publishedBanner.slug}`}
                className="text-xs font-bold uppercase tracking-wider text-emerald-800 hover:underline flex items-center space-x-1"
              >
                <span>View Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setPublishedBanner(null)}
                className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10 pb-5 border-b border-gray-200">
          {/* Category Filter Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#5f3786] text-white border-[#5f3786]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#7a49a6] hover:text-[#7a49a6]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles or tags..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="border border-gray-100 bg-gray-50 h-96 animate-pulse" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-16 px-6 text-center bg-gray-50 border border-dashed border-gray-300">
            <BookOpen className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-900">No matching blog posts found</h2>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              Try a different keyword or add a new article right now.
            </p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center space-x-2 bg-[#5f3786] hover:bg-black text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Blog</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group border border-gray-200 bg-white flex flex-col justify-between hover:border-[#7a49a6]/60 hover:shadow-md transition-all duration-200"
              >
                <div>
                  {/* Clickable Cover Image */}
                  <Link
                    to={`/blog/${post.slug}`}
                    className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100"
                  >
                    {post.image ? (
                      <img
                        src={resolveAssetUrl(post.image)}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-white/95 text-[#5f3786] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 shadow-xs">
                      {post.category}
                    </span>
                  </Link>

                  {/* Body */}
                  <div className="p-6 text-left">
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 mb-3">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#7a49a6]" />
                        {post.date}
                      </span>
                      {post.readTime && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#7a49a6]" />
                          {post.readTime}
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 leading-snug mb-2.5 group-hover:text-[#7a49a6] transition-colors">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-[#fafafa]">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 truncate max-w-[140px]">
                    <User className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    <span className="truncate">{post.author}</span>
                  </span>

                  <div className="flex items-center gap-3">
                    {!['blog-1', 'blog-2', 'blog-3'].includes(post.id) && (
                      confirmDeleteId === post.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDeletePost(post.id)}
                            className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-[11px] text-gray-500 hover:text-gray-800 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(post.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete custom blog post"
                          aria-label={`Delete ${post.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )
                    )}

                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#5f3786] hover:text-black transition-colors"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Add New Blog Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl border border-gray-200 shadow-2xl my-8 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#5f3786] text-white flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Add New Blog Post</h2>
                <p className="text-[11px] text-purple-100">
                  Publish a new article directly to the WiZ Blog and Latest Blog Posts section
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBlog} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-left">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  Blog Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="e.g. Why pH-Balanced Handwash Matters Every Season"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                />
                {titleInput.trim() && (
                  <p className="text-[11px] text-gray-400 mt-1">
                    URL Slug: <span className="font-mono">/blog/{slugifyBlogTitle(titleInput)}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1">
                    Category
                  </label>
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 bg-white focus:outline-none focus:border-[#7a49a6]"
                  >
                    {BLOG_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={authorInput}
                    onChange={(e) => setAuthorInput(e.target.value)}
                    placeholder="WiZ Editorial Team"
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={readTimeInput}
                    onChange={(e) => setReadTimeInput(e.target.value)}
                    placeholder="4 min read"
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Skin Care, Gentle Cleanse, Daily Ritual"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                />
              </div>

              {/* Cover Image Selection */}
              <div className="border border-gray-200 p-4 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-gray-800">
                    Cover Image URL or Upload
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#5f3786] hover:text-black cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image File</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </div>

                <input
                  type="text"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder="/assets/Blog01.jpg or https://..."
                  className="w-full px-3 py-2 text-xs font-mono border border-gray-300 bg-white focus:outline-none focus:border-[#7a49a6]"
                />

                <div className="flex flex-wrap gap-1.5">
                  {QUICK_COVER_PRESETS.map((preset) => (
                    <button
                      key={preset.path}
                      type="button"
                      onClick={() => setImageInput(preset.path)}
                      className={`px-2.5 py-1 text-[10px] border transition-colors cursor-pointer ${
                        imageInput === preset.path
                          ? 'bg-[#5f3786] text-white border-[#5f3786]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#7a49a6]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                  {FALLBACK_PUBLIC_ASSETS.filter((a) => a.category === 'Blog').length === 0 && null}
                </div>

                {imageInput && (
                  <div className="w-40 aspect-video bg-white border border-gray-200 overflow-hidden">
                    <img
                      src={resolveAssetUrl(imageInput)}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  Short Summary / Excerpt
                </label>
                <textarea
                  rows={2}
                  value={excerptInput}
                  onChange={(e) => setExcerptInput(e.target.value)}
                  placeholder="Brief 1-2 sentence summary displayed on the Blog grid and Homepage..."
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  Full Blog Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  value={contentInput}
                  onChange={(e) => setContentInput(e.target.value)}
                  placeholder="Write your complete blog article here. Use blank lines to separate paragraphs..."
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 focus:outline-none focus:border-[#7a49a6]"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-700 border border-gray-300 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#5f3786] hover:bg-black disabled:opacity-60 transition-colors cursor-pointer"
                >
                  {isSaving ? 'Publishing...' : 'Publish Blog Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
