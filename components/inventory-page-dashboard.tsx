"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter } from "lucide-react";
import AddProductModal from "./add-product-modal";
import ProductsTable from "./products-table";

interface Product {
  _id: string;
  firstName: string;
  lastName: string;
  staffId: string;
  department: string;
  model: string;
  serialNumber: string;
  status: "functional" | "non-functional";
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedDepartment, selectedStatus]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch(
        "https://inventory-app-backend-8i8b.onrender.com/api/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.products);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Department filter
    if (selectedDepartment !== "all") {
      filtered = filtered.filter(
        (product) => product.department === selectedDepartment
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (product) => product.status === selectedStatus
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddProduct = (product: any) => {
    setIsModalOpen(false);
  };

  const handleUpdateProduct = (product: any) => {
    setIsModalOpen(false);
    setProductToEdit(null);
  };

  const handleOpenModal = (product: any = null) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductToEdit(null);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://inventory-app-backend-8i8b.onrender.com/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts(products.filter((product) => product._id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete product");
    }
  };

  const departments = [
    ...new Set(products.map((product) => product.department)),
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-6 mb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Inventory Management
            </h1>
            <p className="mt-2 text-slate-600">
              Manage and track all inventory items across departments
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center px-4 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Item
          </button>
        </div>

        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {/* Filters */}
        <motion.div
          className="p-6 mb-8 bg-white rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 mr-2 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-800">Filters</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute w-5 h-5 text-slate-400 left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 text-slate-800 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="p-2 text-slate-800 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-2 text-slate-800 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="functional">Functional</option>
              <option value="non-functional">Non-Functional</option>
            </select>

            <div className="flex items-center justify-end">
              <span className="text-sm text-slate-600">
                {filteredProducts.length} items found
              </span>
            </div>
          </div>
        </motion.div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProductsTable />
        </motion.div>

        <AddProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          productToEdit={productToEdit}
        />
      </motion.div>
    </div>
  );
};

export default Dashboard;
