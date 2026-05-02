function App() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        background: "#fffaf0",
        color: "#241a3a",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "3rem", margin: 0 }}>Internet Toys</h1>
      <p style={{ marginTop: "0.5rem", opacity: 0.7 }}>
        Vite + React + TypeScript scaffold. Lab 6 / Lab 7 — TUM Web Programming.
      </p>
    </main>
  );
}

export default App;
