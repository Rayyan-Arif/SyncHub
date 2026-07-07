import { API_URL, catchAsync } from '../../utils/helper';
import type { Members } from '../../utils/interfaces';

type MemberCardProps = {
    member: Members;
    organizationId: number;
    onRemoved: () => void;
};

const MemberCard = ({ member, organizationId, onRemoved }: MemberCardProps) => {
    const handleRemove = () => {
        catchAsync(async () => {
            const res = await fetch(`${API_URL}/organizations/remove-member/${organizationId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    user_id: member.user_id,
                    user_role: member.user_role,
                }),
            });

            if (res.ok) {
                onRemoved();
            }
        })();
    };

    return (
        <div className="rounded-card border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{member.user_name}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{member.user_email}</p>
                </div>
                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {member.user_role}
                </span>
            </div>
            <button
                type="button"
                onClick={handleRemove}
                className="button-property mt-4 cursor-pointer rounded-card border border-danger/30 px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger/10"
            >
                Remove from organization
            </button>
        </div>
    );
};

export default MemberCard;
