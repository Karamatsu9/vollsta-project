import React, { useEffect, useState } from 'react';

function WarehouseList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/datanya') // Match your backend port
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>Warehouse Products</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Stock</th>
                        <th>RAM</th>
                        <th>ROM</th>
                        <th>Chipset</th>
                        <th>Battery</th>
                        <th>Camera</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>{p.stock}</td>
                            <td>{p.ram}</td>
                            <td>{p.rom}</td>
                            <td>{p.chipset}</td>
                            <td>{p.battery}</td>
                            <td>{p.camera}</td>
                            <td>{p.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default WarehouseList;
