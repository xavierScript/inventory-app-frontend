"use client";
import React from "react";
import InventoryStats from "./inventory-stats";
import ProductsTable from "./products-table";
import Header from "./header";
import { motion } from "framer-motion";

const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header />
      <motion.div
        className="flex flex-col flex-1 p-8 space-y-8 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <InventoryStats />
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <ProductsTable />
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
