"use client";
import { use } from "react";
import AdminClientDetailPage from "../../../../pages/admin/AdminClientDetailPage";
export default function Page({ params }) {
  const { id } = use(params);
  return <AdminClientDetailPage clientId={id} />;
}
