// server.js
import express from 'express';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Express server!');
});

app.get('/a', (req, res) => {
    res.send('a!');
});
// Sample API route
app.get('/api/data', (req, res) => {
    res.json([
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
    ]);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});