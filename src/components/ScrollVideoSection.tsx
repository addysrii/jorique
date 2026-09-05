/**
 * ScrollVideoSection — Parallax scroll-scrubbed video section.
 *
 * The video does NOT autoplay. As the user scrolls through this section
 * (which is 300vh tall), the video is scrubbed frame-by-frame, creating
 * a cinematic parallax effect like Apple's product pages.
 */
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const VIDEO_SRC = '/videos/bedsheet-spread.mp4';
const POSTER_SRC = '/images/hero.png';

const STORY_BEATS = [
  { progress: 0, text: 'Pure Organic Fibers', sub: '100% Long-Staple Cotton' },
  { progress: 0.4, text: 'Thermoregulated Weave', sub: 'Engineered for Seamless Airflow' },
  { progress: 0.8, text: 'Where Comfort Meets Design', sub: 'JORIQUE Maison' },
];

export default function ScrollVideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentBeat, setCurrentBeat] = useState(0);

  // Track scroll through the tall section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 18, mass: 0.8 });

  // Video scale: zooms in as user scrolls
  const videoScale = useTransform(smoothProgress, [0, 1], [1, 1.35]);
  // Overlay opacity: lightens as story progresses
  const overlayOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.65, 0.45, 0.7]);
  // Text parallax drift
  const textY = useTransform(smoothProgress, [0, 1], ['0%', '30%']);

  // Scrub video on scroll
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (val) => {
      const video = videoRef.current;
      if (!video || !video.duration) return;
      video.pause();
      const targetTime = Math.min(val * video.duration, video.duration - 0.05);
      if (Math.abs(video.currentTime - targetTime) > 0.03) {
        video.currentTime = targetTime;
      }

      // Story beat detection
      const beat = STORY_BEATS.reduce((acc, b, i) =>
        val >= b.progress ? i : acc, 0
      );
      setCurrentBeat(beat);
    });

    return unsubscribe;
  }, [smoothProgress]);

  const beat = STORY_BEATS[currentBeat];

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '300vh' }}
      aria-label="Scroll to experience our fabric story"
    >
      {/* Sticky viewport — stays fixed while user scrolls */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Video layer */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ scale: videoScale }}
        >
          <video
            ref={videoRef}
            poster={POSTER_SRC}
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
        </motion.div>

        {/* Dark overlay */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />

        {/* Story text — parallax drifts up */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-end pb-24 px-6 text-center pointer-events-none"
          style={{ y: textY }}
        >
          {/* Chapter badge */}
          <motion.div
            key={currentBeat + '-badge'}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#C6A96B]/40 text-[#C6A96B] text-[10px] font-mono font-bold tracking-[0.28em] uppercase mb-5 shadow-lg"
          >
            <span>0{currentBeat + 1}</span>
            <span className="w-1 h-1 rounded-full bg-[#C6A96B]/60 inline-block" />
            <span>{beat.sub}</span>
          </motion.div>

          {/* Main text */}
          <motion.h2
            key={currentBeat + '-title'}
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-[0.14em] uppercase text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.9)] max-w-3xl"
          >
            {beat.text}
          </motion.h2>

          {/* Gold divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="h-px w-24 bg-gradient-to-r from-transparent via-[#C6A96B] to-transparent mt-5"
          />
        </motion.div>

        {/* Scroll progress indicator */}
        <div className="absolute bottom-8 right-8 z-10 flex flex-col items-end gap-2 pointer-events-none">
          <div className="h-20 w-px bg-white/15 rounded-full overflow-hidden flex items-start">
            <motion.div
              className="w-full bg-gradient-to-b from-[#C6A96B] to-[#FFE79A]"
              style={{ height: useTransform(smoothProgress, [0, 1], ['0%', '100%']) }}
            />
          </div>
          <motion.span
            className="font-mono text-[10px] text-[#C6A96B]/80 tracking-wider"
            style={{ opacity: useTransform(smoothProgress, [0, 0.05], [0.4, 1]) }}
          >
            {useTransform(smoothProgress, (v) => `${Math.round(v * 100).toString().padStart(2, '0')}%`)}
          </motion.span>
        </div>

        {/* Scroll hint — fades out after scrolling starts */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.06], [1, 0]) }}
        >
          <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-white/50">
            Scroll to Experience
          </span>
          <motion.div
            className="w-5 h-9 rounded-full border border-white/25 flex items-start justify-center p-1"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-1 rounded-full bg-[#C6A96B]"
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
