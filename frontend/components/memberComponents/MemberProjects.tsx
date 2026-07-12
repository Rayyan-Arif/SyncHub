import { useEffect, useState } from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import { API_URL, catchAsync, formatUserFriendlyDate } from '../../utils/helper';
import type { AnnouncementItem, AssignedTaskForMember, AuthContext } from '../../utils/interfaces';

const MemberProjects = () => {
    const { user } = useOutletContext<AuthContext>();
    const { organization_id, teamID, projectID } = useParams();
    const organizationId = Number(organization_id);
    const teamId = Number(teamID);
    const projectId = Number(projectID);

    const [assignedTasks, setAssignedTasks] = useState<AssignedTaskForMember[]>([]);
    const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdatingTask, setIsUpdatingTask] = useState(false);

    const fetchProjectData = () => {
        catchAsync(async () => {
            const [tasksRes, announcementsRes] = await Promise.all([
                fetch(`${API_URL}/tasks/${organizationId}/${projectId}/assigned`, {
                    credentials: 'include',
                }),
                fetch(`${API_URL}/announcements/${organizationId}/all?project_id=${projectId}`, {
                    credentials: 'include',
                }),
            ]);

            const tasksData = await tasksRes.json();
            const announcementsData = await announcementsRes.json();

            if (tasksData.status === 'success') {
                setAssignedTasks(tasksData.data.assignedTasks ?? []);
            } else {
                setError(tasksData.message ?? 'Failed to load assigned tasks.');
            }

            if (announcementsData.status === 'success') {
                setAnnouncements(announcementsData.data.announcements ?? []);
            }

            setIsLoading(false);
        })();
    };

    useEffect(() => {
        if (!organizationId || !teamId || !projectId) {
            setError('Invalid route parameters.');
            setIsLoading(false);
            return;
        }

        fetchProjectData();
    }, [organizationId, teamId, projectId]);

    const handleUpdateTaskStatus = (taskId: number, status: 'IN PROGRESS' | 'COMPLETED') => {
        if (!user) {
            return;
        }

        setIsUpdatingTask(true);
        catchAsync(async () => {
            const res = await fetch(`${API_URL}/tasks/assigned/update-status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    organization_id: organizationId,
                    task_id: taskId,
                    member_id: user.user_id,
                    status,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (data.status === 'success' || res.ok) {
                setIsUpdatingTask(false);
                fetchProjectData();
                return;
            }

            setError(data.message ?? 'Failed to update task status.');
            setIsUpdatingTask(false);
        })();
    };

    return (
        <main className="min-h-screen bg-white px-6 py-12 dark:bg-slate-950 md:py-16">
            <div className="mx-auto max-w-6xl">
                {isLoading ? (
                    <p className="text-sm text-slate-600 dark:text-slate-400">Loading project...</p>
                ) : error ? (
                    <p className="rounded-card border border-danger/20 bg-danger/10 px-4 py-2.5 text-sm text-danger">{error}</p>
                ) : (
                    <>
                        <Link
                            to={`/dashboard/organization/member/${organizationId}/teams/${teamId}`}
                            className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                            Back to team
                        </Link>

                        <div className="mb-10">
                            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Project</p>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Your project tasks</h1>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                See your assigned tasks and update their status.
                            </p>
                        </div>

                        <section className="mb-10 rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Project announcements</h2>
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

                        <section className="rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Assigned tasks</h2>
                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                {assignedTasks.length ? (
                                    assignedTasks.map((task) => (
                                        <div key={task.task_id} className="rounded-card border border-slate-200 p-4 dark:border-slate-700">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Task ID: {task.task_id}</p>
                                            <h3 className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{task.title}</h3>
                                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{task.description}</p>
                                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                                Assigned: {formatUserFriendlyDate(task.assigned_date)}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                Due: {formatUserFriendlyDate(task.due_date)}
                                            </p>
                                            <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Current status: {task.status}
                                            </p>
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {
                                                    task.status !== 'IN PROGRESS' && 
                                                    <button
                                                        type="button"
                                                        disabled={isUpdatingTask}
                                                        onClick={() => handleUpdateTaskStatus(task.task_id, 'IN PROGRESS')}
                                                        className="button-property cursor-pointer rounded-card border border-primary/30 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10"
                                                    >
                                                        Mark In Progress
                                                    </button>
                                                }
                                                {
                                                    task.status !== 'COMPLETED' &&
                                                    <button
                                                        type="button"
                                                        disabled={isUpdatingTask}
                                                        onClick={() => handleUpdateTaskStatus(task.task_id, 'COMPLETED')}
                                                        className="button-property cursor-pointer rounded-card border border-success/30 px-3 py-1.5 text-xs font-semibold text-success transition hover:bg-success/10"
                                                    >
                                                        Mark Completed
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 sm:col-span-2">
                                        No tasks assigned to you in this project yet.
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

export default MemberProjects;

