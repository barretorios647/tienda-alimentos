"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [whatsapp, setWhatsapp] = useState("529999999999");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Alimentos");
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");
    if (loggedIn !== "true") {
      router.push("/admin/login");
      return;
    }
    setAuthorized(true);
    loadData();
  }, [router]);

  async function loadData() {
    const [{ data: productRows }, { data: settingRow }] = await Promise.all([
      supabase.from("products").select("*").order("id"),
      supabase.from("settings").select("value").eq("key", "whatsappNumber").single(),
    ]);
    if (productRows) setProducts(productRows);
    if (settingRow?.value) setWhatsapp(settingRow.value);
  }

  function logout() {
    localStorage.removeItem("adminLoggedIn");
    router.push("/admin/login");
  }

  async function saveWhatsapp() {
    const { error } = await supabase
      .from("settings")
      .upsert({ key: "whatsappNumber", value: whatsapp }, { onConflict: "key" });
    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      alert("Número de WhatsApp guardado");
    }
  }

  function clearForm() {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("Alimentos");
    setImage("");
    setEditingId(null);
  }

  async function addOrUpdateProduct() {
    if (!name || !description || !price || !category || !image) {
      alert("Completa todos los campos");
      return;
    }
    setSaving(true);
    if (editingId !== null) {
      const { error } = await supabase
        .from("products")
        .update({ name, description, price: Number(price), category, image })
        .eq("id", editingId);
      if (error) {
        alert("Error al actualizar: " + error.message);
      } else {
        await loadData();
        clearForm();
        alert("Producto actualizado");
      }
    } else {
      const { error } = await supabase
        .from("products")
        .insert({ name, description, price: Number(price), category, image });
      if (error) {
        alert("Error al agregar: " + error.message);
      } else {
        await loadData();
        clearForm();
        alert("Producto agregado");
      }
    }
    setSaving(false);
  }

  function editProduct(product: Product) {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(String(product.price));
    setCategory(product.category);
    setImage(product.image);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteProduct(id: number) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Error al eliminar: " + error.message);
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  }

  if (!authorized) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
        padding: "30px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            background: "#111827",
            color: "white",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>Panel de administración</h1>
            <p style={{ margin: "8px 0 0 0", color: "#d1d5db" }}>
              Gestiona productos, fotos y número de WhatsApp
            </p>
          </div>
          <button
            onClick={logout}
            style={{
              padding: "12px 16px",
              border: "none",
              borderRadius: "10px",
              background: "white",
              color: "#111827",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Cerrar sesión
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* WhatsApp */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "22px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            }}
          >
            <h2>Número de WhatsApp</h2>
            <input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ejemplo: 529999999999"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                marginBottom: "12px",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={saveWhatsapp}
              style={{
                padding: "12px 16px",
                border: "none",
                borderRadius: "10px",
                background: "#111827",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Guardar número
            </button>
          </div>

          {/* Add / edit product */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "22px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            }}
          >
            <h2>{editingId !== null ? "Editar producto" : "Agregar producto"}</h2>
            {(
              [
                { value: name, setter: setName, placeholder: "Nombre del producto" },
                { value: description, setter: setDescription, placeholder: "Descripción" },
              ] as { value: string; setter: (v: string) => void; placeholder: string }[]
            ).map(({ value, setter, placeholder }) => (
              <input
                key={placeholder}
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  marginBottom: "10px",
                  boxSizing: "border-box",
                }}
              />
            ))}
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Precio"
              type="number"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                marginBottom: "10px",
                boxSizing: "border-box",
              }}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                marginBottom: "10px",
                boxSizing: "border-box",
              }}
            >
              <option value="Alimentos">Alimentos</option>
              <option value="Aseo">Aseo</option>
            </select>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="URL de la foto del producto"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                marginBottom: "12px",
                boxSizing: "border-box",
              }}
            />
            {image && (
              <img
                src={image}
                alt="Vista previa"
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginBottom: "12px",
                  background: "#e5e7eb",
                }}
              />
            )}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={addOrUpdateProduct}
                disabled={saving}
                style={{
                  padding: "12px 16px",
                  border: "none",
                  borderRadius: "10px",
                  background: editingId !== null ? "#2563eb" : "#16a34a",
                  color: "white",
                  cursor: saving ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving
                  ? "Guardando…"
                  : editingId !== null
                  ? "Guardar cambios"
                  : "Guardar producto"}
              </button>
              <button
                onClick={clearForm}
                style={{
                  padding: "12px 16px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#6b7280",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>

        {/* Product list */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "22px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            marginTop: "24px",
          }}
        >
          <h2>Productos actuales</h2>
          {products.length === 0 ? (
            <p>No hay productos guardados</p>
          ) : (
            <div style={{ display: "grid", gap: "14px" }}>
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "16px",
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    gap: "16px",
                    alignItems: "start",
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      background: "#e5e7eb",
                    }}
                  />
                  <div>
                    <strong style={{ fontSize: "18px" }}>{product.name}</strong>
                    <p style={{ margin: "8px 0", color: "#4b5563" }}>{product.description}</p>
                    <p style={{ margin: "6px 0" }}>
                      <strong>Precio:</strong> ${product.price}
                    </p>
                    <p style={{ margin: "6px 0 12px 0" }}>
                      <strong>Categoría:</strong> {product.category}
                    </p>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => editProduct(product)}
                        style={{
                          padding: "10px 14px",
                          background: "#2563eb",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        style={{
                          padding: "10px 14px",
                          background: "#dc2626",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
