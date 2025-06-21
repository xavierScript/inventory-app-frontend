import React from "react";

const DashboardPage = () => {
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="mt-4 text-slate-600">
          This is where the main dashboard content will be displayed.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
