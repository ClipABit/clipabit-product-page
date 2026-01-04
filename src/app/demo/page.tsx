import React from 'react'

type Props = {}

export default function Demo({ }: Props) {
    return (
        <>
            <section className='min-h-screen flex flex-col items-center justify-start px-4 md:px-20 py-10'>
                <h1 className='text-3xl md:text-5xl font-bold text-black dark:text-white mb-8 text-center md:text-left'>Welcome to the ClipABit Demo Page!</h1>
                <h2 className='text-2xl md:text-4xl font-bold text-black dark:text-white mb-8 text-center md:text-left'>Semantic Video Search - Demo</h2>
                <p className='text-lg md:text-2xl text-center md:text-left'>The repository below mimics the footage you would have in your video editor's media pool. Try searching for specific actions, settings, objects in the videos using natural language! We'd appreciate any feedback you may have.</p>
            </section>

            <section>

            </section>


        </>
    )
}
