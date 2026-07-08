import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import OrganizationCard from '../../components/OrganizationCard';
import { API_URL, catchAsync } from '../../utils/helper';
import type { AuthContext, UserOrganizations } from '../../utils/interfaces';

const UserDashboardPage = () => {
    const { user } = useOutletContext<AuthContext>();

    const [organizations, setOrganizations] = useState<UserOrganizations | null>(null);
    const [organizationName, setOrganizationName] = useState('');
    const [contact, setContact] = useState('');
    const [description, setDescription] = useState('');
    const [fetchError, setFetchError] = useState('');
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchOrganizations = () => {
        catchAsync(async () => {
            const res = await fetch(`${API_URL}/organizations/all`, {
                credentials: 'include',
            });

            const data = await res.json();

            if (data.status === 'success') {
                setOrganizations(data.data.organizations);
                setIsLoading(false);
                return;
            }

            setFetchError(data.message ?? 'Failed to load organizations.');
            setIsLoading(false);
        })();
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const handleCreateOrganization = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError('');
        setIsProcessing(true);

        catchAsync(async () => {
            const res = await fetch(`${API_URL}/organizations/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    organization_name: organizationName,
                    contact,
                    description,
                }),
            });

            const data = await res.json();

            if (data.status === 'success') {
                setOrganizationName('');
                setContact('');
                setDescription('');
                setIsProcessing(false);
                fetchOrganizations();
                return;
            }

            setFormError(data.message ?? 'Failed to create organization.');
            setIsProcessing(false);
        })();
    };

    return (
        <main className="bg-white px-6 py-12 dark:bg-slate-950 md:py-16">
            <div className="mx-auto max-w-6xl">
                <div className="mb-10">
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary">Dashboard</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Welcome back, {user?.user_name}
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Manage your organizations and create new ones.
                    </p>
                </div>

                <div className="grid gap-10 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        {fetchError && (
                            <p className="mb-6 rounded-card border border-danger/20 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                                {fetchError}
                            </p>
                        )}

                        {isLoading ? (
                            <p className="text-sm text-slate-600 dark:text-slate-400">Loading organizations...</p>
                        ) : (
                            <div className="space-y-10">
                                <section>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                        Organizations you created
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        Organizations you created and manage.
                                    </p>
                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        {organizations?.admin_of_organizations.length ? (
                                            organizations.admin_of_organizations.map((org) => (
                                                <OrganizationCard
                                                    key={org.organization_id}
                                                    organizationID={org.organization_id}
                                                    organizationName={org.organization_name}
                                                    contact={org.contact}
                                                    description={org.description}
                                                    badge="Admin"
                                                    onDeleted={fetchOrganizations}
                                                />
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-500 dark:text-slate-400 sm:col-span-2">
                                                You are not an admin of any organization yet.
                                            </p>
                                        )}
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                        Organizations you&apos;re a member of
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        Organizations you have been added to.
                                    </p>
                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        {organizations?.member_of_organizations.length ? (
                                            organizations.member_of_organizations.map((org) => (
                                                <OrganizationCard
                                                    key={`${org.organization_id}-${org.role_in_organization}`}
                                                    organizationID={org.organization_id}
                                                    organizationName={org.organization_name}
                                                    contact={org.contact}
                                                    description={org.description}
                                                    badge={org.role_in_organization}
                                                />
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-500 dark:text-slate-400 sm:col-span-2">
                                                You are not a member of any organization yet.
                                            </p>
                                        )}
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="rounded-card border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                Create organization
                            </h2>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                Set up a new organization for your team.
                            </p>

                            <form className="mt-6 space-y-4" onSubmit={handleCreateOrganization}>
                                {formError && (
                                    <p className="rounded-card border border-danger/20 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                                        {formError}
                                    </p>
                                )}

                                <div>
                                    <label
                                        htmlFor="organization-name"
                                        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        Organization name
                                    </label>
                                    <input
                                        id="organization-name"
                                        name="organization-name"
                                        type="text"
                                        placeholder="Acme Organization"
                                        value={organizationName}
                                        onChange={(e) => setOrganizationName(e.target.value)}
                                        className="mt-1.5 w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-primary"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="contact"
                                        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        Contact
                                    </label>
                                    <input
                                        id="contact"
                                        name="contact"
                                        type="text"
                                        maxLength={13}
                                        placeholder="03001234567"
                                        value={contact}
                                        onChange={(e) => setContact(e.target.value)}
                                        className="mt-1.5 w-full rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-primary"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        placeholder="What does your organization do?"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="mt-1.5 w-full resize-none rounded-card border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-primary"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="button-property w-full rounded-card bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:bg-primary/90"
                                >
                                    {isProcessing ? 'Processing' : 'Create organization'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default UserDashboardPage;
