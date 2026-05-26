import React from 'react';
import { FiCheckCircle, FiClipboard, FiFolder, FiLayers, FiSearch, FiShield, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const featureList = [
  {
    icon: <FiFolder size={24} />,
    title: 'Spaces for every topic',
    description: 'Create dedicated spaces for notes, links, and code snippets so related work stays grouped.'
  },
  {
    icon: <FiClipboard size={24} />,
    title: 'Structured content',
    description: 'Add titles, summaries, tags, and descriptions that make information easy to scan.'
  },
  {
    icon: <FiSearch size={24} />,
    title: 'Fast find',
    description: 'Search across all spaces with instant results and clear organization.'
  },
  {
    icon: <FiLayers size={24} />,
    title: 'Clear workspace',
    description: 'Keep the dashboard minimal with white cards, subtle borders, and precise spacing.'
  },
  {
    icon: <FiUsers size={24} />,
    title: 'Team-ready flow',
    description: 'Invite collaborators and make shared work easy to browse and maintain.'
  },
  {
    icon: <FiShield size={24} />,
    title: 'Secure by design',
    description: 'Protect your notes and links while keeping access simple for your workflow.'
  }
];

const stats = [
  { value: '3x', label: 'Faster retrieval' },
  { value: '10K+', label: 'Items managed' },
  { value: '99%', label: 'User satisfaction' }
];

const steps = [
  { label: '01', title: 'Build spaces', description: 'Create clear areas for projects, topics, and teams.' },
  { label: '02', title: 'Add items', description: 'Capture notes, links, and snippets with one interface.' },
  { label: '03', title: 'Find faster', description: 'Use search and filters to retrieve work instantly.' }
];

const GuestHome: React.FC = () => {
  return (
    <div className="bg-white text-slate-950 min-h-screen dark:bg-slate-950 dark:text-slate-100">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-4xl border border-border bg-white py-20 shadow-sm dark:border-slate-800 dark:bg-slate-950 mt-15 px-5 md:px-10 lg:px-15">
          <div className="absolute inset-x-0 top-0 h-48 bg-slate-50 dark:bg-slate-900" />
          <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-8">
              

              <div className="space-y-6">
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
                  A calm, clean workspace for notes, links, and team knowledge.
                </h1>
                <p className="max-w-xl text-base leading-8 text-slate-600 dark:text-slate-400">
                  SyncSpace helps guests understand the app instantly with clear organization, fast search, and a minimal workspace that puts content first.
                </p>
              </div>

              {/* <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-left dark:border-slate-700 dark:bg-slate-900">
                    <div className="text-3xl font-semibold text-slate-950 dark:text-white">{item.value}</div>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div> */}

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background! transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  Get started
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  Sign in
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="text-sm uppercase tracking-[0.5em] text-slate-500 dark:text-slate-400">Workspace preview</div>
              <div className="mt-8 space-y-6">
                <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-950">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-slate-100 p-3 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      <FiFolder size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-950 dark:text-white">Project spaces</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Organize content by topic and project.</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-950">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-slate-100 p-3 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      <FiSearch size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-950 dark:text-white">Instant search</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Find notes and links without extra clicks.</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-950">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-slate-100 p-3 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      <FiClipboard size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-950 dark:text-white">Quick notes</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Capture ideas and reference material as you browse.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="grid gap-8 lg:grid-cols-3">
            {featureList.map((feature) => (
              <article key={feature.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-950">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-slate-100">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-950 dark:text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-20 bg-card dark:bg-slate-900 px-6 md:px-8 lg:px-10 rounded-2xl">
          <div className="mx-auto max-w-3xl text-center ">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">How it works</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">Three steps to a cleaner workflow</h2>
            <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-400">
              Fresh content, organized spaces, and fast retrieval make this the right place to manage your work from day one.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.label} className="rounded-[1.75rem] border border-slate-200 bg-white p-8 text-left shadow-sm dark:border-slate-700 dark:bg-slate-950">
                <div className="text-lg font-semibold text-slate-950 dark:text-white">{step.label}</div>
                <h3 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20">
          <div className="rounded-4xl border border-slate-200 bg-white p-10 shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Why choose SyncSpace</p>
                <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">A home for every note, link, and code snippet.</h2>
                <p className="mt-4 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-400">
                  Use the guest page to understand how the app helps you structure content with clarity and confidence.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {['Fast search', 'Clean layout', 'Shared spaces', 'Secure access'].map((item) => (
                  <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50 dark:bg-slate-950">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Get started</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">Ready to see the workflow in action?</h2>
            <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-400">
              Create your first space, add content, and keep everything easy to find.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Create account
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GuestHome;
