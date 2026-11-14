export default function AuthErrorPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="page-header" style={{ marginBottom: "1.5rem" }}>
          <h1>Erro de autenticação</h1>
        </div>
        <div className="alert alert-error">
          Ocorreu um erro durante a autenticação. Tente novamente.
        </div>
        <p style={{ textAlign: "center" }}>
          <a href="/auth/login" style={{ color: "#007bff" }}>
            Voltar ao login
          </a>
        </p>
      </div>
    </main>
  );
}
