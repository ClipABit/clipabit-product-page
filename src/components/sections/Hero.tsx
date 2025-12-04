import React from 'react'
import Image from 'next/image'

type Props = {}

function Hero({ }: Props) {
    return (
        <section>
            <div className='test_border flex flex-row items-center justify-between px-20 py-10'>
                <div className='test_border'>
                    <div className="line1">
                        <Image src="/watai.svg" alt="Watai Logo" width={131} height={131} />
                        <p className='text-6xl font-bold text-black dark:text-white mt-4'>ClipABit</p>
                    </div>

                    <div className="line2">
                        <p className='text-6xl font-bold text-black dark:text-white mt-4'>Find What You Want</p>
                    </div>

                    <div className="line3">
                        <p className='text-6xl font-bold text-gray-600 dark:text-gray-300 mt-4'>Whenever You Want It</p>
                    </div>
                </div>
                <div className='test_border'>
                    <Image src="/davinci_logo.svg" alt="Davinci Logo" width={131} height={131} />
                </div>
            </div>
            <div className='test_border'>
                <Image
                    src="/timeline_graphic.svg"
                    alt="Video Editor Timeline"
                    width={900}
                    height={100}
                    className='mx-auto mb-10'
                />
            </div>
        </section>

    )
}

export default Hero