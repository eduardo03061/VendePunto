import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Link} from '@inertiajs/react';
import {to} from "../../../../utilities/tools.js";

export default function PurchaseDetail({auth, roles, purschaces}) {
    console.log('purschaces', purschaces)


    return (
        <AuthenticatedLayout user={auth.user} roles={roles} title={'Detalle de Compra'}>
            <div className="py-12">
                <div className=" mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg shadow-md rounded-lg p-8 bg-fondo">
                        <div className="mt-6 overflow-x-auto">
                            <table className="min-w-full table table-striped table-hover">
                                <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">ID
                                        Venta
                                    </th>
                                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">ID
                                        Artículo
                                    </th>
                                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">Cantidad
                                        (unidades)
                                    </th>

                                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                    <th className="px-6 py-3 text-left text-md font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                </tr>
                                </thead>
                                <tbody className="">
                                {purschaces.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 text-md font-medium text-gray-500">
                                            <Link href={route('sales.showdetails', item.id_sales)}>
                                                {item.id_sales}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-md text-gray-500">{item.id_item}</td>
                                        <td className="px-6 py-4 text-md text-gray-500">{item.kg}</td>
                                        <td className="px-6 py-4 text-md text-gray-500">{item.price}</td>
                                        <td className="px-6 py-4 text-md text-gray-500">{to.formatDateTime(item.created_at)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className='content-between'>

                            <Link href={route('sales.print', purschaces[0].id_sales)}>Imprimir Ticket
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
