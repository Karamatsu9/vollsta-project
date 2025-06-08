// src/App.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/Dashboard.css";
import Vbg from "../assets/volls.mp4";
import Logow from "../assets/logow.png";
import Chart from './StockChart';

function Chartt() {
  const nav = useNavigate()
       useEffect(() => {
          const getUser  = JSON.parse(localStorage.getItem("userAuth"));
          if (getUser && getUser.position =="manager") {
          } else {
            nav("/"); // Redirect if not authenticated
          }
        }, [nav]);
    return (
        <div>
            <div id="body">
    <video src={Vbg} className="mainBg" autoPlay muted loop></video>
    <p id="copyright">Kenny Azril Ghazi© Copyright 2025 </p>
    <h1 id="titleWindow">📊Chart</h1>
    <h2 id="desWindow">Welcome Kenny Richie</h2>
    <div id="LunchCountdown">-</div>
    <section id="updateWarehouse">
        <h1>Products Stock Chart</h1>
        <div id="updatelist">
          <Chart/>
        </div>
    </section>
  
    <nav>
            <marquee id="movingtext"  behavior="" direction="">You are entering StaZ mode so that you can see through the base data</marquee>
            <div id="menunav">
          <div className="navbtn" onClick={()=>{
            nav("/managerDashboard")
          }}>Dashboard</div>
          <div className="navbtn" onClick={()=>{
            nav("/managerWarehouse")
          }}>Warehouse</div>
          <div className="navbtn" onClick={()=>{
            nav("/Transaction")
          }}>Transaction</div>
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

export default Chartt;