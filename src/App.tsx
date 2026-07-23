import quincyHomepage from './assets/quincy-homepage.png';
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowUpRight, Moon, Sun } from 'lucide-react';
import {
  type ElementType,
  type PropsWithChildren,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type FadeInProps = PropsWithChildren<{
  as?: ElementType;
  className?: string;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
}>;

function FadeIn({
  as = 'div',
  className,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  children,
}: FadeInProps) {
  const MotionElement = useMemo(() => motion.create(as), [as]);

  return (
    <MotionElement
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{
        delay,
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </MotionElement>
  );
}

type MagnetProps = PropsWithChildren<{
  className?: string;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
}>;

function Magnet({
  className,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  children,
}: MagnetProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const activeTouchPointer = useRef<number | null>(null);
  const [active, setActive] = useState(false);
  const [transform, setTransform] = useState('translate3d(0, 0, 0)');

  const resetPosition = () => {
    setActive(false);
    setTransform('translate3d(0, 0, 0)');
  };

  const moveToPoint = (
    clientX: number,
    clientY: number,
    ignorePaddingCheck = false,
  ) => {
    const element = elementRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const insideMagneticArea =
      ignorePaddingCheck ||
      (clientX >= rect.left - padding &&
        clientX <= rect.right + padding &&
        clientY >= rect.top - padding &&
        clientY <= rect.bottom + padding);

    if (!insideMagneticArea) {
      resetPosition();
      return;
    }

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (clientX - centerX) / strength;
    const y = (clientY - centerY) / strength;

    setActive(true);
    setTransform(`translate3d(${x}px, ${y}px, 0)`);
  };

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (activeTouchPointer.current !== null) return;
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      moveToPoint(event.clientX, event.clientY);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [padding, strength]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch') return;

    activeTouchPointer.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    moveToPoint(event.clientX, event.clientY, true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType !== 'touch' ||
      activeTouchPointer.current !== event.pointerId
    ) {
      return;
    }

    moveToPoint(event.clientX, event.clientY, true);
  };

  const finishTouchInteraction = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (activeTouchPointer.current !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    activeTouchPointer.current = null;
    resetPosition();
  };

  return (
    <div
      ref={elementRef}
      className={className}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishTouchInteraction}
      onPointerCancel={finishTouchInteraction}
      style={{
        transform,
        transition: active ? activeTransition : inactiveTransition,
        willChange: 'transform',
        touchAction: 'pan-y',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {children}
    </div>
  );
}

function ContactButton({ className = '' }: { className?: string }) {
  return (
    <a
      href="#contact"
      className={`group inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white outline outline-2 outline-offset-[-3px] outline-white transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-offset-4 sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base ${className}`}
      style={{
        background:
          'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow:
          '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
      }}
    >
      Contact Me
      <ArrowUpRight
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
}

function LiveProjectButton() {
  return (
    <a
      href="#projects"
      className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-2 theme-border px-8 py-3 text-sm font-medium uppercase tracking-widest theme-text transition-colors duration-200 hover:bg-current/10 sm:px-10 sm:py-3.5 sm:text-base"
    >
      Live Project
      <ArrowUpRight
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
}

type Theme = 'dark' | 'light';

function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: Theme;
  onToggle: () => void;
}) {
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      aria-pressed={isLight}
      className="theme-toggle fixed right-5 top-20 z-50 sm:right-8 sm:top-24"
    >
      <span className="theme-toggle__sun" aria-hidden="true">
        <Sun size={23} strokeWidth={2.4} />
      </span>
      <span
        className="theme-toggle__thumb"
        data-light={isLight ? 'true' : 'false'}
        aria-hidden="true"
      >
        {isLight ? <Sun size={22} /> : <Moon size={21} />}
      </span>
    </button>
  );
}

function HeroSection() {
  return (
    <section className="relative flex h-screen min-h-[650px] flex-col overflow-x-clip theme-bg">
      <FadeIn as="nav" delay={0} y={-20} className="relative z-30">
        <div className="flex items-center justify-between px-6 pt-6 text-sm font-medium uppercase tracking-wider theme-text md:px-10 md:pt-8 md:text-lg lg:text-[1.4rem]">
          {[
            ['About', '#about'],
            ['Price', '#services'],
            ['Projects', '#projects'],
            ['Contact', '#contact'],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="transition-opacity duration-200 hover:opacity-70"
            >
              {label}
            </a>
          ))}
        </div>
      </FadeIn>

      <FadeIn
        delay={0.15}
        y={40}
        className="relative z-0 mt-6 w-full overflow-hidden sm:mt-4 md:-mt-5"
      >
        <h1 className="hero-heading w-full whitespace-nowrap px-2 text-center text-[clamp(2.6rem,10.8vw,11.5rem)] font-black uppercase leading-none tracking-[-0.045em] sm:px-4">
          Hi, i&apos;m quincy
        </h1>
      </FadeIn>

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[470px] -translate-x-1/2 -translate-y-1/2 sm:bottom-[-4vh] sm:top-auto sm:w-[620px] sm:translate-y-0 md:w-[760px] lg:w-[940px] xl:w-[1080px]">
        <FadeIn delay={0.6} y={30}>
          <Magnet
            className="hero-portrait-magnet pointer-events-auto"
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
          >
            <img
              src={quincyHomepage}
              alt="Quincy Chen welcome portrait"
              className="max-h-[108vh] w-full select-none rounded-[28px] object-contain shadow-2xl sm:rounded-[36px]"
              draggable={false}
            />
          </Magnet>
        </FadeIn>
      </div>

      <div className="relative z-20 mt-auto flex items-end justify-between gap-5 px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p
            className="max-w-[160px] font-light uppercase leading-snug tracking-wide theme-text sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
          >
            a 3d creator driven by crafting striking and unforgettable projects
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}

const marqueeImages = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
];

