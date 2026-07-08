import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TeamMemberCard from './TeamMemberCard';
import ManagerProjectCard from './ManagerProjectCard';
import { API_URL, catchAsync } from '../../utils/helper';
import type { AnnouncementItem, TeamDetailsResponseForManager, TeamMemberPerformance } from '../../utils/interfaces';

const ITEMS_PER_PAGE = 10;
const paginate = <T,>(items: T[], page: number, itemsPerPage: number) => {
    const start = page * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
};

const getTotalPages = (count: number, itemsPerPage: number) => Math.max(1, Math.ceil(count / itemsPerPage));

type PaginationControlsProps = {
    page: number;
    totalItems: number;
    onBack: () => void;
    onNext: () => void;
    itemsPerPage: number;
};

const PaginationControls = ({ page, totalItems, onBack, onNext, itemsPerPage }: PaginationControlsProps) => {
    const totalPages = getTotalPages(totalItems, itemsPerPage);

    if (totalItems <= itemsPerPage) {
        return null;
    }

    return (
        <div className="mt-4 flex items-center justify-between">
            <button
                type="button"
                disabled={page === 0}
                onClick={onBack}
                className="button-property cursor-pointer rounded-card border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-primary/30 hover:text-primary disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-primary/50"
            >
                Back
            </button>
            <span className="text-sm text-slate-500 dark:text-slate-400">
                Page {page + 1} of {totalPages}
            </span>
            <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={onNext}
                className="button-property cursor-pointer rounded-card border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-primary/30 hover:text-primary disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-primary/50"
            >
                Next
            </button>
        </div>
    );
};

