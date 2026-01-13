import React from 'react'

type Props = {}

export default function FilmReel({ }: Props) {
    // Create enough frames to ensure seamless scrolling (duplicate for seamless loop)
    const frameCount = 20;
    const frames = Array.from({ length: frameCount * 2 }); // Duplicate for seamless loop
    
    return (
        // Container: Full width with overflow hidden to show scrolling animation
        <div className="w-full overflow-hidden relative" style={{ height: '264px', minHeight: '264px' }}>
            <section
                className='relative flex w-max animate-scroll'
                style={{ width: `${frameCount * 240 * 2}px`, height: '264px' }} // Ensure exact width for seamless loop
            >
                {/* Film reel background that scrolls with content.
                    In light mode invert to make lines black; in dark keep white. */}
                <div
                    className="pointer-events-none absolute inset-0 bg-[url('/reel.svg')] bg-repeat-x bg-left brightness-0 dark:invert"
                    style={{ 
                        willChange: 'transform', 
                        transform: 'translateZ(0)',
                        width: '100%',
                        height: '264px',
                        backgroundSize: 'auto 264px',
                        backgroundPosition: 'left center'
                    }}
                    aria-hidden="true"
                />
                {/* Empty frames duplicated for seamless scrolling */}
                {frames.map((_, index) => (
                    <div
                        key={index}
                        className="w-[240px] h-[264px] flex items-center justify-center shrink-0"
                    />
                ))}
            </section>
        </div>
    )
}