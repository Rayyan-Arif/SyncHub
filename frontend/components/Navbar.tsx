import { Link, useNavigate } from "react-router-dom";
import { getInitials, scrollToComponent, API_URL } from "../utils/helper";
import { useEffect, useState } from "react";
import type { User } from "../utils/interfaces";
import logo from '../synchub_icon.png';

const Navbar = ({ user, setUser, isLanding }: { user: User | null; setUser: React.Dispatch<React.SetStateAction<User | null>> | null; isLanding: Boolean }) => {
    const [theme, setTheme] = useState<string>(localStorage.getItem("theme") ?? "light");
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("theme", theme);
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    const handleLogout = async () => {
        const res = await fetch(`${API_URL}/users/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        if (res.ok) {
            setUser?.(null);
            navigate('/');
        }
    };

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 text-slate-900 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
            <input id="nav-toggle" type="checkbox" className="peer sr-only" />

            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <Link to="/" className="flex items-center gap-2.5">
                    <img src={logo} className="max-h-[50px] "/>
                    <span className="text-lg font-semibold tracking-tight">SyncHub</span>
                </Link>

                {
                    isLanding &&
                    <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400 md:flex">
                        <span onClick={() => scrollToComponent("features")} className="cursor-pointer transition hover:text-primary">Features</span>
                        <span onClick={() => scrollToComponent("how-it-works")} className="cursor-pointer transition hover:text-primary">How it works</span>
                        <span onClick={() => scrollToComponent("who-its-for")} className="cursor-pointer transition hover:text-primary">Who it’s for</span>
                    </nav>
                }

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
                        type="button"
                        aria-label="Toggle dark mode"
                        className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-card border border-slate-200 bg-white text-slate-600 transition hover:border-primary/30 hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-primary/50 dark:hover:text-primary"
                    >
                        <svg
                            className="h-5 w-5 dark:hidden"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                            />
                        </svg>
                        <svg
                            className="hidden h-5 w-5 dark:block"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                            />
                        </svg>
                    </button>

                    {user ? (
                        <div className="hidden items-center gap-3 md:flex">
                            <span
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-sm shadow-primary/30"
                                title={user.user_name}
                                aria-label={user.user_name}
                            >
                                {getInitials(user.user_name)}
                            </span>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="cursor-pointer rounded-card border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary/30 hover:text-primary dark:border-slate-700 dark:text-slate-300 dark:hover:border-primary/50"
                            >
                                Log out
                            </button>
                        </div>
                    ) : (
                        <div className="hidden items-center gap-3 md:flex">
                            <Link
                                to="/login"
                                className="text-sm font-medium text-slate-600 transition hover:text-primary dark:text-slate-400"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="rounded-card bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:bg-primary/90"
                            >
                                Get started
                            </Link>
                        </div>
                    )}

                    <label
                        htmlFor="nav-toggle"
                        aria-label="Toggle menu"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-card border border-slate-200 bg-white text-slate-600 transition hover:border-primary/30 hover:text-primary peer-checked:[&_.icon-menu]:hidden peer-checked:[&_.icon-close]:block dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-primary/50 dark:hover:text-primary md:hidden"
                    >
                        <svg
                            className="icon-menu h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                        <svg
                            className="icon-close hidden h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </label>
                </div>
            </div>

            <nav className="hidden border-t border-slate-200/80 bg-white/95 px-6 py-4 peer-checked:block dark:border-slate-800 dark:bg-slate-900/95 md:hidden">
                {
                    isLanding &&
                    <div className="flex flex-col gap-1">
                        <span
                            onClick={() => scrollToComponent("features")}
                            className="cursor-pointer rounded-card px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                            Features
                        </span>
                        <span
                            onClick={() => scrollToComponent("how-it-works")}
                            className="cursor-pointer rounded-card px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                            How it works
                        </span>
                        <span
                            onClick={() => scrollToComponent("who-its-for")}
                            className="cursor-pointer rounded-card px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                            Who it’s for
                        </span>
                    </div>
                }

                <div className="mt-4 flex flex-col gap-2 border-t border-slate-200/80 pt-4 dark:border-slate-800">
                    {user ? (
                        <>
                            <div className="flex items-center gap-3 rounded-card px-3 py-2.5">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-sm shadow-primary/30">
                                    {getInitials(user.user_name)}
                                </span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.user_name}</span>
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="cursor-pointer rounded-card border border-slate-200 px-3 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:border-primary/30 hover:text-primary dark:border-slate-700 dark:text-slate-300 dark:hover:border-primary/50"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="rounded-card px-3 py-2.5 text-center text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="rounded-card bg-primary px-3 py-2.5 text-center text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:bg-primary/90"
                            >
                                Get started
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
