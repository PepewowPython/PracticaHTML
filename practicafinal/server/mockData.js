// Mock data to handle cases where the MercadoLibre API blocks server requests (403 Forbidden).
// Contains high-quality adventure products matching Vamos de Aventura, as well as typical items.

const mockProducts = [
  // Adventure / Outdoor Gear (PWVA theme)
  {
    id: "MLA900000001",
    title: "Mochila de Montaña Trekking PWVA 75L Impermeable",
    category_path: ["Deportes y Fitness", "Camping", "Mochilas y Bolsos", "Mochilas"],
    price: {
      currency: "ARS",
      amount: 145000,
      decimals: 90
    },
    picture: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop",
    condition: "new",
    free_shipping: true,
    sold_quantity: 120,
    description: "Mochila técnica de expedición de 75 litros de capacidad, diseñada bajo los estándares de PWVA (Vamos de Aventura). Cuenta con un sistema de suspensión ergonómico ajustable, espaldar de malla respirable y funda impermeable integrada. Compartimento principal con acceso frontal y superior, portapiquetas y correas de compresión laterales. Ideal para trekkings de varios días y senderismo exigente. Fabricada en poliéster ripstop de alta tenacidad."
  },
  {
    id: "MLA900000002",
    title: "Carpa de Alta Montaña Domo PWVA 4 Personas 4 Estaciones",
    category_path: ["Deportes y Fitness", "Camping", "Carpas"],
    price: {
      currency: "ARS",
      amount: 320000,
      decimals: 0
    },
    picture: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&auto=format&fit=crop",
    condition: "new",
    free_shipping: true,
    sold_quantity: 45,
    description: "Carpa tipo domo para 4 personas certificada para 4 estaciones. Diseñada para resistir condiciones climáticas extremas: vientos fuertes, nieve y lluvias intensas. Doble techo de poliéster 190T con impermeabilidad de 3000 mm de columna de agua. Varillas de duraluminio aeronáutico liviano y de alta resistencia. Costuras termoselladas y costuras reforzadas en puntos de tensión. Sistema de ventilación ajustable para evitar la condensación interna."
  },
  {
    id: "MLA900000003",
    title: "Botas de Trekking Impermeables PWVA Cuero Premium",
    category_path: ["Ropa y Accesorios", "Calzado", "Botas y Botines"],
    price: {
      currency: "ARS",
      amount: 185000,
      decimals: 50
    },
    picture: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500&auto=format&fit=crop",
    condition: "new",
    free_shipping: true,
    sold_quantity: 310,
    description: "Calzado técnico de senderismo de media caña con membrana impermeable y transpirable. Confeccionadas en cuero nobuck de alta calidad con refuerzo de goma en la puntera y talón para proteger contra impactos de piedras. Suela de caucho de alta tracción con agarre multidireccional, ideal para terrenos húmedos, rocosos y resbaladizos. Plantilla ergonómica de EVA amortiguada para máximo confort durante largas caminatas."
  },
  {
    id: "MLA900000004",
    title: "Brújula Profesional de Orientación PWVA con Clinómetro",
    category_path: ["Deportes y Fitness", "Camping", "Accesorios de Camping", "Brújulas"],
    price: {
      currency: "ARS",
      amount: 28000,
      decimals: 0
    },
    picture: "https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=500&auto=format&fit=crop",
    condition: "new",
    free_shipping: false,
    sold_quantity: 65,
    description: "Brújula cartográfica profesional de alta precisión. Incorpora clinómetro para medir pendientes y ángulos verticales, espejo de avistamiento con ranura de puntería y cápsula rellena de líquido estabilizador. Bisel giratorio de 360 grados, escalas en milímetros e pulgadas para lectura directa sobre mapas topográficos. Aguja magnética balanceada con marcas luminosas para uso nocturno o con baja visibilidad. Incluye cordón con escala de seguridad."
  },
  {
    id: "MLA900000005",
    title: "Bolsa de Dormir Térmica PWVA Sarcófago -10°C Extremo",
    category_path: ["Deportes y Fitness", "Camping", "Bolsas de Dormir"],
    price: {
      currency: "ARS",
      amount: 98000,
      decimals: 0
    },
    picture: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&auto=format&fit=crop", // generic camping img fallback
    condition: "new",
    free_shipping: true,
    sold_quantity: 85,
    description: "Bolsa de dormir técnica tipo sarcófago (momia). Relleno sintético de fibra hueca siliconada de alta densidad, excelente capacidad de aislamiento térmico con bajo peso. Capucha anatómica ajustable y collar térmico para minimizar la pérdida de calor. Rango de temperatura: Confort 5°C, Límite 0°C, Extrema -10°C. Cierre bidireccional acoplable con solapa térmica. Incluye bolsa de compresión reforzada para transporte compacto."
  },

  // Generic Electronics (for general queries like "celular", "iphone", "notebook")
  {
    id: "MLA900000006",
    title: "Apple iPhone 15 Pro Max 256GB - Titanio Natural",
    category_path: ["Celulares y Teléfonos", "Celulares y Smartphones"],
    price: {
      currency: "ARS",
      amount: 2150000,
      decimals: 0
    },
    picture: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop",
    condition: "new",
    free_shipping: true,
    sold_quantity: 940,
    description: "Diseño de titanio resistente y ligero de calidad aeroespacial. Chip A17 Pro que redefine el rendimiento gráfico en smartphones. Sistema de cámaras pro potente: lente principal de 48 MP y teleobjetivo de 5x para capturar detalles increíbles a distancia. Botón de Acción personalizable para acceder rápidamente a tu función favorita. Conector USB-C compatible con velocidades USB 3 para transferencias ultrarrápidas."
  },
  {
    id: "MLA900000007",
    title: "Notebook ASUS Vivobook 15 Intel Core i5 16GB RAM 512GB SSD",
    category_path: ["Computación", "Notebooks"],
    price: {
      currency: "ARS",
      amount: 980000,
      decimals: 99
    },
    picture: "https://images.unsplash.com/photo-1496181130204-755241544e35?w=500&auto=format&fit=crop",
    condition: "new",
    free_shipping: true,
    sold_quantity: 520,
    description: "Notebook ASUS Vivobook de diseño elegante y ultradelgado. Equipada con procesador Intel Core i5 de 11ª generación para una productividad fluida. 16 GB de memoria RAM DDR4 y almacenamiento de alta velocidad SSD de 512 GB NVMe. Pantalla NanoEdge Full HD de 15.6 pulgadas con biseles ultradelgados y tratamiento antirreflejo. Teclado ergonómico retroiluminado, bisagra plana de 180° y sensor de huella digital integrado."
  },
  {
    id: "MLA900000008",
    title: "Auriculares Bluetooth Sony WH-1000XM5 Cancelación de Ruido",
    category_path: ["Electrónica, Audio y Video", "Audio", "Auriculares"],
    price: {
      currency: "ARS",
      amount: 450000,
      decimals: 0
    },
    picture: "https://images.unsplash.com/photo-1496181130204-755241544e35?w=500&auto=format&fit=crop", // generic audio/pc fallback
    condition: "new",
    free_shipping: true,
    sold_quantity: 1200,
    description: "Auriculares inalámbricos de diadema con cancelación de ruido activa líder de la industria gracias al procesador integrado V1 y el procesador de Noise Cancelling HD QN1. Calidad de sonido excepcional con High-Resolution Audio. Micrófonos de alta precisión y avanzada tecnología de procesamiento de señal de voz para llamadas ultra claras. Batería de larga duración de hasta 30 horas con carga rápida USB-C."
  }
];

