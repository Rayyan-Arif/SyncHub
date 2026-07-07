import { API_URL, catchAsync } from '../../utils/helper';
import type { Teams } from '../../utils/interfaces';

type TeamCardProps = {
    team: Teams;
    organizationId: number;
    onDeleted: () => void;
};

const TeamCard = ({ team, organizationId, onDeleted }: TeamCardProps) => {
    const handleDelete = () => {
        catchAsync(async () => {
            const res = await fetch(`${API_URL}/teams/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    organization_id: organizationId,
                    team_id: team.team_id,
                }),
            });

            if (res.ok) {
                onDeleted();
            }
        })();
    };

    return (
        <div className="rounded-card border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{team.team_name}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        Max members: {team.no_of_members}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
                        {team.projects.length} project{team.projects.length === 1 ? '' : 's'}
                    </p>
                </div>
            </div>
            <button
                type="button"
                onClick={handleDelete}
                className="button-property mt-4 cursor-pointer rounded-card border border-danger/30 px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger/10"
            >
                Delete team
            </button>
        </div>
    );
};

export default TeamCard;
