'use client'

import { motion, AnimatePresence } from 'motion/react'
import { IoClose } from 'react-icons/io5'
import { LuDownload } from 'react-icons/lu'

interface SecurityBypassModalProps {
    isOpen: boolean
    onClose: () => void
    platform: string
}

export default function SecurityBypassModal({ isOpen, onClose, platform }: SecurityBypassModalProps) {
    const isMac = platform === 'macOS'

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-[#1a1a1a] shadow-2xl border border-gray-200 dark:border-white/10"
                    >
                        <div className="p-8">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                            >
                                <IoClose size={24} />
                            </button>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
                                    <LuDownload size={28} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Thanks for downloading ClipABit!
                                </h2>
                            </div>

                            <div className="space-y-6">
                                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                                    Your download has started! Since ClipABit is a new app, {isMac ? 'macOS' : 'Windows'} might show a security warning.
                                </p>

                                <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/5">
                                    <h3 className=" text-gray-900 dark:text-white mb-3">
                                        How to open safely:
                                    </h3>
                                    
                                    {isMac ? (
                                        <div className="space-y-4">
                                            <ol className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-300">
                                                <li>Open <span className="font-bold">System Settings</span>.</li>
                                                <li>Go to <span className="font-bold">Privacy &amp; Security</span>.</li>
                                                <li>Scroll down to <span className="font-bold">Security</span> and click <span className="font-bold text-blue-500 italic">Open Anyway</span>.</li>
                                            </ol>
                                        </div>
                                    ) : (
                                        <ol className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-300">
                                            <li>Double-click the .exe file.</li>
                                            <li>On the blue warning screen, click <span className="font-bold underline italic">&quot;More info&quot;</span> just below the text.</li>
                                            <li>Click the <span className="font-bold text-blue-500 italic">&quot;Run anyway&quot;</span> button at the bottom.</li>
                                        </ol>
                                    )}
                                </div>

                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-[#FAAF04] hover:bg-[#ffb700] text-black font-bold rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                                >
                                    Got it!
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
