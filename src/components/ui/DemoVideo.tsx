export default function DemoVideo() {
    const videoUrl = "https://firebasestorage.googleapis.com/v0/b/clipabit.firebasestorage.app/o/demo.mp4?alt=media&token=204b3539-8e6a-4e4f-92c9-5873e1612515";

    return (
        <video
            className="rounded-lg shadow-lg" width={800} height={650} controls>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
};