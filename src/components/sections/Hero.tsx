'use client'
import GetStartedSection from './GetStarted'

import Image from 'next/image'
import GreenGradientText from '../ui/green-gradient-text'
import RedGradientText from '../ui/red-gradient-text'
import AnimatedTextCycle from '../ui/AnimatedTextCycle'
import { TextHoverEffect } from '../ui/text-hover-effect'
import DavinciGlow from '../ui/DavinciGlow'
import { GooeyText } from '../ui/gooey-text-morphing'
import HoverDefinition from '../ui/HoverDefinition'
import LinkPreview from '../ui/LinkPreview'

type Props = {}

function Hero({ }: Props) {
    return (
        <section>
            <div className='flex flex-col md:flex-row items-center justify-between px-4 md:px-20 pt-40 md:pt-24 pb-10'>
                <div className='flex-1 text-center md:text-left'>
                    <div className="line1">
                        <div className="w-full max-w-[1000px] h-[180px] md:h-60">
                            <TextHoverEffect
                                text="ClipABit"
                                className=""
                            />
                        </div>
                    </div>

                    <div className="line2">
                        <div className={`hero-subtitle-text text-black dark:text-white mt-2`}>
                            Search by{' '}
                            <HoverDefinition word="ideas">
                                <span className="inline-block font-bold" style={{ fontFamily: '-apple-system, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
                                    <GreenGradientText text="ideas" />
                                </span>
                            </HoverDefinition>{' '}
                            , not{' '}
                            <HoverDefinition word="timestamps">
                                <span className="inline-block font-bold" style={{ fontFamily: '-apple-system, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
                                    <RedGradientText>timestamps</RedGradientText>
                                </span>
                            </HoverDefinition>
                        </div>
                    </div>

                    <div className="line3">
                            <div className={`hero-subtitle-text text-gray-600 dark:text-gray-300 mt-4`}>
                                Every{' '}
                                <AnimatedTextCycle
                                    words={['audio', 'moment', 'person']}
                                    interval={3500}
                                    className="font-bold"
                                    style={{ fontFamily: '-apple-system, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                                />
                                , one search away
                            </div>
                    </div>
                </div>
                <div className='hidden md:flex flex-1 justify-center items-center mt-10 md:mt-0'>
                    <LinkPreview url="https://www.blackmagicdesign.com/ca/products/davinciresolve/studio">
                        <DavinciGlow src="/DaVinci_Resolve_Studio 1.svg" width={200} height={200} className="w-40 md:w-60 h-auto" />
                    </LinkPreview>
                </div>
            </div>
            <div className='px-4 md:px-0 mt-14 md:mt-20'>
                <Image
                    src="/timeline_graphic.svg"
                    alt="Video Editor Timeline"
                    width={1400}
                    height={120}
                    className='mx-auto mb-10 w-full md:w-[900px] h-auto'
                />
            </div>
        </section>

    )
}

export default Hero