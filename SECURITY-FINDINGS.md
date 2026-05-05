# SECURITY FINDINGS REPORT

## Información general

* Proyecto: ProyectoDevOps
* Herramienta: Semgrep
* Fecha: 2026-05-04

---

## Lenguajes analizados

Según los logs de GitHub Actions:

* Java
* TypeScript
* CSS

---

## Hallazgo #1 – Secreto expuesto en archivo .env

* Regla: secreto genérico detectado
* Severidad: Baja
* Archivo: backend/.env
* Línea: 6

### Descripción del riesgo

Se detectó información sensible almacenada directamente en el archivo `.env`. Esto representa un riesgo de seguridad, ya que dichos secretos pueden ser expuestos en el repositorio o accesibles para usuarios no autorizados.

---

### Código vulnerable

```env
DB_PASSWORD=Password123
```

## Evidencias

* Hallazgo detectado en Semgrep

  
<img width="1600" height="766" alt="image" src="https://github.com/user-attachments/assets/ceec8130-54bd-4c6b-ab43-d8a964f33d5f" />


* Código vulnerable antes de la corrección
<img width="325" height="90" alt="image" src="https://github.com/user-attachments/assets/58ddd15b-dc65-4045-a1ec-0b99a643f0ef" />





---

## Nota

El hallazgo fue identificado en Semgrep Cloud, el cual analiza archivos de configuración como `.env`, por lo que algunos resultados no se reflejan directamente en los logs del pipeline de GitHub Actions.
