import { works } from '@/app/data/works';
import FeaturedWork from './FeaturedWork';
import WorkCard from './WorkCard';

export default function Works() {
  const featuredWork = works.find((w) => w.featured);
  const otherWorks = works.filter((w) => !w.featured);

  return (
    <section id="works" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center text-black drop-shadow-sm pointer-events-auto">
          Works
        </h2>

        {featuredWork && <FeaturedWork work={featuredWork} />}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherWorks.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      </div>
    </section>
  );
}
