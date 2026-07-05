import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import {scrollToComponent} from '../utils/helper';

const LandingPage = () => {
    return (
        <div className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <Navbar user={null} setUser={null}/>

            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(79,70,229,0.12),_transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(79,70,229,0.2),_transparent_55%)]" />
                <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-success/10 blur-3xl" />

                <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-primary dark:text-[#FFFFFF] dark:border-primary/25 dark:bg-primary/10">
                            <span className="h-1.5 w-1.5 rounded-full bg-success" />
                            Built for teams that need clarity
                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl md:text-6xl">
                            Keep every team
                            <span className="text-primary"> in sync</span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                            SyncHub brings your organization, teams, projects, and tasks into one place — so
                            everyone knows what they’re working on, who’s responsible, and what’s due.
                        </p>

                        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                to="/signup"
                                className="inline-flex w-full items-center justify-center rounded-card bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90 sm:w-auto"
                            >
                                Start free
                            </Link>
                            <span
                                onClick={() => {scrollToComponent("how-it-works")}}
                                className="cursor-pointer inline-flex w-full items-center justify-center rounded-card border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary/30 hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-primary/50 sm:w-auto"
                            >
                                See how it works
                            </span>
                        </div>
                    </div>

                    {/* Friendly product preview */}
                    <div className="mx-auto mt-16 max-w-4xl rounded-card border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-900/60">
                        <div className="rounded-card bg-slate-50 p-6 dark:bg-slate-800/50 md:p-8">
                            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        Your workspace
                                    </p>
                                    <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">Acme Organization</p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="rounded-card border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Teams</p>
                                    <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">3</p>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">With clear managers</p>
                                </div>

                                <div className="rounded-card border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Projects</p>
                                    <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">8</p>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">With target dates</p>
                                </div>

                                <div className="rounded-card border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tasks</p>
                                    <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">24</p>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Assigned to people</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="border-t border-slate-100 bg-slate-50/70 py-20 dark:border-slate-800 dark:bg-slate-900/50 md:py-24">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Features</p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
                            Everything your team needs to stay aligned
                        </h2>
                        <p className="mt-4 text-slate-600 dark:text-slate-400">
                            Simple tools for running an organization, coordinating teams, and getting work done.
                        </p>
                    </div>

                    <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <article className="rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="flex h-10 w-10 items-center justify-center rounded-card bg-primary/10 text-primary">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Your organization, in one place</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                Set up your organization with a name, contact details, and a short description —
                                then invite people to join.
                            </p>
                        </article>

                        <article className="rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="flex h-10 w-10 items-center justify-center rounded-card bg-success/10 text-success">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Managers and members</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                Give people the right role in your organization — managers can lead, members can
                                focus on the work.
                            </p>
                        </article>

                        <article className="rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="flex h-10 w-10 items-center justify-center rounded-card bg-warning/10 text-warning">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-2.161 2.72a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Small, focused teams</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                Create teams inside your organization, each with a manager. Keep teams lean —
                                up to 10 people per team.
                            </p>
                        </article>

                        <article className="rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="flex h-10 w-10 items-center justify-center rounded-card bg-primary/10 text-primary">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Projects with deadlines</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                Start projects under a team, set a target completion date, and mark them active
                                or completed when you’re done.
                            </p>
                        </article>

                        <article className="rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="flex h-10 w-10 items-center justify-center rounded-card bg-success/10 text-success">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Tasks people can own</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                Break projects into tasks, assign them to teammates, set due dates, and follow
                                progress from assigned to in progress to completed.
                            </p>
                        </article>

                        <article className="rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="flex h-10 w-10 items-center justify-center rounded-card bg-danger/10 text-danger">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Announcements that land</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                Share updates with a whole team or a specific project, so important messages
                                don’t get lost in chat.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" className="py-20 md:py-24">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-sm font-semibold uppercase tracking-wider text-primary">How it works</p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
                            Up and running in a few steps
                        </h2>
                        <p className="mt-4 text-slate-600 dark:text-slate-400">
                            No complicated setup — just create your space and start working together.
                        </p>
                    </div>

                    <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-card border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-card bg-primary text-lg font-bold text-white">
                                1
                            </div>
                            <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">Create your account</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                Sign up with your name and email. You’re ready in minutes.
                            </p>
                        </div>

                        <div className="rounded-card border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-card bg-primary text-lg font-bold text-white">
                                2
                            </div>
                            <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">Set up your organization</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                Add your org details and invite the people you work with.
                            </p>
                        </div>

                        <div className="rounded-card border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-card bg-primary text-lg font-bold text-white">
                                3
                            </div>
                            <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">Form teams & projects</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                Group people into teams and start projects with clear deadlines.
                            </p>
                        </div>

                        <div className="rounded-card border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-card bg-primary text-lg font-bold text-white">
                                4
                            </div>
                            <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">Assign work</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                Add people to projects, hand out tasks, and track them to done.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Who it's for */}
            <section id="who-its-for" className="border-t border-slate-100 bg-slate-50/70 py-20 dark:border-slate-800 dark:bg-slate-900/50 md:py-24">
                <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Who it’s for</p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
                            Made for groups that need structure
                        </h2>
                        <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">
                            Whether you’re a student group, a startup, or a small company, SyncHub helps you
                            keep people, projects, and deadlines organized without the noise.
                        </p>

                        <ul className="mt-8 space-y-4">
                            <li className="flex items-start gap-3">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </span>
                                <span className="text-sm text-slate-700 dark:text-slate-300">Know who leads each team and who belongs where</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </span>
                                <span className="text-sm text-slate-700 dark:text-slate-300">See which projects are active and which are done</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </span>
                                <span className="text-sm text-slate-700 dark:text-slate-300">Give every task an owner and a due date</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </span>
                                <span className="text-sm text-slate-700 dark:text-slate-300">Post announcements where the team will actually see them</span>
                            </li>
                        </ul>
                    </div>

                    <div className="rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            At a glance
                        </p>
                        <div className="mt-5 space-y-4">
                            <div className="flex items-center justify-between rounded-card bg-warning/5 px-4 py-3 dark:bg-warning/10">
                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Someone is working on it</span>
                                <span className="rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-semibold text-warning dark:bg-warning/20">
                                    In progress
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-card bg-success/5 px-4 py-3 dark:bg-success/10">
                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Work is finished</span>
                                <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success dark:bg-success/20">
                                    Completed
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-card bg-slate-50 px-4 py-3 dark:bg-slate-700/50">
                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Task just handed out</span>
                                <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-600 dark:text-slate-200">
                                    Assigned
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section id="cta" className="py-20 md:py-24">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="relative overflow-hidden rounded-card bg-primary px-8 py-14 text-center shadow-xl shadow-primary/25 md:px-16 dark:shadow-primary/10">
                        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

                        <h2 className="relative text-3xl font-bold tracking-tight text-white md:text-4xl">
                            Ready to get your team in sync?
                        </h2>
                        <p className="relative mx-auto mt-4 max-w-xl text-indigo-100">
                            Create your free account, set up your organization, and start managing teams,
                            projects, and tasks today.
                        </p>
                        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                to="/signup"
                                className="inline-flex w-full items-center justify-center rounded-card bg-white px-6 py-3 text-sm font-semibold text-primary transition hover:bg-indigo-50 sm:w-auto"
                            >
                                Create free account
                            </Link>
                            <span
                                onClick={() => {scrollToComponent("features");}}
                                className="cursor-pointer inline-flex w-full items-center justify-center rounded-card border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
                            >
                                Explore features
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default LandingPage
