import React, {useEffect} from 'react';
import Logo from "@/Components/Logo.jsx";
import '../../../css/print.css'

export default function PrintSalesTicket({sale, items, company}) {
    // Al montar el componente, ejecutar la función de impresión
    useEffect(() => {
        const f = new Date();
        const formattedDate = `${f.getDate()}/${f.getMonth() + 1}/${f.getFullYear()}`;
        document.getElementById("dateSale").innerHTML = `
            Empresa<br>
            ${company?.name.replace(/_/g, " ")}<br>
            ${formattedDate}
        `;

        window.print();
    }, []);

    return (
        <div className="ticket">
            <Logo className="h-11 fill-white"/>
            <p className="centrado" id="dateSale"></p>

            <table>
                <thead>
                <tr>
                    <th className="cantidad">CANT</th>
                    <th className="producto">PRODUCTO</th>
                    <th className="precio">$$</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item, index) => (
                    <tr key={index}>
                        <td className="cantidad">
                            {item.kg} kg
                        </td>
                        <td className="producto">
                            {item.name}
                        </td>
                        <td className="precio">
                            ${item.price}
                        </td>
                    </tr>
                ))}
                <tr>
                    <td className="cantidad"></td>
                    <td className="producto">TOTAL</td>
                    <td className="precio">${sale.quantity}</td>
                </tr>
                </tbody>
            </table>

            <p className="centrado">
                ¡GRACIAS POR SU COMPRA!
                <br/>
                F B: @{company?.name.replace(/_/g, " ")}
            </p>
            <p>2025</p>
        </div>
    );
}
