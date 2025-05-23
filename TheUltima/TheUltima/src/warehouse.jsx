import { useState } from 'react';
import vollsVideo from './assets/volls.mp4';
import logoImage from './assets/logow.png';
import "./warehouse.css";

const Warehouse = () => {
  const [items] = useState([
    { name: "HP Vollsta V5", stock: 5 },
    { name: "HP Vollsta V5", stock: 5 },
    { name: "HP Vollsta V5", stock: 5 }
  ]);

  const storageBoxes = [
    { title: "Laptop 💻💻", percentage: "56%" },
    { title: "Phone 📱📱", percentage: "86%" },
    { title: "EWatch ⌚⌚", percentage: "46%" },
    { title: "Tab 📺📺", percentage: "33%" },
    { title: "Other 🎹🎧", percentage: "76%" }
  ];

  return (
    <div className="container">
      <video src={vollsVideo} id="mainBg" autoPlay muted loop />
      
      <div id="warehouseMain">
        <div id="StorageDisplay">
          {storageBoxes.map((box, index) => (
            <div key={index} className="boxStorage BOXgadget">
              {box.title} <hr /><div className="iconBS">{box.percentage}</div>
            </div>
          ))}
        </div>

        <div id="StorageItemList">
          {items.map((item, index) => (
            <div key={index} id="ItemList">
              <div id="itemName">{item.name}</div>
              <div id="itemStock">| {item.stock}</div>
              <div id="EditBtn">🖋</div>
            </div>
          ))}
        </div>

        <div id="updateItemBar">
          <div id="addItem">+</div>
        </div>
        
        <div id="StorageImg" />
        <div id="StorageitemDetail" />
      </div>

      <p id="copyright">Kenny Azril Ghazi© Copyright 2025</p>
      <h1 id="titleWindow">📦Warehouse</h1>
      <h2 id="desWindow">Welcome Kenny Richie</h2>

      <nav>
        <img src={logoImage} id="logo" alt="Logo" />
        <marquee id="movingtext" behavior="" direction="">
          You are entering StaZ mode so that you can see through the base data
        </marquee>
        
        <div id="menunav">
          <div className="navbtn">dashboard</div>
          <div className="navbtn">Warehouse</div>
          <div className="navbtn">Transaction</div>
        </div>
        
        <footer>
          <button className="btnBelow"> Settings</button>
          <button className="btnBelow"> Help</button>
          <button className="btnBelow"> Exit</button>
        </footer>
      </nav>
    </div>
  );
};

export default Warehouse;