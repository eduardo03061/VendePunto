import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { to } from "../../../../utilities/tools.js";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline/index.js";

export default function SalesList({ auth, roles, sales }) {
  const [incompleteSale, setIncompleteSale] = useState(null);

  const safeToFixed = (value, decimals = 2) => {
    const num = Number(value) || 0;
    return num.toFixed(decimals);
  };

  useEffect(() => {
    const pendingSale = sales.find(s => s.status === 'pendiente');
    setIncompleteSale(pendingSale || null);
  }, [sales]);

  return (
    <AuthenticatedLayout user={auth.user} title="Registro de Ventas" roles={roles}>
      <div className="py-3">
        <div className="mx-auto">
          <div className="shadow-sm sm:rounded-lg">
            <div className="block sm:flex justify-between gap-8 items-start">

              {/* Sección de Botones */}
              <div className="sm:float-end p-6 mx-12 flex flex-col gap-4">
                <Link
                  href={route("sales.store")}
                  method="post"
                  className="punto-btn text-3xl mb-8 mt-8"
                >
                  Vender
                </Link>
                {incompleteSale && (
                  <Link
                    href={route('sales.edit', incompleteSale.id)}
                    className="primary w-full text-center"
                  >
                    Reanudar venta #{incompleteSale.id}
                  </Link>
                )}
              </div>

              {/* Tabla Ajustada */}
              <div className="w-full bg-fondo rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-700">
                  {/* <thead className="bg-gray-800">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-300 uppercase">ID</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-300 uppercase max-w-[120px] truncate">Vendedor</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-300 uppercase">Método</th>
                      <th className="px-2 py-2 text-right text-xs font-medium text-gray-300 uppercase">Subtotal</th>
                      <th className="px-2 py-2 text-right text-xs font-medium text-gray-300 uppercase">Desc.</th>
                      <th className="px-2 py-2 text-right text-xs font-medium text-gray-300 uppercase">Total</th>
                      <th className="px-2 py-2 text-right text-xs font-medium text-gray-300 uppercase">Cambio</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-300 uppercase min-w-[140px]">Fecha</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-300 uppercase min-w-[100px]">Estado</th>
                    </tr>
                  </thead> */}

                  <div className="divide-y divide-gray-700">
                    {sales.map((sale) => (
                      <div key={sale.id} className="hover:bg-black p-3">

                        <div className="flex items-center justify-between">

                        <div className="flex items-center">
                            <div className="pr-2 whitespace-nowrap text-xl text-blue-400 hover:text-blue-300">
                                  <Link href={route("sales.showdetails", sale.id)}>
                                    #{sale.id}
                                  </Link>
                            </div>
                              <div className="whitespace-nowrap text-gray-400 text-xs">
                                ({to.formatDateTime(sale.created_at)})
                              </div>
                        </div>

                            <div className="whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                                sale.status === 'pendiente' 
                                  ? 'bg-yellow-400/20 text-yellow-300'
                                  : 'bg-green-400/20 text-green-300'
                              }`}>
                                {sale.status} {/* Texto completo aquí */}
                              </span>
                            </div>
                        </div>


                        <div className="flex justify-between items-end">
                          <div className="w-1/2">
                            <div className="flex justify-between">
                              <div className="whitespace-nowrap text-gray-400 text-xs">Subtotal:                              
                              </div>                              
                              <div className="whitespace-nowrap text-gray-400 text-xs">
                                ${safeToFixed(sale.subtotal)}
                              </div>                              
                            </div>
                            
                            <div className="flex justify-between">
                              <div className="whitespace-nowrap text-gray-400 text-xs"> Descuento:
                              </div>

                              <div className="whitespace-nowrap text-red-400 text-xs">
                                {sale.discount_amount > 0 ? `-$${safeToFixed(sale.discount_amount)}` : <span className="text-gray-500"> - </span>}
                              </div>  

                            </div>

                            <div className="flex justify-between">
                              <div className="whitespace-nowrap text-gray-400 text-xs">Cambio:
                              </div>
                                  <div className="whitespace-nowrap text-gray-400 text-xs">
                                    {sale.payment_method === 'efectivo' ? 
                                      `$${safeToFixed(sale.change)}` : 
                                      <span className="text-gray-500"> - </span>}
                                  </div>
                              </div>

                                <div className="flex justify-between">
                                    <div className="whitespace-wrap text-gray-400 text-xs">
                                    vendió </div>
                                    <div className="whitespace-wrap text-right text-gray-400 text-xs">{sale.user?.name || 'N/A'}</div>
                                </div>
                            </div>

                            <div className="gap-2">
                                <div className="w-full text-right whitespace-nowrap">
                                  <p className="inline-flex items-center px-1.5 py-0.5 rounded text-xs text-gray-300">
                                    {sale.payment_method === 'efectivo' ? 'Efectivo' : 'Tarjeta'}
                                  </p>
                                </div>  
                                <div className="whitespace-nowrap primary-link text-3xl font-medium">
                                  ${safeToFixed(sale.quantity)}
                                </div>
                              </div>                     
                          </div>
                      </div>
                      
                    ))}
                  </div>
                </table>
                
                {sales.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-400 text-sm">No hay ventas registradas</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}