import React from 'react'

import Image from 'next/image'

type Props = {}

export default function FilmReel({ }: Props) {
    const images = [
        "/spark.png",
        "/pointer.png",
        "/trudeausac.png",
        "/socratica.png",
        "/create.png",
        "/spark.png",
        "/pointer.png",
        "/trudeausac.png",
        "/socratica.png",
        "/create.png",
        "/spark.png",
        "/pointer.png",
        "/trudeausac.png",
        "/socratica.png",
        "/create.png",
    ];

    return (
        <section className='flex w-max animate-scroll'>
            <Image
                src="/reel.svg"
                alt="Film reel start"
                className='test_border'
                style={{ zIndex: -1 }}
                fill
            />
            {
                images.map((src, index) => (
                    <Image
                        key={index}
                        src={src}
                        alt={`Film reel image ${index + 1}`}
                        width={200}
                        height={150}
                        className='mr-40'
                    />
                ))
            }
        </section>
    )
}