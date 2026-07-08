import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TeamCard from '../../components/memberComponents/TeamCard';
import { API_URL, catchAsync } from '../../utils/helper';
import type { MemberTeam } from '../../utils/interfaces';

const UserOrganizationPage = () => {
    const { userRole, organization_id } = useParams();
    const organizationId = Number(organization_id);
    const isManager = userRole === 'manager';

    const [teams, setTeams] = useState<MemberTeam[]>([]);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingTeam, setIsCreatingTeam] = useState(false);

    const [teamName, setTeamName] = useState('');
    const [noOfMembers, setNoOfMembers] = useState('');

    const fetchTeams = () => {
        catchAsync(async () => {
            const url = isManager
                ? `${API_URL}/teams/all/${organizationId}`
                : `${API_URL}/organizations/teams/${organizationId}`;

            const res = await fetch(url, {
                credentials: 'include',
            });

            const data = await res.json();

            if (data.status === 'success') {
                setTeams(isManager ? data.data.teams : data.data.teams.teams_joined);
                setIsLoading(false);
                return;
            }

            setError(data.message ?? 'Failed to load teams.');
            setIsLoading(false);
        })();
    };

    useEffect(() => {
        if (!organizationId) {
            setError('Invalid organization.');
            setIsLoading(false);
            return;
        }

        fetchTeams();
    }, [organizationId]);

    const handleCreateTeam = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError('');
        setIsCreatingTeam(true);

        catchAsync(async () => {
            const res = await fetch(`${API_URL}/teams/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    organization_id: organizationId,
                    team_name: teamName,
                    no_of_members: Number(noOfMembers),
                }),
            });

            const data = await res.json();

            if (data.status === 'success') {
                setTeamName('');
                setNoOfMembers('');
                setIsCreatingTeam(false);
                fetchTeams();
                return;
            }

            setFormError(data.message ?? 'Failed to create team.');
            setIsCreatingTeam(false);
        })();
    };

    return (
        <main className="min-h-screen bg-white px-6 py-12 dark:bg-slate-950 md:py-16">
            <div className="mx-auto max-w-6xl">
                {isLoading ? (
                    <p className="text-sm text-slate-600 dark:text-slate-400">Loading teams...</p>
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
                            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Teams</p>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Your teams
                            </h1>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                {isManager
                                    ? 'Teams you manage in this organization.'
                                    : 'Teams you are part of in this organization.'}
                            </p>
                        </div>

                        {isManager && (
                            <div className="mb-10">
                                <form
                                    onSubmit={handleCreateTeam}
                                    className="max-w-xl rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                                >
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Create team</h2>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        Add a new team to this organization.
                                    </p>

                                    {formError && (
                                        <p className="mt-4 rounded-card border border-danger/20 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                                            {formError}
                                        </p>
                                    )}

                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label htmlFor="team-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Team name
                                            </label>
                                            <input
                                                id="team-name"
                                                type="text"
                                                placeholder="Design team"
                                                value={teamName}
                                                onChange={(e) => setTeamName(e.target.value)}
                                                className="mt-1.5 w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="no-of-members" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Max members
                                            </label>
                                            <input
                                                id="no-of-members"
                                                type="number"
                                                min={1}
                                                max={10}
                                                placeholder="5"
                                                value={noOfMembers}
                                                onWheel={(e) => e.currentTarget.blur()}
                                                onChange={(e) => setNoOfMembers(e.target.value)}
                                                className="mt-1.5 w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isCreatingTeam}
                                        className="button-property mt-4 cursor-pointer rounded-card bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:bg-primary/90"
                                    >
                                        {isCreatingTeam ? 'Processing' : 'Create team'}
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="space-y-10">
                            {isManager && (
                                <section>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Teams you manage</h2>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        Teams you created as a manager.
                                    </p>
                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        {teams.length ? (
                                            teams.map((team) => (
                                                <TeamCard
                                                    key={team.team_id}
                                                    team={team}
                                                    organizationId={organizationId}
                                                    onDeleted={fetchTeams}
                                                />
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-500 dark:text-slate-400 sm:col-span-2">
                                                You do not manage any teams yet.
                                            </p>
                                        )}
                                    </div>
                                </section>
                            )}

                            {!isManager && (
                                <section>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Teams you&apos;re in</h2>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        Teams you have been added to as a member.
                                    </p>
                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        {teams.length ? (
                                            teams.map((team) => (
                                                <TeamCard key={team.team_id} team={team} />
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-500 dark:text-slate-400 sm:col-span-2">
                                                You are not part of any team yet.
                                            </p>
                                        )}
                                    </div>
                                </section>
                            )}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};

export default UserOrganizationPage;
