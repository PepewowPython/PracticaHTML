import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Search } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const querySearch = searchParams.get("search") || "";
  const [query, setQuery] = useState(querySearch);

  // Sync state with URL params
  useEffect(() => {
    setQuery(querySearch);
  }, [querySearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/items?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="header-wrapper" role="banner">
      <div className="container header-container">
        {/* Primary logo linking back to Home */}
        <Link to="/" className="logo-link" aria-label="Volver a la página principal de Vamos de Aventura">
          <img 
            src="/logos/02_logo_negativo_navy.png" 
            alt="Logo de Vamos de Aventura PWVA" 
            className="logo-img"
          />
        </Link>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="search-form" role="search">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos, equipo de aventura, marcas y más..."
            className="form-input search-input"
            aria-label="Caja de búsqueda de productos"
            autoComplete="off"
            name="search"
          />
          <button 
            type="submit" 
            className="search-button" 
            aria-label="Ejecutar búsqueda"
          >
            <Search size={20} />
          </button>
        </form>
      </div>
    </header>
  );
}
