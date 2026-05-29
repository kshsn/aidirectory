import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-hero text-text-inverse mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <span className="font-bold text-lg">aidirectory</span>
          </div>
          <p className="text-slate-400 text-sm text-center">
            The global AI tools directory — 500+ tools in 10 languages
          </p>
          <p className="text-slate-500 text-sm">
            © {year} aidirectory
          </p>
        </div>
      </div>
    </footer>
  );
}
