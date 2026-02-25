"use client";

import { useEffect, useState, ReactNode } from "react";

export function ClientOnly({ children }: { children: ReactNode }) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        // Render nothing or a consistent shell during SSR
        return null;
    }

    return <>{children}</>;
}
