import { Auth, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

export const useAuthState = (auth: Auth) => {
    const [user, setUser] = useState<null | User>(null);
   
    useEffect(() => {
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