function MarqueeRow({
  images,
  translateX,
}: {
  images: string[];
  translateX: number;
}) {
  const tripled = [...images, ...images, ...images];

  return (
    <div className="marquee-mask w-full overflow-hidden">
      <div
        className="flex w-max gap-3"
        style={{
          transform: `translate3d(${translateX}px, 0, 0)`,
          willChange: 'transform',
        }}
      >
        {tripled.map((src, index) => (
          <img
            key={`${src}-${index}`}
            src={src}
            alt="3D motion project preview"
            loading="lazy"
            decoding="async"
            className="h-[270px] w-[420px] shrink-0 rounded-2xl object-cover"
          />
        ))}
      </div>
    </div>
  );
}

function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let frame = 0;

    const updateOffset = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const nextOffset =
        (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(nextOffset);
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateOffset);
    };

    updateOffset();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Selected motion work"
      className="overflow-x-clip theme-bg pb-10 pt-24 sm:pt-32 md:pt-40"
    >
      <div className="flex flex-col gap-3">
        <MarqueeRow
          images={marqueeImages.slice(0, 11)}
          translateX={offset - 200}
        />
        <MarqueeRow
          images={marqueeImages.slice(11)}
          translateX={-(offset - 200)}
        />
      </div>
    </section>
  );
}

function AnimatedCharacter({
  character,
  index,
  total,
  progress,
}: {
  character: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = total <= 1 ? 0 : (index / total) * 0.8;
  const end = Math.min(start + 0.2, 1);
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  const visibleCharacter = character === ' ' ? '\u00A0' : character;

  return (
    <span className="relative inline-block">
      <span aria-hidden="true" className="opacity-0">
        {visibleCharacter}
      </span>
      <motion.span
        aria-hidden="true"
        className="absolute inset-0"
        style={{ opacity }}
      >
        {visibleCharacter}
      </motion.span>
    </span>
  );
}

function AnimatedText({ text }: { text: string }) {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ['start 0.8', 'end 0.2'],
  });
  const characters = Array.from(text);

  return (
    <p
      ref={paragraphRef}
      aria-label={text}
      className="max-w-[560px] text-center font-medium leading-relaxed theme-text"
      style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
    >
      {characters.map((character, index) => (
        <AnimatedCharacter
          key={`${character}-${index}`}
          character={character}
          index={index}
          total={characters.length}
          progress={scrollYProgress}
        />
      ))}
    </p>
  );
}

const aboutDecorations = [
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
    alt: '3D moon sculpture',
    className:
      'absolute left-[1%] top-[4%] w-[120px] sm:left-[2%] sm:w-[160px] md:left-[4%] md:w-[210px]',
    delay: 0.1,
    x: -80,
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
    alt: 'Abstract 3D sculpture',
    className:
      'absolute bottom-[8%] left-[3%] w-[100px] sm:left-[6%] sm:w-[140px] md:left-[10%] md:w-[180px]',
    delay: 0.25,
    x: -80,
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png',
    alt: '3D building block sculpture',
    className:
      'absolute right-[1%] top-[4%] w-[120px] sm:right-[2%] sm:w-[160px] md:right-[4%] md:w-[210px]',
    delay: 0.15,
    x: 80,
  },
  {
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
    alt: 'Grouped 3D forms',
    className:
      'absolute bottom-[8%] right-[3%] w-[130px] sm:right-[6%] sm:w-[170px] md:right-[10%] md:w-[220px]',
    delay: 0.3,
    x: 80,
  },
];

function AboutSection() {
  const description =
    "With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!";

  return (
    <section
      id="about"
      className="relative flex min-h-screen items-center justify-center overflow-hidden theme-bg px-5 py-20 sm:px-8 md:px-10"
    >
      {aboutDecorations.map((item) => (
        <FadeIn
          key={item.src}
          delay={item.delay}
          x={item.x}
          y={0}
          duration={0.9}
          className={`${item.className} pointer-events-none z-0`}
        >
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            className="h-auto w-full select-none object-contain"
            draggable={false}
          />
        </FadeIn>
      ))}

      <div className="relative z-10 flex w-full flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading text-center font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About me
          </h2>
        </FadeIn>

        <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
          <AnimatedText text={description} />
          <ContactButton />
        </div>
      </div>
    </section>
  );
}

