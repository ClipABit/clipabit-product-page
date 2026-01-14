'use client'; // This directive allows interactivity here

import Button from "../ui/Button";
import { useTheme } from '../../lib/theme';

export default function GetStartedSection() {
    const onGetStartedClick = () => {
        // Add your click handling logic here
        console.log("Get Started button clicked");
    }

    const { theme } = useTheme();
    return (
        <section className={`flex flex-col items-center mb-20 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
            {/* We use your generic UI Button here */}
            <Button text={theme === 'dark' ? 'Get Started!' : 'Get Started!'} onClick={onGetStartedClick} />
        </section>
    );
}