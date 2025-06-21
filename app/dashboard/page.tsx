"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import InventoryStats from "@/components/inventory-stats";
import StatusPieChart from "@/components/charts/StatusPieChart";
import DepartmentBarChart from "@/components/charts/DepartmentBarChart";
import RecentItems from "@/components/RecentItems";

interface Product {
  _id: string;
  department: string;
  status: "functional" | "non-functional";
  firstName: string;
  lastName: string;
  model: string;
  createdAt: string;
}

const DashboardPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.replace("/login");
          }
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [router]);

  const statusData = [
    {
      name: "functional",
      value: products.filter((p) => p.status === "functional").length,
    },
    {
      name: "non-functional",
      value: products.filter((p) => p.status === "non-functional").length,
    },
  ];

  const departmentData = products.reduce((acc, product) => {
    const dept = acc.find((d) => d.name === product.department);
    if (dept) {
      dept.count++;
    } else {
      acc.push({ name: product.department, count: 1 });
    }
    return acc;
  }, [] as { name: string; count: number }[]);

  const recentItems = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>
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
        <InventoryStats />

        <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-3">
          <motion.div
            className="p-6 bg-white rounded-lg shadow-lg lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="mb-4 text-xl font-bold text-slate-800">
              Items per Department
            </h3>
            <DepartmentBarChart data={departmentData} />
          </motion.div>

          <motion.div
            className="p-6 bg-white rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="mb-4 text-xl font-bold text-slate-800">
              Item Status
            </h3>
            <StatusPieChart data={statusData} />
          </motion.div>
        </div>

        <div className="mt-8">
          <RecentItems items={recentItems} />
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
