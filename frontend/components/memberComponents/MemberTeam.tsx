import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MemberProjectCard from './MemberProjectCard';
import { API_URL, catchAsync, formatUserFriendlyDate } from '../../utils/helper';
import type { AnnouncementItem, Projects } from '../../utils/interfaces';

const MemberTeam = () => {
    const { organization_id, teamID } = useParams();
    const organizationId = Number(organization_id);
    const teamId = Number(teamID);

    const [projects, setProjects] = useState<Projects[]>([]);
    const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!organizationId || !teamId) {
            setError('Invalid route parameters.');
            setIsLoading(false);
            return;
        }

        catchAsync(async () => {
            const [projectsRes, announcementsRes] = await Promise.all([
                fetch(`${API_URL}/projects/${organizationId}/${teamId}/all`, {
                    credentials: 'include',
                }),
                fetch(`${API_URL}/announcements/${organizationId}/all?team_id=${teamId}`, {
                    credentials: 'include',
                }),
            ]);

            const projectsData = await projectsRes.json();
            const announcementsData = await announcementsRes.json();

            if (projectsData.status === 'success') {
                setProjects(projectsData.data.projects.projects_joined ?? []);
            } else {
                setError(projectsData.message ?? 'Failed to load projects.');
            }

            if (announcementsData.status === 'success') {
                setAnnouncements(announcementsData.data.announcements ?? []);
            }

            setIsLoading(false);
        })();
    }, [organizationId, teamId]);

    return (
        <main className="min-h-screen bg-white px-6 py-12 dark:bg-slate-950 md:py-16">
            <div className="mx-auto max-w-6xl">
                {isLoading ? (
                    <p className="text-sm text-slate-600 dark:text-slate-400">Loading team...</p>
                ) : error ? (
                    <p className="rounded-card border border-danger/20 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                        {error}
                    </p>
                ) : (
                    <>
                        <Link
                            to="/dashboard"
                            className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                            Back to dashboard
                        </Link>

                        <div className="mb-10">
                            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Team</p>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Your team
                            </h1>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                Projects you are part of and team announcements.
                            </p>
                        </div>

                        <section className="mb-10 rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Team announcements</h2>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                Updates posted for this team.
                            </p>
                            <div className="mt-4 space-y-3">
                                {announcements.length ? (
                                    announcements.map((item) => (
                                        <div
                                            key={item.announcement_id}
                                            className="rounded-card border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50"
                                        >
                                            <p className="text-sm text-slate-800 dark:text-slate-200">{item.announcement}</p>
                                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                {formatUserFriendlyDate(item.created_at)}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 dark:text-slate-400">No announcements yet.</p>
                                )}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Your projects</h2>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                Projects you have been added to in this team.
                            </p>
                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                {projects.length ? (
                                    projects.map((project) => (
                                        <MemberProjectCard key={project.project_id} project={project} />
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 sm:col-span-2">
                                        You are not part of any project in this team yet.
                                    </p>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </div>
        </main>
    );
};

export default MemberTeam;
