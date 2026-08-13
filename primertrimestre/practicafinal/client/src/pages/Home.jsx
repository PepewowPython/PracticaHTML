import React from "react";
import { Link } from "react-router-dom";
import { Compass, Shield, MapPin, Sparkles } from "lucide-react";

export default function Home() {
  const featuredCategories = [
    {
      title: "Equipamiento de Camping",
      query: "carpa",
      description: "Carpas térmicas de 4 estaciones, sacos de dormir y accesorios de camping profesionales.",
      icon: <Compass size={32} className="card-icon" style={{ color: "var(--color-navy)" }} />,
      priceRange: "Desde $28.000",
      image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&auto=format&fit=crop"
    },
    {
      title: "Mochilas de Expedición",
      query: "mochila",
      description: "Mochilas ergonómicas ripstop de gran litraje para travesías exigentes y senderismo.",
      icon: <Sparkles size={32} className="card-icon" style={{ color: "var(--color-sea-green)" }} />,
      priceRange: "Desde $145.000",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop"
    },
    {
      title: "Calzado de Trekking",
      query: "botas",
      description: "Calzado impermeable de caña media con suela de tracción para terrenos rocosos.",
      icon: <Shield size={32} className="card-icon" style={{ color: "var(--color-maroon)" }} />,
      priceRange: "Desde $185.000",
      image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500&auto=format&fit=crop"
    }
  ];

  return (
    <main className="container" style={{ minHeight: "80vh", paddingBottom: "var(--space-6)" }}>
      {/* Hero Welcome Banner */}
      <section className="hero-section" aria-labelledby="welcome-heading">
        <span className="badge badge-adventure" style={{ marginBottom: "var(--space-2)" }}>Plataforma Web de Turismo</span>
        <h1 id="welcome-heading" style={{ marginBottom: "var(--space-2)" }}>Vamos de Aventura</h1>
        <p className="hero-subtitle">
          El equipamiento técnico y de seguridad ideal para tus rutas al aire libre. Explora con confianza y vive la naturaleza de forma segura.
        </p>
        <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
          <Link to="/items?search=mochila" className="btn btn-primary">
            Ver Mochilas
          </Link>
          <Link to="/items?search=carpa" className="btn btn-outline">
            Ver Carpas
          </Link>
        </div>
      </section>

      {/* Brand Values / Security Info */}
      <section style={{ marginTop: "var(--space-6)" }} aria-labelledby="values-heading">
        <h2 id="values-heading" className="featured-section-title">¿Por qué equiparse con PWVA?</h2>
        <div className="grid-container" style={{ marginTop: "var(--space-4)" }}>
          <div className="card" style={{ padding: "var(--space-4)", gridColumn: "span 4", textAlign: "center" }}>
            <div style={{ marginBottom: "var(--space-3)", display: "flex", justifyContent: "center" }}>
              <Shield size={40} style={{ color: "var(--color-maroon)" }} />
            </div>
            <h3 style={{ marginBottom: "var(--space-2)" }}>Seguridad Garantizada</h3>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
              Todo nuestro equipo cuenta con certificaciones internacionales para resistir climas severos y proteger tu integridad en la montaña.
            </p>
          </div>
          <div className="card" style={{ padding: "var(--space-4)", gridColumn: "span 4", textAlign: "center" }}>
            <div style={{ marginBottom: "var(--space-3)", display: "flex", justifyContent: "center" }}>
              <MapPin size={40} style={{ color: "var(--color-sea-green)" }} />
            </div>
            <h3 style={{ marginBottom: "var(--space-2)" }}>Rutas y Geolocalización</h3>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
              Diseñamos rutas seguras y te brindamos el equipamiento necesario adaptado al terreno, nivel de riesgo y clima de tu destino.
            </p>
          </div>
          <div className="card" style={{ padding: "var(--space-4)", gridColumn: "span 4", textAlign: "center" }}>
            <div style={{ marginBottom: "var(--space-3)", display: "flex", justifyContent: "center" }}>
              <Compass size={40} style={{ color: "var(--color-navy)" }} />
            </div>
            <h3 style={{ marginBottom: "var(--space-2)" }}>Exploración Consciente</h3>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
              Promovemos el turismo sustentable de aventura. Equipamiento duradero para minimizar la huella ambiental en cada travesía.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section style={{ marginTop: "var(--space-6)" }} aria-labelledby="featured-heading">
        <h2 id="featured-heading" className="featured-section-title">Equipamiento Técnico Destacado</h2>
        <div className="grid-container" style={{ marginTop: "var(--space-4)" }}>
          {featuredCategories.map((cat, i) => (
            <article key={i} className="card featured-card" style={{ gridColumn: "span 4" }}>
              <div className="featured-card-img-wrapper">
                <img src={cat.image} alt={cat.title} className="featured-card-img" />
              </div>
              <div className="featured-card-body">
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
                  {cat.icon}
                  <h3 className="featured-card-title" style={{ margin: 0 }}>{cat.title}</h3>
                </div>
                <p className="featured-card-desc">{cat.description}</p>
                <div className="featured-card-footer">
                  <span className="featured-card-price">{cat.priceRange}</span>
                  <Link to={`/items?search=${encodeURIComponent(cat.query)}`} className="btn btn-outline" style={{ padding: "6px 12px", fontSize: "0.8rem" }} aria-label={`Explorar categoría ${cat.title}`}>
                    Explorar
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
