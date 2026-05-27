import { useEffect, useMemo, useState } from "react";
import {
  createUser,
  deleteUser,
  deactivateUser,
  activateUser,
  getUsers,
  type User,
} from "../api/users";
import { getErrorMessage } from "../api/errorMessage";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

const P = {
  bgFrom: "#0d1b2e",
  bgMid: "#0f2240",
  bgTo: "#091528",

  surface: "#162035",
  surfaceHover: "#1c2a45",

  border: "rgba(99,149,210,0.18)",
  borderMid: "rgba(99,149,210,0.3)",

  accent: "#2563eb",
  accentHover: "#1d4ed8",
  accentLight: "#93c5fd",
  accentSoft: "rgba(37,99,235,0.12)",

  text: "#f0f6ff",
  textMuted: "rgba(200,220,255,0.55)",

  green: "#4ade80",
  greenSoft: "rgba(74,222,128,0.12)",

  red: "#f87171",
  redSoft: "rgba(248,113,113,0.12)",

  yellow: "#facc15",
};

export function UsersAdminPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [data, setData] = useState<{
    users: User[];
    totalPages: number;
    totalElements: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [newNombre, setNewNombre] = useState("");
  const [newApellido, setNewApellido] = useState("");
  const [newTelefono, setNewTelefono] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [creating, setCreating] = useState(false);

  async function load() {
    setError(null);

    try {
      setLoading(true);

      const res = await getUsers({
        page,
        size,
        nombre: nombre.trim() || undefined,
        apellido: apellido.trim() || undefined,
      });

      setData({
        users: res.content,
        totalPages: res.totalPages,
        totalElements: res.totalElements,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page, size]);

  async function applyTextFilters() {
    setPage(0);

    try {
      setLoading(true);

      const res = await getUsers({
        page: 0,
        size,
        nombre: nombre.trim() || undefined,
        apellido: apellido.trim() || undefined,
      });

      setData({
        users: res.content,
        totalPages: res.totalPages,
        totalElements: res.totalElements,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = useMemo(() => {
    if (!data) return [];

    if (statusFilter === "ALL") return data.users;

    if (statusFilter === "ACTIVE") {
      return data.users.filter((u) => u.activo);
    }

    return data.users.filter((u) => !u.activo);
  }, [data, statusFilter]);

  function validateCreate(): string | null {
    if (!newNombre.trim()) return "Nombre obligatorio.";
    if (!newApellido.trim()) return "Apellido obligatorio.";
    if (!newTelefono.trim()) return "Teléfono obligatorio.";
    if (!newEmail.trim()) return "Email obligatorio.";
    if (!newPassword.trim()) return "Password obligatorio.";

    if (!/^[+]?[0-9]{10}$/.test(newTelefono.trim())) {
      return "El teléfono debe contener 10 dígitos.";
    }

    if (newPassword.length < 8) {
      return "La contraseña debe tener mínimo 8 caracteres.";
    }

    return null;
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    const v = validateCreate();

    if (v) {
      setError(v);
      return;
    }

    try {
      setCreating(true);

      await createUser({
        nombre: newNombre.trim(),
        apellido: newApellido.trim(),
        telefono: newTelefono.trim(),
        email: newEmail.trim(),
        password: newPassword,
      });

      setSuccess("Usuario creado correctamente.");

      setNewNombre("");
      setNewApellido("");
      setNewTelefono("");
      setNewEmail("");
      setNewPassword("");

      setPage(0);

      await applyTextFilters();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  async function onDelete(u: User) {
    const ok = window.confirm(
      `¿Eliminar a ${u.nombre} ${u.apellido}?`
    );

    if (!ok) return;

    try {
      await deleteUser(u.id);

      setSuccess("Usuario eliminado.");
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function onToggleActive(u: User) {
    try {
      if (u.activo) {
        await deactivateUser(u.id);
        setSuccess("Usuario desactivado.");
      } else {
        await activateUser(u.id);
        setSuccess("Usuario activado.");
      }

      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(
          ellipse 80% 60% at 50% -10%,
          #1a3a6e 0%,
          ${P.bgMid} 45%,
          ${P.bgTo} 100%
        )`,
        color: P.text,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          width: "100%",
          borderBottom: `1px solid ${P.border}`,
          background: "rgba(9,21,40,0.72)",
          backdropFilter: "blur(16px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "1rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background:
                  "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 25px rgba(37,99,235,0.35)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M7 1.5L12 4.5v5L7 12.5 2 9.5v-5L7 1.5z"
                  stroke="white"
                  strokeWidth="1.2"
                  fill="none"
                  strokeLinejoin="round"
                />
                <circle cx="7" cy="7" r="1.5" fill="white" />
              </svg>
            </div>

            <div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                }}
              >
                Sistema de Eventos
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: P.textMuted,
                }}
              >
                Panel administrativo
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/app")}
              style={btnSecondary}
            >
              Inicio
            </button>

            <button
              onClick={() => navigate("/user")}
              style={btnSecondary}
            >
              Mi perfil
            </button>

            {isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                style={btnSecondary}
              >
                Admin
              </button>
            )}
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <main
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "2.5rem 1.5rem 4rem",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1150px",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* HERO */}
          <section
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                width: "fit-content",
                gap: "6px",
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: P.accentLight,
                background: P.accentSoft,
                border: `1px solid ${P.borderMid}`,
                borderRadius: "999px",
                padding: "6px 14px",
              }}
            >
              ● Administración
            </div>

            <h1
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.3rem)",
                lineHeight: 1.1,
                margin: 0,
                letterSpacing: "-0.04em",
              }}
            >
              Gestión de usuarios
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: "700px",
                color: P.textMuted,
                lineHeight: 1.8,
                fontSize: "15px",
              }}
            >
              Administra usuarios del sistema, activa o
              desactiva cuentas y crea nuevos accesos con una
              interfaz moderna y organizada.
            </p>
          </section>

          {/* ALERTAS */}
          {error && (
            <div
              style={{
                background: P.redSoft,
                border: `1px solid ${P.red}55`,
                color: P.red,
                padding: "15px 18px",
                borderRadius: "14px",
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                background: P.greenSoft,
                border: `1px solid ${P.green}55`,
                color: P.green,
                padding: "15px 18px",
                borderRadius: "14px",
                fontWeight: 500,
              }}
            >
              {success}
            </div>
          )}

          {/* FILTROS */}
          <section style={cardStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={sectionTitleStyle}>Filtros</h2>
            </div>

            <div style={gridStyle}>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Filtrar por nombre"
                style={inputStyle}
              />

              <input
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Filtrar por apellido"
                style={inputStyle}
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as StatusFilter
                  )
                }
                style={inputStyle}
              >
                <option value="ALL">Todos</option>
                <option value="ACTIVE">Activos</option>
                <option value="INACTIVE">Inactivos</option>
              </select>

              <button
                onClick={applyTextFilters}
                style={primaryButton}
              >
                Aplicar filtros
              </button>
            </div>
          </section>

          {/* CREAR */}
          <section style={cardStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={sectionTitleStyle}>
                Crear usuario
              </h2>
            </div>

            <form onSubmit={onCreate} style={gridStyle}>
              <input
                value={newNombre}
                onChange={(e) =>
                  setNewNombre(e.target.value)
                }
                placeholder="Nombre"
                style={inputStyle}
              />

              <input
                value={newApellido}
                onChange={(e) =>
                  setNewApellido(e.target.value)
                }
                placeholder="Apellido"
                style={inputStyle}
              />

              <input
                value={newTelefono}
                onChange={(e) =>
                  setNewTelefono(e.target.value)
                }
                placeholder="Teléfono"
                style={inputStyle}
              />

              <input
                value={newEmail}
                onChange={(e) =>
                  setNewEmail(e.target.value)
                }
                placeholder="Email"
                type="email"
                style={inputStyle}
              />

              <input
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                placeholder="Password"
                type="password"
                style={inputStyle}
              />

              <button
                disabled={creating}
                style={primaryButton}
              >
                {creating
                  ? "Creando..."
                  : "Crear usuario"}
              </button>
            </form>
          </section>

          {/* TABLA */}
          <section style={cardStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "14px",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  disabled={page === 0}
                  onClick={() =>
                    setPage((p) => Math.max(0, p - 1))
                  }
                  style={secondaryButton}
                >
                  ← Anterior
                </button>

                <button
                  disabled={
                    !data || page + 1 >= data.totalPages
                  }
                  onClick={() => setPage((p) => p + 1)}
                  style={secondaryButton}
                >
                  Siguiente →
                </button>

                <div
                  style={{
                    color: P.textMuted,
                    fontSize: "14px",
                  }}
                >
                  Página <b>{page + 1}</b> de{" "}
                  <b>{data?.totalPages ?? 1}</b>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    color: P.textMuted,
                    fontSize: "14px",
                  }}
                >
                  Mostrar:
                </span>

                <select
                  value={size}
                  onChange={(e) =>
                    setSize(Number(e.target.value))
                  }
                  style={{
                    ...inputStyle,
                    width: "90px",
                    padding: "10px",
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: P.textMuted,
                }}
              >
                Cargando usuarios...
              </div>
            ) : (
              <div
                style={{
                  overflowX: "auto",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "850px",
                  }}
                >
                  <thead>
                    <tr>
                      {[
                        "ID",
                        "Nombre",
                        "Apellido",
                        "Email",
                        "Teléfono",
                        "Estado",
                        "Acciones",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: "left",
                            padding: "16px",
                            borderBottom: `1px solid ${P.border}`,
                            color: P.textMuted,
                            fontSize: "12px",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        style={{
                          transition: "0.2s",
                        }}
                      >
                        <td style={tdStyle}>{u.id}</td>
                        <td style={tdStyle}>{u.nombre}</td>
                        <td style={tdStyle}>{u.apellido}</td>
                        <td style={tdStyle}>{u.email}</td>
                        <td style={tdStyle}>{u.telefono}</td>

                        <td style={tdStyle}>
                          <span
                            style={{
                              padding: "5px 12px",
                              borderRadius: "999px",
                              fontSize: "11px",
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              background: u.activo
                                ? P.greenSoft
                                : P.redSoft,
                              color: u.activo
                                ? P.green
                                : P.red,
                              border: `1px solid ${
                                u.activo
                                  ? P.green
                                  : P.red
                              }55`,
                            }}
                          >
                            {u.activo
                              ? "Activo"
                              : "Inactivo"}
                          </span>
                        </td>

                        <td style={tdStyle}>
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              flexWrap: "wrap",
                            }}
                          >
                            <button
                              onClick={() =>
                                onToggleActive(u)
                              }
                              style={{
                                ...secondaryButton,
                                color: u.activo
                                  ? P.yellow
                                  : P.green,
                              }}
                            >
                              {u.activo
                                ? "Desactivar"
                                : "Activar"}
                            </button>

                            <button
                              onClick={() => onDelete(u)}
                              style={{
                                ...dangerButton,
                              }}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredUsers.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          style={{
                            padding: "30px",
                            textAlign: "center",
                            color: P.textMuted,
                          }}
                        >
                          No hay usuarios disponibles.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "rgba(22,32,53,0.88)",
  border: "1px solid rgba(99,149,210,0.18)",
  borderRadius: "22px",
  padding: "1.7rem",
  backdropFilter: "blur(14px)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.22)",
};

const sectionHeaderStyle: React.CSSProperties = {
  marginBottom: "1.4rem",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "1.05rem",
  fontWeight: 700,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: "12px",
  border: "1px solid rgba(99,149,210,0.22)",
  background: "#101a2d",
  color: "#f0f6ff",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box",
};

const primaryButton: React.CSSProperties = {
  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
  border: "none",
  borderRadius: "12px",
  color: "#fff",
  padding: "13px 18px",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: "14px",
  boxShadow: "0 10px 30px rgba(37,99,235,0.35)",
};

const secondaryButton: React.CSSProperties = {
  background: "rgba(37,99,235,0.12)",
  border: "1px solid rgba(59,130,246,0.3)",
  borderRadius: "12px",
  color: "#93c5fd",
  padding: "10px 14px",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "13px",
};

const dangerButton: React.CSSProperties = {
  background: "rgba(248,113,113,0.08)",
  border: "1px solid rgba(248,113,113,0.25)",
  borderRadius: "12px",
  color: "#f87171",
  padding: "10px 14px",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "13px",
};

const btnSecondary: React.CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(99,149,210,0.3)",
  borderRadius: "10px",
  color: "rgba(200,220,255,0.82)",
  fontSize: "13px",
  fontWeight: 600,
  padding: "10px 18px",
  cursor: "pointer",
};

const tdStyle: React.CSSProperties = {
  padding: "16px",
  borderBottom: "1px solid rgba(99,149,210,0.1)",
  color: "#f0f6ff",
  fontSize: "14px",
};