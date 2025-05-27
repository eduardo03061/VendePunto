import { Link } from '@inertiajs/react';
import Logo from "@/Components/Logo.jsx";

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center sm:pt-0 change2">
            <div>
                <Link href="/">
                <div className="flex items-center">
                            <div>
                            <img src="/assets/vendepunto-logo.png" alt="logo"/>
                            </div>
                        </div>
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 change shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
