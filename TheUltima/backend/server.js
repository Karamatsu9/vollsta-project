// server.js
const express = require('express');
const cors = require('cors');
const connection = require('./config/database'); // This is the MySQL connection

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewarenya
app.use(cors());
app.use(express.json());

// =================== PRODUCTS API (Frontend uses /api/products) ===================

// GET all products
app.get('/api/products', (req, res) => {
    connection.query('SELECT * FROM products ORDER BY Id DESC', (err, results) => {
        if (err) {
            console.error("Database fetch error:", err);
            res.status(500).json({ error: "Failed to fetch products" });
        } else {
            res.json(results);
        }
    });
});

// GET single product by ID
app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    connection.query('SELECT * FROM products WHERE Id = ?', [productId], (err, results) => {
        if (err) {
            console.error("Database fetch error:", err);
            res.status(500).json({ error: "Failed to fetch product" });
        } else if (results.length === 0) {
            res.status(404).json({ error: "Product not found" });
        } else {
            res.json(results[0]);
        }
    });
});

// POST create new product
app.post('/api/products', (req, res) => {
    const {
        Name,
        Stock,
        Ram,
        Rom,
        Chipset,
        Battery,
        Camera,
        Price,
        Status,
        From
    } = req.body;

    // Validation
    if (!Name || !Price) {
        return res.status(400).json({ error: "Product name and price are required" });
    }

    const sql = `
        INSERT INTO products 
        (Name, Stock, Ram, Rom, Chipset, Battery, Camera, Price, Status, \`From\`) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
        sql, 
        [Name, Stock, Ram, Rom, Chipset, Battery, Camera, Price, Status || 'pending', From],
        (err, result) => {
            if (err) {
                console.error("Database insert error:", err);
                res.status(500).json({ error: "Failed to create product" });
            } else {
                res.status(201).json({ 
                    message: "Product created successfully", 
                    product_id: result.insertId 
                });
            }
        }
    );
});

// PUT update product
app.put('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const {
        Name,
        Stock,
        Ram,
        Rom,
        Chipset,
        Battery,
        Camera,
        Price,
        Status,
        From
    } = req.body;

    const sql = `
        UPDATE products SET
            Name = ?,
            Stock = ?,
            Ram = ?,
            Rom = ?,
            Chipset = ?,
            Battery = ?,
            Camera = ?,
            Price = ?,
            Status = ?,
            \`From\` = ?
        WHERE Id = ?
    `;

    connection.query(
        sql, 
        [Name, Stock, Ram, Rom, Chipset, Battery, Camera, Price, Status, From, productId], 
        (err, result) => {
            if (err) {
                console.error("Database update error:", err);
                res.status(500).json({ error: "Failed to update product" });
            } else if (result.affectedRows === 0) {
                res.status(404).json({ error: "Product not found" });
            } else {
                res.json({ message: "Product updated successfully" });
            }
        }
    );
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    
    connection.query(
        'DELETE FROM products WHERE Id = ?',
        [productId],
        (err, result) => {
            if (err) {
                console.error("Database delete error:", err);
                res.status(500).json({ error: "Failed to delete product" });
            } else if (result.affectedRows === 0) {
                res.status(404).json({ error: "Product not found" });
            } else {
                res.json({ message: "Product deleted successfully" });
            }
        }
    );
});

// =================== ORDERS API (if still needed for other features) ===================

// GET all orders
app.get('/api/orders', (req, res) => {
    connection.query('SELECT * FROM orders ORDER BY order_id DESC', (err, results) => {
        if (err) {
            console.error("Database fetch error:", err);
            res.status(500).json({ error: "Failed to fetch orders" });
        } else {
            res.json(results);
        }
    });
});

// GET single order by ID
app.get('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;
    connection.query('SELECT * FROM orders WHERE order_id = ?', [orderId], (err, results) => {
        if (err) {
            console.error("Database fetch error:", err);
            res.status(500).json({ error: "Failed to fetch order" });
        } else if (results.length === 0) {
            res.status(404).json({ error: "Order not found" });
        } else {
            res.json(results[0]);
        }
    });
});

// PUT update order status
app.put('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
    
    if (!status) {
        return res.status(400).json({ error: "Status is required" });
    }
    
    connection.query(
        'UPDATE orders SET status = ? WHERE order_id = ?', 
        [status, orderId], 
        (err, result) => {
            if (err) {
                console.error("Database update error:", err);
                res.status(500).json({ error: "Failed to update order" });
            } else if (result.affectedRows === 0) {
                res.status(404).json({ error: "Order not found" });
            } else {
                res.json({ message: "Order updated successfully", order_id: orderId, status });
            }
        }
    );
});

// POST create new order
app.post('/api/orders', (req, res) => {
    const { item_name, price, status } = req.body;
    
    if (!item_name || !price) {
        return res.status(400).json({ error: "Item name and price are required" });
    }
    
    connection.query(
        'INSERT INTO orders (item_name, price, status) VALUES (?, ?, ?)',
        [item_name, price, status || 'pending'],
        (err, result) => {
            if (err) {
                console.error("Database insert error:", err);
                res.status(500).json({ error: "Failed to create order" });
            } else {
                res.status(201).json({ 
                    message: "Order created successfully", 
                    order_id: result.insertId 
                });
            }
        }
    );
});

