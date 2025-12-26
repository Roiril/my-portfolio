export default function Footer() {
  return (
    <footer className="px-8 py-12 bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm text-gray-700 pointer-events-auto">
          © {new Date().getFullYear()} Shiroishi Lab / Roil. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
