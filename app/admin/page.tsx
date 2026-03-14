"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Frijoles negros 1kg",
    description: "Frijoles secos seleccionados",
    price: 3,
    category: "Alimentos",
    image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e1?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Huevos (docena)",
    description: "Huevos frescos de granja",
    price: 4,
    category: "Alimentos",
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Leche 1L",
    description: "Leche entera pasteurizada",
    price: 2.5,
    category: "Alimentos",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Azúcar 1kg",
    description: "Azúcar refinada blanca",
    price: 2,
    category: "Alimentos",
    image: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Detergente líquido",
    description: "Detergente para ropa 1L",
    price: 5,
    category: "Aseo",
    image: "https://images.unsplash.com/photo-1583947582886-f40ec95dd752?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Jabón de baño",
    description: "Jabón corporal antibacterial",
    price: 1.5,
    category: "Aseo",
    image: "https://images.unsplash.com/photo-1607006483225-5e4df0f69f0d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 8,
    name: "Papel higiénico",
    description: "Paquete de 6 rollos",
    price: 4,
    category: "Aseo",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 9,
    name: "Cloro 1L",
    description: "Cloro desinfectante 1L",
    price: 3,
    category: "Aseo",
    image: "https://images.unsplash.com/photo-1596704017254-9751f9f3d1e9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 10,
    name: "Esponja de cocina",
    description: "Esponja para lavar platos",
    price: 1,
    category: "Aseo",
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?q=80&w=1200&auto=format&fit=crop",
  },
];

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

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");

    if (loggedIn !== "true") {
      router.push("/admin/login");
      return;
    }

    setAuthorized(true);

    const savedProducts = localStorage.getItem("products");
    const savedPhone = localStorage.getItem("whatsappNumber");

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(defaultProducts);
      localStorage.setItem("products", JSON.stringify(defaultProducts));
    }

    if (savedPhone) {
      setWhatsapp(savedPhone);
    }
  }, [router]);

  function logout() {
    localStorage.removeItem("adminLoggedIn");
    router.push("/admin/login");
  }

  function saveWhatsapp() {
    localStorage.setItem("whatsappNumber", whatsapp);
    alert("Número de WhatsApp guardado");
  }

  function clearForm() {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("Alimentos");
    setImage("");
    setEditingId(null);
  }

  function saveProducts(updatedProducts: Product[]) {
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  }

  function addOrUpdateProduct() {
    if (!name || !description || !price || !category || !image) {
      alert("Completa todos los campos");
      return;
    }

    if (editingId) {
      const updatedProducts = products.map((product) =>
        product.id === editingId
          ? {
              ...product,
              name,
              description,
              price: Number(price),
              category,
              image,
            }
          : product
      );

      saveProducts(updatedProducts);
      clearForm();
      alert("Producto actualizado");
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name,
      description,
      price: Number(price),
      category,
      image,
    };

    const updatedProducts = [...products, newProduct];
    saveProducts(updatedProducts);
    clearForm();
    alert("Producto agregado");
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

  function deleteProduct(id: number) {
    const updatedProducts = products.filter((product) => product.id !== id);
    saveProducts(updatedProducts);
  }

  function resetStore() {
    localStorage.setItem("products", JSON.stringify(defaultProducts));
    setProducts(defaultProducts);
    clearForm();
    alert("Productos restablecidos");
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
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
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

          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "22px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            }}
          >
            <h2>{editingId ? "Editar producto" : "Agregar producto"}</h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del producto"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                marginBottom: "10px",
              }}
            />

            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                marginBottom: "10px",
              }}
            />

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
                style={{
                  padding: "12px 16px",
                  border: "none",
                  borderRadius: "10px",
                  background: editingId ? "#2563eb" : "#16a34a",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {editingId ? "Guardar cambios" : "Guardar producto"}
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

          <button
            onClick={resetStore}
            style={{
              marginTop: "20px",
              padding: "12px 16px",
              background: "#111827",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "10px",
              fontWeight: "bold",
            }}
          >
            Restablecer productos por defecto
          </button>
        </div>
      </div>
    </div>
  );
}
