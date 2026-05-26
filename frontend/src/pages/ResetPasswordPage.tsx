import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/auth";
import { getErrorMessage } from "../api/errorMessage";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export function ResetPasswordPage() {
    const navigate = useNavigate();
    const query = useQuery();
    const token = useMemo(() => query.get("token") ?? "", [query]);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!token) {
            setError("Falta el token de recuperación en la URL.");
            return;
        }

        if (!password.trim() || !confirmPassword.trim()) {
            setError("La contraseña y la confirmación son obligatorias.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (password.length < 8) {
            setError("La contraseña debe tener mínimo 8 caracteres.");
            return;
        }

        try {
            setLoading(true);
            await resetPassword(token, password);
            setSuccess("Contraseña actualizada correctamente. Ya puedes iniciar sesión.");
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-bg" />
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-badge">Restablecer contraseña</div>
                    <h2>Nueva contraseña</h2>
                    <p>Ingresa tu nueva contraseña para completar la recuperación.</p>
                </div>

                {error && (
                    <div className="auth-alert auth-alert-error">
                        <i className="pi pi-exclamation-circle" />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="auth-alert auth-alert-success">
                        <i className="pi pi-check-circle" />
                        <span>{success}</span>
                    </div>
                )}

                <form onSubmit={onSubmit} className="auth-form">
                    <div className="field">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nueva contraseña"
                            className="w-full auth-input"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="confirmPassword">Confirmar contraseña</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repite la contraseña"
                            className="w-full auth-input"
                        />
                    </div>

                    <button type="submit" className="w-full auth-button" disabled={loading}>
                        {loading ? "Guardando..." : "Cambiar contraseña"}
                    </button>
                </form>

                <div className="auth-links">
                    <button onClick={() => navigate("/login")} className="link-button">
                        Volver al login
                    </button>
                </div>
            </div>
        </div>
    );
}
