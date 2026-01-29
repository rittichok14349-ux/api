import React, { useState, useEffect } from "react";
import api from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // 1. สร้าง State สำหรับฟอร์ม (ตามข้อมูลที่คุณระบุมา)
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    totalAmount: "",
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/orders");
      setOrders(response.data.data || response.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("ไม่สามารถดึงข้อมูลคำสั่งซื้อได้");
    } finally {
      setLoading(false);
    }
  };

  // 2. ฟังก์ชันจัดการการพิมพ์ใน Input
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
      await api.post("/orders", formData);
      setFormData({
        customerName: "",
        email: "",
        phone: "",
        totalAmount: "",
      });
      fetchOrders();
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการเพิ่มสมาชิก:", err);
      alert("เพิ่มสมาชิกไม่สำเร็จ กรุณาเช็ค CORS ที่ Backend");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <i className="bi bi-cart-fill text-orange-600"></i> จัดการคำสั่งซื้อ
        </h1>

        <form onSubmit={handleSubmit} className="mb-6 flex gap-2 flex-wrap">
          <input
            className="border p-2 rounded"
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Customer Name"
            required
          />
          <input
            className="border p-2 rounded"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            className="border p-2 rounded"
            type="number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            required
          />
          <input
            className="border p-2 rounded"
            type="number"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChange}
            placeholder="Total Amount"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            เพิ่ม
          </button>
        </form>

        {loading && <p>กำลังโหลดข้อมูลสมาชิก...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* --- ส่วนแสดงตารางเดิม --- */}
        {loading ? (
          <p>กำลังโหลด...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Order #</th>
                <th className="border p-2">ลูกค้า</th>
                <th className="border p-2">อีเมล</th>
                <th className="border p-2 text-right">ยอดเงิน</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="border p-2">{order.orderNumber}</td>
                  <td className="border p-2">{order.customerName}</td>
                  <td className="border p-2">{order.email}</td>
                  <td className="border p-2 text-right">
                    ฿{order.totalAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;
