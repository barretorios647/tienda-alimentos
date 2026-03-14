"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Arroz 1kg",
    description: "Arroz blanco de grano largo",
    price: 2,
    category: "Alimentos",
    image: "https://via.placeholder.com/600x400?text=Arroz+1kg",
  },
  {
    id: 2,
    name: "Frijoles negros 1kg",
    description: "Frijoles secos seleccionados",
    price: 3,
    category: "Alimentos",
    image: "https://via.placeholder.com/600x400?text=Frijoles",
  },
  {
    id: 3,
    name: "Huevos (docena)",
    description: "Huevos frescos de granja",
    price: 4,
    category: "Alimentos",
    image: "https://via.placeholder.com/600x400?text=Huevos",
  },
  {
    id: 4,
    name: "Detergente líquido",
    description: "Detergente para ropa 1L",
    price: 5,
    category: "Aseo",
    image: "https://via.placeholder.com/600x400?text=Detergente",
  },
];

export default function Home() {
  const [products] = useState<Product[]>(defaultProducts);
  const [cart, setCart] = useState<Product[]>([]);

  function addToCart(product: Product) {
    setCart([...cart, product]);
  }

  function removeFromCart(index: number) {
    setCart(cart.filter((_, i) => i !== index));
  }

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  }, [cart]);

  function sendWhatsApp() {
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    let message = "Hola, quiero hacer este pedido:%0A%0A";

    cart.forEach((item) => {
      message += `• ${item.name} - $${item.price}%0A`;
    });

    message += `%0ATotal: $${total}`;
    window.open(`https://wa.me/529999999999?text=${message}`, "_blank");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
        color: "#111827",
      }}
    >
      <header
        style={{
          background: "#111827",
          color: "white",
          padding: "22px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "28px" }}>Mini Mercado</h1>
          <p style={{ margin: "6px 0 0 0", color: "#d1d5db" }}>
            Alimentos y productos de aseo
          </p>
        </div>

        <a
          href="/admin/login"
          style={{
            background: "white",
            color: "#111827",
            padding: "10px 16px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Admin
        </a>
      </header>

      <main style={{ padding: "30px", maxWidth: "1400px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          <section>
            <h2 style={{ marginBottom: "18px" }}>Productos disponibles</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                gap: "18px",
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "18px",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                    border: "1px solid #eef2f7",
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      marginBottom: "14px",
                      background: "#e5e7eb",
                    }}
                  />

                  <h3 style={{ margin: "0 0 8px 0" }}>{product.name}</h3>
                  <p style={{ color: "#4b5563", minHeight: "40px" }}>
                    {product.description}
                  </p>

                  <p style={{ margin: "8px 0", fontSize: "14px", color: "#6b7280" }}>
                    Categoría: <strong>{product.category}</strong>
                  </p>

                  <p style={{ fontSize: "24px", fontWeight: "bold", margin: "10px 0" }}>
                    ${product.price}
                  </p>

                  <button
                    onClick={() => addToCart(product)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "none",
                      borderRadius: "10px",
                      background: "#111827",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Agregar al carrito
                  </button>
                </div>
              ))}
            </div>
          </section>

          <aside
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Carrito</h2>

            {cart.length === 0 ? (
              <p style={{ color: "#6b7280" }}>No hay productos agregados.</p>
            ) : (
              <>
                <div style={{ display: "grid", gap: "12px" }}>
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        borderBottom: "1px solid #e5e7eb",
                        paddingBottom: "10px",
                      }}
                    >
                      <strong>{item.name}</strong>
                      <div style={{ color: "#6b7280", margin: "4px 0" }}>${item.price}</div>
                      <button
                        onClick={() => removeFromCart(index)}
                        style={{
                          padding: "8px 10px",
                          border: "none",
                          borderRadius: "8px",
                          background: "#dc2626",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>

                <p style={{ marginTop: "16px", fontSize: "18px" }}>
                  <strong>Total: ${total}</strong>
                </p>

                <button
                  onClick={sendWhatsApp}
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    padding: "14px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#16a34a",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Pedir por WhatsApp
                </button>
              </>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}