import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Play,
  Pause
} from 'lucide-react';
import { Product } from '../types';

export interface ShoppableVideoItem {
  id: string;
  productTitle: string;
  regularPrice: number;
  sellingPrice: number;
  productImage: string;
  videoPoster: string;
  videoUrl?: string;
  instagramUrl?: string;
  productId?: string;
}

export const DEFAULT_SHOPPABLE_VIDEOS: ShoppableVideoItem[] = [
  {
    id: 'shoppable-1',
    productTitle: 'Hand Wash',
    regularPrice: 150.0,
    sellingPrice: 99.0,
    productImage: '/assets/products/Lavender-Handwash-1L.jpg',
    videoPoster: '/assets/products/stoppable-video01.jpg'
  },
  {
    id: 'shoppable-2',
    productTitle: 'Wet Wipes',
    regularPrice: 150.0,
    sellingPrice: 99.0,
    productImage: '/assets/products/shoppable-thumb-2.jpg',
    videoPoster: '/assets/products/stoppable-video02.jpg'
  },
  {
    id: 'shoppable-3',
    productTitle: 'Body Wash',
    regularPrice: 150.0,
    sellingPrice: 99.0,
    productImage: '/assets/products/LilyBodywash 5L.jpg',
    videoPoster: '/assets/products/stoppable-video03.jpg'
  },
  {
    id: 'shoppable-4',
    productTitle: 'Liquid Matic',
    regularPrice: 150.0,
    sellingPrice: 99.0,
    productImage: '/assets/products/shoppable-thumb-4.jpg',
    videoPoster: '/assets/products/stoppable-video04.jpg'
  }
];

export function extractInstagramShortcode(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:instagram\.com|instagr\.am)\/(?:reel|p|tv|reels)\/([A-Za-z0-9_-]+)/i);
  return match ? match[1] : null;
}

interface ShoppableVideosSectionProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

