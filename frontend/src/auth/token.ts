const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export type StoredAuthUser = {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    roles: string[];
};

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getUser(): StoredAuthUser | null {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    try {
        return JSON.parse(stored) as StoredAuthUser;
    } catch {
        return null;
    }
}

export function setUser(user: StoredAuthUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

export function clearUser(): void {
    localStorage.removeItem(USER_KEY);
}
