"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, CheckCircle, XCircle, TrendingUp } from "lucide-react";

interface Product {
  _id: string;
  department: string;
  status: "functional" | "non-functional";
  createdAt: string;
}

const InventoryStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    functional: 0,
    nonFunctional: 0,
    departments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          const products: Product[] = data.products;

          const total = products.length;
          const functional = products.filter(
            (p) => p.status === "functional"
          ).length;
          const nonFunctional = products.filter(
            (p) => p.status === "non-functional"
          ).length;
          const departments = new Set(products.map((p) => p.department)).size;

          setStats({ total, functional, nonFunctional, departments });
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Items",
      value: stats.total,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Functional",
      value: stats.functional,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Non-Functional",
      value: stats.nonFunctional,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Departments",
      value: stats.departments,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-6 bg-white rounded-lg shadow-lg animate-pulse"
          >
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-slate-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-6 bg-white rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{stat.title}</p>
              <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default InventoryStats;
