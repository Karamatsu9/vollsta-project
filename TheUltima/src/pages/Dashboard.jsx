// src/App.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/Dashboard.css";
import Vbg from "../assets/volls.mp4";
import Logow from "../assets/logow.png";
import axios from 'axios';

function Dashboard() {
  const nav = useNavigate()

  const isFriday = new Date().getDay() === 5;
  
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productName, setProductName] = useState('');
    const [productFrom, setProductFrom] = useState('');
    const [productStatus, setProductStatus] = useState('');
    const [productDetails, setProductDetails] = useState('');
    const [productTanggalKeluar, setProductTanggalKeluar] = useState('');
    const [productTanggalMasuk, setProductTanggalMasuk] = useState('');
    const [userData, SetUserData] = useState();

      useEffect(() => {
        const getUser  = JSON.parse(localStorage.getItem("userAuth"));
        if (getUser && getUser.position =="staff") {
          SetUserData(getUser);
        } else {
          nav("/"); // Redirect if not authenticated
        }
      }, [nav]);

  const CountdownData = {
    breaktime: {
      br1: 9,
      br2: 12,
      br3: 15,
    },
    shalattime: {
      Shubuh: 4,
      Dzuhur: 12,
      Ashar: 15,
      Maghrib: 18,
      Isya: 19
    }
  };

  const [shalatCountdown, setShalatCountdown] = useState('');
  
  const handleRenderItemDash = (item) => {
    setSelectedProduct(item);
    setProductName(item.Name);
    setProductFrom(item.From || 'Unknown');
    setProductStatus(item.Status);
    setProductDetails(`Price: Rp. ${item.Price} | Stock: ${item.Stock} | Chipset: ${item.Chipset}`);
    setProductTanggalKeluar(item.tanggal_keluar || 'Not recorded');
    setProductTanggalMasuk(item.tanggal_masuk || 'Not recorded');
  };

  useEffect(() => {
    // Shalat countdown interval
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

  // Fetch products that have tanggal_keluar (approved or declined)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        console.log('All products:', response.data); // Debug log
        
        // Filter products that have tanggal_keluar OR have status accept/decline
        const processedProducts = response.data.filter(
          product => (product.Status === 'accept' || product.Status === 'decline')
        );
        
        console.log('Filtered products:', processedProducts); // Debug log
        
        // Sort by tanggal_keluar if exists, otherwise by id (newest first)
        processedProducts.sort((a, b) => {
          if (a.tanggal_keluar && b.tanggal_keluar) {
            return new Date(b.tanggal_keluar) - new Date(a.tanggal_keluar);
          }
          return b.Id - a.Id;
        });
        
        setProducts(processedProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'accept': return '#27ae60';
      case 'decline': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'accept': return 'Approved ✓';
      case 'decline': return 'Declined ✗';
      default: return status.toUpperCase();
    }
  };

    return (
        <div>
            <div id="body">
    <video src={Vbg} className="mainBg" autoPlay muted loop></video>
    <p id="copyright">Kenny Azril Ghazi© Copyright 2025 </p>
    <h1 id="titleWindow">🍀dashboard</h1>
    <h2 id="desWindow">Welcome {userData ? userData.username: null}</h2>
    <div id="LunchCountdown">-</div>
    <div id="ShalatCountdown">{shalatCountdown}</div>
    <section id="updateWarehouse">
        <h1>Products with Exit Date</h1>
        <div id="updatelist">
        {products.length === 0 ? (
          <div style={{ color: 'white', fontSize: '1.5vw', textAlign: 'center', marginTop: '10vw' }}>
            No products with exit date yet
          </div>
        ) : (
          products.map((item, index) => (
            <div 
              id="theItem" 
              key={item.Id} 
              onClick={() => handleRenderItemDash(item)}
              style={{
                borderLeft: `0.5vw solid ${getStatusColor(item.Status)}`
              }}
            >
              <div id="code">
                #{item.Id} {item.Name} - {getStatusText(item.Status)} 
                <span id="renderDate" style={{ fontSize: '0.8vw', marginLeft: '1vw' }}>
                  (Masuk: {item.tanggal_masuk || 'N/A'} | Keluar: {item.tanggal_keluar || 'N/A'})
                </span>
              </div>
            </div>
          ))
        )}
        </div>
    </section>
    <div id="Report">
        <h1>Report:</h1>
        <hr/>
        <div id="titleReport">{productName || 'Select an item'}</div>
        <div id="fromReport">From: {productFrom}</div>
        <div id="desReport">
          Status: <span style={{ color: getStatusColor(productStatus) }}>
            {getStatusText(productStatus)}
          </span>
        </div>
        <div style={{ marginTop: '1vw', fontSize: '1vw' }}>
          Tanggal Masuk: {productTanggalMasuk}
        </div>
        <div style={{ marginTop: '1vw', fontSize: '1vw' }}>
          Tanggal Keluar: {productTanggalKeluar}
        </div>
        <div style={{ marginTop: '1vw', fontSize: '1vw' }}>
          Price: Rp. {selectedProduct?.Price || '-'}
        </div>
        <div style={{ marginTop: '1vw', fontSize: '1vw' }}>
          Stock: {selectedProduct?.Stock || '-'}
        </div>
        <div style={{ marginTop: '1vw', fontSize: '1vw' }}>
          Chipset: {selectedProduct?.Chipset || '-'}
        </div>
    </div>
    <nav>
            <marquee id="movingtext"  behavior="" direction="">You are entering StaZ mode so that you can see through the base data</marquee>
            <div id="menunav">
          <div className="navbtn" onClick={()=>{
            nav("/dashboard")
          }}>Dashboard</div>
          <div className="navbtn" onClick={()=>{
            nav("/warehouse")
          }}>Warehouse</div>
          
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

export default Dashboard;