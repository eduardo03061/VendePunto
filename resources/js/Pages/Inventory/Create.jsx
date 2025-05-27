import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function CreateArticle({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        category: '',
        barCode: '',
        sku: '',
        description: '',
        salesUnit: '',
        stocks: '',
        purchasePrice: '',
        sellingPrice: '',
        image: null, // Nuevo campo de imagen
    });

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }

        post(route('inventory.storage'), {
            data: formData,
            onFinish: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-2xl changetext leading-tight">Create New Article</h2>}
        >
            <Head title="Create Article" />

            <div className="py-12">
                <div className=" mx-auto sm:px-6 lg:px-8">
                    <div className="change shadow-md rounded-lg p-8">
                        <h3 className="text-xl font-semibold changetext3 mb-6">Article Details</h3>
                        <form onSubmit={submit} encType="multipart/form-data">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Name" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="category" value="Category" />
                                    <TextInput
                                        id="category"
                                        name="category"
                                        value={data.category}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('category', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.category} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="barCode" value="Bar Code" />
                                    <TextInput
                                        id="barCode"
                                        name="barCode"
                                        value={data.barCode}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('barCode', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.barCode} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="sku" value="SKU" />
                                    <TextInput
                                        id="sku"
                                        name="sku"
                                        value={data.sku}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('sku', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.sku} className="mt-2" />
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <InputLabel htmlFor="description" value="Description" />
                                    <TextInput
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('description', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="salesUnit" value="Sales Unit" />
                                    <TextInput
                                        id="salesUnit"
                                        name="salesUnit"
                                        value={data.salesUnit}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('salesUnit', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.salesUnit} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="stocks" value="Stocks" />
                                    <TextInput
                                        id="stocks"
                                        name="stocks"
                                        value={data.stocks}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('stocks', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.stocks} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="purchasePrice" value="Purchase Price" />
                                    <TextInput
                                        id="purchasePrice"
                                        name="purchasePrice"
                                        type="number"
                                        step="0.01"
                                        value={data.purchasePrice}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('purchasePrice', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.purchasePrice} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="sellingPrice" value="Selling Price" />
                                    <TextInput
                                        id="sellingPrice"
                                        name="sellingPrice"
                                        type="number"
                                        step="0.01"
                                        value={data.sellingPrice}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('sellingPrice', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.sellingPrice} className="mt-2" />
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <InputLabel htmlFor="image" value="Image" />
                                    <input
                                        id="image"
                                        type="file"
                                        name="image"
                                        className="mt-1 block w-full"
                                        accept="image/*"
                                        onChange={(e) => setData('image', e.target.files[0])}
                                    />
                                    <InputError message={errors.image} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex justify-end mt-8">
                                <PrimaryButton className="ml-4" disabled={processing}>
                                    Create Article
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
