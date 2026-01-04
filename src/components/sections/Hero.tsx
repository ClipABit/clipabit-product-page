import GetStartedSection from './GetStarted'

import Image from 'next/image'

type Props = {}

function Hero({ }: Props) {
    return (
        <section>
            <div className='flex flex-row items-center justify-between px-20 py-10'>
                <div className='flex-1'>
                    <div className="line1">
                        <p className='hero-title-text text-black dark:text-white mt-4'>ClipABit</p>
                    </div>

                    <div className="line2">
                        <p className='hero-subtitle-text text-black dark:text-white mt-4'>Search by ideas, not timestamps</p>
                    </div>

                    <div className="line3">
                        <p className='hero-subtitle-text text-gray-600 dark:text-gray-300 mt-4'>Every moment, one search away</p>
                    </div>
                </div>
                <div className='flex-1 flex justify-center items-center'>
                    <Image src="/davinci_logo.svg" alt="Davinci Logo" width={400} height={400} />
                </div>
            </div>
            <div className=''>
                <Image
                    src="/timeline_graphic.svg"
                    alt="Video Editor Timeline"
                    width={1200}
                    height={100}
                    className='mx-auto mb-10'
                />
            </div>
        </section>

    )
}

export default Hero