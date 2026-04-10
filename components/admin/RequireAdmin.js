"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminLoggedIn } from "../../lib/crm";

export default function RequireAdmin({ children }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  useEffect(() => { if (!isAdminLoggedIn()) { router.push("/admin/login"); } else { setOk(true); } }, [router]);
  if (!ok) return null;
  return <>{children}</>;
}
