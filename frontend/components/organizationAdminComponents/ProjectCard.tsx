import { formatUserFriendlyDate } from '../../utils/helper';
import type { Projects } from '../../utils/interfaces';

const ProjectCard = ({ project }: { project: Projects }) => {
    return (
        <div className="rounded-card border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
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
        </div>
    );
};

export default ProjectCard;
