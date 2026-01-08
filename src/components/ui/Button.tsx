import React from 'react'
import { useTheme } from '../../lib/theme'


type Props = {
    text: string;
    onClick?: () => void;
}

export default function Button({ text, onClick }: Props) {
    const { theme } = useTheme();
    return (
        <button onClick={onClick} className={`px-4 py-2 bg-[#FAAF04] ${theme === 'dark' ? 'text-white' : 'text-black'} rounded hover:bg-[#e6a800] `}>
            {text}
        </button>
    )
}