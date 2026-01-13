"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import DemoVideo from "../ui/DemoVideo";
import { ContainerScroll } from "../ui/container-scroll-animation";
import { HeroHighlight, Highlight } from "../ui/hero-highlight";
import GooeyTextMorph from "../ui/GooeyTextMorph";
import { GooeyText } from "../ui/gooey-text-morphing";
import FilmReel from "../ui/FilmReel";
import {useTheme} from '../../lib/theme'

type Props = {}

export default function Content({ }: Props) {
    const waitlistRef = useRef<HTMLDivElement | null>(null);
    const howRef = useRef<HTMLDivElement | null>(null);
    const [howInView, setHowInView] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        const node = howRef.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) setHowInView(true);
                });
            },
            { threshold: 0.4 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!waitlistRef.current) return;

        // Prevent duplicate iframes
        if (waitlistRef.current.querySelector('iframe')) {
            waitlistRef.current.innerHTML = '';
        }

        const iframe = document.createElement('iframe');
        const baseUrl = 'https://waitlister.me/form/-i8DggpXQdia';
        // If the provider supports theming via query params, this will work.
        // If not, the param will simply be ignored.
        const themeParam = `?theme=${theme === 'dark' ? 'dark' : 'light'}`;
        iframe.src = `${baseUrl}${themeParam}`;
        iframe.scrolling = 'no';
        iframe.setAttribute('frameBorder', '0');
        iframe.style.width = '100%';
        iframe.style.maxWidth = '40rem';
        iframe.style.height = '600px'; // Full height to allow clipping
        iframe.style.border = 'none';
        iframe.style.overflow = 'hidden';
        iframe.style.transform = 'translateY(-80px)'; // Shift up to show email and name fields

        waitlistRef.current.appendChild(iframe);

        return () => {
            if (waitlistRef.current) waitlistRef.current.innerHTML = '';
        };
    }, [theme]);

        return (
            <section className="flex flex-col items-center justify-center space-y-32 md:space-y-40 px-4 md:px-20 py-10 mt-24">
            <section ref={howRef} className="w-full flex flex-col md:flex-row items-start gap-8 md:gap-6 mb-16 md:mb-20">
                <div className="w-full md:w-[40%] flex-shrink-0">
                    <h1 className='text-4xl md:text-6xl font-[550] text-black dark:text-white mb-8 text-center md:text-left'>How It Works</h1>
                    
                    <motion.p
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: [20, -5, 0],
                        }}
                        transition={{
                            duration: 0.5,
                            ease: [0.4, 0.0, 0.2, 1],
                        }}
                        className='text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300 mt-4 max-w-xl text-left'
                    >
                        ClipABit uses zero‑shot image‑text matching to analyze video content, enabling users to{" "}
                        <HeroHighlight containerClassName="inline-block p-1">
                            <Highlight className="text-black dark:text-white">
                                instantly search
                            </Highlight>
                        </HeroHighlight>{" "}
                        and retrieve specific clips using simple keywords or phrases.
                    </motion.p>
                    <motion.p
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: [20, -5, 0],
                        }}
                        transition={{
                            duration: 0.5,
                            ease: [0.4, 0.0, 0.2, 1],
                            delay: 0.1,
                        }}
                        className='text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300 mt-4 max-w-xl text-left'
                    >
                        Our plug-in scans your{" "}
                        <HeroHighlight containerClassName="inline-block p-1">
                            <Highlight className="text-black dark:text-white">
                                entire video library
                            </Highlight>
                        </HeroHighlight>{" "}
                        to find the most relevant segments.
                    </motion.p>
                </div>
                <div className="w-full md:flex-1 flex justify-start md:justify-start relative">
                    <DemoVideo />
                </div>
            </section>

                {/* Gooey text overlaid on FilmReel timeline */}
                <div className="w-full flex flex-col items-center justify-center mt-32 md:mt-40 mb-32 md:mb-40">
                        <span className="font-extrabold leading-none text-[clamp(2rem,10vw,8rem)] text-black dark:text-white tracking-tight mb-6 text-center" style={{ fontFamily: '-apple-system, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
                            making video editing
                        </span>
                
                {/* FilmReel positioned behind only the morphing words */}
                <div className="w-full relative py-12 flex items-center justify-center" style={{ minHeight: '264px' }}>
                    {/* FilmReel as background - full viewport width from edge to edge */}
                    <div 
                        className="absolute w-screen"
                        style={{ 
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '100vw',
                            maxWidth: '100vw',
                            height: '264px',
                            minHeight: '264px'
                        }}
                    >
                        <FilmReel />
                    </div>
                    
                    {/* Morphing words overlay centered on timeline */}
                    <div className="absolute inset-0 flex items-center justify-center text-black dark:text-white tracking-tight pointer-events-none">
                        <div className="text-center">
                            <GooeyText
                                texts={['EFFICIENT.', 'FASTER.', 'SMARTER.', 'AGENTIC.']}
                                morphTime={1}
                                cooldownTime={0.25}
                                className="font-extrabold inline-block align-baseline w-[10ch] h-[1.2em]"
                                textClassName="text-[clamp(2rem,10vw,8rem)] leading-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

                <section className="w-full flex flex-col items-center text-center gap-2 mt-8 md:mt-12">
                <ContainerScroll
                    titleComponent={
                        <>
                    
                            <h1 className='text-4xl md:text-6xl font-[550] text-black dark:text-white'>About Us</h1>
                            
                            <p className='text-center text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300 mt-2 max-w-2xl w-full mx-auto px-4'>
                                We are a group of passionate UWaterloo students trying revolutionize the video editing process with the power of AI. We are on a mission to eliminate the tedious work, so editors can telling better stories.
                            </p>
                        </>
                    }
                >
                    <img
                        src="https://firebasestorage.googleapis.com/v0/b/clipabit.firebasestorage.app/o/team.webp?alt=media&token=b7242bfc-05e6-4c6f-874d-face760d5411"
                        alt="Team Photo"
                        className="mx-auto rounded-2xl object-cover h-full w-full object-center"
                        width={1400}
                        height={720}
                        draggable={false}
                    />
                </ContainerScroll>
            </section>

            <section id="waitlist" className="w-full flex flex-col items-center justify-center text-center mt-12 md:mt-16">
                <h2 className={`text-3xl md:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Early Plug-in Access</h2>
                <p className={`mb-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Join the waitlist by filling out the form below</p>
                {/* <a href="https://clipabit.streamlit.app/search_demo" className="mt-8 px-6 py-3 bg-[#FAAF04] text-black rounded hover:bg-[#e6a800] text-2xl font-semibold">
                    Try the Demo!
                </a> */}
                {/* Waitlist form is injected via useEffect to prevent hydration errors */}
                <div className="w-full flex justify-center overflow-hidden" style={{ height: '325px', position: 'relative' }}>
                    <div ref={waitlistRef} className="w-full max-w-[40rem] h-full" style={{ overflow: 'hidden', clipPath: 'inset(80px 0 80px 0)' }}></div>
                </div>

            </section>

        </section>

    )
}