// DELETE order
app.delete('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;
    
    connection.query(
        'DELETE FROM orders WHERE order_id = ?',
        [orderId],
        (err, result) => {
            if (err) {
                console.error("Database delete error:", err);
                res.status(500).json({ error: "Failed to delete order" });
            } else if (result.affectedRows === 0) {
                res.status(404).json({ error: "Order not found" });
            } else {
                res.json({ message: "Order deleted successfully" });
            }
        }
    );
});
// DELETE user
app.delete('/api/login/:id', (req, res) => {
    const userID = req.params.id;
    
    connection.query(
        'DELETE FROM users WHERE id = ?',
        [userID],
        (err, result) => {
            if (err) {
                console.error("Database delete error:", err);
                res.status(500).json({ error: "Failed to delete user" });
            } else if (result.affectedRows === 0) {
                res.status(404).json({ error: "user not found" });
            } else {
                res.json({ message: "user deleted successfully" });
            }
        }
    );
});
// DELETE order
app.delete('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;
    
    connection.query(
        'DELETE FROM orders WHERE order_id = ?',
        [orderId],
        (err, result) => {
            if (err) {
                console.error("Database delete error:", err);
                res.status(500).json({ error: "Failed to delete order" });
            } else if (result.affectedRows === 0) {
                res.status(404).json({ error: "Order not found" });
            } else {
                res.json({ message: "Order deleted successfully" });
            }
        }
    );
});

// =================== OTHER ROUTES ===================

// Root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Express server!');
});

// Dashboard data (static for now)
const DashboardData = [
    {
        id: 0,
        title: "Hp Vollsta X1",
        from: "admin kenny",
        des: "item ini baru saja ditambahkan ke dalam warehouse, kondisi aman, no minus"
    },
    {
        id: 1,
        title: "Hp Vollsta X2",
        from: "admin ghazi",
        des: "item ini kemarin saja ditambahkan ke dalam warehouse, kondisi aman, no minus"
    },
    {
        id: 2,
        title: "Hp Vollsta X3",
        from: "admin kenny",
        des: "item ini baru saja ditambahkan ke dalam warehouse, kondisi aman, no minus"
    },
    {
        id: 3,
        title: "Hp Vollsta G1",
        from: "admin azril",
        des: "item ini baru saja ditambahkan ke dalam warehouse, kondisi aman, no minus"
    },
    {
        id: 4,
        title: "Hp Vollsta Gx",
        from: "admin azril",
        des: "pake snapdragon 9s gen 1 mantul"
    },
];

app.get('/api/data', (req, res) => {
    res.json(DashboardData);
});

// Login routes
app.get('/api/login', (req, res) => {
    connection.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error("Database fetch error:", err);
            res.status(500).json({ error: "Failed to fetch users" });
        } else {
            res.json(results);
        }
    });
});

app.post('/api/login', (req, res) => {
    const { email, password, position } = req.body;
    console.log('Login attempt:', { email, position });
    
    connection.query(
        'SELECT * FROM users WHERE email = ? AND password = ?', 
        [email, password], 
        (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            
            if (results.length > 0) {
                const user = results[0];
                // Check if position matches (if provided)
                if (position && user.position !== position) {
                    return res.status(401).json({ message: 'Invalid position' });
                }
                
                return res.status(200).json({ 
                    message: 'Login successful',
                    user: {
                        id: user.id,
                        email: user.email,
                        position: user.position
                    }
                });
            } else {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
        }
    );
});

// =================== LEGACY ROUTES (untuk backward compatibility) ===================
// Redirect legacy routes to new ones
app.get('/api/datanya', (req, res) => {
    res.redirect('/api/products');
});

app.post('/api/datanya', (req, res) => {
    // Transform old format to new format
    req.body.Name = req.body.name;
    req.body.Stock = req.body.stock;
    req.body.Ram = req.body.ram;
    req.body.Rom = req.body.rom;
    req.body.Chipset = req.body.chipset;
    req.body.Battery = req.body.battery;
    req.body.Camera = req.body.camera;
    req.body.Price = req.body.price;
    req.body.Status = 'pending';
    res.redirect(307, '/api/products');
});

app.put('/api/datanya/:id', (req, res) => {
    // Transform old format to new format
    req.body.Name = req.body.name;
    req.body.Stock = req.body.stock;
    req.body.Ram = req.body.ram;
    req.body.Rom = req.body.rom;
    req.body.Chipset = req.body.chipset;
    req.body.Battery = req.body.battery;
    req.body.Camera = req.body.camera;
    req.body.Price = req.body.price;
    res.redirect(307, `/api/products/${req.params.id}`);
});

app.delete('/api/datanya/:id', (req, res) => {
    res.redirect(307, `/api/products/${req.params.id}`);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Products API: http://localhost:${PORT}/api/products`);
    console.log(`Orders API: http://localhost:${PORT}/api/orders`);
});