import React from "react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ categories = [] }) {
  if (!categories || categories.length === 0) {
    return <div className="breadcrumb-container" aria-label="Breadcrumb navigation" />;
  }

  return (
    <nav className="container" aria-label="Breadcrumbs">
      <div className="breadcrumb-container">
        {categories.map((category, index) => {
          const isLast = index === categories.length - 1;
          const searchUrl = `/items?search=${encodeURIComponent(category)}`;

          return (
            <span key={index} className="breadcrumb-item">
              {isLast ? (
                <span aria-current="page">{category}</span>
              ) : (
                <Link to={searchUrl}>{category}</Link>
              )}
            </span>
          );
        })}
      </div>
    </nav>
  );
}
