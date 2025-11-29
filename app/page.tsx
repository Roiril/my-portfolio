"use client";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* ヒーローセクション */}
      <section className="flex flex-col items-center justify-center h-screen bg-white shadow-sm px-4">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            Hi, I'm <span className="text-blue-600">[Your Name]</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            情報系大学生 / Web Developer
            <br />
            技術で誰かの課題を解決することが好きです。
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a href="#works" className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
              View Works
            </a>
            <a href="#contact" className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition">
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* Aboutセクション */}
      <section id="about" className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">About Me</h2>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <p className="leading-relaxed text-gray-600 mb-4">
            はじめまして。〇〇大学の情報学部に所属しています。
            大学ではコンピュータサイエンスの基礎を学びつつ、個人開発でWebアプリケーションを作っています。
          </p>
          <p className="leading-relaxed text-gray-600">
            最近は **Next.js** と **Supabase** を使った開発にハマっており、
            「自分が欲しいもの」を形にすることに情熱を注いでいます。
          </p>
          
          <div className="mt-6">
            <h3 className="font-bold text-gray-900 mb-2">Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {['TypeScript', 'Next.js', 'React', 'Supabase', 'Python', 'Git'].map((skill) => (
                <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Worksセクション */}
      <section id="works" className="py-20 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Works</h2>
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* 作品1: Markdown Diary */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
              <div className="h-48 bg-blue-50 flex items-center justify-center">
                <span className="text-4xl">📝</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Markdown Diary</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Next.jsとSupabaseで構築した、マークダウン記法対応の日記アプリ。
                  認証機能、CRUD処理、RLSによるセキュリティ設定を実装しました。
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Next.js</span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Supabase</span>
                </div>
                <div className="flex gap-4">
                  <a href="https://my-markdown-diary.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    Live Demo →
                  </a>
                  <a href="https://github.com/YourName/my-markdown-diary" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline text-sm">
                    GitHub →
                  </a>
                </div>
              </div>
            </div>

            {/* 作品2: My Portfolio (これ) */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
              <div className="h-48 bg-gray-50 flex items-center justify-center">
                <span className="text-4xl">👤</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">My Portfolio</h3>
                <p className="text-gray-600 text-sm mb-4">
                  自分自身の経歴と作品を紹介するポートフォリオサイト。
                  シンプルで見やすいデザインを心がけました。
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Next.js</span>
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">Tailwind CSS</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Contactセクション */}
      <section id="contact" className="py-20 px-6 max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Contact</h2>
        <p className="text-gray-600 mb-8">
          開発の依頼や技術的な相談、インターンのお誘いなど、お気軽にご連絡ください。
        </p>
        <div className="flex justify-center gap-6">
          <a href="mailto:your.email@example.com" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
            <span>📧</span> Email
          </a>
          <a href="https://twitter.com/YourTwitterHandle" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
            <span>🐦</span> Twitter (X)
          </a>
          <a href="https://zenn.dev/YourZennId" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
            <span>📚</span> Zenn
          </a>
        </div>
      </section>

      {/* フッター */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t">
        © {new Date().getFullYear()} [Your Name]. All rights reserved.
      </footer>
    </main>
  );
}