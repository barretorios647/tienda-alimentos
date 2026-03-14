"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === "admin123") {
      localStorage.setItem("adminLoggedIn", "true");
      router.push("/admin");
    } else {
      setError("Contraseña incorrecta");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "40px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: "380px",
        }}
      >
        <h1 style={{ margin: "0 0 8px 0", fontSize: "24px", color: "#111827" }}>
          Administración
        </h1>
        <p style={{ margin: "0 0 28px 0", color: "#6b7280" }}>
          Ingresa tu contraseña para continuar
        </p>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Contraseña"
            autoFocus
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: error ? "1px solid #dc2626" : "1px solid #d1d5db",
              marginBottom: "8px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
          {error && (
            <p style={{ color: "#dc2626", margin: "0 0 12px 0", fontSize: "14px" }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "10px",
              background: "#111827",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
              marginTop: "8px",
            }}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
