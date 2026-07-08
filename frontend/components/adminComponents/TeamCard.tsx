import type { Teams } from '../../utils/interfaces';

const TeamCard = ({ team }: { team: Teams }) => {
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
        </div>
    );
};

export default TeamCard;
