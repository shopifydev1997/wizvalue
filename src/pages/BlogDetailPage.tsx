import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
  Share2,
  Check,
  BookOpen
} from 'lucide-react';
import { BlogPost } from '../types';
import { getBlogPostBySlugOrId, getBlogPosts, resolveAssetUrl } from '../lib/storeService';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSEO } from '../hooks/useSEO';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useSEO({
    title: post ? `${post.title} | WiZ Blog` : 'Blog Article | WiZ Home Hygiene & Personal Care',
    description: post?.excerpt || 'Read skin care and personal hygiene insights from WiZ.'
  });

  useEffect(() => {
    let active = true;
    const loadArticle = async () => {
      setLoading(true);
      try {
        const all = await getBlogPosts();
        const found = slug ? await getBlogPostBySlugOrId(slug) : undefined;
        if (active) {
          setPost(found || null);
          setRelatedPosts(
            all.filter((b) => b.id !== found?.id && b.published !== false).slice(0, 3)
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadArticle();
    return () => {
      active = false;
    };
  }, [slug]);

  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen pb-20 font-['Poppins',sans-serif]">
        <Breadcrumbs items={[{ label: 'Blog', path: '/blog' }, { label: 'Loading...' }]} />
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-[180px] xl:px-[200px] pt-8">
          <div className="h-8 bg-gray-100 w-2/3 mb-4 animate-pulse" />
          <div className="h-80 bg-gray-100 w-full mb-6 animate-pulse" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-100 w-full animate-pulse" />
            <div className="h-4 bg-gray-100 w-5/6 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-white min-h-screen pb-20 font-['Poppins',sans-serif]">
        <Breadcrumbs items={[{ label: 'Blog', path: '/blog' }, { label: 'Article Not Found' }]} />
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-[180px] xl:px-[200px] py-20 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            Blog Article Not Found
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            The article you are looking for may have been moved or removed.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-[#5f3786] hover:bg-black text-white px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Blogs</span>
          </Link>
        </div>
      </div>
    );
  }

  const paragraphs = post.content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="bg-white min-h-screen pb-20 font-['Poppins',sans-serif]">
      <Breadcrumbs items={[{ label: 'Blog', path: '/blog' }, { label: post.title }]} />

      <article className="w-full px-4 sm:px-8 md:px-12 lg:px-[180px] xl:px-[200px] pt-6">
        {/* Back link & Category */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 hover:text-[#7a49a6] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Blog Posts</span>
          </Link>

          <button
            type="button"
            onClick={handleCopyShareLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-gray-200 hover:border-[#7a49a6] text-xs font-medium text-gray-700 hover:text-[#7a49a6] transition-colors cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Article</span>
              </>
            )}
          </button>
        </div>

        {/* Article Header */}
        <header className="max-w-4xl text-left mb-8">
          <span className="inline-block bg-[#f8f0fc] text-[#5f3786] border border-[#ecdcf8] text-[11px] font-bold uppercase tracking-widest px-3 py-1 mb-4">
            {post.category}
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-gray-900 tracking-tight leading-tight mb-4">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-5">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-5 text-xs text-gray-500 pt-4 border-t border-gray-100">
            <span className="inline-flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#7a49a6]" />
              <span>{post.author}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#7a49a6]" />
              <span>{post.date}</span>
            </span>
            {post.readTime && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#7a49a6]" />
                <span>{post.readTime}</span>
              </span>
            )}
          </div>
        </header>

        {/* Hero Cover Image */}
        {post.image && (
          <div className="w-full max-w-4xl aspect-[16/9] sm:aspect-[21/10] bg-gray-100 overflow-hidden mb-10 border border-gray-100 shadow-xs">
            <img
              src={resolveAssetUrl(post.image)}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
          </div>
        )}

        {/* Full Article Content */}
        <div className="max-w-4xl text-left space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed sm:leading-loose">
          {paragraphs.map((paragraph, idx) => (
            <p key={idx} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags & CTA Banner */}
        <div className="max-w-4xl mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">
              Tags:
            </span>
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to="/blog"
                className="rounded-full px-3.5 py-1 text-xs text-gray-700 bg-gray-50 border border-gray-200 hover:border-[#7a49a6] hover:text-[#7a49a6] transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 bg-[#5f3786] hover:bg-black text-white px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
          >
            <span>Explore WiZ Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Related Blog Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                More From WiZ Journal
              </h2>
              <Link
                to="/blog"
                className="text-xs font-semibold uppercase tracking-wider text-[#7a49a6] hover:underline flex items-center gap-1"
              >
                <span>View All Blogs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((item) => (
                <Link
                  key={item.id}
                  to={`/blog/${item.slug}`}
                  className="group border border-gray-200 bg-white hover:border-[#7a49a6]/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                      {item.image && (
                        <img
                          src={resolveAssetUrl(item.image)}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="p-5 text-left">
                      <span className="text-[11px] text-[#7a49a6] font-semibold uppercase tracking-wider block mb-1">
                        {item.category}
                      </span>
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#7a49a6] transition-colors leading-snug mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{item.excerpt}</p>
                    </div>
                  </div>
                  <div className="px-5 py-3 border-t border-gray-100 text-[11px] font-semibold text-[#5f3786] flex items-center justify-between">
                    <span>{item.date}</span>
                    <span className="inline-flex items-center gap-1">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};
