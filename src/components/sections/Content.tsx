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
        <section className="flex flex-col items-center justify-center space-y-20 px-20 py-10">
            <section className="w-full flex flex-row">
                <div>
                    <h1 className='text-5xl font-[550] text-black dark:text-white mb-10'>How ClipABit Works</h1>
                    <p className='text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-3xl text-left mr-16'>
                        ClipABit leverages advanced AI algorithms to analyze video content, allowing users to effortlessly search and retrieve specific clips based on keywords or phrases. Simply input your desired search terms, and ClipABit will scan through your video library to find the most relevant segments, making video editing faster and more efficient than ever before.
                    </p>
                </div>
                <div>
                    <DemoVideo />
                </div>
            </section>

            <section className="w-full flex flex-row justify-between gap-10">
                <div className="w-[50%]">
                    <h1 className='text-6xl font-[550] text-black dark:text-white mb-10'>About Us</h1>
                    <p className='text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-3xl text-left mb-16'>
                        Our team is a group of 9 passionate UWaterloo students passionate about the use of AI and its potential to revolutionize the video editing process for creators worldwide. We are dedicated to developing innovative solutions that empower users to create high-quality content with ease and efficiency.
                    </p>
                </div>
                <div>
                    <img src="https://firebasestorage.googleapis.com/v0/b/clipabit.firebasestorage.app/o/team.webp?alt=media&token=b7242bfc-05e6-4c6f-874d-face760d5411" alt="Team Photo" className="rounded-lg shadow-lg " width={600} height={500} />
                </div>
            </section>

            <section className="w-full flex flex-col items-center justify-center">
                <h2 className='text-6xl font-bold text-black dark:text-white'>Like What You See?</h2>
                <p className="mb-5">Then join the waitlist by filling out the form below!</p>
                {/* <a href="https://clipabit.streamlit.app/search_demo" className="mt-8 px-6 py-3 bg-[#FAAF04] text-black rounded hover:bg-[#e6a800] text-2xl font-semibold">
                    Try the Demo!
                </a> */}
                <div ref={waitlistRef} className="waitlister-form w-full pl-[26%]" data-waitlist-key="-i8DggpXQdia" data-height="400px"></div>

            </section>

        </section>

    )
}