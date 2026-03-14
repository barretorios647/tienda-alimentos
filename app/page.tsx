"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

type CartItem = Product & { quantity: number };

const CATEGORIES = ["Todos", "Alimentos", "Aseo"];

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [whatsapp, setWhatsapp] = useState("529999999999");
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [{ data: productRows }, { data: settingRows }] = await Promise.all([
        supabase.from("products").select("*").order("id"),
        supabase.from("settings").select("value").eq("key", "whatsappNumber").single(),
      ]);
      if (productRows) setProducts(productRows);
      if (settingRows?.value) setWhatsapp(settingRows.value);
      setLoading(false);
    }
    loadData();
  }, []);

  const filtered =
    activeCategory === "Todos"
      ? products
      : products.filter((p) => p.category === activeCategory);

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(id: number) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (!existing) return prev;
      if (existing.quantity === 1) return prev.filter((i) => i.id !== id);
      return prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i));
    });
  }

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  function sendWhatsApp() {
    if (cart.length === 0) return;
    const lines = cart.map(
      (i) => `• ${i.name} x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`
    );
    const message = `Hola, me gustaría hacer el siguiente pedido:\n\n${lines.join(
      "\n"
    )}\n\nTotal: $${totalPrice.toFixed(2)}`;
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fb", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <header
        style={{
          background: "#111827",
          color: "white",
          padding: "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
          🛒 Tienda de alimentos
        </h1>
        <button
          onClick={() => setShowCart(true)}
          style={{
            background: "#25d366",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "10px 18px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "15px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          🛍️ Carrito
          {totalItems > 0 && (
            <span
              style={{
                background: "#dc2626",
                borderRadius: "999px",
                padding: "2px 8px",
                fontSize: "13px",
              }}
            >
              {totalItems}
            </span>
          )}
        </button>
      </header>

      {/* Category tabs */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "20px 24px 0",
          maxWidth: "1100px",
          margin: "0 auto",
          flexWrap: "wrap",
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "9px 20px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
              background: activeCategory === cat ? "#111827" : "white",
              color: activeCategory === cat ? "white" : "#374151",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              transition: "all 0.15s",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "20px 24px 40px",
        }}
      >
        {loading ? (
          <p style={{ color: "#9ca3af", textAlign: "center", marginTop: "60px" }}>
            Cargando productos…
          </p>
        ) : filtered.length === 0 ? (
          <p style={{ color: "#9ca3af", textAlign: "center", marginTop: "60px" }}>
            No hay productos en esta categoría.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "20px",
            }}
          >
            {filtered.map((product) => {
              const inCart = cart.find((i) => i.id === product.id);
              return (
                <div
                  key={product.id}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      background: "#e5e7eb",
                    }}
                  />
                  <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <strong style={{ fontSize: "16px", color: "#111827" }}>{product.name}</strong>
                    <p
                      style={{
                        margin: "6px 0 12px",
                        color: "#6b7280",
                        fontSize: "14px",
                        flex: 1,
                      }}
                    >
                      {product.description}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "auto",
                      }}
                    >
                      <span
                        style={{ fontSize: "18px", fontWeight: "bold", color: "#111827" }}
                      >
                        ${product.price.toFixed(2)}
                      </span>
                      {inCart ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              border: "none",
                              background: "#f3f4f6",
                              cursor: "pointer",
                              fontSize: "18px",
                              fontWeight: "bold",
                              lineHeight: 1,
                            }}
                          >
                            −
                          </button>
                          <span
                            style={{
                              fontWeight: "bold",
                              minWidth: "20px",
                              textAlign: "center",
                            }}
                          >
                            {inCart.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(product)}
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              border: "none",
                              background: "#111827",
                              color: "white",
                              cursor: "pointer",
                              fontSize: "18px",
                              fontWeight: "bold",
                              lineHeight: 1,
                            }}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          style={{
                            padding: "9px 16px",
                            background: "#111827",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "14px",
                          }}
                        >
                          Agregar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Cart drawer */}
      {showCart && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            onClick={() => setShowCart(false)}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }}
          />
          <div
            style={{
              position: "relative",
              background: "white",
              width: "100%",
              maxWidth: "420px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxShadow: "-4px 0 30px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0 }}>Tu carrito</h2>
              <button
                onClick={() => setShowCart(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#6b7280",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
              {cart.length === 0 ? (
                <p
                  style={{ color: "#9ca3af", textAlign: "center", marginTop: "40px" }}
                >
                  Tu carrito está vacío
                </p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      gap: "14px",
                      alignItems: "center",
                      marginBottom: "16px",
                      paddingBottom: "16px",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        background: "#e5e7eb",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: "15px" }}>{item.name}</strong>
                      <p
                        style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}
                      >
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "none",
                          background: "#f3f4f6",
                          cursor: "pointer",
                          fontSize: "16px",
                          fontWeight: "bold",
                          lineHeight: 1,
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          fontWeight: "bold",
                          minWidth: "18px",
                          textAlign: "center",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          border: "none",
                          background: "#111827",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "16px",
                          fontWeight: "bold",
                          lineHeight: 1,
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ padding: "20px 24px", borderTop: "1px solid #e5e7eb" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={sendWhatsApp}
                  style={{
                    width: "100%",
                    padding: "15px",
                    background: "#25d366",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  📲 Pedir por WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
