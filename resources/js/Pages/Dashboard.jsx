import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { to } from "../../../utilities/tools.js";
import { usePage } from "@inertiajs/react";

export default function Dashboard({
  auth,
  roles,
  salesData,
  salesForCategory,
}) {
  const { props } = usePage();
  const { status } = props;

  return (
    <AuthenticatedLayout
      user={auth.user}
      roles={roles}
      header={
        <h2 className="font-semibold text-xl leading-tight">Dashboard</h2>
      }
    >
      <Head title="Dashboard" />
      <div className="min-h-screen">
        <div className=" mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="rounded-lg p-4">
              {status && (
                <div className="alert alert-success mb-4">{status}</div>
              )}
              <h2 className="text-2xl font-semibold mb-4">
                Hola, {auth.user.name}!
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ventas Mensuales */}
                <div className="bg-gray-900 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    Ventas Mensuales
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />

                      <YAxis
                        tickFormatter={(value) =>
                          `$${
                            value.toLocaleString("es-MX").length > 5
                              ? value.toLocaleString("es-MX").slice(0, 3)
                              : value.toLocaleString("es-MX")
                          }`
                        }
                      />
                      <Tooltip
                        formatter={(value) => [to.pesos(value), "Ventas"]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="#5FE58E"
                        activeDot={{ r: 8 }}
                        name="Hasta la actualidad"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {/* Compras por Categoría */}
                <div className="bg-gray-900 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    Ventas por Categoría
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesForCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="purchases"
                        fill="#5FE58E"
                        name="Categorias"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
