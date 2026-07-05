import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { API_URL, catchAsync, formatDate, getInitials } from '../utils/helper';
import type { AuthContext, OwnerStats, UserSignupStat } from '../utils/interfaces';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const OwnerStatsPage = () => {
    const { user } = useOutletContext<AuthContext>();
    const [stats, setStats] = useState<OwnerStats | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const fillMissingDaysOfArray = (users: UserSignupStat[], isMonthOrWeek: Boolean): UserSignupStat[] => {
        const dates: string[] = [];
        const filteredUsers: UserSignupStat[] = users.map(user => {
            return {users_joined: +user.users_joined, created_at: formatDate(new Date(user.created_at))}
        });
        for(let i = 0 ; i < (isMonthOrWeek ? 30 : 7) ; i++) dates.push(formatDate(new Date(Date.now() - i * 24 * 3600 * 1000)));
        dates.forEach(date => {
            if(!users?.find(user => formatDate(new Date(user.created_at)) === date))
                filteredUsers.push({users_joined: 0, created_at: date});
        })

        return filteredUsers;
    }

    useEffect(() => {
        if(user?.user_role !== 'OWNER')
            navigate("/page-not-found");

        catchAsync(async () => {
            const res = await fetch(`${API_URL}/users/owner/stats`, {
                credentials: 'include',
            });

            const data = await res.json();

            if (data.status === 'success') {
                const weekUsers: UserSignupStat[] = fillMissingDaysOfArray(data.data.stats.users_this_week ?? [], false);
                const monthUsers: UserSignupStat[] = fillMissingDaysOfArray(data.data.stats.users_this_month ?? [], true);

                setStats({...data.data.stats, users_this_week: weekUsers, users_this_month: monthUsers});
                setIsLoading(false);
                return;
            }

            setError(data.message ?? 'Failed to load owner stats.');
            setIsLoading(false);
        })();
    }, []);

    const statCards = stats
        ? [
              { label: 'Organizations', value: stats.organizations_created },
              { label: 'Users joined', value: stats.users_joined },
              { label: 'Teams created', value: stats.teams_created },
              { label: 'Projects started', value: stats.projects_started },
              { label: 'Assigned tasks', value: stats.assigned_tasks },
          ]
        : [];

    return (
        <main className="bg-white px-6 py-12 dark:bg-slate-950 md:py-16">
            <div className="mx-auto max-w-6xl">
                <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-white shadow-sm shadow-primary/30">
                            {user ? getInitials(user.user_name) : 'O'}
                        </span>
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Owner dashboard</p>
                            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                {user?.user_name ?? 'Owner'}
                            </h1>
                            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                                {user?.user_email}
                            </p>
                        </div>
                    </div>
                    <span className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {user?.user_role ?? 'OWNER'}
                    </span>
                </div>

                {error && (
                    <p className="mb-6 rounded-card border border-danger/20 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                        {error}
                    </p>
                )}

                {isLoading ? (
                    <p className="text-sm text-slate-600 dark:text-slate-400">Loading stats...</p>
                ) : (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            {statCards.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-card border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                                >
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                    Users joined this week
                                </h2>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                    Daily signups over the last 7 days
                                </p>

                                {/* IMPLEMENT RECHARTS CHART HERE — use stats.users_this_week (users_joined, created_at) */}
                                <div className="mt-6 flex min-h-64 items-center justify-center rounded-card border border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={stats?.users_this_week}>
                                            <XAxis dataKey="created_at" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="users_joined" fill='green' name="Users Joined"/>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                    Users joined this month
                                </h2>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                    Daily signups over the last 30 days
                                </p>

                                {/* IMPLEMENT RECHARTS CHART HERE — use stats.users_this_month (users_joined, created_at) */}
                                <div className="mt-6 flex min-h-64 items-center justify-center rounded-card border border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={stats?.users_this_month}>
                                            <XAxis dataKey="created_at" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="users_joined" fill='green' name="Users Joined"/>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};

export default OwnerStatsPage;
