"use client";

import { useEffect, useRef } from "react";
import DemoVideo from "../ui/DemoVideo";

type Props = {}

export default function Content({ }: Props) {
    const waitlistRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!waitlistRef.current) return;

        // Prevent duplicate iframes
        if (waitlistRef.current.querySelector('iframe')) return;

        const iframe = document.createElement('iframe');
        iframe.src = 'https://waitlister.me/form/-i8DggpXQdia';
        iframe.scrolling = 'no';
        iframe.setAttribute('frameBorder', '0');
        iframe.style.width = '100%';
        iframe.style.maxWidth = '40rem';
        iframe.style.height = '400px';
        iframe.style.border = 'none';

        waitlistRef.current.appendChild(iframe);

        return () => {
            if (waitlistRef.current) waitlistRef.current.innerHTML = '';
        };
    }, []);

    return (
        <section className="flex flex-col items-center justify-center space-y-20 px-4 md:px-20 py-10">
            <section className="w-full flex flex-col md:flex-row justify-between gap-10">
                <div className="w-full md:w-[50%]">
                    <h1 className='text-3xl md:text-5xl font-[550] text-black dark:text-white mb-10 text-center md:text-left'>How It Works</h1>
                    <p className='text-xl leading-relaxed text-gray-600 dark:text-gray-300 mt-6 max-w-xl text-left'>
                        ClipABit leverages advanced AI algorithms to analyze video content, allowing users to effortlessly search and retrieve specific clips based on keywords or phrases. Simply enter your desired search terms, and ClipABit will scan through your video library to find the most relevant segments, making video editing faster and more efficient than ever before.
                    </p>
                </div>
                <div className="w-full md:w-auto flex justify-center md:block relative">
                    <DemoVideo />
                </div>
            </section>

            <section className="w-full flex flex-col md:flex-row justify-between gap-10">
                <div className="w-full md:w-[50%]">
                    <h1 className='text-4xl md:text-6xl font-[550] text-black dark:text-white mb-10 text-center md:text-left'>About Us</h1>
                    <p className='text-xl leading-relaxed text-gray-600 dark:text-gray-300 mt-6 max-w-xl text-left mb-16'>
                        Our team is a group of passionate UWaterloo students trying revolutionize the video editing process with the power of AI. We are on a mission to eliminate the tedious work, so editors can focus on the creative again.
                    </p>
                </div>
                <div className="w-full md:w-auto flex justify-center md:block">
                    <img src="https://firebasestorage.googleapis.com/v0/b/clipabit.firebasestorage.app/o/team.webp?alt=media&token=b7242bfc-05e6-4c6f-874d-face760d5411" alt="Team Photo" className="rounded-lg shadow-lg w-full md:w-[600px] h-auto" width={600} height={500} />
                </div>
            </section>

            <section className="w-full flex flex-col items-center justify-center text-center">
                <h2 className='text-4xl md:text-6xl font-bold text-black dark:text-white'>Like What You See?</h2>
                <p className="mb-5">Then join the waitlist by filling out the form below!</p>
                {/* <a href="https://clipabit.streamlit.app/search_demo" className="mt-8 px-6 py-3 bg-[#FAAF04] text-black rounded hover:bg-[#e6a800] text-2xl font-semibold">
                    Try the Demo!
                </a> */}
                {/* Waitlist form is injected via useEffect to prevent hydration errors */}
                <div ref={waitlistRef} className="w-full pl-0 md:pl-[26%]"></div>

            </section>

        </section>

    )
}