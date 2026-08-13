import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";

export default function Detail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/items/${id}`);
        if (!response.ok) {
          throw new Error(`Error en el servidor: código ${response.status}`);
        }
        const data = await response.json();
        
        // Support both "item" and "ítem" in response
        const itemObj = data.item || data["ítem"];
        if (!itemObj) {
          throw new Error("No se encontraron detalles para este producto.");
        }
        
        setItem(itemObj);
        setCategories(data.categories || ["Detalle"]);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Ocurrió un error al cargar el detalle del producto. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ minHeight: "80vh" }}>
        <div className="state-container">
          <div className="spinner"></div>
          <h2>Cargando equipamiento...</h2>
          <p>Preparando los detalles para tu aventura.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ minHeight: "80vh" }}>
        <div className="state-container">
          <div className="error-icon">⚠</div>
          <h2>Detalle no disponible</h2>
          <p>{error}</p>
          <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
            <Link to="/" className="btn btn-primary">
              Volver al inicio
            </Link>
            <button onClick={() => window.location.reload()} className="btn btn-outline">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currencySymbol = item.price.currency === "ARS" ? "$" : item.price.currency;
  const formattedAmount = item.price.amount.toLocaleString("es-AR");
  const formattedDecimals = item.price.decimals.toString().padStart(2, "0");

  return (
    <main>
      <Breadcrumb categories={categories} />
      <div className="container">
        {/* Back Link for ease of navigation */}
        <Link to={-1} className="btn btn-outline" style={{ border: "none", padding: "8px 0", display: "inline-flex", gap: "8px", marginBottom: "var(--space-3)" }}>
          <ArrowLeft size={18} />
          <span>Volver al listado</span>
        </Link>

        <section className="detail-container" aria-labelledby="product-title">
          <div className="detail-main">
            {/* Image Box */}
            <div className="detail-img-box">
              <img src={item.picture} alt={item.title} className="detail-img" />
            </div>

            {/* Purchasing Panel */}
            <div className="detail-panel">
              <div className="detail-meta">
                <span>{item.condition === "new" ? "Nuevo" : "Usado"}</span>
                {item.sold_quantity > 0 && (
                  <span> • {item.sold_quantity} vendidos</span>
                )}
              </div>
              <h1 id="product-title" className="detail-title">{item.title}</h1>
              
              {/* Custom price tag formatting */}
              <div className="detail-price-box">
                <span className="detail-currency">{currencySymbol}</span>
                <span className="detail-amount">{formattedAmount}</span>
                <span className="detail-decimals">{formattedDecimals}</span>
              </div>

              {item.free_shipping && (
                <div style={{ color: "var(--color-sea-green)", display: "flex", alignItems: "center", gap: "8px", fontSize: "var(--text-sm)", marginBottom: "var(--space-3)", fontWeight: "500" }}>
                  <span>✓</span> Envío gratis a todo el país
                </div>
              )}

              <button className="btn btn-adventure detail-buy-btn" onClick={() => alert("¡Gracias por elegir Vamos de Aventura! Esta es una simulación de compra.")}>
                Comprar Ahora
              </button>
            </div>
          </div>

          {/* Description Section */}
          <div className="detail-description-section">
            <h2 className="detail-description-title">Descripción del producto</h2>
            <p className="detail-description-text">
              {item.description || item["descripción"] || "El vendedor no proporcionó una descripción para este producto."}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
