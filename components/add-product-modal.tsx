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

  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
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
  }, [productToEdit, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productToEdit) {
      onUpdateProduct({ ...formData, staffId: parseInt(formData.staffId) });
    } else {
      onAddProduct({ ...formData, staffId: parseInt(formData.staffId) });
    }
    onClose();
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
            className="relative w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg"
            initial={{ scale: 0.95, y: -50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="mb-6 text-2xl font-bold text-slate-800">
              {isUpdateMode ? "Update Product" : "Add New Product"}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                required
              />
              <input
                type="number"
                name="staffId"
                placeholder="Staff ID"
                value={formData.staffId}
                onChange={handleChange}
                className="p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                required
              />
              <input
                type="text"
                name="designation"
                placeholder="Designation"
                value={formData.designation}
                onChange={handleChange}
                className="p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                required
              />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className="p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                required
              />
              <input
                type="text"
                name="block"
                placeholder="Block"
                value={formData.block}
                onChange={handleChange}
                className="p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                required
              />
              <input
                type="text"
                name="roomNumber"
                placeholder="Room Number"
                value={formData.roomNumber}
                onChange={handleChange}
                className="p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                required
              />
              <input
                type="text"
                name="make"
                placeholder="Make"
                value={formData.make}
                onChange={handleChange}
                className="p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                required
              />
              <input
                type="text"
                name="model"
                placeholder="Model"
                value={formData.model}
                onChange={handleChange}
                className="p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                required
              />
              <input
                type="text"
                name="serialNumber"
                placeholder="Serial Number"
                value={formData.serialNumber}
                onChange={handleChange}
                className="p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                disabled={isUpdateMode}
                required
              />
              <input
                type="text"
                name="capacityVA"
                placeholder="Capacity (VA)"
                value={formData.capacityVA}
                onChange={handleChange}
                className="p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                required
              />
              <input
                type="date"
                name="issueDate"
                placeholder="Issue Date"
                value={formData.issueDate}
                onChange={handleChange}
                className="p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                required
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="p-3 transition-colors bg-slate-50 border border-slate-300 text-slate-800 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="functional">Functional</option>
                <option value="non-functional">Non-functional</option>
              </select>
              <div className="flex justify-end col-span-2 space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 font-semibold text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
                >
                  {isUpdateMode ? "Update Product" : "Add Product"}
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
