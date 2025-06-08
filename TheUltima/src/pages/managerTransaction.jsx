import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/managerTransaction.css";  // Adjust path based on your CSS location
import Vbg from "../assets/volls.mp4";
import Logow from "../assets/logow.png";
import axios from 'axios';

function Transaction() {
  const nav = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderTitle, setOrderTitle] = useState('Select an order');
  const [orderPrice, setOrderPrice] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
   const [loading, setLoading] = useState(true);
  const [orderDate, setOrderDate] = useState('');
  const isFriday = new Date().getDay() === 5;
  const [shalatCountdown, setShalatCountdown] = useState('');
    const [userData, SetUserData] = useState();

  useEffect(() => {
    const getUser  = JSON.parse(localStorage.getItem("userAuth"));
    if (getUser && getUser.position =="manager") {
      SetUserData(getUser);
    } else {
      nav("/"); // Redirect if not authenticated
    }
  }, [nav]);

  const CountdownData = {
    shalattime: {
      Shubuh: 4,
      Dzuhur: 12,
      Ashar: 15,
      Maghrib: 18,
      Isya: 19
    }
  };



  // Handle order selection for displaying details
  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setOrderTitle(order.item_name);
    setOrderPrice(`$${order.price}`);
    setOrderStatus(order.status);
    setOrderDate(order.created_at ? new Date(order.created_at).toLocaleString() : new Date().toLocaleString());
  };

  // Handle accepting an order - THIS USES AXIOS
  const handleAcceptOrder = async () => {
    if (!selectedOrder) return;

    try {
      // AXIOS PUT REQUEST to backend
      const response = await axios.put(`http://localhost:5000/api/orders/${selectedOrder.order_id}`, {
        status: 'accepted'
      });

      if (response.status === 200) {
        // Update the orders list in frontend
        setOrders(orders.map(order => 
          order.order_id === selectedOrder.order_id 
            ? { ...order, status: 'accepted' }
            : order
        ));
        
        // Update selected order display
        setSelectedOrder({ ...selectedOrder, status: 'accepted' });
        setOrderStatus('accepted');
        
        alert('Order accepted successfully!');
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      alert('Failed to accept order. Please try again.');
    }
  };

  

  // Handle rejecting an order - THIS USES AXIOS
  const handleRejectOrder = async () => {
    if (!selectedOrder) return;

    try {
      // AXIOS PUT REQUEST to backend
      const response = await axios.put(`http://localhost:5000/api/orders/${selectedOrder.order_id}`, {
        status: 'rejected'
      });

      if (response.status === 200) {
        // Update the orders list in frontend
        setOrders(orders.map(order => 
          order.order_id === selectedOrder.order_id 
            ? { ...order, status: 'rejected' }
            : order
        ));
        
        // Update selected order display
        setSelectedOrder({ ...selectedOrder, status: 'rejected' });
        setOrderStatus('rejected');
        
        alert('Order rejected successfully!');
      }
    } catch (error) {
      console.error('Error rejecting order:', error);
      alert('Failed to reject order. Please try again.');
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

  // Fetch orders from database - THIS USES AXIOS
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // AXIOS GET REQUEST to backend
        const response = await axios.get('http://localhost:5000/api/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  // Get status color for styling
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'accepted': return '#27ae60';
      case 'rejected': return '#e74c3c';
      case 'processing': return '#3498db';
      case 'completed': return '#9b59b6';
      default: return '#95a5a6';
    }
  };

  return (
    <div>
      <div id="body">
        <video src={Vbg} className="mainBg" autoPlay muted loop></video>
        <p id="copyright">Kenny Azril Ghazi© Copyright 2025</p>
        <h1 id="titleWindow">💰 Transaction</h1>
        <h2 id="desWindow">Order Management System</h2>
        <div id="LunchCountdown">-</div>
        <div id="ShalatCountdown">{shalatCountdown}</div>
        
        <section id="updateWarehouse">
          <h1>Order Management</h1>
          <div id="updatelist">
            {orders.map((order, index) => (
              <div 
                id="theItem" 
                key={order.order_id} 
                onClick={() => handleSelectOrder(order)}
                style={{
                  borderLeft: `0.5vw solid ${getStatusColor(order.status)}`
                }}
              >
                <div id="code">
                  #{order.order_id} {order.item_name} - ${order.price} 
                  <span style={{
                    backgroundColor: getStatusColor(order.status),
                    color: 'white',
                    padding: '0.2vw 0.5vw',
                    borderRadius: '0.3vw',
                    marginLeft: '1vw',
                    fontSize: '0.8vw'
                  }}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div id="Report">
          <h1>Order Details:</h1>
          <hr/>
          <div id="titleReport">{orderTitle}</div>
          <div id="fromReport">Price: {orderPrice}</div>
          <div id="desReport">
            Status: <span style={{ color: getStatusColor(orderStatus) }}>
              {orderStatus.toUpperCase()}
            </span>
          </div>
          <div style={{ marginTop: '2vw', fontSize: '1vw' }}>
            Order Date: {orderDate}
          </div>
          
          {/* Action Buttons */}
          {selectedOrder && (
            <div style={{ marginTop: '3vw' }}>
              {selectedOrder.status === 'pending' && (
                <div>
                  <button 
                    onClick={handleAcceptOrder}
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
                    ✓ Accept Order
                  </button>
                  <button 
                    onClick={handleRejectOrder}
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
                    ✗ Reject Order
                  </button>
                </div>
              )}
              {selectedOrder.status === 'accepted' && (
                <div style={{ 
                  backgroundColor: '#27ae60', 
                  color: 'white', 
                  padding: '1vw', 
                  borderRadius: '0.3vw',
                  textAlign: 'center'
                }}>
                  ✓ Order Accepted
                </div>
              )}
              {selectedOrder.status === 'rejected' && (
                <div style={{ 
                  backgroundColor: '#e74c3c', 
                  color: 'white', 
                  padding: '1vw', 
                  borderRadius: '0.3vw',
                  textAlign: 'center'
                }}>
                  ✗ Order Rejected
                </div>
              )}
            </div>
          )}
        </div>

        <nav>
          <marquee id="movingtext" behavior="" direction="">
            Transaction Management - Accept or Reject Orders
          </marquee>
          <div id="menunav">
            <div className="navbtn" onClick={() => nav("/managerDashboard")}>
              Dashboard
            </div>
            <div className="navbtn" onClick={() => nav("/managerWarehouse")}>
              Warehouse
            </div>
            <div className="navbtn" onClick={() => nav("/managerTransaction")}>
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