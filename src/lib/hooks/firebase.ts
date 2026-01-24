import { Auth, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

export const useAuthState = (auth: Auth | undefined) => {
    // Initialize with null if auth is not available (SSR), otherwise undefined (loading)
    const [user, setUser] = useState<undefined | null | User>(() => auth ? undefined : null);

    useEffect(() => {
        // Don't attempt to use auth if it's not initialized (SSR)
        if (!auth) {
            return;
        }

        const listener = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
            } else {
                setUser(null);
            }
        });
        return () => listener();
    }, [auth])

    return user;
};