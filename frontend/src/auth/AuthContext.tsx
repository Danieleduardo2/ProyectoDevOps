import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearToken, clearUser, getToken, getUser, setToken, setUser} from "./token";
import type { StoredAuthUser } from "./token";
import { getCurrentUser } from "../api/users";

type AuthContextValue = {
    isAuthenticated: boolean;
    token: string | null;
    user: StoredAuthUser | null;
    isAdmin: boolean;
    loginWithToken: (token: string, user: StoredAuthUser) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setTokenState] = useState<string | null>(() => getToken());
    const [user, setUserState] = useState<StoredAuthUser | null>(() => getUser());
    // @ts-ignore - isUserLoaded is declared but its value is never read
    const [isUserLoaded, setIsUserLoaded] = useState<boolean>(false);

   useEffect(() => {
    if (!token) {
        setIsUserLoaded(true);
        return;
    }

    getCurrentUser()
        .then((currentUser) => {
            setUser(currentUser);
            setUserState(currentUser);
        })
        .catch(() => {
            clearToken();
            clearUser();
            setTokenState(null);
            setUserState(null);
        })
        .finally(() => {
            setIsUserLoaded(true);
        });
}, [token]);

    const value = useMemo<AuthContextValue>(() => {
        return {
            isAuthenticated: !!token,
            token,
            user,
            isAdmin: !!user && Array.isArray(user.roles) && user.roles.includes("ROLE_ADMIN"),
            loginWithToken: (t: string, u: StoredAuthUser) => {
                setToken(t);
                setUser(u);
                setTokenState(t);
                setUserState(u);
            },
            logout: () => {
                clearToken();
                clearUser();
                setTokenState(null);
                setUserState(null);
            },
        };
    }, [token, user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    return ctx;
}