const ManagerTeam = () => {
    const { organization_id, teamID } = useParams();
    const organizationId = Number(organization_id);
    const teamId = Number(teamID);

    const [teamData, setTeamData] = useState<TeamDetailsResponseForManager | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [isAddingMembers, setIsAddingMembers] = useState(false);
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const [formError, setFormError] = useState('');
    const [projectFormError, setProjectFormError] = useState('');
    const [memberEmails, setMemberEmails] = useState<string[]>(['']);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectStartDate, setProjectStartDate] = useState('');
    const [projectTargetDate, setProjectTargetDate] = useState('');

    const [memberSearch, setMemberSearch] = useState('');
    const [membersPage, setMembersPage] = useState(0);

    const [report, setReport] = useState<TeamMemberPerformance[] | null>(null);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [reportError, setReportError] = useState('');
    const [reportSearch, setReportSearch] = useState('');
    const [reportPage, setReportPage] = useState(0);

    const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
    const [announcementText, setAnnouncementText] = useState('');
    const [announcementIdToRemove, setAnnouncementIdToRemove] = useState('');
    const [announcementError, setAnnouncementError] = useState('');

    const fetchTeamDetails = () => {
        setIsLoading(true);
        catchAsync(async () => {
            const res = await fetch(`${API_URL}/teams/${organizationId}/team/${teamId}`, {
                credentials: 'include',
            });

            const data = await res.json();

            if (data.status === 'success') {
                setTeamData(data.data);
                setIsLoading(false);
                return;
            }

            setError(data.message ?? 'Failed to load team details.');
            setIsLoading(false);
        })();
    };

    useEffect(() => {
        if (!organizationId || !teamId) {
            setError('Invalid route parameters.');
            setIsLoading(false);
            return;
        }

        fetchTeamDetails();
    }, [organizationId, teamId]);

    const fetchTeamAnnouncements = () => {
        catchAsync(async () => {
            const res = await fetch(`${API_URL}/announcements/all?team_id=${teamId}`, {
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
        if (!organizationId || !teamId) {
            return;
        }

        fetchTeamAnnouncements();
    }, [organizationId, teamId]);

    const handleEmailChange = (index: number, value: string) => {
        setMemberEmails((prev) => prev.map((email, i) => (i === index ? value : email)));
    };

    const handleAddEmailField = () => {
        setMemberEmails((prev) => [...prev, '']);
    };

    const handleRemoveEmailField = (index: number) => {
        setMemberEmails((prev) => prev.filter((_, i) => i !== index));
    };

    const capacityAvailable = Boolean(teamData) && (teamData!.team_details.team_members.length < teamData!.no_of_members);

    const handleAddMembersToTeam = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError('');

        const emails = memberEmails.map((email) => email.trim()).filter(Boolean);

        if (emails.length === 0) {
            setFormError('Please enter at least one email.');
            return;
        }

        setIsAddingMembers(true);

        catchAsync(async () => {
            const res = await fetch(`${API_URL}/teams/add-member`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    organization_id: organizationId,
                    team_id: teamId,
                    user_emails: emails,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (data.status === 'success' || res.ok) {
                setMemberEmails(['']);
                setIsAddingMembers(false);
                setMembersPage(0);
                fetchTeamDetails();
                return;
            }

            setFormError(data.message ?? 'Failed to add members.');
            setIsAddingMembers(false);
        })();
    };

    const handleCreateProject = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProjectFormError('');
        setIsCreatingProject(true);

        catchAsync(async () => {
            const res = await fetch(`${API_URL}/projects/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    organization_id: organizationId,
                    team_id: teamId,
                    project_name: projectName,
                    description: projectDescription,
                    start_date: projectStartDate,
                    target_completion_date: projectTargetDate,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (data.status === 'success' || res.ok) {
                setProjectName('');
                setProjectDescription('');
                setProjectStartDate('');
                setProjectTargetDate('');
                setIsCreatingProject(false);
                fetchTeamDetails();
                return;
            }

            setProjectFormError(data.message ?? 'Failed to create project.');
            setIsCreatingProject(false);
        })();
    };

    const handleCreateAnnouncement = () => {
        setAnnouncementError('');

        catchAsync(async () => {
            const res = await fetch(`${API_URL}/announcements/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    organization_id: organizationId,
                    team_id: teamId,
                    announcement: announcementText,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (data.status === 'success' || res.ok) {
                setAnnouncementText('');
                fetchTeamAnnouncements();
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
                    team_id: teamId,
                    announcement_id: Number(announcementIdToRemove),
                }),
            });

            if (res.ok) {
                setAnnouncementIdToRemove('');
                fetchTeamAnnouncements();
                return;
            }

            const data = await res.json().catch(() => ({}));
            setAnnouncementError(data.message ?? 'Failed to remove announcement.');
        })();
    };

    const filteredMembers = (teamData?.team_details.team_members ?? []).filter((member) => {
        const query = memberSearch.toLowerCase();
        return member.user_name.toLowerCase().includes(query) || member.user_email.toLowerCase().includes(query);
    });

    const paginatedMembers = paginate(filteredMembers, membersPage, ITEMS_PER_PAGE);

    const handleGenerateReport = () => {
        setIsGeneratingReport(true);
        setReportError('');

        catchAsync(async () => {
            const res = await fetch(`${API_URL}/tasks/performance/${organizationId}`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await res.json();

            if (data.status === 'success') {
                setReport(data.data.report);
                setReportPage(0);
                setIsGeneratingReport(false);
                return;
            }

            setReportError(data.message ?? 'Failed to generate report.');
            setIsGeneratingReport(false);
        })();
    };

    const teamMemberIds = (teamData?.team_details.team_members ?? []).map((m) => m.user_id);

    const filteredReport = (report ?? []).filter((row) => {
        const query = reportSearch.toLowerCase();
        const inThisTeam = teamMemberIds.includes(row.user_id);
        const matchesSearch = row.user_name.toLowerCase().includes(query) || row.user_email.toLowerCase().includes(query);
        return inThisTeam && matchesSearch;
    });

    const paginatedReport = paginate(filteredReport, reportPage, ITEMS_PER_PAGE);

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
                            className="cursor-pointer mb-6 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                            Back to dashboard
                        </Link>

                        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-primary">Team</p>
                                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                    {teamData?.team_name}
                                </h1>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                    Capacity: {teamData?.team_details.team_members.length ?? 0}/{teamData?.no_of_members ?? 0}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleGenerateReport}
                                disabled={isGeneratingReport}
                                className="button-property cursor-pointer rounded-card bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:bg-primary/90"
                            >
                                {isGeneratingReport ? 'Processing' : 'Generate report'}
                            </button>
                        </div>

                        {reportError && (
                            <p className="mb-6 rounded-card border border-danger/20 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                                {reportError}
                            </p>
                        )}

                        {report && (
                            <section className="mb-10 rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Member performance report</h2>

                                <input
                                    type="text"
                                    placeholder="Search report by name or email"
                                    value={reportSearch}
                                    onChange={(e) => {
                                        setReportSearch(e.target.value);
                                        setReportPage(0);
                                    }}
                                    className="mt-4 w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 sm:max-w-xs"
                                />

                                <div className="mt-4 overflow-x-auto rounded-card border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                                                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Name</th>
                                                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Tasks assigned</th>
                                                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">In progress</th>
                                                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Completed</th>
                                                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Missed</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedReport.map((row) => (
                                                <tr key={row.user_id} className="border-b border-slate-200 last:border-b-0 dark:border-slate-700">
                                                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200">
                                                        <div className="font-medium">{row.user_name}</div>
                                                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{row.user_email}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{row.tasks_assigned}</td>
                                                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{row.tasks_in_progress}</td>
                                                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{row.tasks_completed}</td>
                                                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{row.tasks_missed}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <PaginationControls
                                    page={reportPage}
                                    totalItems={filteredReport.length}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                    onBack={() => setReportPage((prev) => prev - 1)}
                                    onNext={() => setReportPage((prev) => prev + 1)}
                                />
                            </section>
                        )}

                        <section className="mb-10 rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Team announcements</h2>
                            {announcementError && (
                                <p className="mt-3 rounded-card border border-danger/20 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                                    {announcementError}
                                </p>
                            )}

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                <input
                                    type="text"
                                    placeholder="Write announcement"
                                    value={announcementText}
                                    onChange={(e) => setAnnouncementText(e.target.value)}
                                    className="w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                                />
                                <button
                                    type="button"
                                    onClick={handleCreateAnnouncement}
                                    className="button-property cursor-pointer rounded-card bg-primary px-4 py-2.5 text-sm font-semibold text-white"
                                >
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
                                <button
                                    type="button"
                                    onClick={handleRemoveAnnouncement}
                                    className="button-property cursor-pointer rounded-card border border-danger/30 px-4 py-2.5 text-sm font-semibold text-danger"
                                >
                                    Remove announcement
                                </button>
                            </div>

                            <div className="mt-4 space-y-2">
                                {announcements.length ? (
                                    announcements.map((item) => (
                                        <p key={item.announcement_id} className="text-sm text-slate-700 dark:text-slate-300">
                                            #{item.announcement_id} - {item.announcement}
                                        </p>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 dark:text-slate-400">No announcements yet.</p>
                                )}
                            </div>
                        </section>

                        <div className="space-y-10">
                            <section>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Projects</h2>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Projects under this team.</p>

                                <div className="mt-6 rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                                    <h3 className="text-md font-semibold text-slate-900 dark:text-slate-100">Create project</h3>

                                    {projectFormError && (
                                        <p className="mt-3 rounded-card border border-danger/20 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                                            {projectFormError}
                                        </p>
                                    )}

                                    <form onSubmit={handleCreateProject} className="mt-4 space-y-4">
                                        <div>
                                            <label htmlFor="project-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Project name
                                            </label>
                                            <input
                                                id="project-name"
                                                type="text"
                                                placeholder="Website revamp"
                                                value={projectName}
                                                onChange={(e) => setProjectName(e.target.value)}
                                                className="mt-1.5 w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="project-description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Description (Optional)
                                            </label>
                                            <textarea
                                                id="project-description"
                                                rows={3}
                                                placeholder="Project details"
                                                value={projectDescription}
                                                onChange={(e) => setProjectDescription(e.target.value)}
                                                className="mt-1.5 w-full resize-none rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                                            />
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="project-start-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Start date
                                                </label>
                                                <input
                                                    id="project-start-date"
                                                    type="date"
                                                    value={projectStartDate}
                                                    onChange={(e) => setProjectStartDate(e.target.value)}
                                                    className="mt-1.5 w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="project-target-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Target completion date
                                                </label>
                                                <input
                                                    id="project-target-date"
                                                    type="date"
                                                    value={projectTargetDate}
                                                    onChange={(e) => setProjectTargetDate(e.target.value)}
                                                    className="mt-1.5 w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isCreatingProject}
                                            className="button-property cursor-pointer rounded-card bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:bg-primary/90"
                                        >
                                            {isCreatingProject ? 'Processing' : 'Create project'}
                                        </button>
                                    </form>
                                </div>

                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    {(teamData?.team_details.projects ?? []).length ? (
                                        teamData!.team_details.projects.map((project) => (
                                            <ManagerProjectCard
                                                key={project.project_id}
                                                project={project}
                                                organizationId={organizationId}
                                                teamId={teamId}
                                                onDeleted={fetchTeamDetails}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500 dark:text-slate-400 sm:col-span-2">No projects yet.</p>
                                    )}
                                </div>
                            </section>

                            <section>
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Team members</h2>
                                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                            Remove members or add more emails (capacity-aware).
                                        </p>
                                    </div>

                                    {capacityAvailable && (
                                        <div className="w-full sm:w-auto" />
                                    )}
                                </div>

                                <input
                                    type="text"
                                    placeholder="Search member by name or email"
                                    value={memberSearch}
                                    onChange={(e) => {
                                        setMemberSearch(e.target.value);
                                        setMembersPage(0);
                                    }}
                                    className="mt-4 w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 sm:max-w-xs"
                                />

                                {capacityAvailable ? (
                                    <div className="mt-6 rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                                        <h3 className="text-md font-semibold text-slate-900 dark:text-slate-100">Add members</h3>
                                        {formError && (
                                            <p className="mt-3 rounded-card border border-danger/20 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                                                {formError}
                                            </p>
                                        )}

                                        <form onSubmit={handleAddMembersToTeam}>
                                            <div className="mt-4 space-y-4">
                                                {memberEmails.map((email, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <input
                                                            type="email"
                                                            placeholder="user@example.com"
                                                            value={email}
                                                            onChange={(e) => handleEmailChange(index, e.target.value)}
                                                            className="w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                                                        />
                                                        {memberEmails.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveEmailField(index)}
                                                                className="button-property cursor-pointer rounded-card border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-primary/30 hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                                            >
                                                                &times;
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className='w-full flex flex-col lg:flex-row items-center justify-between'>
                                                <button
                                                    type="button"
                                                    onClick={handleAddEmailField}
                                                    className="mt-3 cursor-pointer text-sm font-medium text-primary transition hover:text-primary/80"
                                                >
                                                    + Add another email
                                                </button>

                                                <button
                                                    type="submit"
                                                    disabled={isAddingMembers}
                                                    className="button-property mt-4 cursor-pointer rounded-card bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:bg-primary/90 disabled:opacity-50"
                                                >
                                                    {isAddingMembers ? 'Adding' : 'Add to team'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                                        Team capacity is full. You cannot add more members right now.
                                    </p>
                                )}

                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    {paginatedMembers.length ? (
                                        paginatedMembers.map((member) => (
                                            <TeamMemberCard
                                                key={member.user_id}
                                                member={member}
                                                organizationId={organizationId}
                                                teamId={teamId}
                                                onRemoved={fetchTeamDetails}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500 dark:text-slate-400 sm:col-span-2">
                                            {memberSearch ? 'No matching members found.' : 'No members yet.'}
                                        </p>
                                    )}
                                </div>

                                <PaginationControls
                                    page={membersPage}
                                    totalItems={filteredMembers.length}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                    onBack={() => setMembersPage((prev) => prev - 1)}
                                    onNext={() => setMembersPage((prev) => prev + 1)}
                                />
                            </section>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};

export default ManagerTeam;