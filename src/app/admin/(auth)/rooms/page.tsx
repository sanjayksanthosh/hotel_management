"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";

interface Room {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  capacity: number;
  status: string;
  images: { id: string; imageUrl: string }[];
}

const emptyForm = {
  name: "", type: "", description: "", price: "", capacity: "1", status: "Available", images: [""] as string[],
};

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchRooms = useCallback(async () => {
    const res = await fetch("/api/rooms");
    const data = await res.json();
    setRooms(data);
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validImages = form.images.filter((url) => url.trim());
    const body = { ...form, images: validImages };

    try {
      const res = editing
        ? await fetch("/api/admin/rooms", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...body, id: editing }),
          })
        : await fetch("/api/admin/rooms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

      if (res.ok) {
        toast.success(editing ? "Room updated" : "Room created");
        setShowForm(false);
        setEditing(null);
        setForm(emptyForm);
        fetchRooms();
      }
    } catch {
      toast.error("Failed to delete room");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    try {
      const res = await fetch(`/api/admin/rooms?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Room deleted");
        fetchRooms();
      } else {
        const err = await res.json();
        toast.error(err.error);
      }
    } catch {
      toast.error("Failed to delete room");
    }
  };

  const handleEdit = (room: Room) => {
    setForm({
      name: room.name,
      type: room.type,
      description: room.description,
      price: room.price.toString(),
      capacity: room.capacity.toString(),
      status: room.status,
      images: room.images.map((i) => i.imageUrl).concat([""]),
    });
    setEditing(room.id);
    setShowForm(true);
  };

  const addImageField = () => setForm({ ...form, images: [...form.images, ""] });
  const removeImageField = (i: number) => {
    if (form.images.length > 1) {
      setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) });
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a365d]" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Room Management</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyForm); }}
          className="flex items-center gap-2 bg-[#1a365d] text-white px-4 py-2 rounded font-semibold hover:bg-[#2a4a7f] transition"
        >
          <HiPlus /> Add Room
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{editing ? "Edit Room" : "Add New Room"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Room Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Room Type</label>
                <input type="text" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required placeholder="e.g. Deluxe, Suite" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Price Per Night ($)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="0" step="0.01" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Max Occupancy</label>
                <select value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
                  {[1,2,3,4,5,6,7,8,9,10].map((n) => (<option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]">
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Description (use commas for amenities)</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Image URLs</label>
              {form.images.map((url, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input type="url" value={url} onChange={(e) => { const imgs = [...form.images]; imgs[i] = e.target.value; setForm({ ...form, images: imgs }); }} placeholder="https://example.com/image.jpg" className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]" />
                  <button type="button" onClick={() => removeImageField(i)} className="text-red-500 px-2">×</button>
                </div>
              ))}
              <button type="button" onClick={addImageField} className="text-sm text-[#1a365d] hover:underline">+ Add another image</button>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="bg-[#c9a84c] text-[#1a365d] px-6 py-2 rounded font-semibold hover:bg-[#dfc06a] transition">
                {editing ? "Update Room" : "Create Room"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm); }} className="text-gray-500 hover:underline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-medium text-gray-500">Room</th>
              <th className="text-left p-4 font-medium text-gray-500">Type</th>
              <th className="text-left p-4 font-medium text-gray-500">Price</th>
              <th className="text-left p-4 font-medium text-gray-500">Capacity</th>
              <th className="text-left p-4 font-medium text-gray-500">Status</th>
              <th className="text-left p-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-t">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden">
                      <img src={room.images[0]?.imageUrl || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=100&q=80"} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium">{room.name}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-600">{room.type}</td>
                <td className="p-4 font-medium">${room.price}</td>
                <td className="p-4 text-gray-600">{room.capacity}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${room.status === "Available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {room.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(room)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><HiPencil /></button>
                    <button onClick={() => handleDelete(room.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><HiTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400">No rooms added yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
