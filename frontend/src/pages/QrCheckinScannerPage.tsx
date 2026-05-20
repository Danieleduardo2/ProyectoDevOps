import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { useNavigate, useParams } from "react-router-dom";
import { registrarCheckin } from "../api/checkin";

const scannerId = "qr-reader";

function extraerToken(rawText: string): string {
    const value = rawText.trim();

    try {
        const url = new URL(value);
        const token = url.searchParams.get("token");
        if (token) return token;
    } catch {
        // no era URL
    }

    return value;
}

export function QrCheckinScannerPage() {
    const navigate = useNavigate();
    const { eventoId } = useParams();
    const [loadingCamera, setLoadingCamera] = useState(true);
    const [mensaje, setMensaje] = useState("Solicitando acceso a la cámara...");
    const [error, setError] = useState<string | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const handledRef = useRef(false);

    useEffect(() => {
        if (!eventoId) {
            setError("No se encontró el ID del evento.");
            setLoadingCamera(false);
            return;
        }

        const eventoIdSeguro = eventoId;
        let mounted = true;

        async function startScanner() {
            try {
                const qr = new Html5Qrcode(scannerId);
                scannerRef.current = qr;

                const cameras = await Html5Qrcode.getCameras();
                if (!mounted) return;

                if (!cameras || cameras.length === 0) {
                    setError("No se encontró ninguna cámara disponible.");
                    setLoadingCamera(false);
                    return;
                }

                const cameraId = cameras[0].id;

                await qr.start(
                    cameraId,
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                    },
                    async (decodedText) => {
                        if (handledRef.current) return;
                        handledRef.current = true;

                        const token = extraerToken(decodedText);
                        setMensaje("Código detectado. Registrando asistencia...");

                        try {
                            await qr.stop();
                        } catch {
                            // ignorar
                        }

                        try {
                            const response = await registrarCheckin(eventoIdSeguro, token);

                            navigate("/checkin/resultado", {
                                replace: true,
                                state: {
                                    tipo: "exito",
                                    titulo: "Asistencia registrada correctamente",
                                    descripcion:
                                        response.mensaje ??
                                        "La asistencia fue registrada correctamente.",
                                    eventoNombre: response.eventoNombre ?? "",
                                    usuarioNombre: response.usuarioNombre ?? "",
                                },
                            });
                        } catch (err: any) {
                            const status = err?.response?.status;
                            const backendMsg =
                                err?.response?.data?.message ??
                                err?.response?.data?.error ??
                                "";

                            if (status === 409 || /usad|utilizad/i.test(backendMsg)) {
                                navigate("/checkin/resultado", {
                                    replace: true,
                                    state: {
                                        tipo: "error",
                                        titulo: "QR ya usado",
                                        descripcion: "Este código QR ya fue utilizado anteriormente.",
                                    },
                                });
                                return;
                            }

                            if (
                                status === 400 ||
                                status === 403 ||
                                /otro evento|no corresponde|evento diferente/i.test(backendMsg)
                            ) {
                                navigate("/checkin/resultado", {
                                    replace: true,
                                    state: {
                                        tipo: "error",
                                        titulo: "QR de otro evento rechazado",
                                        descripcion:
                                            "Este código QR no corresponde al evento actual.",
                                    },
                                });
                                return;
                            }

                            navigate("/checkin/resultado", {
                                replace: true,
                                state: {
                                    tipo: "error",
                                    titulo: "No se pudo registrar la asistencia",
                                    descripcion:
                                        "Ocurrió un error inesperado al intentar procesar el QR.",
                                },
                            });
                        }
                    },
                    () => {
                        // ignorar errores de lectura continuos
                    }
                );

                if (mounted) {
                    setLoadingCamera(false);
                    setMensaje("Apunta la cámara al código QR para registrar la asistencia.");
                }
            } catch (e: any) {
                setError(
                    e?.message ??
                    "No fue posible acceder a la cámara. Revisa permisos y vuelve a intentarlo."
                );
                setLoadingCamera(false);
            }
        }

        startScanner();

        return () => {
            mounted = false;
            const scanner = scannerRef.current;
            if (scanner) {
                const state = scanner.getState();
                if (
                    state === Html5QrcodeScannerState.SCANNING ||
                    state === Html5QrcodeScannerState.PAUSED
                ) {
                    scanner.stop().catch(() => void 0);
                }
            }
        };
    }, [eventoId, navigate]);

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1 style={styles.title}>Escáner QR de asistencia</h1>
                <p style={styles.subtitle}>
                    Usa la cámara del navegador o del móvil para leer el código QR.
                </p>

                <div style={styles.statusBox}>
                    {loadingCamera ? (
                        <p>Abriendo la cámara...</p>
                    ) : error ? (
                        <p style={{ color: "#b42318" }}>{error}</p>
                    ) : (
                        <p>{mensaje}</p>
                    )}
                </div>

                <div id={scannerId} style={styles.scanner} />

                <div style={styles.actions}>
                    <button onClick={() => navigate("/app")} style={styles.secondaryButton}>
                        Volver
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        style={styles.primaryButton}
                    >
                        Reiniciar cámara
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "#f5f7fb",
    },
    card: {
        width: "100%",
        maxWidth: 760,
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 10px 35px rgba(16, 24, 40, 0.12)",
        padding: 24,
    },
    title: {
        margin: "0 0 8px",
        fontSize: 28,
    },
    subtitle: {
        marginBottom: 16,
        color: "#475467",
    },
    statusBox: {
        padding: 12,
        borderRadius: 12,
        background: "#f9fafb",
        border: "1px solid #eaecf0",
        marginBottom: 16,
    },
    scanner: {
        width: "100%",
        minHeight: 360,
        overflow: "hidden",
        borderRadius: 16,
        border: "1px solid #eaecf0",
        background: "#000",
    },
    actions: {
        display: "flex",
        gap: 12,
        marginTop: 16,
        justifyContent: "flex-end",
        flexWrap: "wrap",
    },
    primaryButton: {
        border: "none",
        background: "#7c3aed",
        color: "#fff",
        padding: "10px 16px",
        borderRadius: 10,
        cursor: "pointer",
        fontWeight: 600,
    },
    secondaryButton: {
        border: "1px solid #d0d5dd",
        background: "#fff",
        color: "#344054",
        padding: "10px 16px",
        borderRadius: 10,
        cursor: "pointer",
        fontWeight: 600,
    },
};
