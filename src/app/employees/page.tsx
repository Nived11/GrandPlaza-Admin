'use client';

import React from "react";
import EmployeesMainPage from "@/features/employees/EmployeesMainPage";
import AdminRoleGuard from "@/components/auth/AdminRoleGuard";

export default function EmployeesPage() {
  return (
    <AdminRoleGuard>
      <EmployeesMainPage />
    </AdminRoleGuard>
  );
}
