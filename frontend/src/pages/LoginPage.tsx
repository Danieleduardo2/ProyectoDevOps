import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

import { login } from "../api/auth";
import { getErrorMessage } from "../api/errorMessage";
import { useAuth } from "../auth/AuthContext";

export function LoginPage() {
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!email.trim() || !password.trim()) {
            setError("Email y contraseña son obligatorios.");
            return;
        }

        try {
            setLoading(true);
            const res = await login({ email: email.trim(), password });
            loginWithToken(res.token, res);
            navigate("/app", { replace: true });
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-bg" />
            <Card className="auth-card">
                <div className="auth-header">
                    <div className="auth-badge">Acceso</div>
                    <h2>Sistema de Gestión de Eventos</h2>
                    <p>Ingresa con tu cuenta para continuar.</p>
                </div>

                {error && (
                    <div className="auth-alert auth-alert-error">
                        <i className="pi pi-exclamation-circle" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={onSubmit} className="auth-form">
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <InputText
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="correo@dominio.com"
                            className="w-full auth-input"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="password">Contraseña</label>
                        <div className="auth-password">
                            <Password
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                feedback={false}
                                toggleMask
                                className="w-full"
                                inputClassName="w-full auth-input"
                                style={{ width: "100%" }}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        label={loading ? "Ingresando..." : "Ingresar"}
                        icon="pi pi-sign-in"
                        className="w-full auth-button"
                        loading={loading}
                    />
                </form>

                <div className="auth-links">
                    <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
                    <span>
                        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                    </span>
                </div>
            </Card>
        </div>
    );
}
