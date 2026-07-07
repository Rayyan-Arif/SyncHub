import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <main className="relative flex min-h-[calc(100vh-8rem)] flex-1 items-center justify-center overflow-x-hidden px-6 py-16">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(79,70,229,0.12),_transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(79,70,229,0.2),_transparent_55%)]" />
                    <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute -left-24 bottom-16 h-72 w-72 rounded-full bg-danger/10 blur-3xl" />
                </div>

                <div className="relative z-10 mx-auto w-full max-w-lg text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-card bg-danger/10 text-danger dark:bg-danger/15">
                        <svg
                            className="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.75"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                            />
                        </svg>
                    </div>

                    <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-danger">
                        Error 404
                    </p>

                    <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
                        Page not found
                    </h1>

                    <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-400">
                        This page doesn’t exist or may have been moved. Let’s get you back to a workspace
                        that is still in sync.
                    </p>

                    <div className="mx-auto mt-10 rounded-card border border-slate-200 bg-white p-5 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            What you can do
                        </p>
                        <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                                Head back to the SyncHub home page
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-warning" />
                                Check the URL for typos
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-success" />
                                Open your organization or team from the dashboard
                            </li>
                        </ul>
                    </div>

                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            to="/"
                            className="inline-flex w-full items-center justify-center rounded-card bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90 sm:w-auto"
                        >
                            Back to home
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NotFoundPage;
