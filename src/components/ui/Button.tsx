import React from 'react'


type Props = {
    text: string;
    onClick?: () => void;
}

export default function Button({ text, onClick }: Props) {
    return (
        <button onClick={onClick} className="px-4 py-2 bg-[#FAAF04] text-black rounded hover:bg-[#e6a800] ">
            {text}
        </button>
    )
}