export function getMockSearch(query) {
  const normalizedQuery = (query || "").toLowerCase();
  
  // Filter mock products by title/description/category matching the query
  let results = mockProducts.filter(p => 
    p.title.toLowerCase().includes(normalizedQuery) ||
    p.description.toLowerCase().includes(normalizedQuery) ||
    p.category_path.some(cat => cat.toLowerCase().includes(normalizedQuery))
  );

  // If no specific results, return a general set (first 4 items)
  if (results.length === 0) {
    results = mockProducts.slice(0, 4);
  } else {
    results = results.slice(0, 4);
  }

  // Find the most popular category in these results
  // For simplicity, we take the categories of the first result or compile them
  const categories = results[0] ? results[0].category_path : ["Deportes y Fitness", "Camping"];

  return {
    categories,
    items: results.map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      picture: p.picture,
      condition: p.condition,
      free_shipping: p.free_shipping
    }))
  };
}

export function getMockItem(id) {
  const item = mockProducts.find(p => p.id === id);
  if (item) {
    return {
      categories: item.category_path,
      item: {
        id: item.id,
        title: item.title,
        price: item.price,
        picture: item.picture,
        condition: item.condition,
        free_shipping: item.free_shipping,
        sold_quantity: item.sold_quantity,
        description: item.description
      }
    };
  }
  
  // If not found, return a generic item based on id format
  return {
    categories: ["Deportes y Fitness", "Camping"],
    item: {
      id: id,
      title: "Producto Genérico de Aventura PWVA",
      price: {
        currency: "ARS",
        amount: 85000,
        decimals: 0
      },
      picture: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop",
      condition: "new",
      free_shipping: true,
      sold_quantity: 10,
      description: "Este es un producto genérico generado por el sistema de contingencia de PWVA. La API original de MercadoLibre no está disponible en este momento o ha retornado un estado denegado. Disfruta de la exploración con Vamos de Aventura."
    }
  };
}
