import React from "react";
import { useState, useEffect } from "react";
import api from "../services/api";

const Products = () => {
  const [Products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/products");
      setProducts(response.data.data || response.data);
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:", err);
      setError("ไม่สามารถดึงข้อมูลสินค้าได้");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products", formData);
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
      });
      fetchProducts();
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการเพิ่มสินค้า:", err);
      alert("เพิ่มสินค้าไม่สำเร็จ กรุณาเช็ค CORS ที่ Backend");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <i className="bi bi-box-seam-fill text-green-600"></i>
          จัดการข้อมูลสินค้า
        </h1>
        <form onSubmit={handleSubmit} className="mb-6 flex gap-2 flex-wrap">
          <input
            className="border p-2 rounded flex-1"
            type="text"
            name="name" 
            value={formData.name}
            onChange={handleChange}
            placeholder="ชื่อสินค้า"
            required
          />
          <input
            className="border p-2 rounded flex-1"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="รายละเอียดสินค้า"
          />
          <input
            className="border p-2 rounded w-32"
            type="number"
            name="price" 
            value={formData.price}
            onChange={handleChange}
            placeholder="ราคา"
            required
          />
          <input
            className="border p-2 rounded w-24"
            type="number"
            name="stock" 
            value={formData.stock}
            onChange={handleChange}
            placeholder="สต็อก"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            เพิ่มสินค้า
          </button>
        </form>

        {loading && <p>กำลังโหลดข้อมูลสมาชิก...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && (
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">ชื่อสินค้า</th>
                <th className="border px-4 py-2">รายละเอียด</th>
                <th className="border px-4 py-2">ราคา</th>
                <th className="border px-4 py-2">สต็อก</th>
              </tr>
            </thead>
            <tbody>
              {Products.length > 0 ? (
                Products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{product.name}</td>
                    <td className="border px-4 py-2">{product.description}</td>
                    <td className="border px-4 py-2 text-right">
                      {Number(product.price).toLocaleString()} บาท
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {product.stock}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="border px-4 py-8 text-center text-gray-500"
                  >
                    ไม่พบข้อมูลสินค้า
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Products;
