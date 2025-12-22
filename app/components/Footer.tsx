export default function Footer() {
  return (
    <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-200">
      <span className="pointer-events-auto">
        © {new Date().getFullYear()} Shiroishi Lab / Roil. All rights reserved.
      </span>
    </footer>
  );
}
