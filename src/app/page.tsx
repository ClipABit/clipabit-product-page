import Hero from "../components/sections/Hero";
import FilmReel from "../components/ui/FilmReel";
import Content from "../components/sections/Content";

export default function Home() {



  return (
    <main className="flex flex-col space-y-24">
      <Hero />
      <Content />
    </main>
  );
}
