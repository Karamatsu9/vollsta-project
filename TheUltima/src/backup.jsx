// src/App.js
import React, { useEffect, useState } from 'react';
import "./Dashboard.css";
import Vbg from "./assets/volls.mp4";
import Logow from "./assets/logow.png";
import axios from 'axios';

function Dashboard() {
    const [data, setData] = useState(null);
    const [dataTitle, setdataTitle] = useState();
    const [dataFrom, setDataFrom] = useState();
    const [dataDes, setdataDes] = useState();


  const [updateData ,setUpdateData] = useState([
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

  const [selectedItem, setSelectedItem] = useState(null);
  const [shalatCountdown, setShalatCountdown] = useState('');
  const [items, setItems] = useState([]);
  const handleRenderItemDash = (item) => {
    setdataTitle(item.title);
    setDataFrom(item.from);
    setdataDes(item.des);
};

  useEffect(() => {
    // Initialize items with dates
    const itemsWithDates = updateData.map((item, index) => ({
      ...item,
      date: new Date().toLocaleString()
    }));
    setItems(itemsWithDates);

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
      } else if (jam < timeShalat.Dzuhur) {
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

  


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/data');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div id="body">
    <video src={Vbg} id="mainBg" autoPlay muted loop></video>
    <p id="copyright">Kenny Azril Ghazi© Copyright 2025 </p>
    <h1 id="titleWindow">🍀dashboard</h1>
    <h2 id="desWindow">Welcome Kenny Richie</h2>
    <div id="LunchCountdown">-</div>
    <div id="ShalatCountdown">{shalatCountdown}</div>
    <section id="updateWarehouse">
        <h1>Update Warehouse</h1>
        <div id="updatelist">
        {updateData.map((item, index) => (
                            <div 
                                id="theItem" 
                                key={item.id} 
                                onClick={() => handleRenderItemDash(item)}
                            >
                                <div id="code">#{index} Item entering the Warehouse 📦 (<span id="renderDate"></span>)</div>
                            </div>
                        ))}

        </div>
    </section>
    <div id="Report">
        <h1>Report:</h1>
        <hr/>
        <div id="titleReport">{dataTitle}</div>
                    <div id="fromReport">from: {dataFrom}</div>
                    <div id="desReport">{dataDes}</div>
    </div>
    <nav>
            <img src={Logow} id="logo"/>
            <marquee id="movingtext"  behavior="" direction="">You are entering StaZ mode so that you can see through the base data</marquee>
            <div id="menunav">
                <div id="dashboard" className="navbtn">dashboard</div>
                <div id="warehouse" className="navbtn">Warehouse</div>
                <div id="transaction" className="navbtn">Transaction</div>
            </div>
            <footer>
                <button id="sett" className="btnBelow"> Settings</button>
                <button id="help" className="btnBelow"> Help</button>
                <button id="exit" className="btnBelow"> Exit</button>
            </footer>
    </nav>
</div>
            {data ? <p>{data.message}</p> : <p>Loading...</p>}
        </div>
    );
}

export default Dashboard;