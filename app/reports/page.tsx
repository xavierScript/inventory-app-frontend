"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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

const ReportsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [dateRange, setDateRange] = useState("30"); // days
  const [statusFilter, setStatusFilter] = useState("all");

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
        setFilteredProducts(data.products);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [router]);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Department filter
    if (selectedDepartment !== "all") {
      filtered = filtered.filter((p) => p.department === selectedDepartment);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Date range filter
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));
    filtered = filtered.filter((p) => new Date(p.createdAt) >= daysAgo);

    setFilteredProducts(filtered);
  }, [products, selectedDepartment, dateRange, statusFilter]);

  // Get unique departments
  const departments = [...new Set(products.map((p) => p.department))];

  // Chart data
  const statusData = [
    {
      name: "Functional",
      value: filteredProducts.filter((p) => p.status === "functional").length,
      color: "#10B981",
    },
    {
      name: "Non-Functional",
      value: filteredProducts.filter((p) => p.status === "non-functional")
        .length,
      color: "#EF4444",
    },
  ];

  const departmentData = departments.map((dept) => ({
    name: dept,
    total: filteredProducts.filter((p) => p.department === dept).length,
    functional: filteredProducts.filter(
      (p) => p.department === dept && p.status === "functional"
    ).length,
    nonFunctional: filteredProducts.filter(
      (p) => p.department === dept && p.status === "non-functional"
    ).length,
  }));

  // Monthly trend data (last 6 months)
  const getMonthlyTrend = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleString("default", { month: "short" });
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const count = products.filter((p) => {
        const createdDate = new Date(p.createdAt);
        return createdDate >= monthStart && createdDate <= monthEnd;
      }).length;

      months.push({ month: monthName, count });
    }
    return months;
  };

  // Top models
  const getTopModels = () => {
    const modelCounts = filteredProducts.reduce((acc, product) => {
      acc[product.model] = (acc[product.model] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(modelCounts)
      .map(([model, count]) => ({ model, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  // Export functions
  const exportToCSV = () => {
    const headers = [
      "Name",
      "Staff ID",
      "Department",
      "Model",
      "Serial Number",
      "Status",
      "Created Date",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredProducts.map((p) =>
        [
          `${p.firstName} ${p.lastName}`,
          p.staffId,
          p.department,
          p.model,
          p.serialNumber,
          p.status,
          new Date(p.createdAt).toLocaleDateString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory-report-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateSummaryReport = () => {
    const totalItems = filteredProducts.length;
    const functionalItems = filteredProducts.filter(
      (p) => p.status === "functional"
    ).length;
    const nonFunctionalItems = filteredProducts.filter(
      (p) => p.status === "non-functional"
    ).length;
    const functionalPercentage =
      totalItems > 0 ? ((functionalItems / totalItems) * 100).toFixed(1) : "0";

    // Create PDF
    const doc = new jsPDF();

    // Set font styles
    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.text("INVENTORY SUMMARY REPORT", 20, 30);

    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 45);
    doc.text(
      `Filters: Department=${selectedDepartment}, Status=${statusFilter}, Date Range=${dateRange} days`,
      20,
      55
    );

    // Summary section
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text("SUMMARY", 20, 75);

    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text(`Total Items: ${totalItems}`, 20, 90);
    doc.text(
      `Functional: ${functionalItems} (${functionalPercentage}%)`,
      20,
      100
    );
    doc.text(
      `Non-Functional: ${nonFunctionalItems} (${(
        100 - parseFloat(functionalPercentage)
      ).toFixed(1)}%)`,
      20,
      110
    );

    // Department breakdown
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text("DEPARTMENT BREAKDOWN", 20, 130);

    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    let yPos = 145;
    departmentData.forEach((dept) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(
        `${dept.name}: ${dept.total} items (${dept.functional} functional, ${dept.nonFunctional} non-functional)`,
        20,
        yPos
      );
      yPos += 10;
    });

    // Top models
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text("TOP EQUIPMENT MODELS", 20, yPos + 10);

    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    yPos += 25;
    getTopModels().forEach((model, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`${index + 1}. ${model.model}: ${model.count} items`, 20, yPos);
      yPos += 10;
    });

    // Save the PDF
    doc.save(`inventory-summary-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg">Loading reports...</p>
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
        <div className="flex flex-col gap-6 mb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Reports & Analytics
            </h1>
            <p className="mt-2 text-slate-600">
              Comprehensive inventory analysis and exportable reports
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={generateSummaryReport}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
            >
              Summary Report
            </button>
          </div>
        </div>

        {/* Filters */}
        <motion.div
          className="p-6 mb-8 bg-white rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Filters</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full p-2 text-slate-800 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 text-slate-800 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="functional">Functional</option>
                <option value="non-functional">Non-Functional</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full p-2 text-slate-800 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
                <option value="all">All time</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="p-2 text-sm text-slate-600 bg-slate-100 rounded-md">
                {filteredProducts.length} items found
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Monthly Trend */}
          <motion.div
            className="p-6 bg-white rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
              Monthly Inventory Growth
            </h3>
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={getMonthlyTrend()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3B82F6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Status Distribution */}
          <motion.div
            className="p-6 bg-white rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
              Status Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Department Comparison */}
          <motion.div
            className="p-6 bg-white rounded-lg shadow-lg lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
              Department Comparison
            </h3>
            <div className="h-80">
              <ResponsiveContainer>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="functional" fill="#10B981" name="Functional" />
                  <Bar
                    dataKey="nonFunctional"
                    fill="#EF4444"
                    name="Non-Functional"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Top Models */}
        <motion.div
          className="p-6 mt-8 bg-white rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="mb-4 text-lg font-semibold text-slate-800">
            Top Equipment Models
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getTopModels().map((model, index) => (
              <div key={model.model} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-800">
                      {model.model}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {model.count} items
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    #{index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ReportsPage;
