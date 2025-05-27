import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Logo from "@/Components/Logo.jsx";
import Menu from "@/Layouts/Menu.jsx";
export default function Authenticated({ title,user, header, isBack, children, roles }) {
    const [viewMenu, setViewMenu] = useState(false);
    const onMenu = (e) => {
        e.preventDefault();
        setViewMenu(!viewMenu);
    };
    console.log('TT roles',roles)
    const Title = ({ children }) => {
        return <div className="font-semibold text-3xl">{children}</div>;
    };
    return (
        <>
            <Head>
                <title>{title}</title>
                <link rel="icon" type="image/svg+xml" href="/assets/vendepunto-logo.png" />
            </Head>
            <div className="subpixel-antialiased font-['Poppins'] overflow-hidden">
                <div className="sm:hidden bg-gray-900">
                    <div className="flex items-center flex-row justify-between p-4 ">
                        <Logo className="h-7 fill-white" />
                        <button type="button" onClick={onMenu}>
                            {viewMenu ? <XMarkIcon className="w-6 h-6 text-white" /> : <Bars3Icon className="w-6 h-6 text-white" />}
                        </button>
                    </div>
                    <div className={viewMenu ? ' px-6 py-4 z-20 fixed left-0 top-14 w-full h-auto bg-gray-900' : 'hidden'}>
                        <Menu roles={roles} />
                    </div>
                </div>

                <div className="fixed top-0 left-0 z-40 w-48 h-screen transition-transform -translate-x-full sm:translate-x-0">
                    <div className="h-full px-4 py-8 overflow-y-auto bg-gray-900 flex flex-col space-y-6 sm:items-center">
                        <Logo className="h-11 fill-white" />
                        <Menu roles={roles} />
                    </div>
                </div>

                <div className="overflow-x-hidden p-4 sm:p-12 sm:ml-48">
                    {
                        isBack ? <Back route={routeBack}>{title}</Back> : <Title>{title}</Title>
                    }
                    <div>{children}</div>
                </div>
            </div>
        </>
    );
}
