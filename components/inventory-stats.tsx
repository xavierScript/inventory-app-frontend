import React from "react";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const StatCard = ({
  title,
  value,
  subtitle,
  colorClass,
  revenue,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  colorClass: string;
  revenue?: string;
}) => {
  return (
    <motion.div
      className="p-6 bg-white rounded-lg shadow-lg"
      variants={cardVariants}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    >
      <div className={`text-lg font-bold ${colorClass}`}>{title}</div>
      <div className="mt-2 text-4xl font-bold text-slate-800">{value}</div>
      <div className="mt-1 text-slate-500">{subtitle}</div>
      {revenue && <div className="mt-1 text-slate-500">{revenue}</div>}
    </motion.div>
  );
};

const LowStockCard = ({
  title,
  ordered,
  notInStock,
  colorClass,
}: {
  title: string;
  ordered: number;
  notInStock: number;
  colorClass: string;
}) => {
  return (
    <motion.div
      className="p-6 bg-white rounded-lg shadow-lg"
      variants={cardVariants}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    >
      <div className={`text-lg font-bold ${colorClass}`}>{title}</div>
      <div className="flex justify-between mt-2">
        <div>
          <div className="text-4xl font-bold text-slate-800">{ordered}</div>
          <div className="mt-1 text-slate-500">Ordered</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-slate-800">{notInStock}</div>
          <div className="mt-1 text-slate-500">Not in stock</div>
        </div>
      </div>
    </motion.div>
  );
};

const InventoryStats = () => {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-slate-800">
        Overall Inventory
      </h2>
      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <StatCard
          title="Categories"
          value={14}
          subtitle="Last 7 days"
          colorClass="text-emerald-500"
        />
        <StatCard
          title="Total Products"
          value={868}
          subtitle="Last 7 days"
          colorClass="text-emerald-500"
          revenue="₹25000 Revenue"
        />
        <StatCard
          title="Top Selling"
          value={5}
          subtitle="Last 7 days"
          colorClass="text-emerald-500"
          revenue="₹2500 Cost"
        />
        <LowStockCard
          title="Low Stocks"
          ordered={12}
          notInStock={2}
          colorClass="text-red-500"
        />
      </motion.div>
    </div>
  );
};

export default InventoryStats;
