import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && <div className="mb-4 font-medium text-md text-green-600">{status}</div>}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-3">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-md text-gray-600">¿Recordarme?</span>
                    </label>
                </div>

                <div className='w-full mt-4 text-center'>
                    <PrimaryButton className="btn" disabled={processing}>
                        Entrar
                    </PrimaryButton>
                </div>

                <div className="w-full justify-center items-center mt-4">

                        <div className='mt-4 w-full text-center'>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="underline text-center text-md text-gray-600 hover:changetext2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}
                        <div>
                        <Link
                                href={route('register.page')}
                                className="underline text-md text-gray-600 hover:changetext2 rounded-md  text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                 ¿Aún no tienes cuenta? Regístrate aquí →
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
