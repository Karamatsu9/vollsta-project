import { useState, useEffect } from 'react';
import vollsVideo from '../assets/volls.mp4';
import logow from '../assets/logow.png';
import "../css/warehouse.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Warehouse = () => {
   const nav = useNavigate();
   const [dispInputField, setDispInputField] = useState(false)
   const [userData, SetUserData] = useState();
   const [storageItem, setStorageItem] = useState([])
  
   useEffect(() => {
        const getUser = JSON.parse(localStorage.getItem("userAuth"));
        if (getUser && getUser.position == "staff") {
          SetUserData(getUser);
        } else {
          nav("/"); // Redirect if not authenticated
        }
   }, [nav]);

   useEffect(() => {
    const fetchingAPI = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        console.log('Fetched products:', response.data);
        setStorageItem(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchingAPI()
   }, [])

  const [editMode, setEditMode] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Display states
  const [namaBarang, setNamaBarang] = useState("") 
  const [stok, setStok] = useState(0) 
  const [ram, setRam] = useState("") 
  const [rom, setRom] = useState("") 
  const [chip, setChip] = useState("") 
  const [bat, setBat] = useState("") 
  const [cam, setCam] = useState("") 
  const [price, setPrice] = useState(0)
  const [status, setStatus] = useState("pending")
  const [from, setFrom] = useState("")
  const [tanggalMasuk, setTanggalMasuk] = useState("")
  const [tanggalKeluar, setTanggalKeluar] = useState("")

  // Input states
  const [INputnamaBarang, setINputNamaBarang] = useState("") 
  const [INputstok, setINputStok] = useState("") 
  const [INputram, setINputRam] = useState("") 
  const [INputrom, setINputRom] = useState("") 
  const [INputchip, setINputChip] = useState("") 
  const [INputbat, setINputBat] = useState("") 
  const [INputcam, setINputCam] = useState("") 
  const [INputprice, setINputPrice] = useState("")
  const [INputstatus, setINputStatus] = useState("pending")
  const [INputfrom, setINputFrom] = useState("")
  const [INputtanggalMasuk, setINputTanggalMasuk] = useState("")

  const handleClickItem = (index) => {
    const item = storageItem[index];
    console.log('Selected item:', item);
    setNamaBarang(item.Name || "-")
    setStok(item.Stock || 0)
    setRam(item.Ram || "-")
    setRom(item.Rom || "-")
    setChip(item.Chipset || "-")
    setBat(item.Battery || "-")
    setCam(item.Camera || "-")
    setPrice(item.Price || 0)
    setStatus(item.Status || "pending")
    setFrom(item.From || "-")
    setTanggalMasuk(item.tanggal_masuk || "-")
    setTanggalKeluar(item.tanggal_keluar || "-")
  }

  const storageBoxes = [
    { title: "Laptop 💻💻", percentage: "56%" },
    { title: "Phone 📱📱", percentage: "86%" },
    { title: "EWatch ⌚⌚", percentage: "46%" },
    { title: "Tab 📺📺", percentage: "33%" },
    { title: "Other 🎹🎧", percentage: "76%" }
  ];

  const clearInputs = () => {
    setINputNamaBarang("");
    setINputStok("");
    setINputRam("");
    setINputRom("");
    setINputChip("");
    setINputBat("");
    setINputCam("");
    setINputPrice("");
    setINputStatus("pending");
    setINputFrom("");
    setINputTanggalMasuk("");
  };

  // Function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'accept': return '#27ae60';
      case 'decline': return '#e74c3c';
      case 'pending': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="container">
      <video src={vollsVideo} className="mainBg" autoPlay muted loop />
      
      <div id="warehouseMain">
        <div id="StorageDisplay">
          {storageBoxes.map((box, index) => (
            <div key={index} className="boxStorage BOXgadget">
              {box.title} <hr /><div className="iconBS">{box.percentage}</div>
            </div>
          ))}
        </div>

        <div id="StorageItemList">
          {storageItem.length > 0 ? storageItem.map((item, index) => (
            <div key={index} className="ItemList">
              <div id="itemName" onClick={() => handleClickItem(index)}>
                {item.Name}
              </div>
              <div id="itemStock">| {item.Stock}</div>
              
              {/* Status indicator */}
              <div id="itemStatus" style={{
                backgroundColor: getStatusColor(item.Status),
                color: 'white',
                padding: '0.2vw 0.5vw',
                borderRadius: '0.3vw',
                fontSize: '0.8vw',
                marginLeft: '1vw'
              }}>
                {item.Status?.toUpperCase() || 'PENDING'}
              </div>

              <div
                id="EditBtn"
                onClick={() => {
                  console.log('Edit item:', item);
                  setINputNamaBarang(item.Name || "");
                  setINputStok(item.Stock || "");
                  setINputRam(item.Ram || "");
                  setINputRom(item.Rom || "");
                  setINputChip(item.Chipset || "");
                  setINputBat(item.Battery || "");
                  setINputCam(item.Camera || "");
                  setINputPrice(item.Price || "");
                  setINputStatus(item.Status || "pending");
                  setINputFrom(item.From || "");
                  setINputTanggalMasuk(item.tanggal_masuk || "");
                  setEditingItemId(item.Id);
                  setEditMode(true);
                  setDispInputField(true);
                }}
              >
                🖋
              </div>
            </div>
          )) : <div style={{color: "red", fontSize: "2vw"}}>Database kosong atau server belum running</div>}
        </div>

        <div id="updateItemBar">
          <div id="addItem" onClick={() => {
            setDispInputField(true);
            setEditMode(false);
            clearInputs();
            // Set default tanggal_masuk to current date for new items
            const currentDate = getCurrentDate();
            setINputTanggalMasuk(currentDate);
            console.log('Add new item with date:', currentDate);
          }}>+</div>
        </div>

        <div id="StorageImg" />
        <div className="StorageitemDetail">
            Nama barang : {namaBarang || "-"} <br />
            Stok barang : {stok || "-"} <br />
            RAM : {ram || "-"} <br />
            ROM : {rom || "-"} <br />
            Chipset : {chip || "-"} <br />
            Battery : {bat || "-"} <br />
            Camera : {cam || "-"} <br />
            Price : Rp. {price || "-"} <br />
            Status : <span style={{ color: getStatusColor(status) }}>{status || "-"}</span> <br />
            From : {from || "-"} <br />
            Tanggal Masuk : {tanggalMasuk || "-"} <br />
            Tanggal Keluar : {tanggalKeluar || "-"} <br />
        </div>
      </div>

      <p id="copyright">Kenny Azril Ghazi© Copyright 2025</p>
      <h1 id="titleWindow">📦Warehouse</h1>
      <h2 id="desWindow">Welcome guest</h2>

      <nav>
        <img src={logow} className="logo" alt="Logo" />
        <marquee id="movingtext" behavior="" direction="">
          You are entering StaZ mode so that you can see through the base data
        </marquee>
        
        <div id="menunav">
          <div className="navbtn" onClick={() => nav("/dashboard")}>Dashboard</div>
          <div className="navbtn" onClick={() => nav("/warehouse")}>Warehouse</div>
        </div>
        
        <footer className='footer'>
              <button id="exit" className="btnBelow" onClick={()=>{
                  localStorage.removeItem("userAuth")
                  nav("/")
                  }}> Exit</button>
        </footer>

        <div className='addField' style={{display: dispInputField ? "block" : "none"}}>
          <div className="ContainerimgAddField">
            <img src="https://iopwiki.com/images/1/10/Clukay.png" className="imgAddField" />
          </div>

          <div className="insertField">
            <h1>{editMode ? 'Edit Product' : 'Add New Product'}</h1>
            
            Nama barang :
            <input 
              type="text" 
              id='inputFirudo' 
              value={INputnamaBarang} 
              onChange={(e) => setINputNamaBarang(e.target.value)} 
              placeholder="Enter product name" 
              className="InpBar" 
            /><br />
            
            Stock :
            <input 
              type="number" 
              id='inputFirudo' 
              value={INputstok}  
              onChange={(e) => setINputStok(e.target.value)} 
              placeholder="Enter stock quantity" 
              className="InpBar" 
            /><br />
            
            RAM :
            <input 
              type="text" 
              id='inputFirudo' 
              value={INputram}  
              onChange={(e) => setINputRam(e.target.value)} 
              placeholder="e.g., 8GB" 
              className="InpBar" 
            /><br />
            
            ROM :
            <input 
              type="text" 
              id='inputFirudo' 
              value={INputrom}  
              onChange={(e) => setINputRom(e.target.value)} 
              placeholder="e.g., 256GB" 
              className="InpBar" 
            /><br />
            
            Battery :
            <input 
              type="text" 
              id='inputFirudo' 
              value={INputbat}  
              onChange={(e) => setINputBat(e.target.value)} 
              placeholder="e.g., 4000mAh" 
              className="InpBar" 
            /><br />
            
            Chipset :
            <input 
              type="text" 
              id='inputFirudo' 
              value={INputchip} 
              onChange={(e) => setINputChip(e.target.value)} 
              placeholder="e.g., Snapdragon 888" 
              className="InpBar" 
            /><br />
            
            Camera :
            <input 
              type="text" 
              id='inputFirudo' 
              value={INputcam} 
              onChange={(e) => setINputCam(e.target.value)} 
              placeholder="e.g., 48MP" 
              className="InpBar" 
            /><br />
            
            Price :
            <input 
              type="number" 
              id='inputFirudo' 
              value={INputprice} 
              onChange={(e) => setINputPrice(e.target.value)} 
              placeholder="Enter price" 
              className="InpBar" 
            /><br />
            
            From :
            <input 
              type="text" 
              id='inputFirudo' 
              value={INputfrom} 
              onChange={(e) => setINputFrom(e.target.value)} 
              placeholder="Enter supplier/source name" 
              className="InpBar" 
            /><br />
            
            Tanggal Masuk :
            <input 
              type="date" 
              id='inputFirudo' 
              value={INputtanggalMasuk} 
              onChange={(e) => {
                setINputTanggalMasuk(e.target.value);
                console.log('Tanggal masuk changed to:', e.target.value);
              }} 
              className="InpBar" 
            /><br />
           
          </div>

          <button
            className="submitData"
            onClick={async () => {
              try {
                // Ensure tanggal_masuk has a value
                const tanggalMasukValue = INputtanggalMasuk || getCurrentDate();
                
                // Updated data object to include tanggal_masuk field
                const data = {
                  Name: INputnamaBarang,
                  Stock: parseInt(INputstok) || 0,
                  Ram: INputram || "",
                  Rom: INputrom || "",
                  Battery: INputbat || "",
                  Chipset: INputchip || "",
                  Camera: INputcam || "",
                  Price: parseInt(INputprice) || 0,
                  Status: INputstatus || "pending",
                  From: INputfrom || "",
                  tanggal_masuk: tanggalMasukValue,
                  tanggal_keluar: null // Explicitly set to null for new items
                };

                console.log('=== SUBMIT DATA ===');
                console.log('Data to be sent:', data);
                console.log('tanggal_masuk value:', data.tanggal_masuk);

                if (editMode) {
                  // Edit existing item
                  console.log('Updating product ID:', editingItemId);
                  const response = await axios.put(`http://localhost:5000/api/products/${editingItemId}`, data);
                  console.log('Update response:', response.data);
                  
                  alert("Product updated successfully!");
                  setDispInputField(false);
                  setEditMode(false);
                  setEditingItemId(null);
                  clearInputs();
                  
                  // Re-fetch items
                  const refreshResponse = await axios.get("http://localhost:5000/api/products");
                  setStorageItem(refreshResponse.data);
                } else {
                  // Add new item
                  console.log('Creating new product');
                  const response = await axios.post("http://localhost:5000/api/products", data);
                  console.log('Create response:', response.data);
                  
                  alert(`Product added successfully!\nTanggal Masuk: ${data.tanggal_masuk}`);
                  setDispInputField(false);
                  clearInputs();
                  
                  // Re-fetch items
                  const refreshResponse = await axios.get("http://localhost:5000/api/products");
                  setStorageItem(refreshResponse.data);
                }
              } catch (err) {
                console.error("Error details:", err.response?.data || err);
                alert("Failed to save product: " + (err.response?.data?.message || err.message));
              }
            }}
          >
            Submit
          </button>

          <button className='clearData' onClick={clearInputs}>
            Clear
          </button>
          
          <button className='exitField' onClick={() => {
            setDispInputField(false);
            setEditMode(false);
            clearInputs();
          }}>
            X
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Warehouse;