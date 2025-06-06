import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/react";

export default function ForgotPassword({ status }) {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
  });

  const submit = (e) => {
    e.preventDefault();

    post(route("password.email"));
  };

  return (
    <GuestLayout>
      <Head title="Forgot Password" />

      <div className="mb-4 text-md text-gray-600">
        ¿Ha olvidado su contraseña? No se preocupe. Indíquenos su dirección de
        correo electrónico y le enviaremos un enlace de restablecimiento de
        contraseña a que le permitirá elegir una nueva.
      </div>

      {status && (
        <div className="mb-4 font-medium text-md text-green-600">{status}</div>
      )}

      <form onSubmit={submit}>
        <TextInput
          id="email"
          type="email"
          name="email"
          value={data.email}
          className="mt-1 block w-full"
          isFocused={true}
          onChange={(e) => setData("email", e.target.value)}
        />

        <InputError message={errors.email} className="mt-2" />

        <div className="flex items-center justify-end mt-4">
          <PrimaryButton className="ms-4" disabled={processing}>
            Enviar link
          </PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  );
}
