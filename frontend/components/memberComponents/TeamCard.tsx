import { Link } from 'react-router-dom';
import { API_URL, catchAsync } from '../../utils/helper';
import type { MemberTeam } from '../../utils/interfaces';

type TeamCardProps = {
    team: MemberTeam;
    organizationId?: number;
    onDeleted?: () => void;
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
                onDeleted?.();
            }
        })();
    };

    return (
        <Link to={`teams/${team.team_id}`} className="cursor-pointer rounded-card border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{team.team_name}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Max members: {team.no_of_members}
            </p>
            {onDeleted && (
                <button
                    type="button"
                    onClick={handleDelete}
                    className="button-property mt-4 cursor-pointer rounded-card border border-danger/30 px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger/10"
                >
                    Delete team
                </button>
            )}
        </Link>
    );
};

export default TeamCard;
