import GetStartedSection from './GetStarted'

import Image from 'next/image'

type Props = {}

function Hero({ }: Props) {
    return (
        <section>
            <div className='flex flex-col md:flex-row items-center justify-between px-4 md:px-20 pt-4 pb-10'>
                <div className='flex-1 text-center md:text-left'>
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
                <div className='flex-1 flex justify-center items-center mt-10 md:mt-0'>
                    <Image src="/davinci_logo.svg" alt="Davinci Logo" width={400} height={400} className="w-60 md:w-auto h-auto" />
                </div>
            </div>
            <div className='px-4 md:px-0'>
                <Image
                    src="/timeline_graphic.svg"
                    alt="Video Editor Timeline"
                    width={1200}
                    height={100}
                    className='mx-auto mb-10 w-full md:w-auto h-auto'
                />
            </div>
        </section>

    )
}

export default Hero