export const ShoppableVideosSection: React.FC<ShoppableVideosSectionProps> = ({
  products,
  onQuickView
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Shoppable Videos state with localStorage persistence
  const [shoppableVideos, setShoppableVideos] = useState<ShoppableVideoItem[]>(() => {
    try {
      const saved = localStorage.getItem('wiz_shoppable_videos_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: ShoppableVideoItem) => {
            if (item.videoPoster === '/assets/products/shoppable-video-1.jpg') {
              return { ...item, videoPoster: '/assets/products/stoppable-video01.jpg' };
            }
            if (item.videoPoster === '/assets/products/shoppable-video-2.jpg') {
              return { ...item, videoPoster: '/assets/products/stoppable-video02.jpg' };
            }
            if (item.videoPoster === '/assets/products/shoppable-video-3.jpg') {
              return { ...item, videoPoster: '/assets/products/stoppable-video03.jpg' };
            }
            if (item.videoPoster === '/assets/products/shoppable-video-4.jpg') {
              return { ...item, videoPoster: '/assets/products/stoppable-video04.jpg' };
            }
            return item;
          });
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_SHOPPABLE_VIDEOS;
  });

  // Video playback states
  const [playingVideoMap, setPlayingVideoMap] = useState<Record<string, boolean>>({});
  const [mutedVideoMap, setMutedVideoMap] = useState<Record<string, boolean>>({});
  const videoElementsRef = useRef<Record<string, HTMLVideoElement | null>>({});

  // Track scroll position to update navigation arrow states
  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const ref = scrollContainerRef.current;
    if (ref) {
      ref.addEventListener('scroll', updateScrollButtons);
      window.addEventListener('resize', updateScrollButtons);
      return () => {
        ref.removeEventListener('scroll', updateScrollButtons);
        window.removeEventListener('resize', updateScrollButtons);
      };
    }
  }, [shoppableVideos]);

  const handlePrev = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  // Toggle Video Playback
  const handleTogglePlay = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isCurrentlyPlaying = !!playingVideoMap[videoId];
    const newPlayState = !isCurrentlyPlaying;

    setPlayingVideoMap((prev) => ({
      ...prev,
      [videoId]: newPlayState
    }));

    const videoEl = videoElementsRef.current[videoId];
    if (videoEl) {
      if (newPlayState) {
        videoEl.play().catch(() => {});
      } else {
        videoEl.pause();
      }
    }
  };

  // Toggle Audio Mute
  const handleToggleMute = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isCurrentlyMuted = mutedVideoMap[videoId] !== false;
    const newMutedState = !isCurrentlyMuted;

    setMutedVideoMap((prev) => ({
      ...prev,
      [videoId]: newMutedState
    }));

    const videoEl = videoElementsRef.current[videoId];
    if (videoEl) {
      videoEl.muted = newMutedState;
    }
  };

  // Reset to default reference videos if empty
  const handleResetDefaults = () => {
    setShoppableVideos(DEFAULT_SHOPPABLE_VIDEOS);
    try {
      localStorage.setItem('wiz_shoppable_videos_v5', JSON.stringify(DEFAULT_SHOPPABLE_VIDEOS));
    } catch {
      // ignore
    }
  };

  // Dynamically resolve product details from backend uploaded products
  const resolveBackendProduct = (video: ShoppableVideoItem): Product | undefined => {
    if (!products || products.length === 0) return undefined;

    // 1. Match by linked productId
    if (video.productId) {
      const match = products.find((p) => p.id === video.productId);
      if (match) return match;
    }

    // 2. Match by exact title name
    const exactNameMatch = products.find(
      (p) => p.name.toLowerCase().trim() === video.productTitle.toLowerCase().trim()
    );
    if (exactNameMatch) return exactNameMatch;

    // 3. Match by partial keyword
    const partialMatch = products.find((p) => {
      const pName = p.name.toLowerCase();
      const vName = video.productTitle.toLowerCase();
      return pName.includes(vName) || vName.includes(pName);
    });

    return partialMatch;
  };

  // When clicking Quick View on a video card
  const handleQuickViewClick = (video: ShoppableVideoItem) => {
    const targetProduct = resolveBackendProduct(video);

    if (targetProduct) {
      onQuickView(targetProduct);
      return;
    }

    // Fallback: create synthetic product wrapper if not yet uploaded in backend
    const syntheticProduct: Product = {
      id: video.productId || `dynamic-${video.id}`,
      name: video.productTitle,
      slug: video.productTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: `WIZ-${video.productTitle.toUpperCase().replace(/\s+/g, '').slice(0, 4)}`,
      category: 'Home & Personal Care',
      shortDescription: `Official WiZ ${video.productTitle}. Gentle, effective, and daily hygiene essential.`,
      fullDescription: `Shop authentic WiZ ${video.productTitle}. Specially formulated with skin-friendly cleansers and active hygiene protection.`,
      benefits: ['Dermatologically Tested', 'Antibacterial Protection', 'Gentle on Skin', 'Eco-friendly Formula'],
      images: [video.productImage],
      regularPrice: video.regularPrice,
      sellingPrice: video.sellingPrice,
      discountPercent: Math.round(((video.regularPrice - video.sellingPrice) / video.regularPrice) * 100),
      variants: [
        {
          id: 'v1',
          name: 'Standard Pack',
          sku: `WIZ-${video.productTitle.toUpperCase().replace(/\s+/g, '').slice(0, 4)}-STD`,
          regularPrice: video.regularPrice,
          sellingPrice: video.sellingPrice,
          stock: 50,
          packagingSize: 'Standard'
        }
      ],
      stock: 50,
      published: true
    };
    onQuickView(syntheticProduct);
  };

  return (
    <section className="w-full py-12 sm:py-16 bg-white select-none">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-[100px] xl:px-[100px]">
        {/* Top Header Row matching Reference Layout */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-semibold text-neutral-900 tracking-tight font-['Poppins',sans-serif]">
            Shoppable videos
          </h2>

          {/* Circular Carousel Navigation Arrows - Matching Reference Exactly */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={!canScrollLeft}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                canScrollLeft
                  ? 'bg-[#9c9c9c] hover:bg-[#7e7e7e] text-white opacity-100'
                  : 'bg-[#9c9c9c] text-white opacity-60 cursor-default'
              }`}
              style={{ borderRadius: '9999px' }}
              aria-label="Previous video"
              title="Previous video"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black hover:bg-neutral-800 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
              style={{ borderRadius: '9999px' }}
              aria-label="Next video"
              title="Next video"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Video Cards Row / Carousel matching Reference Layout */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-[100px] xl:px-[100px]">
        {shoppableVideos.length === 0 ? (
          <div className="py-16 text-center bg-gray-50 border border-dashed border-gray-300 p-8 w-full">
            <p className="text-gray-500 mb-4 font-medium">No shoppable videos currently available.</p>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="bg-black hover:bg-neutral-800 text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer rounded-none"
            >
              Restore Default Videos
            </button>
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="flex items-stretch overflow-x-auto gap-[18px] no-scrollbar scroll-smooth pb-2"
          >
            {shoppableVideos.map((video) => {
              const isPlaying = playingVideoMap[video.id] === true;
              const isMuted = mutedVideoMap[video.id] !== false; // default muted for autoplay compliance

              // Resolve dynamic product thumbnail and details from backend uploaded products
              const backendProduct = resolveBackendProduct(video);

              const displayTitle = backendProduct?.name || video.productTitle;
              const displayRegularPrice = backendProduct?.regularPrice || video.regularPrice;
              const displaySellingPrice = backendProduct?.sellingPrice || video.sellingPrice;

              // Product thumbnail packshot dynamically from uploaded product or video definition
              const displayThumbnail = backendProduct?.images?.[0] || video.productImage;

              const instagramShortcode = extractInstagramShortcode(video.instagramUrl);

              return (
                <div
                  key={video.id}
                  className="relative shrink-0 w-[calc(100%-16px)] sm:w-[calc(50%-12px)] lg:w-[calc(25%-13.5px)] min-w-[270px] max-w-[340px] aspect-[330/510] bg-neutral-900 overflow-hidden group select-none shadow-xs rounded-none border border-neutral-100"
                >
                  {/* Video / Background Media Layer */}
                  <div className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-950">
                    {video.instagramUrl && instagramShortcode && isPlaying ? (
                      // Instagram Reel Embedded Frame when playing
                      <iframe
                        src={`https://www.instagram.com/reel/${instagramShortcode}/embed/?autoplay=1`}
                        title={`Instagram Reel: ${displayTitle}`}
                        className="w-full h-full border-0 select-auto pointer-events-auto scale-[1.02]"
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : video.videoUrl && isPlaying ? (
                      // Direct HTML5 video when playing
                      <video
                        ref={(el) => {
                          videoElementsRef.current[video.id] = el;
                        }}
                        src={video.videoUrl}
                        poster={video.videoPoster}
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                        className="w-full h-full object-cover select-none"
                      />
                    ) : (
                      // Clean Poster / Video / Image preview
                      <img
                        src={video.videoPoster}
                        alt={displayTitle}
                        className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-500 group-hover:scale-[1.02]"
                        draggable={false}
                      />
                    )}
                  </div>

                  {/* Subtle vignette gradient for contrast */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-black/15" />

                  {/* Top Right: Circular Volume & Play/Pause Controls - Exactly like Reference Image */}
                  <div className="absolute top-3.5 right-3.5 z-30 flex flex-col items-center gap-2">
                    {/* Mute/Unmute Round White Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleMute(video.id, e)}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-neutral-900 hover:bg-neutral-100 flex items-center justify-center transition-transform hover:scale-105 shadow-md cursor-pointer"
                      style={{ borderRadius: '9999px' }}
                      title={isMuted ? 'Unmute video' : 'Mute video'}
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? (
                        <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-900" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-900" />
                      )}
                    </button>

                    {/* Pause/Play Round White Button */}
                    <button
                      type="button"
                      onClick={(e) => handleTogglePlay(video.id, e)}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-neutral-900 hover:bg-neutral-100 flex items-center justify-center transition-transform hover:scale-105 shadow-md cursor-pointer"
                      style={{ borderRadius: '9999px' }}
                      title={isPlaying ? 'Pause video' : 'Play video'}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-neutral-900" />
                      ) : (
                        <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-neutral-900 ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Bottom Floating Product Card Overlay - Exactly matching Reference Design */}
                  <div className="absolute inset-x-3 sm:inset-x-3.5 bottom-3.5 z-30 bg-white p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3 shadow-md rounded-none text-left">
                    {/* Dynamic Packshot Thumbnail from Backend Uploaded Product */}
                    <div className="w-12 h-16 sm:w-14 sm:h-18 shrink-0 flex items-center justify-center p-0.5 bg-neutral-50/60 border border-neutral-100">
                      <img
                        src={displayThumbnail}
                        alt={displayTitle}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    {/* Product Details & Price */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4
                          className="text-xs sm:text-[13px] font-medium text-neutral-900 truncate leading-tight"
                          title={displayTitle}
                        >
                          {displayTitle}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] sm:text-xs text-neutral-400 line-through">
                            ₹{displayRegularPrice.toFixed(2)}
                          </span>
                          <span className="text-xs sm:text-[13px] font-bold text-neutral-950">
                            ₹{displaySellingPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleQuickViewClick(video)}
                        className="mt-1.5 sm:mt-2 w-full bg-black hover:bg-[#7a49a6] text-white py-1 px-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-center transition-colors cursor-pointer rounded-none"
                      >
                        QUICK VIEW
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
