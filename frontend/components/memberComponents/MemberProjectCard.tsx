import { Link } from 'react-router-dom';
import { formatUserFriendlyDate } from '../../utils/helper';
import type { Projects } from '../../utils/interfaces';

const MemberProjectCard = ({ project }: { project: Projects }) => {
    return (
        <Link
            to={`projects/${project.project_id}`}
            className="cursor-pointer block rounded-card border border-slate-200 bg-white p-4 shadow-sm transition hover:border-primary/30 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary/50"
        >
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
        </Link>
    );
};

export default MemberProjectCard;
