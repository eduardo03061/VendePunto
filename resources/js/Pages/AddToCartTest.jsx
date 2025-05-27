import React, { useState } from 'react';
import axios from 'axios';

export default function AddToCartTest({ purchase_id }) {
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(0);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await axios.post(route('purchases.add-to-cart'), {
                purchase_id: purchase_id,
                product_id: productId,
                quantity: quantity,
                price: price
            });

            setMessage('Producto agregado al carrito exitosamente');
            setProductId('');
            setQuantity(1);
            setPrice(0);
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            setMessage('Error al agregar el producto al carrito');
        }
    };

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-5">Agregar Producto al Carrito (Test)</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="productId" className="block mb-1">ID del Producto:</label>
                    <input
                        type="text"
                        id="productId"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="quantity" className="block mb-1">Cantidad:</label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        min="1"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="price" className="block mb-1">Precio:</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        step="0.01"
                        min="0"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Agregar al Carrito
                </button>
            </form>
            {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
    );
}
