import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Results from "./pages/Results";
import Detail from "./pages/Detail";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Persistent Search Header */}
        <Header />

        {/* Dynamic Pages */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/items" element={<Results />} />
            <Route path="/items/:id" element={<Detail />} />
          </Routes>
        </div>

        {/* Footer with brand attributes */}
        <footer style={{ backgroundColor: "var(--color-slate)", color: "var(--color-white)", padding: "var(--space-4) 0", marginTop: "var(--space-5)" }}>
          <div className="container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "var(--space-3)" }}>
            <div>
              <p style={{ fontWeight: "700", color: "var(--color-white)", fontSize: "1.1rem" }}>PWVA - Vamos de Aventura</p>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-border)", marginTop: "4px" }}>
                Plataforma Web de Turismo y Equipamiento de Aventura.
              </p>
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-border)" }}>
              <span>© {new Date().getFullYear()} Pepe Wow. Todos los derechos reservados.</span>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
