"use client";

import { useEffect, useRef } from "react";

export default function DemoVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoUrl = "https://firebasestorage.googleapis.com/v0/b/clipabit.firebasestorage.app/o/demo.mp4?alt=media&token=204b3539-8e6a-4e4f-92c9-5873e1612515";

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Video is in view, try to play
                        video.play().catch((error) => {
                            // Autoplay was prevented, user interaction required
                            console.log("Autoplay prevented:", error);
                        });
                    } else {
                        // Video is out of view, pause it
                        video.pause();
                    }
                });
            },
            { threshold: 0.5 } // Trigger when 50% of video is visible
        );

        observer.observe(video);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <video
            ref={videoRef}
            className="rounded-lg shadow-lg w-full md:w-[700px] lg:w-[800px] xl:w-[900px] h-auto"
            controls
            muted
            playsInline
        >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
};