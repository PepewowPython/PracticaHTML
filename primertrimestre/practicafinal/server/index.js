import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { getMockSearch, getMockItem } from "./mockData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Author signature required by the PDF specs
const AUTHOR = {
  name: "Pepe",
  lastname: "Wow"
};

// Helper function to fetch category path details from MercadoLibre
async function fetchCategoryPath(categoryId) {
  if (!categoryId) return [];
  try {
    const res = await fetch(`https://api.mercadolibre.com/categories/${categoryId}`);
    if (res.status === 200) {
      const data = await res.json();
      if (data && data.path_from_root) {
        return data.path_from_root.map(cat => cat.name);
      }
    }
  } catch (error) {
    console.warn(`Could not fetch category path for category: ${categoryId}`, error.message);
  }
  return [];
}

// 1. Search Endpoint: GET /api/items?q=:query
app.get("/api/items", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Missing query parameter 'q'" });
  }

  console.log(`[API] Searching for items: "${query}"`);

  try {
    const mlResponse = await fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${encodeURIComponent(query)}`);
    
    // If blocked or forbidden, fallback to mock data
    if (mlResponse.status === 403) {
      console.warn(`[API] MercadoLibre API returned 403 Forbidden. Falling back to local PWVA mock database.`);
      const mockResult = getMockSearch(query);
      return res.json({
        author: AUTHOR,
        categories: mockResult.categories,
        items: mockResult.items
      });
    }

    if (!mlResponse.ok) {
      throw new Error(`MercadoLibre API responded with status ${mlResponse.status}`);
    }

    const data = await mlResponse.json();
    const results = data.results || [];
    
    // Process items (limit to 4 as requested by the PDF)
    const items = results.slice(0, 4).map(item => {
      const price = item.price || 0;
      const amount = Math.floor(price);
      const decimals = Math.round((price - amount) * 100);
      return {
        id: item.id,
        title: item.title,
        price: {
          currency: item.currency_id || "ARS",
          amount: amount,
          decimals: decimals
        },
        picture: item.thumbnail,
        condition: item.condition,
        free_shipping: item.shipping?.free_shipping || false,
        address: item.address?.state_name || "" // Location is shown in search results layout
      };
    });

    // Resolve categories for breadcrumb:
    // "El breadcrumb que se muestra en el listado de búsqueda debe armarse basado en la categoría que más resultados obtuvo"
    let categories = [];
    
    // Try to extract from filters
    const categoryFilter = data.filters?.find(f => f.id === "category");
    if (categoryFilter && categoryFilter.values && categoryFilter.values.length > 0) {
      categories = categoryFilter.values[0].path_from_root?.map(cat => cat.name) || [];
    } else {
      // Try to extract from available_filters (facets)
      const categoryAvailableFilter = data.available_filters?.find(f => f.id === "category");
      if (categoryAvailableFilter && categoryAvailableFilter.values && categoryAvailableFilter.values.length > 0) {
        // Find category with most results
        const topCategory = categoryAvailableFilter.values.reduce((prev, current) => {
          return (prev.results > current.results) ? prev : current;
        });
        if (topCategory) {
          categories = await fetchCategoryPath(topCategory.id);
        }
      }
    }

    // Fallback if no categories are resolved
    if (categories.length === 0 && items.length > 0 && results[0]?.category_id) {
      categories = await fetchCategoryPath(results[0].category_id);
    }

    return res.json({
      author: AUTHOR,
      categories: categories.length > 0 ? categories : ["Búsqueda"],
      items
    });

  } catch (error) {
    console.error("[API Error] Search error:", error.message);
    console.warn("[API] Using local PWVA mock database fallback.");
    const mockResult = getMockSearch(query);
    return res.json({
      author: AUTHOR,
      categories: mockResult.categories,
      items: mockResult.items
    });
  }
});

// 2. Product Detail Endpoint: GET /api/items/:id
app.get("/api/items/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`[API] Fetching item details for ID: "${id}"`);

  try {
    const [itemRes, descRes] = await Promise.all([
      fetch(`https://api.mercadolibre.com/items/${id}`),
      fetch(`https://api.mercadolibre.com/items/${id}/description`)
    ]);

    // If blocked or forbidden, fallback to mock data
    if (itemRes.status === 403 || descRes.status === 403) {
      console.warn(`[API] MercadoLibre API returned 403 Forbidden. Falling back to local PWVA mock database.`);
      const mockItem = getMockItem(id);
      return res.json({
        author: AUTHOR,
        categories: mockItem.categories,
        item: mockItem.item,
        "ítem": mockItem.item // Support accented version as well
      });
    }

    if (!itemRes.ok) {
      throw new Error(`MercadoLibre Item API responded with status ${itemRes.status}`);
    }

    const itemData = await itemRes.json();
    let descData = { plain_text: "" };
    
    if (descRes.ok) {
      descData = await descRes.json();
    }

    const price = itemData.price || 0;
    const amount = Math.floor(price);
    const decimals = Math.round((price - amount) * 100);

    const categories = await fetchCategoryPath(itemData.category_id);

    const processedItem = {
      id: itemData.id,
      title: itemData.title,
      price: {
        currency: itemData.currency_id || "ARS",
        amount: amount,
        decimals: decimals
      },
      picture: itemData.pictures && itemData.pictures.length > 0 
        ? itemData.pictures[0].secure_url || itemData.pictures[0].url
        : itemData.thumbnail,
      condition: itemData.condition,
      free_shipping: itemData.shipping?.free_shipping || false,
      sold_quantity: itemData.sold_quantity || 0,
      description: descData.plain_text || descData.text || "",
      "descripción": descData.plain_text || descData.text || "" // Support accented version
    };

    return res.json({
      author: AUTHOR,
      categories: categories.length > 0 ? categories : ["Detalle"],
      item: processedItem,
      "ítem": processedItem // Support accented version
    });

  } catch (error) {
    console.error(`[API Error] Item details error for ID ${id}:`, error.message);
    console.warn("[API] Using local PWVA mock database fallback.");
    const mockItem = getMockItem(id);
    return res.json({
      author: AUTHOR,
      categories: mockItem.categories,
      item: mockItem.item,
      "ítem": mockItem.item
    });
  }
});

// Serve frontend static assets in production
const frontendBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(frontendBuildPath));

app.get("*", (req, res, next) => {
  // If request is for api, pass it to next (which will result in a 404 for api routes)
  if (req.path.startsWith("/api/")) {
    return next();
  }
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`[Server] Server running on http://localhost:${PORT}`);
});
