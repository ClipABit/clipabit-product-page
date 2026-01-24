import { Auth, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

export const useAuthState = (auth: Auth | undefined) => {
    const [user, setUser] = useState<undefined | null | User>(undefined);

    useEffect(() => {
        // Don't attempt to use auth if it's not initialized (SSR)
        if (!auth) {
            setUser(null);
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