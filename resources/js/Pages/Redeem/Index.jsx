import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm } from "@inertiajs/react";
import TextInput from "@/Components/TextInput.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import InputError from "@/Components/InputError.jsx";

export default function Redeem({ roles }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    code: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route("code.redeem"));
  };

  return (
    <AuthenticatedLayout roles={roles}>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-green overflow-hidden shadow-sm sm:rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              Tu suscripción ha finalizado
            </h3>
            <p className="mb-4">
              Por favor, ingresa un nuevo código de suscripción para continuar
              utilizando el servicio.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <TextInput
                  id="subscriptionCode"
                  type="text"
                  className="mt-1 block w-full"
                  value={data.code}
                  onChange={(e) => setData("code", e.target.value)}
                  required
                  placeholder="Código de suscripción"
                />
                <InputError message={errors.code} className="mt-2" />
              </div>
              <PrimaryButton className="mt-4" disabled={processing}>
                {processing ? "Procesando..." : "Canjear código"}
              </PrimaryButton>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
