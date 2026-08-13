import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Truck } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";

export default function Results() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!search) return;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/items?q=${encodeURIComponent(search)}`);
        if (!response.ok) {
          throw new Error(`Error en el servidor: código ${response.status}`);
        }
        const data = await response.json();
        setItems(data.items || []);
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Ocurrió un error al cargar los resultados de búsqueda. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [search]);

  // Helper to format prices
  const formatPrice = (price) => {
    const symbol = price.currency === "ARS" ? "$" : price.currency;
    const formattedAmount = price.amount.toLocaleString("es-AR");
    return `${symbol} ${formattedAmount}`;
  };

  if (loading) {
    return (
      <div className="container" style={{ minHeight: "80vh" }}>
        <div className="state-container">
          <div className="spinner"></div>
          <h2>Buscando aventuras...</h2>
          <p>Estamos recuperando el mejor equipamiento para tu viaje.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ minHeight: "80vh" }}>
        <div className="state-container">
          <div className="error-icon">⚠</div>
          <h2>Error de Conexión</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ marginTop: "var(--space-3)" }}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container" style={{ minHeight: "80vh" }}>
        <div className="state-container">
          <div className="empty-icon">🎒</div>
          <h2>No se encontraron resultados</h2>
          <p>No pudimos encontrar productos que coincidan con "{search}".</p>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>
            Intenta buscar términos relacionados como "mochila", "carpa", "botas" o "brújula".
          </p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: "var(--space-4)" }}>
            Volver a la Página de Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main>
      <Breadcrumb categories={categories} />
      <div className="container">
        <section className="results-list" aria-label="Resultados de búsqueda">
          {items.map((item) => (
            <Link to={`/items/${item.id}`} key={item.id} className="result-item-link" aria-label={`Ver detalle de ${item.title}`}>
              <article className="result-item">
                {/* Image */}
                <div className="result-img-wrapper">
                  <img src={item.picture} alt={item.title} className="result-img" loading="lazy" />
                </div>

                {/* Details */}
                <div className="result-info">
                  <div className="result-price-wrapper">
                    <span className="result-price">{formatPrice(item.price)}</span>
                    {item.price.decimals > 0 && (
                      <span style={{ fontSize: "0.85em", alignSelf: "flex-start", marginTop: "2px" }}>
                        {item.price.decimals.toString().padStart(2, "0")}
                      </span>
                    )}
                    {item.free_shipping && (
                      <span className="result-shipping-icon" title="Envío gratis">
                        <Truck size={18} />
                      </span>
                    )}
                  </div>
                  <h2 className="result-title">{item.title}</h2>
                  <span className="badge badge-adventure" style={{ marginTop: "var(--space-1)", alignSelf: "flex-start" }}>
                    {item.condition === "new" ? "Nuevo" : "Usado"}
                  </span>
                </div>

                {/* Seller Location */}
                <div className="result-location">
                  <span>{item.address || "Medellín"}</span>
                </div>
              </article>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
