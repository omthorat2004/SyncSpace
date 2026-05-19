import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlay, FiUsers, FiFileText, FiActivity, FiTag, FiSearch, FiLink, FiCode, FiStar, FiTrendingUp, FiZap } from 'react-icons/fi';
import { MdNotes } from 'react-icons/md';

const GuestHome: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { icon: <MdNotes size={28} />, title: "Smart Notes", description: "Create rich text notes with formatting, code blocks, and media embedding." },
    { icon: <FiLink size={28} />, title: "Link Management", description: "Save and organize important links with previews and automatic metadata." },
    { icon: <FiCode size={28} />, title: "Code Snippets", description: "Store and syntax-highlight code snippets in any programming language." },
    { icon: <FiTag size={28} />, title: "Tag Organization", description: "Powerful tagging system to categorize and find your content instantly." },
    { icon: <FiSearch size={28} />, title: "Fast Search", description: "Search across all your content with filters and instant results." },
    { icon: <FiActivity size={28} />, title: "Activity Tracking", description: "Keep track of your recent activities and frequently accessed content." }
  ];

  const stats = [
    { value: "10K+", label: "Active Users", icon: <FiUsers size={24} />, trend: "+25%" },
    { value: "50K+", label: "Notes Created", icon: <FiFileText size={24} />, trend: "+40%" },
    { value: "99.9%", label: "Uptime", icon: <FiActivity size={24} />, trend: "Guaranteed" },
    { value: "24/7", label: "Support", icon: <FiUsers size={24} />, trend: "Live chat" }
  ];

  return (
    <div className="bg-[var(--background)] min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none transition-transform duration-300"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, var(--accent) 0%, transparent 50%)`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 bg-white/10 backdrop-blur-md text-accent animate-bounce">
            <FiZap className="w-4 h-4" />
            <span className="text-sm font-semibold">🚀 Welcome to SyncSpace</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-foreground">
            Your Personal
            <span className="block mt-2 bg-linear-to-r from-accent via-secondary to-accent bg-size-[200%_auto] bg-clip-text text-transparent animate-shimmer">
              Knowledge Hub
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed text-muted">
            Store notes, links, and code snippets with powerful organization and search.
            <br className="hidden md:block" />
            Never lose track of important information again.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/register"
              className="group px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 justify-center bg-[var(--accent)] text-[var(--accent-text)] hover:bg-[var(--accent-hover)]"
            >
              Get Started Free
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/demo"
              className="group px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 justify-center border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-text)]"
            >
              <FiPlay className="transition-transform duration-300 group-hover:scale-110" />
              Watch Demo
            </Link>
          </div>

          <div className="flex flex-wrap gap-4 justify-center text-sm text-muted">
            <span>🎉 No credit card required</span>
            <span>• Free forever plan</span>
            <span>• Cancel anytime</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 rounded-full flex justify-center border-[var(--accent)]">
            <div className="w-1 h-2 rounded-full mt-2 animate-pulse bg-[var(--accent)]" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[var(--card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl transition-all duration-300 hover:scale-105 bg-[var(--background)] border border-[var(--border)]"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-[var(--accent)] text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2 text-[var(--accent)]">
                  {stat.value}
                </div>
                <div className="text-sm mb-2 text-[var(--muted)]">{stat.label}</div>
                <div className="text-xs flex items-center justify-center gap-1 text-[var(--success)]">
                  <FiTrendingUp className="w-3 h-3" />
                  {stat.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
              Everything You Need to
              <span className="block text-accent">Organize Knowledge</span>
            </h2>
            <p className="text-xl max-w-2xl mx-auto text-muted">
              Powerful features to help you capture, organize, and find information instantly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl bg-[var(--card)] border border-[var(--border)]"
              >
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 bg-[var(--accent)] text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
              How SyncSpace Works
            </h2>
            <p className="text-xl text-muted">
              Three simple steps to organize your knowledge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Spaces", desc: "Organize your knowledge into spaces like DSA, Backend, Projects, or Ideas", icon: "🎯" },
              { step: "02", title: "Add Content", desc: "Save notes, links, or code snippets and organize them with tags", icon: "📝" },
              { step: "03", title: "Find Instantly", desc: "Search across all your content with powerful filters and instant results", icon: "⚡" }
            ].map((item, index) => (
              <div key={index} className="group text-center">
                <div className="p-8 rounded-xl transition-all duration-300 group-hover:scale-105 bg-background border border-border">
                  <div className="text-6xl mb-4 animate-bounce">{item.icon}</div>
                  <div className="text-5xl font-bold mb-4 opacity-10 text-accent">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
              Loved by Users Worldwide
            </h2>
            <p className="text-xl text-muted">
              Join thousands of satisfied users organizing their knowledge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Chen", role: "Software Engineer", content: "SyncSpace transformed how I organize my technical knowledge. The tagging system is incredibly powerful!", avatar: "SC", company: "Google" },
              { name: "Michael Rodriguez", role: "Product Manager", content: "Finally, a knowledge management system that actually works for developers. Love the code snippet feature.", avatar: "MR", company: "Microsoft" },
              { name: "Priya Patel", role: "Student", content: "Perfect for organizing DSA notes and project ideas. The search is lightning fast!", avatar: "PP", company: "Stanford" }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="p-6 rounded-xl transition-all duration-300 hover:scale-105 bg-[var(--card)] border border-[var(--border)]"
              >
                <div className="flex items-center mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg bg-[var(--accent)]"
                  >
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-[var(--foreground)]">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-[var(--muted)]">{testimonial.role}</div>
                    <div className="text-xs text-[var(--accent)]">{testimonial.company}</div>
                  </div>
                </div>
                <p className="italic leading-relaxed mb-4 text-[var(--muted)]">"{testimonial.content}"</p>
                <div className="flex gap-1 text-[var(--secondary)]">
                  {[...Array(5)].map((_, i) => <FiStar key={i} className="fill-current" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-[var(--accent)] to-[var(--secondary)]" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, var(--accent) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 z-10">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full mb-6 bg-white/10 backdrop-blur-md text-[var(--accent)]">
            <FiZap className="w-4 h-4" />
            <span className="text-sm font-semibold">Limited Time Offer</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[var(--foreground)]">
            Ready to Organize Your Knowledge?
          </h2>
          <p className="text-xl mb-8 text-[var(--muted)]">
            Join SyncSpace today and never lose track of important information again
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="group px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 justify-center bg-[var(--accent)] text-[var(--accent-text)] hover:bg-[var(--accent-hover)]"
            >
              Get Started Now
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/features"
              className="px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-text)]"
            >
              Learn More
            </Link>
          </div>

          <p className="text-sm mt-6 text-[var(--muted)]">
            Free forever plan • No credit card required • 14-day premium trial
          </p>
        </div>
      </section>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default GuestHome;