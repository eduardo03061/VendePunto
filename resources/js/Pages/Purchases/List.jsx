import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { to } from "../../../../utilities/tools.js";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline/index.js";

export default function PurchasesList({ auth, roles, purchases = [] }) { // Valor por defecto añadido aquí
  const [incompletePurchase, setIncompletePurchase] = useState(null);

  // Buscar si existe AL MENOS UNA compra pendiente
  useEffect(() => {
    // Usar optional chaining por si purchases es undefined
    const pendingPurchase = purchases?.find(p => p.status === 'pendiente');
    setIncompletePurchase(pendingPurchase || null);
  }, [purchases]);

  return (
    <AuthenticatedLayout user={auth.user} title="Registro de Compras" roles={roles}>
      <div className="py-3">
        <div className="mx-auto">
          <div className="shadow-sm sm:rounded-lg">
            <div className="flex justify-between gap-8 items-start">
              
              {/* Sección izquierda - Lista completa de compras */}
              <div className="w-2/3 shadow-md rounded-lg p-4 bg-gray-900">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {/* Optional chaining en el map */}
                    {purchases?.map((purchase) => (
                      <tr key={purchase.id} className={purchase.status === 'pendiente' ? 'bg-yellow-100 bg-opacity-10' : ''}>
                        <td className="px-6 py-4 text-white">
                          <Link href={route("purchases.showdetails", purchase.id)} className="hover:text-green-400">
                            {purchase.id}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            purchase.status === 'pendiente' 
                              ? 'bg-yellow-500 text-white' 
                              : 'bg-green-500'
                          }`}>
                            {purchase.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white">${purchase.quantity}</td>
                        <td className="px-6 py-4 text-white">{to.formatDateTime(purchase.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Sección derecha - Botones */}
              <div className="float-end mx-12 flex flex-col gap-4">
                {/* Botón de reanudar solo si existe compra pendiente */}
                {incompletePurchase && (
                  <Link
                    href={route('purchases.showdetails', incompletePurchase.id)}
                    className="btn bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    Reanudar compra #{incompletePurchase.id}
                  </Link>
                )}
                
                {/* Botón de nueva compra siempre visible */}
                <Link
                  href={route("purchases.create")}
                  method="get"
                  className="btn bg-green-500 hover:bg-green-600 text-white"
                >
                  Nueva Compra
                </Link>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}