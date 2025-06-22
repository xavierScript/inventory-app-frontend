"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AddProductModal = ({
  isOpen,
  onClose,
  onAddProduct,
  onUpdateProduct,
  productToEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: any) => void;
  onUpdateProduct: (product: any) => void;
  productToEdit: any | null;
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    staffId: "",
    designation: "",
    department: "",
    location: "",
    block: "",
    roomNumber: "",
    make: "",
    model: "",
    serialNumber: "",
    capacityVA: "",
    issueDate: "",
    status: "functional",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        firstName: productToEdit.firstName || "",
        lastName: productToEdit.lastName || "",
        staffId: productToEdit.staffId?.toString() || "",
        designation: productToEdit.designation || "",
        department: productToEdit.department || "",
        location: productToEdit.location || "",
        block: productToEdit.block || "",
        roomNumber: productToEdit.roomNumber || "",
        make: productToEdit.make || "",
        model: productToEdit.model || "",
        serialNumber: productToEdit.serialNumber || "",
        capacityVA: productToEdit.capacityVA || "",
        issueDate: productToEdit.issueDate
          ? new Date(productToEdit.issueDate).toISOString().split("T")[0]
          : "",
        status: productToEdit.status || "functional",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        staffId: "",
        designation: "",
        department: "",
        location: "",
        block: "",
        roomNumber: "",
        make: "",
        model: "",
        serialNumber: "",
        capacityVA: "",
        issueDate: "",
        status: "functional",
      });
    }
    setError("");
  }, [productToEdit, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const productData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        staffId: parseInt(formData.staffId),
        designation: formData.designation,
        department: formData.department,
        location: formData.location,
        block: formData.block,
        roomNumber: formData.roomNumber,
        make: formData.make,
        model: formData.model,
        serialNumber: formData.serialNumber,
        capacityVA: formData.capacityVA,
        issueDate: formData.issueDate,
        status: formData.status,
      };

      if (productToEdit) {
        // Update product
        const response = await fetch(
          `https://inventory-app-backend-8i8b.onrender.com/api/products/${productToEdit._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(productData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update product");
        }

        const updatedProduct = await response.json();
        onUpdateProduct(updatedProduct.product);
      } else {
        // Add new product
        const response = await fetch(
          "https://inventory-app-backend-8i8b.onrender.com/api/products",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(productData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add product");
        }

        const newProduct = await response.json();
        onAddProduct(newProduct.product);
      }

      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isUpdateMode = !!productToEdit;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black bg-opacity-60"
            onClick={onClose}
          ></div>
          <motion.div
            className="relative w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, y: -50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="mb-6 text-2xl font-bold text-slate-800">
              {isUpdateMode
                ? "Update Inventory Item"
                : "Add New Inventory Item"}
            </h2>

            {error && (
              <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Staff ID *
                  </label>
                  <input
                    type="number"
                    name="staffId"
                    placeholder="Enter staff ID"
                    value={formData.staffId}
                    onChange={handleChange}
                    className="w-full p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Designation *
                  </label>
                  <input
                    type="text"
                    name="designation"
                    placeholder="Enter designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Department *
                  </label>
                  <input
                    type="text"
                    name="department"
                    placeholder="Enter department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Enter location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Block *
                  </label>
                  <input
                    type="text"
                    name="block"
                    placeholder="Enter block"
                    value={formData.block}
                    onChange={handleChange}
                    className="w-full p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    name="roomNumber"
                    placeholder="Enter room number"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    className="w-full p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Make *
                  </label>
                  <input
                    type="text"
                    name="make"
                    placeholder="Enter make"
                    value={formData.make}
                    onChange={handleChange}
                    className="w-full p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Model *
                  </label>
                  <input
                    type="text"
                    name="model"
                    placeholder="Enter model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Serial Number *
                  </label>
                  <input
                    type="text"
                    name="serialNumber"
                    placeholder="Enter serial number"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    className="w-full p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Capacity (VA) *
                  </label>
                  <input
                    type="text"
                    name="capacityVA"
                    placeholder="Enter capacity VA"
                    value={formData.capacityVA}
                    onChange={handleChange}
                    className="w-full p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleChange}
                    className="w-full p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="functional">Functional</option>
                    <option value="non-functional">Non-functional</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 font-medium text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : isUpdateMode
                    ? "Update Item"
                    : "Add Item"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddProductModal;
