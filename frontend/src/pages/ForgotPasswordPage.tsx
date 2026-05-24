import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import { forgotPassword } from "../api/auth";
import { getErrorMessage } from "../api/errorMessage";

export function ForgotPasswordPage() {
    const [email, setEmail] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!email.trim()) {
            setError("El email es obligatorio.");
            return;
        }

        try {
            setLoading(true);
            await forgotPassword(email.trim());
            setSuccess("Si el correo existe, recibirás instrucciones para recuperar tu contraseña.");
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
                    <div className="auth-badge">Recuperación</div>
                    <h2>Recuperar contraseña</h2>
                    <p>Ingresa tu correo para recibir ayuda con el acceso.</p>
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

                    <Button
                        type="submit"
                        label={loading ? "Enviando..." : "Enviar instrucciones"}
                        icon="pi pi-envelope"
                        className="w-full auth-button"
                        loading={loading}
                    />
                </form>

                <div className="auth-links">
                    <Link to="/login">Volver al login</Link>
                </div>
            </Card>
        </div>
    );
}
