import { useRef, useState } from 'react';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium changetext2">Eliminar Cuenta</h2>

                <p className="mt-1 text-md text-gray-600">
                Una vez eliminada su cuenta, todos sus recursos y datos se borrarán permanentemente. Antes de
                de eliminar su cuenta, descargue los datos o la información que desee conservar.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>Eliminar Cuenta</DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium changetext2">
                    ¿Seguro que quieres eliminar tu cuenta?
                    </h2>

                    <p className="mt-1 text-md text-gray-600">
                    Una vez eliminada su cuenta, todos sus recursos y datos se borrarán permanentemente. Por favor,
                    introduzca su contraseña para confirmar que desea eliminar definitivamente su cuenta.
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="password" value="Password" className="sr-only" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder="Password"
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Cancelar</SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Eliminar Cuenta
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
