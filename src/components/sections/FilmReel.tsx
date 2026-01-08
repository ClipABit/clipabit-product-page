import React from 'react'
import Image from 'next/image'

type Props = {}

export default function FilmReel({ }: Props) {
    // 1. Ensure you have enough duplicates to cover the screen width + buffer
    //need to update the create image... cut off
    const images = [
        "/spark.png", "/pointer.png", "/trudeausac.png", "/socratica.png", "/create.png",
        "/spark.png", "/pointer.png", "/trudeausac.png", "/socratica.png", "/create.png",
        "/spark.png", "/pointer.png", "/trudeausac.png", "/socratica.png", "/create.png",
        "/spark.png", "/pointer.png", "/trudeausac.png", "/socratica.png", "/create.png",
    ];

    return (
        // Container: Hides the overflow so we only see the "window"
        <div className="w-full overflow-hidden relative">
            <section
                className='flex w-max animate-scroll'
                style={{
                    backgroundImage: "url('/reel.svg')",
                    backgroundRepeat: 'repeat-x',
                    // Optional: Adjust background-position-y if the images aren't vertically centered in the film holes
                    backgroundPosition: 'left center'
                }}
            >
                {
                    images.map((src, index) => (
                        <div
                            key={index}
                            className="w-[240px] h-[264px] flex items-center justify-center shrink-0"
                        >
                            <Image
                                src={src}
                                alt={`Film reel image ${index + 1}`}
                                width={180} // Reduced slightly from 200 to fit comfortably inside the frame
                                height={150}
                                className='object-contain'
                                loading='eager'
                            />
                        </div>
                    ))
                }
            </section>
        </div>
    )
}