import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, router } from "@inertiajs/react";
import { to } from "../../../../utilities/tools.js";
import { Button } from "@headlessui/react";
 
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function SalesDetail({ auth, roles, sales }) {
  console.log("sales", sales);
  const handleReturnToSelection = () => {
   
    router.visit(route("sales.list"));
  };
  return (
    <AuthenticatedLayout
      user={auth.user}
      roles={roles}
      title={"Detalle de Venta"}
    >
      <div className="py-12">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleReturnToSelection}
            className="hover:bg-gray-700 p-1 rounded-full"
          >
            <ChevronLeftIcon className="h-6 w-6 text-white" />
          </Button>
          <h1 className="text-2xl font-semibold text-white">Ventas</h1>
        </div>
        <div className=" mx-auto sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-sm sm:rounded-lg shadow-md rounded-lg p-8 bg-gray-900">
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full table table-striped table-hover">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                      ID Articulo
                    </th>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {sales?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-md font-medium text-gray-500">
                        <Link href={route("sales.showdetails", item?.id_sales)}>
                          {item?.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-md text-gray-500">
                        {item?.price}
                      </td>
                      <td className="px-6 py-4 text-md text-gray-500">
                        {item?.kg}
                      </td>
                      <td className="px-6 py-4 text-md text-gray-500">
                        {to.formatDateTime(item?.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="content-between">
              {sales.length > 0 && (
                <Link href={route("sales.print", sales[0]?.id_sales)}>
                  Imprimir Ticket
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
