"use client";
import React from "react";
import { motion } from "framer-motion";
import { Clock, User, Building } from "lucide-react";

interface RecentItem {
  _id: string;
  firstName: string;
  lastName: string;
  department: string;
  model: string;
  status: "functional" | "non-functional";
  createdAt: string;
}

interface RecentItemsProps {
  items: RecentItem[];
}

const RecentItems: React.FC<RecentItemsProps> = ({ items }) => {
  const getStatusColor = (status: string) => {
    return status === "functional"
      ? "text-emerald-600 bg-emerald-50"
      : "text-red-600 bg-red-50";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      className="p-6 bg-white rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">Recent Items</h3>
        <Clock className="w-5 h-5 text-slate-400" />
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-800">
                  {item.firstName} {item.lastName}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">
                  {item.department}
                </span>
              </div>

              <span className="text-sm text-slate-600">{item.model}</span>
            </div>

            <div className="flex items-center space-x-3">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                  item.status
                )}`}
              >
                {item.status}
              </span>
              <span className="text-xs text-slate-500">
                {formatDate(item.createdAt)}
              </span>
            </div>
          </motion.div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500">No recent items found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecentItems;
