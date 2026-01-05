import React, { useState, useEffect, useRef } from 'react';
import { ARTICLES } from './data';
import { Article } from './types';

export default function App() {
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeArticle = ARTICLES.find((a) => a.id === activeArticleId);

  const handleArticleClick = (id: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveArticleId(id);
      setIsTransitioning(false);
      window.scrollTo(0, 0);
    }, 400); // Wait for fade out
  };

  const handleBackClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveArticleId(null);
      setIsTransitioning(false);
    }, 400);
  };

  return (
    <>
      <SnowEffect />
      <div className={`min-h-screen transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {!activeArticle ? (
          <HomeView onArticleSelect={handleArticleClick} />
        ) : (
          <ArticleView article={activeArticle} onBack={handleBackClick} />
        )}
      </div>
    </>
  );
}

function SnowEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    setSize();
    window.addEventListener('resize', setSize);

    // Particle configuration
    const particleCount = 70;
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      opacity: number;
      sway: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        speedY: Math.random() * 0.5 + 0.2, // Slow falling speed
        speedX: Math.random() * 0.2 - 0.1, // Slight drift
        opacity: Math.random() * 0.5 + 0.1,
        sway: Math.random() * Math.PI * 2 // Random starting phase for sway
      });
    }

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.005;

      particles.forEach((p) => {
        // Update position
        p.y += p.speedY;
        // Add gentle sine wave sway
        p.x += Math.sin(time + p.sway) * 0.3 + p.speedX;

        // Wrap around bottom
        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        
        // Wrap around sides
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', setSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-50 mix-blend-screen"
    />
  );
}

function HomeView({ onArticleSelect }: { onArticleSelect: (id: string) => void }) {
  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-stone-950">
      {/* Left Pane: Introduction 
          On mobile: Full screen height (min-h-screen)
          On desktop: Fixed height (h-screen) and sticky so it stays while right side scrolls
      */}
      <section className="w-full md:w-1/2 min-h-screen md:h-screen md:sticky md:top-0 flex flex-col items-center justify-center px-8 md:px-24 bg-stone-950 border-r border-white/5 z-10 relative">
        <div className="max-w-xl text-center md:text-left">
          <div className="w-12 h-1 bg-stone-800 mb-10 mx-auto md:mx-0"></div>
          <h1 className="text-4xl md:text-6xl font-serif text-stone-100 mb-8 tracking-wider leading-tight">
            Digital<br/>Artisan.
          </h1>
          <p className="text-xl text-stone-400 font-light leading-relaxed font-serif">
            I weave code and prose into tapestries of thought. 
            My work explores the silent spaces between technology and humanity, seeking beauty 
            in the ephemeral and structure in the void.
          </p>
          <p className="mt-12 text-xs font-mono text-stone-600 uppercase tracking-widest opacity-60">
            Select a piece to read →
          </p>
        </div>
      </section>

      {/* Right Pane: Article List */}
      <div className="w-full md:w-1/2 flex flex-col border-t md:border-t-0 bg-stone-950">
        {ARTICLES.map((article) => (
          <div 
            key={article.id}
            onClick={() => onArticleSelect(article.id)}
            className="group relative h-[33.33vh] w-full flex items-center justify-center overflow-hidden cursor-pointer border-b border-white/5 last:border-b-0"
          >
            {/* Background Image with Blur and Grayscale */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0"
              style={{ backgroundImage: `url(https://picsum.photos/id/${article.imageIds[0]}/1920/1080)` }}
            />
            
            {/* Dark Overlay for Readability */}
            <div className="absolute inset-0 bg-stone-950/70 transition-colors duration-500 group-hover:bg-stone-950/50" />
            
            {/* Shimmer Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer pointer-events-none" />
            
            {/* Vague Blur Layer - Starts blurry, clears up slightly on hover */}
            <div className="absolute inset-0 backdrop-blur-[2px] group-hover:backdrop-blur-[0px] transition-all duration-700" />

            {/* Content */}
            <div className="relative z-10 p-8 text-center max-w-lg transform transition-all duration-500 group-hover:-translate-y-2">
              <h2 className="text-xl md:text-3xl font-serif text-stone-100 tracking-wide group-hover:text-white transition-colors">
                {article.title}
              </h2>
              {article.subtitle && (
                <p className="mt-3 text-sm md:text-base text-stone-400 font-light tracking-wide group-hover:text-stone-300 transition-colors">
                  {article.subtitle}
                </p>
              )}
            </div>
          </div>
        ))}
        
        <footer className="py-24 text-center text-stone-600 text-xs uppercase tracking-widest bg-stone-950">
          <p>&copy; 2024 Ethereal Portfolio.</p>
        </footer>
      </div>
    </main>
  );
}

function ArticleView({ article, onBack }: { article: Article; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation - Fixed back button */}
      <button 
        onClick={onBack}
        className="fixed top-8 left-8 z-50 text-stone-500 hover:text-white transition-colors flex items-center gap-2 group mix-blend-difference"
      >
        <span className="transform transition-transform group-hover:-translate-x-1">←</span>
        <span className="text-sm uppercase tracking-widest">Back</span>
      </button>

      {/* Main Content Area - Full Width/Centered */}
      <div className="w-full min-h-screen flex flex-col items-center">
        <div className="w-full max-w-3xl px-6 md:px-12 py-24 md:py-32">
          <header className="mb-16 text-center">
            <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight mb-4">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="text-xl md:text-2xl text-stone-400 font-light tracking-wide mb-8">
                {article.subtitle}
              </p>
            )}
          </header>
          
          <article className="prose prose-invert prose-lg prose-stone font-light leading-relaxed mx-auto">
            {article.content.map((paragraph, idx) => (
              <p key={idx} className="mb-8 first-letter:text-3xl first-letter:font-serif first-letter:mr-1 text-stone-300">
                {paragraph}
              </p>
            ))}
          </article>

          <div className="mt-24 pt-12 border-t border-white/10 text-center">
            <button 
              onClick={onBack}
              className="text-xs uppercase tracking-[0.2em] text-stone-500 hover:text-white transition-colors"
            >
              Return to Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}