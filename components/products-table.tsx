"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import AddProductModal from "./add-product-modal";
import * as XLSX from "xlsx";

const initialProducts = [
  {
    firstName: "David",
    lastName: "Onwuka",
    staffId: 1111,
    designation: "IT Specialist",
    department: "IT",
    location: "Main Office",
    block: "A",
    roomNumber: "101",
    make: "Dell",
    model: "XPS 15",
    serialNumber: "SN430",
    capacityVA: "650VA",
    issueDate: "2023-01-15",
    status: "functional",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    staffId: 2111,
    designation: "HR Manager",
    department: "Human Resources",
    location: "Building B",
    block: "B",
    roomNumber: "205",
    make: "HP",
    model: "EliteBook",
    serialNumber: "SN257",
    capacityVA: "500VA",
    issueDate: "2022-11-20",
    status: "non-functional",
  },
  {
    firstName: "John",
    lastName: "Doe",
    staffId: 5112,
    designation: "Software Engineer",
    department: "Engineering",
    location: "Tech Park",
    block: "C",
    roomNumber: "310",
    make: "Lenovo",
    model: "ThinkPad T490",
    serialNumber: "SN405",
    capacityVA: "650VA",
    issueDate: "2023-03-10",
    status: "functional",
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  const statusClasses = {
    functional: "bg-emerald-100 text-emerald-700",
    "non-functional": "bg-red-100 text-red-700",
  };
  // @ts-ignore
  const statusClass = statusClasses[status] || "bg-slate-100 text-slate-700";

  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full ${statusClass}`}
    >
      {status}
    </span>
  );
};

const ProductsTable = () => {
  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<any | null>(null);

  const handleAddProduct = (newProduct: any) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleUpdateProduct = (updatedProduct: any) => {
    // @ts-ignore
    setProducts(
      products.map((p) =>
        p.serialNumber === updatedProduct.serialNumber ? updatedProduct : p
      )
    );
  };

  const handleDeleteProduct = (serialNumber: string) => {
    // @ts-ignore
    setProducts(products.filter((p) => p.serialNumber !== serialNumber));
  };

  const handleOpenModal = (product: any = null) => {
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "products.xlsx");
  };

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
          <h2 className="text-2xl font-bold text-slate-800">Products</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
            >
              Add Product
            </button>
            <button className="px-4 py-2 font-semibold text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors">
              Filters
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 font-semibold text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors"
            >
              Download all
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="p-4 font-semibold whitespace-nowrap">
                  First Name
                </th>
                <th className="p-4 font-semibold whitespace-nowrap">
                  Last Name
                </th>
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
                <th className="p-4 font-semibold whitespace-nowrap">
                  Room Number
                </th>
                <th className="p-4 font-semibold whitespace-nowrap">Make</th>
                <th className="p-4 font-semibold whitespace-nowrap">Model</th>
                <th className="p-4 font-semibold whitespace-nowrap">
                  Serial Number
                </th>
                <th className="p-4 font-semibold whitespace-nowrap">
                  Capacity (VA)
                </th>
                <th className="p-4 font-semibold whitespace-nowrap">
                  Issue Date
                </th>
                <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                <th className="p-4 font-semibold whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <motion.tr
                  key={product.serialNumber}
                  className="border-b hover:bg-slate-50 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <td className="p-4 text-slate-800 whitespace-nowrap">
                    {product.firstName}
                  </td>
                  <td className="p-4 text-slate-800 whitespace-nowrap">
                    {product.lastName}
                  </td>
                  <td className="p-4 text-slate-800 whitespace-nowrap">
                    {product.staffId}
                  </td>
                  <td className="p-4 text-slate-800 whitespace-nowrap">
                    {product.designation}
                  </td>
                  <td className="p-4 text-slate-800 whitespace-nowrap">
                    {product.department}
                  </td>
                  <td className="p-4 text-slate-800 whitespace-nowrap">
                    {product.location}
                  </td>
                  <td className="p-4 text-slate-800 whitespace-nowrap">
                    {product.block}
                  </td>
                  <td className="p-4 text-slate-800 whitespace-nowrap">
                    {product.roomNumber}
                  </td>
                  <td className="p-4 text-slate-800 whitespace-nowrap">
                    {product.make}
                  </td>
                  <td className="p-4 text-slate-800 whitespace-nowrap">
                    {product.model}
                  </td>
                  <td className="p-4 text-slate-800 whitespace-nowrap">
                    {product.serialNumber}
                  </td>
                  <td className="p-4 text-slate-800 whitespace-nowrap">
                    {product.capacityVA}
                  </td>
                  <td className="p-4 text-slate-800 whitespace-nowrap">
                    {product.issueDate}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        Update
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteProduct(product.serialNumber)
                        }
                        className="font-semibold text-red-600 hover:text-red-700"
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
        <div className="flex items-center justify-between pt-4">
          <button className="px-4 py-2 font-semibold text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors">
            Previous
          </button>
          <span className="text-slate-600">
            Page 1 of {Math.ceil(products.length / 10)}
          </span>
          <button className="px-4 py-2 font-semibold text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors">
            Next
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default ProductsTable;
