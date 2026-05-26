import { http } from "./http";

export type LoginRequest = { email: string; password: string };
export type LoginResponse = { token: string };

export type RegisterRequest = {
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    password: string;
};

export async function login(req: LoginRequest): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>("/api/auth/login", req);
    return data;
}

export async function register(req: RegisterRequest): Promise<void> {
    await http.post("/api/users/register", req);
}

export async function forgotPassword(email: string): Promise<void> {
    await http.post("/api/password/forgot", { email });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
    await http.post("/api/password/reset", { token, newPassword });
}
