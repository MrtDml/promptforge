"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirect to /dashboard/history which serves as the full project list
export default function ProjectsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/history");
  }, [router]);
  return null;
}
