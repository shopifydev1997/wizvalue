import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { resolveAssetUrl } from '../lib/storeService';

interface ProductCardData {
  id: string;
  name: string;
  category: string;
  image: string;
  link: string;
}

const PERSONAL_CARE_PRODUCTS: ProductCardData[] = [
  {
    id: 'pc-1',
    name: 'Body Wash',
    category: 'Personal Care',
    image: '/assets/products/Bodywash-5L-Banner.jpg',
    link: '/category/personal-care'
  },
  {
    id: 'pc-2',
    name: 'Wet Wipes',
    category: 'Personal Care',
    image: '/assets/products/bestseller-wet-wipes.jpg',
    link: '/category/wet-wipes'
  },
  {
    id: 'pc-3',
    name: 'Handwash',
    category: 'Hand Hygiene',
    image: '/assets/products/Fresh Orange Hand Wash Advertisement-1.png',
    link: '/category/handwash'
  },
  {
    id: 'pc-4',
    name: 'Hand Sanitizer',
    category: 'Hand Hygiene',
    image: '/assets/products/Fresh Mint Hand Sanitizer Still Life-1.png',
    link: '/category/hand-sanitizer'
  },
  {
    id: 'pc-5',
    name: 'Laundry Detergent',
    category: 'Fabric Care',
    image: '/assets/products/bestseller-laundry-matic.jpg',
    link: '/category/laundry-detergent'
  },
  {
    id: 'pc-6',
    name: 'Dishwash Gel',
    category: 'Kitchen Hygiene',
    image: '/assets/products/bestseller-dishwash.jpg',
    link: '/category/dishwash'
  },
  {
    id: 'pc-7',
    name: 'Floor Cleaner',
    category: 'Home Care',
    image: '/assets/products/bestseller-floor-cleaner.jpg',
    link: '/category/floor-cleaner'
  },
  {
    id: 'pc-8',
    name: 'Lavender Hand Wash',
    category: 'Personal Care',
    image: '/assets/products/bestseller-handwash.jpg',
    link: '/category/handwash'
  },
  {
    id: 'pc-9',
    name: 'Power Degreaser',
    category: 'Home Care',
    image: '/assets/products/Lemon Fresh Dish Wash Refill Pouch-1.png',
    link: '/category/household-cleaners'
  },
  {
    id: 'pc-10',
    name: 'Facial Tissues',
    category: 'Paper Products',
    image: '/assets/products/wiz-facial-tissue-card.jpg',
    link: '/category/paper-products'
  }
];

interface Point {
  x: number;
  y: number;
}

