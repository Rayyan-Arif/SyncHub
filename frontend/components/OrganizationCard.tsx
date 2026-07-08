import { Link } from 'react-router-dom';
import { API_URL, catchAsync } from '../utils/helper';

type OrganizationCardProps = {
    organizationID: number,
    organizationName: string;
    contact: string;
    description: string | null;
    badge: string;
    onDeleted?: () => void;
};

const OrganizationCard = ({ organizationID, organizationName, contact, description, badge, onDeleted }: OrganizationCardProps) => {
    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        catchAsync(async () => {
            const res = await fetch(`${API_URL}/organizations/delete/${organizationID}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.ok) {
                onDeleted?.();
            }
        })();
    };

    return (
        <Link
            to={`/dashboard/organization/${badge.toLowerCase()}/${organizationID}`}
            className="cursor-pointer block rounded-card border border-slate-200 bg-white p-5 shadow-sm transition hover:border-primary/30 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary/50"
        >
            <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {organizationName}
                </h3>
                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {badge}
                </span>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{contact}</p>
            <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-500">
                {description || 'No description'}
            </p>
            {onDeleted && (
                <button
                    type="button"
                    onClick={handleDelete}
                    className="button-property mt-4 cursor-pointer rounded-card border border-danger/30 px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger/10"
                >
                    Delete organization
                </button>
            )}
        </Link>
    );
};

export default OrganizationCard;
