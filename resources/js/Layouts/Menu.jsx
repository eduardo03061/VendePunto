import {
    UserPlusIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    CogIcon,
    CurrencyDollarIcon,
    ArrowLeftOnRectangleIcon,
    BuildingLibraryIcon,
    ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import {is} from "../../../utilities/tools.js";
import {Link} from "@inertiajs/react";

// Definimos el menú con sus elementos y roles permitidos
const menu = [
       /*
    {
        link: 'dashboard',
        title: 'Dashboard',
        icon: <BuildingLibraryIcon className="w-6 h-6"/>,
        roles: ['Administrador','Cliente']
    },
    */
    {
        link: 'sales.list',
        title: 'Vender',
        icon: <CurrencyDollarIcon className="w-6 h-6 items-center"/>,
        roles: ['Administrador', 'Cliente', 'Ventas']
    },
    {
        link: 'inventory.list',
        title: 'Inventario',
        icon: <ArchiveBoxIcon className="w-6 h-6 "/>,
        roles: ['Administrador','Cliente']
    },
    /*
    {
        link: 'customers.list',
        title: 'Clientes',
        icon: <UserPlusIcon className="w-6 h-6"/>,
        roles: ['Administrador','Cliente','Ventas']
    },*/
    {
        link: 'settings',
        title: 'Config',
        icon: <CogIcon className="w-6 h-6"/>,
        roles: ['Administrador','Cliente'] // Sin roles específicos significa que todos tienen acceso
    }


];

export default function Menu({roles}) {
    // Extraemos solo los nombres de los roles
    const roleNames = roles.map(role => role.name);

    // Función que verifica si el usuario tiene acceso basado en sus roles
    const hasAccess = (itemRoles) => {
        // Si no hay roles definidos para el ítem, todos tienen acceso
        if (!itemRoles || itemRoles.length === 0) return true;
        // Si alguno de los roles del usuario coincide con los roles del ítem, tiene acceso
        return itemRoles.some(role => roleNames.includes(role));
    };

    return (
        <div className="w-full h-full flex flex-col space-y-4 sm:space-y-0 sm:justify-between">
            <div className="flex flex-col space-y-4">
                {is.array(menu)
                    ? menu
                        .filter(item => hasAccess(item.roles)) // Filtramos los items según los roles
                        .map((item) => (
                            <Link key={item.link} type="button" href={route(item.link)}
                                  className="flex flex-row space-x-4 text-white px-2 py-2 rounded-lg hover:bg-gray-700">
                                <div>{item.icon}</div>
                                <div>{item.title}</div>
                            </Link>
                        ))
                    : null}
            </div>
            <div className='w-full'>
                <Link method="post" href={route('logout')}
                      className="w-full flex flex-row space-x-4 text-white px-2 py-2 rounded-lg hover:bg-gray-700">
                    <div><ArrowLeftOnRectangleIcon className="w-6 h-6"/></div>
                    Salir
                </Link>
            </div>
        </div>
    );
}
