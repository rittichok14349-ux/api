import React, { useState, useEffect } from "react";
import api from "../services/api";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '', 
    lastName: '',
    email: ''
  });

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/members");
      setMembers(response.data.data || response.data); 
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสมาชิก:", err);
      setError("ไม่สามารถดึงข้อมูลสมาชิกได้");
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
      await api.post("/members", formData);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
      });
      fetchMembers(); 
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการเพิ่มสมาชิก:", err);
      alert("เพิ่มสมาชิกไม่สำเร็จ กรุณาเช็ค CORS ที่ Backend");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <i className="bi bi-people-fill text-blue-600"></i>
          จัดการข้อมูลสมาชิก
        </h1>

        <form onSubmit={handleSubmit} className="mb-6 flex gap-2 flex-wrap">
          <input 
            className="border p-2 rounded"
            type="text" name="firstName" 
            value={formData.firstName} 
            onChange={handleChange} 
            placeholder='First Name' required
          />
          <input 
            className="border p-2 rounded"
            type="text" name="lastName" 
            value={formData.lastName} 
            onChange={handleChange} 
            placeholder='Last Name' required
          />
          <input 
            className="border p-2 rounded"
            type="email" name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder='Email' required
          />
          <button type='submit' className="bg-blue-600 text-white px-4 py-2 rounded">เพิ่มสมาชิก</button>
        </form>

        {loading && <p>กำลังโหลดข้อมูลสมาชิก...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && (
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">ชื่อ</th>
                <th className="border px-4 py-2">นามสกุล</th>
                <th className="border px-4 py-2">อีเมล</th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? members.map((member) => (
                <tr key={member.id}>
                  <td className="border px-4 py-2">{member.id}</td>
                  <td className="border px-4 py-2">{member.firstName}</td>
                  <td className="border px-4 py-2">{member.lastName}</td>
                  <td className="border px-4 py-2">{member.email}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">ไม่พบข้อมูลสมาชิก</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Members;