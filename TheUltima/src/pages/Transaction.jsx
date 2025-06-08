import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/Transaction.css";
import Vbg from "../assets/volls.mp4";
import Logow from "../assets/logow.png";
import axios from 'axios';

function Transaction() {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productName, setProductName] = useState('Select a product');
  const [productPrice, setProductPrice] = useState('');
  const [productStatus, setProductStatus] = useState('');
  const [productFrom, setProductFrom] = useState('');
  const [productTanggalMasuk, setProductTanggalMasuk] = useState('');
  const isFriday = new Date().getDay() === 5;
  const [shalatCountdown, setShalatCountdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [userData, SetUserData] = useState();

  const CountdownData = {
    shalattime: {
      Shubuh: 4,
      Dzuhur: 12,
      Ashar: 15,
      Maghrib: 18,
      Isya: 19
    }
  };

  // Function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle product selection for displaying details
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setProductName(product.Name);
    setProductPrice(`Rp. ${product.Price}`);
    setProductStatus(product.Status);
    setProductFrom(product.From || 'Unknown');
    setProductTanggalMasuk(product.tanggal_masuk || 'Not recorded');
  };

  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem("userAuth"));
    if (getUser && getUser.position == "manager") {
      SetUserData(getUser);
    } else {
      nav("/"); // Redirect if not authenticated
    }
  }, [nav]);

  // Handle accepting a product
  const handleAcceptProduct = async () => {
    if (!selectedProduct) return;

    try {
      const currentDate = getCurrentDate();
      
      // Create updated product object with all fields
      const updatedProduct = {
        Name: selectedProduct.Name,
        Stock: selectedProduct.Stock,
        Ram: selectedProduct.Ram || "",
        Rom: selectedProduct.Rom || "",
        Battery: selectedProduct.Battery || "",
        Chipset: selectedProduct.Chipset || "",
        Camera: selectedProduct.Camera || "",
        Price: selectedProduct.Price,
        From: selectedProduct.From || "",
        tanggal_masuk: selectedProduct.tanggal_masuk || "",
        Status: 'accept',
        tanggal_keluar: currentDate
      };

      console.log('=== TRANSACTION APPROVE ===');
      console.log('Product ID:', selectedProduct.Id);
      console.log('Approving product with data:', updatedProduct);
      console.log('tanggal_keluar being set to:', currentDate);

      const response = await axios.put(`http://localhost:5000/api/products/${selectedProduct.Id}`, updatedProduct);

      console.log('Server response:', response.data);

      if (response.status === 200) {
        alert(`Product approved successfully!\nTanggal Keluar: ${currentDate}`);
        
        // Reset selection
        setSelectedProduct(null);
        setProductName('Select a product');
        setProductPrice('');
        setProductStatus('');
        setProductFrom('');
        setProductTanggalMasuk('');
        
        // Refresh product list
        fetchProducts();
      }
    } catch (error) {
      console.error('Error accepting product:', error);
      console.error('Error details:', error.response?.data);
      alert('Failed to approve product: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle rejecting a product
  const handleRejectProduct = async () => {
    if (!selectedProduct) return;

    try {
      const currentDate = getCurrentDate();
      
      // Create updated product object with all fields
      const updatedProduct = {
        Name: selectedProduct.Name,
        Stock: selectedProduct.Stock,
        Ram: selectedProduct.Ram || "",
        Rom: selectedProduct.Rom || "",
        Battery: selectedProduct.Battery || "",
        Chipset: selectedProduct.Chipset || "",
        Camera: selectedProduct.Camera || "",
        Price: selectedProduct.Price,
        From: selectedProduct.From || "",
        tanggal_masuk: selectedProduct.tanggal_masuk || "",
        Status: 'decline',
        tanggal_keluar: currentDate
      };

      console.log('=== TRANSACTION DECLINE ===');
      console.log('Product ID:', selectedProduct.Id);
      console.log('Declining product with data:', updatedProduct);
      console.log('tanggal_keluar being set to:', currentDate);

      const response = await axios.put(`http://localhost:5000/api/products/${selectedProduct.Id}`, updatedProduct);

      console.log('Server response:', response.data);

      if (response.status === 200) {
        alert(`Product declined successfully!\nTanggal Keluar: ${currentDate}`);
        
        // Reset selection
        setSelectedProduct(null);
        setProductName('Select a product');
        setProductPrice('');
        setProductStatus('');
        setProductFrom('');
        setProductTanggalMasuk('');
        
        // Refresh product list
        fetchProducts();
      }
    } catch (error) {
      console.error('Error rejecting product:', error);
      console.error('Error details:', error.response?.data);
      alert('Failed to decline product: ' + (error.response?.data?.message || error.message));
    }
  };

  // Shalat countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const jam = date.getHours();
      const menit = date.getMinutes();
      const detik = date.getSeconds();
      const timeShalat = CountdownData.shalattime;

      let countdownText;
      if (jam >= timeShalat.Isya) {
        countdownText = `Shalat berikutnya (Shubuh) ${27 - jam}:${60 - menit}:${60 - detik}`;
      } else if (jam < timeShalat.Shubuh) {
        countdownText = `Shalat berikutnya (Shubuh) ${3 - jam}:${60 - menit}:${60 - detik}`;
      } else if (jam < timeShalat.Dzuhur && isFriday) {
        countdownText = `Shalat berikutnya (jumatan, infokan masjid terdekat) ${11 - jam}:${60 - menit}:${60 - detik}`;
      } else if (jam < timeShalat.Dzuhur && !isFriday) {
        countdownText = `Shalat berikutnya (Dzuhur) ${11 - jam}:${60 - menit}:${60 - detik}`;
      } else if (jam < timeShalat.Ashar) {
        countdownText = `Shalat berikutnya (Ashar) ${14 - jam}:${60 - menit}:${60 - detik}`;
      } else if (jam < timeShalat.Maghrib) {
        countdownText = `Shalat berikutnya (Maghrib) ${17 - jam}:${60 - menit}:${60 - detik}`;
      } else {
        countdownText = `Shalat berikutnya (Isya) ${18 - jam}:${60 - menit}:${60 - detik}`;
      }

      setShalatCountdown(countdownText);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      console.log('All products from API:', response.data);
      
      // Filter only pending products
      const pendingProducts = response.data.filter(product => product.Status === 'pending');
      console.log('Pending products:', pendingProducts);
      
      setProducts(pendingProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  // Fetch products from database
  useEffect(() => {
    fetchProducts();
  }, []);

  // Get status color for styling
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'accept': return '#27ae60';
      case 'decline': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  return (
    <div>
      <div id="body">
        <video src={Vbg} className="mainBg" autoPlay muted loop></video>
        <p id="copyright">Kenny Azril Ghazi© Copyright 2025</p>
        <h1 id="titleWindow">💰 Transaction</h1>
        <h2 id="desWindow">Product Approval System</h2>
        <div id="LunchCountdown">-</div>
        <div id="ShalatCountdown">{shalatCountdown}</div>
        
        <section id="updateWarehouse">
          <h1>Pending Products</h1>
          <div id="updatelist">
            {loading ? (
              <div style={{ color: 'white', fontSize: '1.5vw', textAlign: 'center', marginTop: '10vw' }}>
                Loading...
              </div>
            ) : products.length === 0 ? (
              <div style={{ color: 'white', fontSize: '1.5vw', textAlign: 'center', marginTop: '10vw' }}>
                No pending products to approve
              </div>
            ) : (
              products.map((product, index) => (
                <div 
                  id="theItem" 
                  key={product.Id} 
                  onClick={() => handleSelectProduct(product)}
                  style={{
                    borderLeft: `0.5vw solid ${getStatusColor(product.Status)}`,
                    cursor: 'pointer'
                  }}
                >
                  <div id="code">
                    #{product.Id} {product.Name} - Rp. {product.Price} 
                    <span style={{
                      backgroundColor: getStatusColor(product.Status),
                      color: 'white',
                      padding: '0.2vw 0.5vw',
                      borderRadius: '0.3vw',
                      marginLeft: '1vw',
                      fontSize: '0.8vw'
                    }}>
                      {product.Status.toUpperCase()}
                    </span>
                    <span style={{
                      fontSize: '0.8vw',
                      marginLeft: '1vw',
                      color: '#95a5a6'
                    }}>
                      From: {product.From || 'Unknown'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <div id="Report">
          <h1>Product Details:</h1>
          <hr/>
          <div id="titleReport">{productName}</div>
          <div id="fromReport">Price: {productPrice}</div>
          <div id="desReport">
            Status: <span style={{ color: getStatusColor(productStatus) }}>
              {productStatus.toUpperCase()}
            </span>
          </div>
          <div style={{ marginTop: '1vw', fontSize: '1vw' }}>
            From: {productFrom}
          </div>
          <div style={{ marginTop: '1vw', fontSize: '1vw' }}>
            Tanggal Masuk: {productTanggalMasuk}
          </div>
          
          {/* Action Buttons */}
          {selectedProduct && selectedProduct.Status === 'pending' && (
            <div style={{ marginTop: '3vw' }}>
              <button 
                onClick={handleAcceptProduct}
                style={{
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  padding: '1vw 2vw',
                  fontSize: '1.2vw',
                  cursor: 'pointer',
                  borderRadius: '0.3vw',
                  marginRight: '1vw',
                  marginBottom: '1vw'
                }}
              >
                ✓ Approve Product
              </button>
              <button 
                onClick={handleRejectProduct}
                style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '1vw 2vw',
                  fontSize: '1.2vw',
                  cursor: 'pointer',
                  borderRadius: '0.3vw'
                }}
              >
                ✗ Decline Product
              </button>
            </div>
          )}
        </div>

        <nav>
          <marquee id="movingtext" behavior="" direction="">
            Product Approval Management - Approve or Decline Products
          </marquee>
          <div id="menunav">
            <div className="navbtn" onClick={() => nav("/managerDashboard")}>
              Dashboard
            </div>
            <div className="navbtn" onClick={() => nav("/managerWarehouse")}>
              Warehouse
            </div>
            <div className="navbtn" onClick={() => nav("/Transaction")}>
              Transaction
            </div>
            
             <div className="navbtn" onClick={() => nav("/stockchart")}>
              chart
            </div>
            <div className="navbtn" onClick={() => nav("/userlist")}>
              User List
            </div>

          </div>
          <footer>
                 <button id="exit" className="btnBelow" onClick={()=>{
                  localStorage.removeItem("userAuth")
                  nav("/")
                  }}> Exit</button>
          </footer>
          <img src={Logow} id="abc"/>
        </nav>
      </div>
    </div>
  );
}

export default Transaction;