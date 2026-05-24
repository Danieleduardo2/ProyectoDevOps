import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

import { register } from "../api/auth";
import { getErrorMessage } from "../api/errorMessage";

export function RegisterPage() {
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    function validate(): string | null {
        if (!nombre.trim()) return "El nombre es obligatorio.";
        if (!apellido.trim()) return "El apellido es obligatorio.";
        if (!telefono.trim()) return "El teléfono es obligatorio.";
        if (!email.trim()) return "El email es obligatorio.";
        if (!password.trim()) return "La contraseña es obligatoria.";

        const phoneOk = /^[+]?[0-9]{10}$/.test(telefono.trim());
        if (!phoneOk) return "El teléfono debe contener 10 dígitos (puede iniciar con +).";

        if (password.length < 8) return "La contraseña debe tener mínimo 8 caracteres.";

        return null;
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            await register({
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                telefono: telefono.trim(),
                email: email.trim(),
                password,
            });

            navigate("/login", { replace: true });
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-bg" />
            <Card className="auth-card auth-card-register">
                <div className="auth-header">
                    <div className="auth-badge">Registro</div>
                    <h2>Crear cuenta</h2>
                    <p>Regístrate para acceder al Sistema de Gestión de Eventos.</p>
                </div>

                {error && (
                    <div className="auth-alert auth-alert-error">
                        <i className="pi pi-exclamation-circle" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={onSubmit} className="auth-form">
                    <div className="auth-grid">
                        <div className="field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText
                                id="nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Tu nombre"
                                className="w-full auth-input"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="apellido">Apellido</label>
                            <InputText
                                id="apellido"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                                placeholder="Tu apellido"
                                className="w-full auth-input"
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="telefono">Teléfono</label>
                        <InputText
                            id="telefono"
                            type="tel"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            placeholder="Ej: 3001234567"
                            className="w-full auth-input"
                        />
                    </div>

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
                                placeholder="Mínimo 8 caracteres"
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
                        label={loading ? "Registrando..." : "Crear cuenta"}
                        icon="pi pi-user-plus"
                        className="w-full auth-button"
                        loading={loading}
                    />
                </form>

                <div className="auth-links">
                    <span>
                        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                    </span>
                </div>
            </Card>
        </div>
    );
}
