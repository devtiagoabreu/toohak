"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-app)" }}>
      <div className="Card" style={{ width: "100%", maxWidth: "420px", padding: "2rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
            Entrar
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>Faça login na sua conta Toohak</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: "#FEF2F2",
            color: "#991B1B",
            border: "1px solid #FECACA",
            padding: "1rem",
            borderRadius: "12px",
            marginBottom: "1rem",
            fontSize: "0.9rem",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem", color: "var(--text-primary)" }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                fontSize: "1rem",
                fontFamily: "inherit",
                backgroundColor: "#FFFFFF",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "0.9rem", color: "var(--text-primary)" }}>
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                fontSize: "1rem",
                fontFamily: "inherit",
                backgroundColor: "#FFFFFF",
              }}
            />
          </div>

          <Button variant="primary" isLoading={loading} fullWidth style={{ width: "100%", marginTop: "0.5rem" }}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p style={{ marginTop: "1.5rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Não tem uma conta?{" "}
          <Link href="/auth/register" style={{ color: "#0091FF", fontWeight: 600, textDecoration: "underline" }}>
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
