import { useEffect, useState } from "react";
import { getUserActions, type UserAction } from "../api/userActions";

export function UserActionsPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [data, setData] = useState<{
    actions: UserAction[];
    totalPages: number;
    totalElements: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const res = await getUserActions({ page, size });

      setData({
        actions: res.content,
        totalPages: res.totalPages,
        totalElements: res.totalElements,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page, size]);

  return (
    <div style={{ maxWidth: 1000, margin: "30px auto", padding: 12 }}>
      <h2>Historial de acciones</h2>

      {/* PAGINACIÓN */}
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
          Anterior
        </button>

        <div>
          Página {page + 1} / {data?.totalPages ?? 1}
        </div>

        <button
          disabled={!data || page + 1 >= data.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Siguiente
        </button>

        <div style={{ marginLeft: "auto" }}>
          <select value={size} onChange={(e) => setSize(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* TABLA */}
      {loading && <div>Cargando...</div>}

      {!loading && data && data.actions.length === 0 && (
        <div>No hay registros de acciones.</div>
      )}

      {!loading && data && data.actions.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {data.actions.map((a, i) => (
              <tr key={i}>
                <td>{a.usuario}</td>
                <td>{a.accion}</td>
                <td>{new Date(a.fecha).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}