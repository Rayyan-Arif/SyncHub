import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_URL, catchAsync } from '../../utils/helper';
import type { AnnouncementItem, ProjectDetailsForManager } from '../../utils/interfaces';

const ManagerProjects = () => {
    const { organization_id, teamID, projectID } = useParams();
    const organizationId = Number(organization_id);
    const teamId = Number(teamID);
    const projectId = Number(projectID);

    const [projectData, setProjectData] = useState<ProjectDetailsForManager | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
    const [announcementText, setAnnouncementText] = useState('');
    const [announcementIdToRemove, setAnnouncementIdToRemove] = useState('');
    const [announcementError, setAnnouncementError] = useState('');

    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskFormError, setTaskFormError] = useState('');
    const [isCreatingTask, setIsCreatingTask] = useState(false);

    const [assignTaskId, setAssignTaskId] = useState('');
    const [assignMemberId, setAssignMemberId] = useState('');
    const [assignDueDate, setAssignDueDate] = useState('');
    const [assignError, setAssignError] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);

    const [unassignTaskId, setUnassignTaskId] = useState('');
    const [unassignMemberId, setUnassignMemberId] = useState('');
    const [unassignError, setUnassignError] = useState('');
    const [isUnassigning, setIsUnassigning] = useState(false);

    const fetchProjectDetails = () => {
        setIsLoading(true);
        catchAsync(async () => {
            const res = await fetch(`${API_URL}/projects/${organizationId}/${teamId}/details/${projectId}`, {
                credentials: 'include',
            });

            const data = await res.json();

            if (data.status === 'success') {
                const project = data.data.project;
                setProjectData({
                    ...project,
                    project_members: project.project_members ?? [],
                    assigned_tasks: project.assigned_tasks ?? [],
                    tasks_created: project.tasks_created ?? [],
                });
                setIsLoading(false);
                return;
            }

            setError(data.message ?? 'Failed to load project details.');
            setIsLoading(false);
        })();
    };

    const fetchProjectAnnouncements = () => {
        catchAsync(async () => {
            const res = await fetch(`${API_URL}/announcements/${organizationId}/all?project_id=${projectID}`, {
                credentials: 'include',
            });

            const data = await res.json();

            if (data.status === 'success') {
                setAnnouncements(data.data.announcements ?? []);
                return;
            }

            setAnnouncements([]);
        })();
    };

    useEffect(() => {
        if (!organizationId || !teamId || !projectId) {
            setError('Invalid route parameters.');
            setIsLoading(false);
            return;
        }

        fetchProjectDetails();
        fetchProjectAnnouncements();
    }, [organizationId, teamId, projectId]);

    const handleCreateAnnouncement = () => {
        setAnnouncementError('');

        catchAsync(async () => {
            const res = await fetch(`${API_URL}/announcements/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    organization_id: organizationId,
                    project_id: projectId,
                    announcement: announcementText,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (data.status === 'success' || res.ok) {
                setAnnouncementText('');
                fetchProjectAnnouncements();
                return;
            }

            setAnnouncementError(data.message ?? 'Failed to create announcement.');
        })();
    };

    const handleRemoveAnnouncement = () => {
        setAnnouncementError('');

        catchAsync(async () => {
            const res = await fetch(`${API_URL}/announcements/remove`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    organization_id: organizationId,
                    project_id: projectId,
                    announcement_id: Number(announcementIdToRemove),
                }),
            });

            if (res.ok) {
                setAnnouncementIdToRemove('');
                fetchProjectAnnouncements();
                return;
            }

            const data = await res.json().catch(() => ({}));
            setAnnouncementError(data.message ?? 'Failed to remove announcement.');
        })();
    };

    const handleCreateTask = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTaskFormError('');
        setIsCreatingTask(true);

        catchAsync(async () => {
            const res = await fetch(`${API_URL}/tasks/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    organization_id: organizationId,
                    team_id: teamId,
                    project_id: projectId,
                    title: taskTitle,
                    description: taskDescription,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (data.status === 'success' || res.ok) {
                setTaskTitle('');
                setTaskDescription('');
                setIsCreatingTask(false);
                fetchProjectDetails();
                return;
            }

            setTaskFormError(data.message ?? 'Failed to create task.');
            setIsCreatingTask(false);
        })();
    };

    const handleAssignTask = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAssignError('');
        setIsAssigning(true);

        catchAsync(async () => {
            const res = await fetch(`${API_URL}/tasks/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    organization_id: organizationId,
                    team_id: teamId,
                    project_id: projectId,
                    task_id: Number(assignTaskId),
                    member_id: Number(assignMemberId),
                    due_date: assignDueDate,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (data.status === 'success' || res.ok) {
                setAssignTaskId('');
                setAssignMemberId('');
                setAssignDueDate('');
                setIsAssigning(false);
                fetchProjectDetails();
                return;
            }

            setAssignError(data.message ?? 'Failed to assign task.');
            setIsAssigning(false);
        })();
    };

    const handleUnassignTask = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUnassignError('');
        setIsUnassigning(true);

        catchAsync(async () => {
            const res = await fetch(`${API_URL}/tasks/unassign`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    organization_id: organizationId,
                    team_id: teamId,
                    project_id: projectId,
                    task_id: Number(unassignTaskId),
                    member_id: Number(unassignMemberId),
                }),
            });

            if (res.ok) {
                setUnassignTaskId('');
                setUnassignMemberId('');
                setIsUnassigning(false);
                fetchProjectDetails();
                return;
            }

            const data = await res.json().catch(() => ({}));
            setUnassignError(data.message ?? 'Failed to unassign task.');
            setIsUnassigning(false);
        })();
    };

    const handleDeleteTask = (taskId: number) => {
        catchAsync(async () => {
            const res = await fetch(`${API_URL}/tasks/remove`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    organization_id: organizationId,
                    team_id: teamId,
                    project_id: projectId,
                    task_id: taskId,
                }),
            });

            if (res.ok) {
                fetchProjectDetails();
            }
        })();
    };

    const project = projectData?.project_details?.[0];

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
                            to={`/dashboard/organization/manager/${organizationId}/teams/${teamId}`}
                            className="cursor-pointer mb-6 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>

                            Back to team
                        </Link>

                        <div className="mb-10">
                            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Project</p>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{project?.project_name}</h1>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{project?.description || 'No description'}</p>
                        </div>

                        <section className="mb-10 rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Announcements</h2>
                            {announcementError && (
                                <p className="mt-3 rounded-card border border-danger/20 bg-danger/10 px-4 py-2.5 text-sm text-danger">{announcementError}</p>
                            )}

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                <input
                                    type="text"
                                    placeholder="Write announcement"
                                    value={announcementText}
                                    onChange={(e) => setAnnouncementText(e.target.value)}
                                    className="w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                                />
                                <button type="button" onClick={handleCreateAnnouncement} className="button-property cursor-pointer rounded-card bg-primary px-4 py-2.5 text-sm font-semibold text-white">
                                    Create announcement
                                </button>
                            </div>

                            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                                <input
                                    type="number"
                                    placeholder="Announcement ID to remove"
                                    value={announcementIdToRemove}
                                    onChange={(e) => setAnnouncementIdToRemove(e.target.value)}
                                    className="w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                                />
                                <button type="button" onClick={handleRemoveAnnouncement} className="button-property cursor-pointer rounded-card border border-danger/30 px-4 py-2.5 text-sm font-semibold text-danger">
                                    Remove announcement
                                </button>
                            </div>

                            <div className="mt-4 space-y-2">
                                {announcements.length ? (
                                    announcements.map((item) => (
                                        <p key={item.announcement_id} className="text-sm text-slate-700 dark:text-slate-300">
                                            ID: {item.announcement_id} - Announcement: {item.announcement}
                                        </p>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 dark:text-slate-400">No announcements yet.</p>
                                )}
                            </div>
                        </section>

                        <div className="mb-10 grid gap-6 lg:grid-cols-2">
                            <form onSubmit={handleCreateTask} className="rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Create task</h2>
                                {taskFormError && (
                                    <p className="mt-3 rounded-card border border-danger/20 bg-danger/10 px-4 py-2.5 text-sm text-danger">{taskFormError}</p>
                                )}
                                <div className="mt-4 space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Task title"
                                        value={taskTitle}
                                        onChange={(e) => setTaskTitle(e.target.value)}
                                        className="w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                    />
                                    <textarea
                                        rows={3}
                                        placeholder="Task description"
                                        value={taskDescription}
                                        onChange={(e) => setTaskDescription(e.target.value)}
                                        className="w-full resize-none rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                    />
                                </div>
                                <button type="submit" disabled={isCreatingTask} className="button-property mt-4 cursor-pointer rounded-card bg-primary px-4 py-2.5 text-sm font-semibold text-white">
                                    {isCreatingTask ? 'Processing' : 'Create task'}
                                </button>
                            </form>

                            <form onSubmit={handleAssignTask} className="rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Assign task</h2>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                    Use a task ID from created tasks and a member ID from project members.
                                </p>
                                {assignError && (
                                    <p className="mt-3 rounded-card border border-danger/20 bg-danger/10 px-4 py-2.5 text-sm text-danger">{assignError}</p>
                                )}
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label htmlFor="assign-task-id" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Enter task ID
                                        </label>
                                        <input
                                            id="assign-task-id"
                                            type="number"
                                            placeholder="e.g. 12"
                                            value={assignTaskId}
                                            onChange={(e) => setAssignTaskId(e.target.value)}
                                            className="mt-1.5 w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="assign-member-id" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Enter member ID
                                        </label>
                                        <input
                                            id="assign-member-id"
                                            type="number"
                                            placeholder="e.g. 5"
                                            value={assignMemberId}
                                            onChange={(e) => setAssignMemberId(e.target.value)}
                                            className="mt-1.5 w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="assign-due-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Due date
                                        </label>
                                        <input
                                            id="assign-due-date"
                                            type="date"
                                            value={assignDueDate}
                                            onChange={(e) => setAssignDueDate(e.target.value)}
                                            className="mt-1.5 w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                        />
                                    </div>
                                </div>
                                <button type="submit" disabled={isAssigning} className="button-property mt-4 cursor-pointer rounded-card bg-primary px-4 py-2.5 text-sm font-semibold text-white">
                                    {isAssigning ? 'Processing' : 'Assign task'}
                                </button>
                            </form>
                        </div>

                        <section className="mb-10 rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Unassign task</h2>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                Remove an existing task assignment from a member.
                            </p>
                            {unassignError && (
                                <p className="mt-3 rounded-card border border-danger/20 bg-danger/10 px-4 py-2.5 text-sm text-danger">{unassignError}</p>
                            )}
                            <form onSubmit={handleUnassignTask} className="mt-4 space-y-4 md:max-w-xl">
                                <div>
                                    <label htmlFor="unassign-task-id" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Enter task ID
                                    </label>
                                    <input
                                        id="unassign-task-id"
                                        type="number"
                                        placeholder="e.g. 12"
                                        value={unassignTaskId}
                                        onChange={(e) => setUnassignTaskId(e.target.value)}
                                        className="mt-1.5 w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="unassign-member-id" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Enter member ID
                                    </label>
                                    <input
                                        id="unassign-member-id"
                                        type="number"
                                        placeholder="e.g. 5"
                                        value={unassignMemberId}
                                        onChange={(e) => setUnassignMemberId(e.target.value)}
                                        className="mt-1.5 w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                                    />
                                </div>
                                <button type="submit" disabled={isUnassigning} className="button-property cursor-pointer rounded-card border border-danger/30 px-4 py-2.5 text-sm font-semibold text-danger">
                                    {isUnassigning ? 'Processing' : 'Unassign task'}
                                </button>
                            </form>
                        </section>

                        <section className="mb-10 rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Project members</h2>
                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                {projectData?.project_members.length ? (
                                    projectData.project_members.map((member) => (
                                        <div key={member.user_id} className="rounded-card border border-slate-200 p-4 dark:border-slate-700">
                                            <p className="font-semibold text-slate-900 dark:text-slate-100">{member.user_name}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{member.user_email}</p>
                                            <p className="mt-1 text-xs text-black dark:text-white">ID: {member.user_id}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 sm:col-span-2">No members in project.</p>
                                )}
                            </div>
                        </section>

                        <section className="mb-10 rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Created tasks</h2>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                Use these task IDs when assigning tasks to members.
                            </p>
                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                {projectData?.tasks_created.length ? (
                                    projectData.tasks_created.map((task) => (
                                        <div key={task.task_id} className="rounded-card border border-slate-200 p-4 dark:border-slate-700">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                                                Task ID: {task.task_id}
                                            </p>
                                            <h3 className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{task.title}</h3>
                                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{task.description}</p>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteTask(task.task_id)}
                                                className="button-property mt-4 cursor-pointer rounded-card border border-danger/30 px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger/10"
                                            >
                                                Delete task
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 sm:col-span-2">No tasks created yet.</p>
                                )}
                            </div>
                        </section>

                        <section className="rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Assigned tasks history</h2>
                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="text-black dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                                            <th className="py-2 pr-4">Task ID</th>
                                            <th className="py-2 pr-4">Title</th>
                                            <th className="py-2 pr-4">Description</th>
                                            <th className="py-2">Member ID</th>
                                            <th className="py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projectData?.assigned_tasks.length ? (
                                            projectData.assigned_tasks.map((task, idx) => (
                                                <tr key={`${task.task_id}-${task.member_id}-${idx}`} className="border-b border-slate-100 dark:border-slate-800 text-black dark:text-slate-200">
                                                    <td className="py-2 pr-4">{task.task_id}</td>
                                                    <td className="py-2 pr-4">{task.title}</td>
                                                    <td className="py-2 pr-4">{task.description}</td>
                                                    <td className="py-2">{task.member_id}</td>
                                                    <td className="py-2">{task.status.toLowerCase()}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="py-2 text-slate-500 dark:text-slate-400" colSpan={4}>No assigned tasks found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </main>
    );
};

export default ManagerProjects;

