import { Auth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export const useAuthState = (auth: Auth) => {
    const [user, setUser] = useState<null | any>(null);
   
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