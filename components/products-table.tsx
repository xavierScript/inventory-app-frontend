"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AddProductModal from "./add-product-modal";
import * as XLSX from "xlsx";

interface Product {
  _id: string;
  firstName: string;
  lastName: string;
  staffId: number;
  designation: string;
  department: string;
  location: string;
  block: string;
  roomNumber: string;
  make: string;
  model: string;
  serialNumber: string;
  capacityVA: string;
  issueDate: string;
  status: "functional" | "non-functional";
  createdAt: string;
  updatedAt: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusClasses = {
    functional: "bg-emerald-100 text-emerald-700",
    "non-functional": "bg-red-100 text-red-700",
  };
  const statusClass =
    statusClasses[status as keyof typeof statusClasses] ||
    "bg-slate-100 text-slate-700";

  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full ${statusClass}`}
    >
      {status}
    </span>
  );
};

const ProductsTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to login if token is invalid
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return;
        }
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [newProduct, ...prevProducts]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p._id === updatedProduct._id ? updatedProduct : p
      )
    );
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this inventory item?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }

      setProducts((prevProducts) =>
        prevProducts.filter((p) => p._id !== productId)
      );
    } catch (err: any) {
      setError(err.message || "Failed to delete product");
    }
  };

  const handleOpenModal = (product: Product | null = null) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductToEdit(null);
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, "inventory.xlsx");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading inventory items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <>
      <AddProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        productToEdit={productToEdit}
      />
      <motion.div
        className="p-8 bg-white rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Inventory Items ({products.length})
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
            >
              Add Item
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 font-semibold text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors"
            >
              Download All
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No inventory items found. Add your first item to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="p-4 font-semibold whitespace-nowrap">Name</th>
                  <th className="p-4 font-semibold whitespace-nowrap">
                    Staff ID
                  </th>
                  <th className="p-4 font-semibold whitespace-nowrap">
                    Designation
                  </th>
                  <th className="p-4 font-semibold whitespace-nowrap">
                    Department
                  </th>
                  <th className="p-4 font-semibold whitespace-nowrap">
                    Location
                  </th>
                  <th className="p-4 font-semibold whitespace-nowrap">Block</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Room</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Make</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Model</th>
                  <th className="p-4 font-semibold whitespace-nowrap">
                    Serial Number
                  </th>
                  <th className="p-4 font-semibold whitespace-nowrap">
                    Capacity
                  </th>
                  <th className="p-4 font-semibold whitespace-nowrap">
                    Issue Date
                  </th>
                  <th className="p-4 font-semibold whitespace-nowrap">
                    Status
                  </th>
                  <th className="p-4 font-semibold whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <motion.tr
                    key={product._id}
                    className="border-b hover:bg-slate-50 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <td className="p-4 font-medium text-slate-800">
                      {product.firstName} {product.lastName}
                    </td>
                    <td className="p-4 text-slate-800">{product.staffId}</td>
                    <td className="p-4 text-slate-600">
                      {product.designation}
                    </td>
                    <td className="p-4 text-slate-600">{product.department}</td>
                    <td className="p-4 text-slate-600">{product.location}</td>
                    <td className="p-4 text-slate-600">{product.block}</td>
                    <td className="p-4 text-slate-600">{product.roomNumber}</td>
                    <td className="p-4 text-slate-800">{product.make}</td>
                    <td className="p-4 text-slate-800">{product.model}</td>
                    <td className="p-4 text-slate-600 font-mono text-sm">
                      {product.serialNumber}
                    </td>
                    <td className="p-4 text-slate-600">{product.capacityVA}</td>
                    <td className="p-4 text-slate-600 text-sm">
                      {new Date(product.issueDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default ProductsTable;
