const Footer = () => {
    return (
        <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
            <div
                className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-10 px-6 py-4 sm:flex-row"
            >
                <div className="flex items-center gap-2.5">
                <span
                    className="flex h-8 w-8 items-center justify-center rounded-card bg-primary text-xs font-bold text-white"
                >
                    S
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">SyncHub</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">© 2026 SyncHub. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer