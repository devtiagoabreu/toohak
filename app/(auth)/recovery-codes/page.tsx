"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";

export default function RecoveryCodesPage() {
  const [codes, setCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadCodes() {
      const session = await getSession();
      if (!session) return;

      try {
        const response = await fetch("/api/user/recovery-codes", {
          headers: {
            Authorization: `Bearer ${(session as any).accessToken || ""}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCodes(data.codes);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCodes();
  }, []);

  function copyCodes() {
    navigator.clipboard.writeText(codes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="card">Carregando códigos de recuperação...</div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ width: "100%", maxWidth: "500px" }}>
        <div className="page-header" style={{ marginBottom: "1.5rem" }}>
          <h1>Seus códigos de recuperação</h1>
          <p>Guarde esses códigos em um local seguro. Eles permitem acessar sua conta se você perder o dispositivo.</p>
        </div>

        <div className="alert alert-error">
          <strong>Importante:</strong> Se perder seus códigos e não tiver acesso ao email, não conseguirá recuperar sua conta.
        </div>

        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "0.5rem", padding: "1rem", fontFamily: "monospace", fontSize: "0.85rem", marginBottom: "1rem", overflowX: "auto" }}>
          {codes.map((code, i) => (
            <div key={i} style={{ marginBottom: "0.5rem" }}>
              {i + 1}. {code}
            </div>
          ))}
        </div>

        <button
          onClick={copyCodes}
          className="btn btn-outline"
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          {copied ? "Copiado!" : "Copiar todos os códigos"}
        </button>

        <p className="text-muted" style={{ textAlign: "center", fontSize: "0.85rem" }}>
          Recomendamos salvar esses códigos em um gerenciador de senhas como 1Password, Authy ou Keeper.
        </p>
      </div>
    </main>
  );
}
