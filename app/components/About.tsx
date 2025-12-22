import { aboutData } from '@/app/data/about';

export default function About() {
  return (
    <section id="about" className="py-20 px-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-black drop-shadow-sm pointer-events-auto">
        About Me
      </h2>
      <div className="bg-white/80 p-8 rounded-2xl shadow-lg border border-gray-200 backdrop-blur-sm pointer-events-auto">
        {aboutData.bio.map((paragraph, index) => (
          <p key={index} className="leading-relaxed text-gray-700 mb-4 last:mb-0">
            {paragraph}
          </p>
        ))}

        <div className="mt-6">
          <h3 className="font-bold text-black mb-2">今まで使ってきたもの</h3>
          <div className="flex flex-wrap gap-2">
            {aboutData.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm border border-gray-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
