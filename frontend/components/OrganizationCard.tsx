import { Link } from 'react-router-dom';

type OrganizationCardProps = {
    organizationID: number,
    organizationName: string;
    contact: string;
    description: string | null;
    badge: string;
};

const OrganizationCard = ({ organizationID, organizationName, contact, description, badge }: OrganizationCardProps) => {
    return (
        <Link
            to={`/organization/admin/${organizationID}`}
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
        </Link>
    );
};

export default OrganizationCard;
