import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_URL, catchAsync, navigateByRole } from '../utils/helper';
import type { AuthContext } from '../utils/interfaces';

const LoginPage = () => {
    const { user, setUser } = useOutletContext<AuthContext>();
    const navigate = useNavigate();

    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsProcessing(true);

        catchAsync(async () => {
            const res = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    user_email: userEmail,
                    user_password: userPassword,
                }),
            });

            const data = await res.json();

            if (data.status === 'success') {
                setUser(data.data.user);
                navigateByRole(navigate, data.data.user.user_role);
                return;
            }

            setError(data.message ?? 'Login failed. Please try again.');
            setIsProcessing(false);
        })();
    };

    useEffect(() => {
        if(user)
            navigateByRole(navigate, user.user_role);
    }, []);

    return (
        <main className="relative min-h-[calc(100vh-8rem)] overflow-hidden bg-white px-6 py-16 dark:bg-slate-950">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(79,70,229,0.12),_transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(79,70,229,0.2),_transparent_55%)]" />
            <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-success/10 blur-3xl" />

            <div className="relative mx-auto w-full max-w-md">
                <div className="text-center">
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary">Welcome back</p>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Log in to SyncHub
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Enter your details to access your workspace.
                    </p>
                </div>

                <div className="mt-8 rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <p className="rounded-card border border-danger/20 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                                {error}
                            </p>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                className="mt-1.5 w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-primary"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                    Password
                                </label>
                                <button
                                    type="button"
                                    className="cursor-pointer text-sm font-medium text-primary transition hover:text-primary/80"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative mt-1.5">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={userPassword}
                                    onChange={(e) => setUserPassword(e.target.value)}
                                    className="w-full rounded-card border border-slate-200 bg-white py-2.5 pl-4 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-primary"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3 text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="button-property w-full rounded-card bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:bg-primary/90"
                        >
                            {isProcessing ? 'Processing' : 'Log in'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                        Don&apos;t have an account?{' '}
                        <Link to="/signup" className="cursor-pointer font-semibold text-primary transition hover:text-primary/80">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;
