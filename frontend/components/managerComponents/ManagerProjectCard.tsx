import { Link } from 'react-router-dom';
import { API_URL, catchAsync, formatUserFriendlyDate } from '../../utils/helper';
import type { Projects } from '../../utils/interfaces';

type ManagerProjectCardProps = {
    project: Projects;
    organizationId: number;
    teamId: number;
    onDeleted: () => void;
};

const ManagerProjectCard = ({ project, organizationId, teamId, onDeleted }: ManagerProjectCardProps) => {
    const handleDelete = () => {
        catchAsync(async () => {
            const res = await fetch(`${API_URL}/projects/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    organization_id: organizationId,
                    team_id: teamId,
                    project_id: project.project_id,
                }),
            });

            if (res.ok) {
                onDeleted();
            }
        })();
    };

    return (
        <button type='button' className="text-left rounded-card border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{project.project_name}</h3>
                </div>
                <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        project.status === 'COMPLETED'
                            ? 'bg-success/10 text-success'
                            : 'bg-primary/10 text-primary'
                    }`}
                >
                    {project.status}
                </span>
            </div>
            {project.description && (
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">{project.description}</p>
            )}
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {formatUserFriendlyDate(project.start_date)} → {formatUserFriendlyDate(project.target_completion_date)}
            </p>
            <div className='flex flex-col md:flex-row w-full items-center justify-between'>
                <button
                    type="button"
                    onClick={handleDelete}
                    className="button-property mt-4 cursor-pointer rounded-card border border-danger/30 px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger/10"
                >
                    Delete project
                </button>
                <Link
                    to={`projects/${project.project_id}`}
                    className="button-property mt-4 cursor-pointer rounded-card border border-success/30 px-3 py-1.5 text-xs font-semibold text-success transition hover:bg-success/10"
                >
                    View Project
                </Link>
            </div>
        </button>
    );
};

export default ManagerProjectCard;

