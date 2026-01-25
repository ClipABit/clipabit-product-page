"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import DemoVideo from "../ui/DemoVideo";
import { ContainerScroll } from "../ui/container-scroll-animation";
import { HeroHighlight, Highlight } from "../ui/hero-highlight";
import { GooeyText } from "../ui/gooey-text-morphing";
import FilmReel from "../ui/FilmReel";
import { useTheme } from '../../lib/theme'

export default function Content() {
    const howRef = useRef<HTMLDivElement | null>(null);
    const isMountedRef = useRef(false);
    const [, forceUpdate] = useState({});
    const { theme } = useTheme();

    useEffect(() => {
        if (!isMountedRef.current) {
            isMountedRef.current = true;
            forceUpdate({});
        }
    }, []);

    useEffect(() => {
        // Load Waitlister script
        const waitlisterScript = document.createElement('script');
        waitlisterScript.src = 'https://waitlister.me/waitlister.js';
        waitlisterScript.async = true;
        document.body.appendChild(waitlisterScript);

        return () => {
            if (document.body.contains(waitlisterScript)) {
                document.body.removeChild(waitlisterScript);
            }
        };
    }, []);

    return (
        <section className="flex flex-col items-center justify-center space-y-32 md:space-y-40 px-4 md:px-20 py-10 mt-24">
            <section ref={howRef} className="w-full flex flex-col md:flex-row items-start gap-8 md:gap-6 mb-16 md:mb-20 pt-16 md:pt-24 pb-16 md:pb-24">
                <div className="w-full md:w-[40%] shrink-0">
                    <h1 className='text-4xl md:text-6xl font-[550] text-black dark:text-white mb-8 text-center md:text-left'>How It Works</h1>
                    <motion.div
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
                        className='text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300 mt-4 max-w-xl text-center md:text-left'
                    >
                        ClipABit uses zero‑shot image‑text matching to analyze video content, enabling users to{" "}
                        <HeroHighlight containerClassName="inline-block p-1">
                            <Highlight className="text-black dark:text-white">
                                instantly search
                            </Highlight>
                        </HeroHighlight>{" "}
                        and retrieve specific clips using simple keywords or phrases.
                    </motion.div>
                    <motion.div
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
                        className='text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300 mt-4 max-w-xl text-center md:text-left'
                    >
                        Our plug-in works directly in
                        <HeroHighlight containerClassName="inline-block p-1">
                            <Highlight className="text-black dark:text-white">
                                DaVinci Resolve {" "}
                            </Highlight>
                        </HeroHighlight>{" "}
                        and has full contextual understanding of your entire video library to find the most relevant clips.
                    </motion.div>
                </div>
                <div className="w-full md:flex-1 flex justify-center md:justify-start relative">
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

                    <div className="absolute inset-0 flex items-center justify-center text-black dark:text-white tracking-tight pointer-events-none">
                        <div className="text-center">
                            <GooeyText
                                texts={['FASTER', 'SMARTER', 'EASIER']}
                                interval={3000}
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
                    <Image
                        src="https://firebasestorage.googleapis.com/v0/b/clipabit.firebasestorage.app/o/team.webp?alt=media&token=b7242bfc-05e6-4c6f-874d-face760d5411"
                        alt="Team Photo"
                        className="mx-auto rounded-2xl object-cover h-full w-full object-center"
                        width={1400}
                        height={720}
                        draggable={false}
                    />
                </ContainerScroll>
            </section>

            <section id="waitlist" className="w-full flex flex-col items-center justify-center text-center px-4">
                {/* Waitlist form is only rendered on client to prevent hydration errors */}
                {isMountedRef.current && (
                    <div
                        className="waitlister-form w-full sm:w-[85%] md:w-[75%] lg:w-[60%] xl:w-[50%]"
                        data-waitlist-key="-i8DggpXQdia"
                        data-height="350px"
                        style={theme === 'dark' ? { filter: 'invert(1) hue-rotate(180deg)' } : {}}
                    ></div>
                )}
            </section>
        </section>

    )
}