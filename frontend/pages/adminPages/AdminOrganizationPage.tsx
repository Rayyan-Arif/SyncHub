import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MemberCard from '../../components/adminComponents/MemberCard';
import TeamCard from '../../components/adminComponents/TeamCard';
import ProjectCard from '../../components/adminComponents/ProjectCard';
import { API_URL, catchAsync } from '../../utils/helper';
import type {
    OrganizationDetailForAdmin,
    OrganizationPerformance,
    Projects,
} from '../../utils/interfaces';

const ITEMS_PER_PAGE = 5;
const REPORT_ITEMS_PER_PAGE = 10;

const paginate = <T,>(items: T[], page: number, itemsPerPage: number = ITEMS_PER_PAGE) => {
    const start = page * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
};

const getTotalPages = (count: number, itemsPerPage: number = ITEMS_PER_PAGE) => Math.max(1, Math.ceil(count / itemsPerPage));

type PaginationControlsProps = {
    page: number;
    totalItems: number;
    itemsPerPage?: number;
    onBack: () => void;
    onNext: () => void;
};

const PaginationControls = ({ page, totalItems, itemsPerPage = ITEMS_PER_PAGE, onBack, onNext }: PaginationControlsProps) => {
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

const AdminOrganizationPage = () => {
    const { organization_id } = useParams();
    const organizationId = Number(organization_id);

    const [organization, setOrganization] = useState<OrganizationDetailForAdmin | null>(null);
    const [report, setReport] = useState<OrganizationPerformance | null>(null);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    const [memberEmails, setMemberEmails] = useState<string[]>(['']);
    const [memberRole, setMemberRole] = useState<'MEMBER' | 'MANAGER'>('MEMBER');

    const [membersPage, setMembersPage] = useState(0);
    const [teamsPage, setTeamsPage] = useState(0);
    const [projectsPage, setProjectsPage] = useState(0);
    const [reportMembersPage, setReportMembersPage] = useState(0);
    const [reportManagersPage, setReportManagersPage] = useState(0);
    const [reportView, setReportView] = useState<'member' | 'manager'>('member');

    const [memberSearch, setMemberSearch] = useState('');
    const [reportMemberSearch, setReportMemberSearch] = useState('');
    const [reportManagerSearch, setReportManagerSearch] = useState('');

    const fetchOrganization = () => {
        catchAsync(async () => {
            const res = await fetch(`${API_URL}/organizations/details/${organizationId}`, {
                credentials: 'include',
            });

            const data = await res.json();

            if (data.status === 'success') {
                setOrganization(data.data.organization);
                setIsLoading(false);
                return;
            }

            setError(data.message ?? 'Failed to load organization details.');
            setIsLoading(false);
        })();
    };

    useEffect(() => {
        if (!organizationId) {
            setError('Invalid organization.');
            setIsLoading(false);
            return;
        }

        fetchOrganization();
    }, [organizationId]);

    const allProjects: Projects[] = [];

    if (organization) {
        for (const team of organization.teams) {
            for (const project of team.projects) {
                allProjects.push(project);
            }
        }
    }

    const filteredMembers = (organization?.members ?? []).filter((member) => {
        const query = memberSearch.toLowerCase();
        return (
            member.user_name.toLowerCase().includes(query) ||
            member.user_email.toLowerCase().includes(query)
        );
    });

    const paginatedMembers = paginate(filteredMembers, membersPage);
    const paginatedTeams = paginate(organization?.teams ?? [], teamsPage);
    const paginatedProjects = paginate(allProjects, projectsPage);

    const reportMembers = (report?.members ?? []).filter((member) =>
        member.user_name.toLowerCase().includes(reportMemberSearch.toLowerCase())
    );
    const reportManagers = (report?.managers ?? []).filter((manager) =>
        manager.user_name.toLowerCase().includes(reportManagerSearch.toLowerCase())
    );
    const paginatedReportMembers = paginate(reportMembers, reportMembersPage, REPORT_ITEMS_PER_PAGE);
    const paginatedReportManagers = paginate(reportManagers, reportManagersPage, REPORT_ITEMS_PER_PAGE);

    const handleEmailChange = (index: number, value: string) => {
        setMemberEmails((prev) => prev.map((email, i) => (i === index ? value : email)));
    };

    const handleAddEmailField = () => {
        setMemberEmails((prev) => [...prev, '']);
    };

    const handleRemoveEmailField = (index: number) => {
        setMemberEmails((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddMember = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError('');

        const emails = memberEmails.map((email) => email.trim()).filter(Boolean);

        if (emails.length === 0) {
            setFormError('Please enter at least one email.');
            return;
        }

        setIsAddingMember(true);

        catchAsync(async () => {
            const res = await fetch(`${API_URL}/organizations/add-member/${organizationId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    user_emails: emails,
                    user_role: memberRole,
                }),
            });

            const data = await res.json();

            if (data.status === 'success') {
                setMemberEmails(['']);
                setMemberRole('MEMBER');
                setIsAddingMember(false);
                setMembersPage(0);
                fetchOrganization();
                return;
            }

            setFormError(data.message ?? 'Failed to add member.');
            setIsAddingMember(false);
        })();
    };

    const handleGenerateReport = () => {
        setIsGeneratingReport(true);

        catchAsync(async () => {
            const res = await fetch(`${API_URL}/organizations/performance/${organizationId}`, {
                credentials: 'include',
            });

            const data = await res.json();

            if (data.status === 'success') {
                const performance = data.data.performance;
                setReport(performance);
                setReportView(performance.members?.length ? 'member' : 'manager');
                setReportMembersPage(0);
                setReportManagersPage(0);
                setIsGeneratingReport(false);
                return;
            }

            setFormError(data.message ?? 'Failed to generate report.');
            setIsGeneratingReport(false);
        })();
    };

    return (
        <main className="bg-white px-6 py-12 dark:bg-slate-950 md:py-16">
            <div className="mx-auto max-w-6xl">
                {isLoading ? (
                    <p className="text-sm text-slate-600 dark:text-slate-400">Loading organization...</p>
                ) : error ? (
                    <p className="rounded-card border border-danger/20 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                        {error}
                    </p>
                ) : organization ? (
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
                        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-primary">Organization</p>
                                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                    {organization.organization_name}
                                </h1>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{organization.contact}</p>
                                {organization.description && (
                                    <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-500">
                                        {organization.description}
                                    </p>
                                )}
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

                        {formError && (
                            <p className="mb-6 rounded-card border border-danger/20 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                                {formError}
                            </p>
                        )}

                        {report && (
                            <section className="mb-10 rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Performance report</h2>
                                    <div className="flex rounded-card border border-slate-200 p-1 dark:border-slate-700">
                                        <button
                                            type="button"
                                            onClick={() => setReportView('member')}
                                            className={`button-property cursor-pointer rounded-card px-4 py-2 text-sm font-medium transition ${
                                                reportView === 'member'
                                                    ? 'bg-primary text-white'
                                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                                            }`}
                                        >
                                            Members
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setReportView('manager')}
                                            className={`button-property cursor-pointer rounded-card px-4 py-2 text-sm font-medium transition ${
                                                reportView === 'manager'
                                                    ? 'bg-primary text-white'
                                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                                            }`}
                                        >
                                            Managers
                                        </button>
                                    </div>
                                </div>

                                {reportView === 'member' && (
                                    <div className="mt-6">
                                        <input
                                            type="text"
                                            placeholder="Search member by name"
                                            value={reportMemberSearch}
                                            onChange={(e) => {
                                                setReportMemberSearch(e.target.value);
                                                setReportMembersPage(0);
                                            }}
                                            className="mb-4 w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 sm:max-w-xs"
                                        />
                                        {reportMembers.length > 0 ? (
                                            <>
                                                <div className="overflow-x-auto rounded-card border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                                                    <table className="w-full text-left text-sm">
                                                        <thead>
                                                            <tr className="border-b border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                                                                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Name</th>
                                                                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Teams</th>
                                                                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Projects</th>
                                                                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Tasks assigned</th>
                                                                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Tasks completed</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {paginatedReportMembers.map((member) => (
                                                                <tr key={member.user_id} className="border-b border-slate-200 last:border-b-0 dark:border-slate-700">
                                                                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{member.user_name}</td>
                                                                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{member.teams_joined}</td>
                                                                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{member.projects_joined}</td>
                                                                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{member.tasks_assigned}</td>
                                                                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{member.tasks_completed}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <PaginationControls
                                                    page={reportMembersPage}
                                                    totalItems={reportMembers.length}
                                                    itemsPerPage={REPORT_ITEMS_PER_PAGE}
                                                    onBack={() => setReportMembersPage((prev) => prev - 1)}
                                                    onNext={() => setReportMembersPage((prev) => prev + 1)}
                                                />
                                            </>
                                        ) : (
                                            <p className="text-sm text-slate-500 dark:text-slate-400">No matching members found.</p>
                                        )}
                                    </div>
                                )}

                                {reportView === 'manager' && (
                                    <div className="mt-6">
                                        <input
                                            type="text"
                                            placeholder="Search manager by name"
                                            value={reportManagerSearch}
                                            onChange={(e) => {
                                                setReportManagerSearch(e.target.value);
                                                setReportManagersPage(0);
                                            }}
                                            className="mb-4 w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 sm:max-w-xs"
                                        />
                                        {reportManagers.length > 0 ? (
                                            <>
                                                <div className="overflow-x-auto rounded-card border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                                                    <table className="w-full text-left text-sm">
                                                        <thead>
                                                            <tr className="border-b border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                                                                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Name</th>
                                                                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Teams created</th>
                                                                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Projects created</th>
                                                                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Projects completed</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {paginatedReportManagers.map((manager) => (
                                                                <tr key={manager.user_id} className="border-b border-slate-200 last:border-b-0 dark:border-slate-700">
                                                                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{manager.user_name}</td>
                                                                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{manager.teams_created}</td>
                                                                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{manager.projects_created}</td>
                                                                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{manager.projects_completed}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <PaginationControls
                                                    page={reportManagersPage}
                                                    totalItems={reportManagers.length}
                                                    itemsPerPage={REPORT_ITEMS_PER_PAGE}
                                                    onBack={() => setReportManagersPage((prev) => prev - 1)}
                                                    onNext={() => setReportManagersPage((prev) => prev + 1)}
                                                />
                                            </>
                                        ) : (
                                            <p className="text-sm text-slate-500 dark:text-slate-400">No matching managers found.</p>
                                        )}
                                    </div>
                                )}
                            </section>
                        )}

                        <div className="mb-10">
                            <form
                                onSubmit={handleAddMember}
                                className="max-w-xl rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                            >
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Add member</h2>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                    Invite one or more users by email to this organization. Note that role will be same for all users you add at the same time.
                                </p>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Emails
                                        </label>
                                        <div className="mt-1.5 space-y-2">
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
                                                            aria-label="Remove email"
                                                            className="button-property cursor-pointer rounded-card border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:border-danger/30 hover:text-danger dark:border-slate-700 dark:text-slate-400"
                                                        >
                                                            &times;
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddEmailField}
                                            className="mt-2 cursor-pointer text-sm font-medium text-primary transition hover:text-primary/80"
                                        >
                                            + Add another email
                                        </button>
                                    </div>
                                    <div>
                                        <label htmlFor="member-role" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Role
                                        </label>
                                        <select
                                            id="member-role"
                                            value={memberRole}
                                            onChange={(e) => setMemberRole(e.target.value as 'MEMBER' | 'MANAGER')}
                                            className="mt-1.5 w-full cursor-pointer rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                        >
                                            <option value="MEMBER">Member</option>
                                            <option value="MANAGER">Manager</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isAddingMember}
                                    className="button-property mt-4 cursor-pointer rounded-card bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:bg-primary/90"
                                >
                                    {isAddingMember ? 'Processing' : 'Add member'}
                                </button>
                            </form>
                        </div>

                        <div className="space-y-10">
                            <section>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Members</h2>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                    People in this organization.
                                </p>
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
                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    {paginatedMembers.length ? (
                                        paginatedMembers.map((member) => (
                                            <MemberCard
                                                key={`${member.user_id}-${member.user_role}`}
                                                member={member}
                                                organizationId={organizationId}
                                                onRemoved={fetchOrganization}
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
                                    onBack={() => setMembersPage((prev) => prev - 1)}
                                    onNext={() => setMembersPage((prev) => prev + 1)}
                                />
                            </section>

                            <section>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Teams</h2>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                    Teams in this organization.
                                </p>
                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    {paginatedTeams.length ? (
                                        paginatedTeams.map((team) => (
                                            <TeamCard key={team.team_id} team={team} />
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500 dark:text-slate-400 sm:col-span-2">
                                            No teams yet.
                                        </p>
                                    )}
                                </div>
                                <PaginationControls
                                    page={teamsPage}
                                    totalItems={organization.teams.length}
                                    onBack={() => setTeamsPage((prev) => prev - 1)}
                                    onNext={() => setTeamsPage((prev) => prev + 1)}
                                />
                            </section>

                            <section>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Projects</h2>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                    Projects across all teams.
                                </p>
                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    {paginatedProjects.length ? (
                                        paginatedProjects.map((project) => (
                                            <ProjectCard key={project.project_id} project={project} />
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500 dark:text-slate-400 sm:col-span-2">
                                            No projects yet.
                                        </p>
                                    )}
                                </div>
                                <PaginationControls
                                    page={projectsPage}
                                    totalItems={allProjects.length}
                                    onBack={() => setProjectsPage((prev) => prev - 1)}
                                    onNext={() => setProjectsPage((prev) => prev + 1)}
                                />
                            </section>
                        </div>
                    </>
                ) : null}
            </div>
        </main>
    );
};

export default AdminOrganizationPage;