const services = [
  {
    number: '01',
    name: '3D Modeling',
    description:
      'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.',
  },
  {
    number: '02',
    name: 'Rendering',
    description:
      'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.',
  },
  {
    number: '03',
    name: 'Motion Design',
    description:
      'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.',
  },
  {
    number: '04',
    name: 'Branding',
    description:
      'Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.',
  },
  {
    number: '05',
    name: 'Web Design',
    description:
      'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.',
  },
];

function ServicesSection() {
  return (
    <section
      id="services"
      className="rounded-t-[40px] theme-panel px-5 py-20 theme-panel-text sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn>
        <h2
          className="mb-16 text-center font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Services
        </h2>
      </FadeIn>

      <div className="mx-auto max-w-5xl border-t theme-divider">
        {services.map((service, index) => (
          <FadeIn key={service.number} delay={index * 0.1}>
            <article className="grid grid-cols-[auto_1fr] gap-5 border-b theme-divider py-8 sm:gap-10 sm:py-10 md:gap-16 md:py-12">
              <span
                className="font-black leading-none theme-panel-text"
                style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
              >
                {service.number}
              </span>
              <div className="flex flex-col justify-center gap-3 sm:gap-5">
                <h3
                  className="font-medium uppercase leading-tight"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                >
                  {service.name}
                </h3>
                <p
                  className="max-w-2xl font-light leading-relaxed opacity-60"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
                >
                  {service.description}
                </p>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

type Project = {
  number: string;
  name: string;
  category: string;
  images: [string, string, string];
};

const projects: Project[] = [
  {
    number: '01',
    name: 'Nextlevel Studio',
    category: 'Client',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
    ],
  },
  {
    number: '02',
    name: 'Aura Brand Identity',
    category: 'Personal',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
    ],
  },
  {
    number: '03',
    name: 'Solaris Digital',
    category: 'Client',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
    ],
  },
];

function ProjectCard({
  project,
  index,
  totalCards,
}: {
  project: Project;
  index: number;
  totalCards: number;
}) {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardContainerRef,
    offset: ['start end', 'end start'],
  });
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [1, 1, targetScale],
  );
  const top = `calc(clamp(6rem, 10vw, 8rem) + ${index * 28}px)`;

  return (
    <div ref={cardContainerRef} className="h-[85vh]">
      <motion.article
        className="sticky overflow-hidden rounded-[40px] border-2 theme-border theme-bg p-4 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
        style={{ scale, top, transformOrigin: 'top center' }}
      >
        <div className="mb-5 flex flex-wrap items-end justify-between gap-5 sm:mb-7 md:mb-8">
          <div className="flex min-w-0 flex-1 items-end gap-4 sm:gap-7 md:gap-10">
            <span
              className="shrink-0 font-black leading-[0.72] theme-text"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
            >
              {project.number}
            </span>
            <div className="min-w-0 pb-0.5 sm:pb-2">
              <p className="mb-1 text-xs font-light uppercase tracking-[0.25em] theme-muted sm:text-sm">
                {project.category}
              </p>
              <h3
                className="truncate font-medium uppercase leading-tight theme-text"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {project.name}
              </h3>
            </div>
          </div>
          <LiveProjectButton />
        </div>

        <div className="grid grid-cols-5 gap-3 sm:gap-4">
          <div className="col-span-2 flex flex-col gap-3 sm:gap-4">
            <img
              src={project.images[0]}
              alt={`${project.name} preview one`}
              loading="lazy"
              className="w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
              style={{ height: 'clamp(130px, 16vw, 230px)' }}
            />
            <img
              src={project.images[1]}
              alt={`${project.name} preview two`}
              loading="lazy"
              className="w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
              style={{ height: 'clamp(160px, 22vw, 340px)' }}
            />
          </div>
          <img
            src={project.images[2]}
            alt={`${project.name} main preview`}
            loading="lazy"
            className="col-span-3 h-full min-h-0 w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]"
          />
        </div>
      </motion.article>
    </div>
  );
}

function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 rounded-t-[40px] theme-bg px-5 pb-24 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pb-32 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pb-40 md:pt-32"
    >
      <FadeIn>
        <h2
          className="hero-heading mb-16 text-center font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Project
        </h2>
      </FadeIn>

      <div className="mx-auto max-w-[1500px]">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.number}
            project={project}
            index={index}
            totalCards={projects.length}
          />
        ))}
      </div>

      <div
        id="contact"
        className="flex min-h-[45vh] flex-col items-center justify-center gap-8 pt-20 text-center"
      >
        <FadeIn>
          <p className="text-sm font-medium uppercase tracking-[0.35em] theme-muted sm:text-base">
            Have a project in mind?
          </p>
          <h2
            className="hero-heading mt-5 font-black uppercase leading-[0.9] tracking-tight"
            style={{ fontSize: 'clamp(3rem, 9vw, 130px)' }}
          >
            Let&apos;s create
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = window.localStorage.getItem('quincy-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('quincy-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === 'dark' ? 'light' : 'dark',
    );
  };

  return (
    <main
      className="min-h-screen theme-bg font-kanit"
      style={{ overflowX: 'clip' }}
    >
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
    </main>
  );
}

export default App;