export const CurvedPersonalCareHero: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Animation & Carousel state
  const offsetRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const pointerStartXRef = useRef<number>(0);
  const pointerLastXRef = useRef<number>(0);
  const dragDistanceRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const mouseEdgeSpeedRef = useRef<number>(0);
  const [cursorStyle, setCursorStyle] = useState<'grab' | 'grabbing'>('grab');
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

  // Preloaded HTMLImageElements
  const loadedImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Frame constants
  const FRAME_W = 1440;
  const FRAME_H = 1080;
  const CARD_PITCH = 196; // 196u
  const NUM_CARDS = PERSONAL_CARE_PRODUCTS.length; // 10
  const TOTAL_SPAN = NUM_CARDS * CARD_PITCH; // 1960u
  const AUTO_SPEED = 50; // 50u per second right to left

  // Preload product images
  useEffect(() => {
    PERSONAL_CARE_PRODUCTS.forEach((p) => {
      if (!loadedImagesRef.current.has(p.image)) {
        const img = new Image();
        img.src = resolveAssetUrl(p.image);
        img.onload = () => {
          loadedImagesRef.current.set(p.image, img);
        };
      }
    });
  }, []);

  // Helper to draw a rounded quadrilateral with smooth curved corners
  const drawRoundedQuad = (
    ctx: CanvasRenderingContext2D,
    p1: Point,
    p2: Point,
    p3: Point,
    p4: Point,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
    ctx.arcTo(p2.x, p2.y, p3.x, p3.y, radius);
    ctx.arcTo(p3.x, p3.y, p4.x, p4.y, radius);
    ctx.arcTo(p4.x, p4.y, p1.x, p1.y, radius);
    ctx.arcTo(p1.x, p1.y, p2.x, p2.y, radius);
    ctx.closePath();
  };

  // Main render loop
  const renderFrame = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!lastTimeRef.current) lastTimeRef.current = currentTime;
    const dt = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
    lastTimeRef.current = currentTime;

    // Physics update
    if (!isDraggingRef.current) {
      // Exponential velocity decay: 95% per second => remaining is ~5%
      velocityRef.current *= Math.pow(0.05, dt);
      if (Math.abs(velocityRef.current) < 0.5) velocityRef.current = 0;

      // Update offset: auto speed + drag inertia + edge hover acceleration
      const activeSpeed = AUTO_SPEED + velocityRef.current + mouseEdgeSpeedRef.current;
      offsetRef.current += activeSpeed * dt;
    }

    // Keep offset within [0, TOTAL_SPAN)
    offsetRef.current = ((offsetRef.current % TOTAL_SPAN) + TOTAL_SPAN) % TOTAL_SPAN;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Compute responsive scale
    // --u = min(width / 1440, height / 1080)
    const u = Math.min(width / FRAME_W, height / FRAME_H);
    const offsetX = (width - FRAME_W * u) / 2;
    const offsetY = (height - FRAME_H * u) / 2;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(u, u);

    // Store card click boundaries for hit testing
    const cardPolys: { index: number; p1: Point; p2: Point; p3: Point; p4: Point }[] = [];

    // Render 10 cards using the exact curved cylinder arrangement
    for (let i = 0; i < NUM_CARDS; i++) {
      // Relative offset t from center
      let t = (i * CARD_PITCH - offsetRef.current) % TOTAL_SPAN;
      if (t > TOTAL_SPAN / 2) t -= TOTAL_SPAN;
      if (t < -TOTAL_SPAN / 2) t += TOTAL_SPAN;

      // Card center x outward push: x = 720 + t * (1 + 0.083 * (t/706)^2)
      const ratioT = t / 706;
      const cx = 720 + t * (1 + 0.083 * ratioT * ratioT);

      // Normalised distance: d = |x - 720| / 706
      const d = Math.abs(cx - 720) / 706;

      // Card width: (170 + 48 * d^2)u
      const cardW = 170 + 48 * d * d;

      // Edges
      const xLeft = cx - cardW / 2;
      const xRight = cx + cardW / 2;

      // Clip check: skip if completely outside visible frame
      if (xRight < -60 || xLeft > FRAME_W + 60) continue;

      // q: edge's own normalised distance from center 720
      const qLeft = Math.abs(xLeft - 720) / 706;
      const qRight = Math.abs(xRight - 720) / 706;

      // Edge heights: (280 + 92 * q^2.6)u
      const hLeft = 280 + 92 * Math.pow(qLeft, 2.6);
      const hRight = 280 + 92 * Math.pow(qRight, 2.6);

      // Vertical center: (687 - 12 * d^2)u
      const cy = 687 - 12 * d * d;

      // 4 quadrilateral corners
      const p1: Point = { x: xLeft, y: cy - hLeft / 2 };
      const p2: Point = { x: xRight, y: cy - hRight / 2 };
      const p3: Point = { x: xRight, y: cy + hRight / 2 };
      const p4: Point = { x: xLeft, y: cy + hLeft / 2 };

      cardPolys.push({ index: i, p1, p2, p3, p4 });

      // Draw Card Quad
      ctx.save();
      const cornerRadius = 15; // 15u
      drawRoundedQuad(ctx, p1, p2, p3, p4, cornerRadius);
      ctx.clip();

      // Card Background (pure crisp white with subtle mint tint)
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Draw product image
      const product = PERSONAL_CARE_PRODUCTS[i];
      const img = loadedImagesRef.current.get(product.image);
      const minX = Math.min(p1.x, p4.x);
      const maxX = Math.max(p2.x, p3.x);
      const minY = Math.min(p1.y, p2.y);
      const maxY = Math.max(p3.y, p4.y);
      const boxW = maxX - minX;
      const boxH = maxY - minY;

      if (img && img.naturalWidth > 0) {
        // Center & contain inside the card
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const boxAspect = boxW / boxH;
        let dw = boxW * 0.88;
        let dh = dw / imgAspect;
        if (dh > boxH * 0.82) {
          dh = boxH * 0.82;
          dw = dh * imgAspect;
        }
        const dx = minX + (boxW - dw) / 2;
        const dy = minY + (boxH - dh) / 2 - 12;
        ctx.drawImage(img, dx, dy, dw, dh);
      } else {
        // Fallback placeholder while loading
        ctx.fillStyle = '#eef2ea';
        ctx.fillRect(minX + 10, minY + 10, boxW - 20, boxH - 20);
      }

      // Minimal white bottom pill with product title
      const pillW = Math.min(boxW - 16, 140);
      const pillH = 26;
      const pillX = minX + (boxW - pillW) / 2;
      const pillY = maxY - pillH - 10;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 13);
      ctx.fill();
      ctx.strokeStyle = 'rgba(8, 72, 45, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#101410';
      ctx.font = '600 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(product.name, pillX + pillW / 2, pillY + pillH / 2);

      // Subtle active border on hover
      if (hoveredCardIndex === i) {
        ctx.strokeStyle = '#08482D';
        ctx.lineWidth = 2;
        drawRoundedQuad(ctx, p1, p2, p3, p4, cornerRadius);
        ctx.stroke();
      }

      ctx.restore();
    }

    ctx.restore();
  }, [hoveredCardIndex]);

  // Animation frame runner
  useEffect(() => {
    let animId: number;
    const loop = (time: number) => {
      renderFrame(time);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [renderFrame]);

  // Handle Resize for HiDPI sharpness
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pointer interactions (drag, momentum, corner drift)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    pointerStartXRef.current = e.clientX;
    pointerLastXRef.current = e.clientX;
    dragDistanceRef.current = 0;
    velocityRef.current = 0;
    setCursorStyle('grabbing');
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;

    // Corner / edge mouse motion:
    // If mouse moves into left 25%, smoothly scroll right; if in right 25%, scroll left.
    if (!isDraggingRef.current) {
      if (relX < 0.25) {
        // Left corner: accelerate rightwards (negative offset speed)
        const intensity = (0.25 - relX) / 0.25;
        mouseEdgeSpeedRef.current = -intensity * 140;
      } else if (relX > 0.75) {
        // Right corner: accelerate leftwards (positive offset speed)
        const intensity = (relX - 0.75) / 0.25;
        mouseEdgeSpeedRef.current = intensity * 140;
      } else {
        mouseEdgeSpeedRef.current = 0;
      }
    }

    if (isDraggingRef.current) {
      const dx = e.clientX - pointerLastXRef.current;
      dragDistanceRef.current += Math.abs(dx);
      pointerLastXRef.current = e.clientX;

      const u = Math.min(rect.width / FRAME_W, rect.height / FRAME_H);
      const frameDx = dx / (u || 1);

      offsetRef.current -= frameDx;
      velocityRef.current = -frameDx * 12; // Track velocity
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    setCursorStyle('grab');
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored if already released
    }

    // Check if it was a quick click rather than a drag
    if (dragDistanceRef.current < 6) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const u = Math.min(rect.width / FRAME_W, rect.height / FRAME_H);
      const offsetX = (rect.width - FRAME_W * u) / 2;
      const offsetY = (rect.height - FRAME_H * u) / 2;

      const clickX = (e.clientX - rect.left - offsetX) / u;
      const clickY = (e.clientY - rect.top - offsetY) / u;

      // Find which card was clicked
      for (let i = 0; i < NUM_CARDS; i++) {
        let t = (i * CARD_PITCH - offsetRef.current) % TOTAL_SPAN;
        if (t > TOTAL_SPAN / 2) t -= TOTAL_SPAN;
        if (t < -TOTAL_SPAN / 2) t += TOTAL_SPAN;
        const ratioT = t / 706;
        const cx = 720 + t * (1 + 0.083 * ratioT * ratioT);
        const d = Math.abs(cx - 720) / 706;
        const cardW = 170 + 48 * d * d;
        const cy = 687 - 12 * d * d;
        const h = 280 + 92 * Math.pow(d, 2.6);

        if (
          clickX >= cx - cardW / 2 &&
          clickX <= cx + cardW / 2 &&
          clickY >= cy - h / 2 &&
          clickY <= cy + h / 2
        ) {
          navigate(PERSONAL_CARE_PRODUCTS[i].link);
          break;
        }
      }
    }
  };

  const handlePointerLeave = () => {
    mouseEdgeSpeedRef.current = 0;
    setHoveredCardIndex(null);
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#F5F8EF] py-16 sm:py-20 lg:py-24 text-[#101410] select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 text-center flex flex-col items-center">
        {/* Main Headline */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-bold text-[#101410] tracking-[-0.035em] leading-[1.05] font-['Inter',sans-serif] max-w-4xl mx-auto transition-transform duration-700 ease-out">
          Personal Care
        </h2>

        {/* Supporting Text */}
        <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-[#5E5E61] max-w-2xl font-normal leading-relaxed font-['Inter',sans-serif]">
          Discover everyday essentials for your personal care routine.
        </p>

        {/* Curved Product Carousel Canvas Area */}
        <div
          ref={containerRef}
          className="relative w-full h-[360px] sm:h-[420px] md:h-[480px] lg:h-[520px] mt-4 sm:mt-6 cursor-grab active:cursor-grabbing touch-pan-y"
          style={{ cursor: cursorStyle }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerLeave}
          />
        </div>

        {/* Main Call-to-Action Pill Button */}
        <div className="mt-6 sm:mt-8">
          <button
            type="button"
            onClick={() => navigate('/category/personal-care')}
            className="inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#08482D] hover:bg-[#0b5737] active:bg-[#073d26] text-white font-semibold text-sm sm:text-base font-['Inter',sans-serif] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            More Personal Care Products
          </button>
        </div>
      </div>
    </section>
  );
};
