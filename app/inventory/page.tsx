"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/inventory-page-dashboard";

export default function InventoryPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
      }
    }
  }, [router]);

  return <Dashboard />;
}
