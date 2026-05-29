import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-hero text-text-inverse py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Find the Perfect AI Tool
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Discover 500+ AI tools for writing, design, code, video, and more.
          </p>
          <div className="max-w-2xl mx-auto flex gap-2">
            <input
              type="search"
              placeholder="Search AI tools..."
              className="flex-1 px-4 py-3 rounded-xl text-text-primary bg-white border border-border outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold transition-colors">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Placeholder content */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-text-primary mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['Writing', 'Image', 'Video', 'Code', 'Audio', 'Business', 'Research', 'Education', 'Marketing', 'Other'].map((cat) => (
            <div key={cat} className="bg-surface border border-border rounded-card p-4 text-center hover:border-primary hover:shadow-md transition-all cursor-pointer">
              <div className="text-2xl mb-2">🤖</div>
              <div className="font-medium text-text-primary text-sm">{cat}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
