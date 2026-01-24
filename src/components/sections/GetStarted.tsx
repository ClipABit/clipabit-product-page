'use client'; // This directive allows interactivity here

import Button from "../ui/Button";

export default function GetStartedSection() {
    return (
        <section className={`flex flex-col items-center mb-20 bg-white dark:bg-black`}>
            {/* We use your generic UI Button here */}
            <Button text={'Get Started!'} />
        </section>
    );
}