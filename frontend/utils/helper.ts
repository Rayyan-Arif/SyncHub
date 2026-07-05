export const API_URL = import.meta.env.VITE_API_URL;

export const scrollToComponent = (id: string) => {
    document.getElementById(id)?.scrollIntoView({behavior: 'smooth'});
};

export const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return name.trim().slice(0, 2).toUpperCase();
};

export const navigateByRole = (navigate: (path: string) => void, userRole: string) => {
    if (userRole === 'OWNER') {
        navigate('/owner/stats');
        return;
    }

    navigate('/dashboard');
};

export const catchAsync = <T>(func: () => Promise<T>) => {
    return async () => {
        try {
            return await func();
        } catch (err) {
            console.log(err);
            return err;
        }
    };
};

export const getUserLoader = catchAsync(async () => {
    const res = await fetch(`${API_URL}/users/me`, {
        credentials: 'include',
    });

    const data = await res.json();

    return data;
});

export const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}