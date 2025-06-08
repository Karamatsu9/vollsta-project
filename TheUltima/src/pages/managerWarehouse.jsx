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
        if (getUser && getUser.position == "manager") {
          SetUserData(getUser);
        } else {
          nav("/"); // Redirect if not authenticated
        }
   }, [nav]);

   useEffect(() => {
    const fetchingAPI = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
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
  const [tanggalMasuk, setTanggalMasuk] = useState("") // Add tanggal_masuk display state

  // Input states
  const [INputnamaBarang, setINputNamaBarang] = useState("") 
  const [INputstok, setINputStok] = useState(0) 
  const [INputram, setINputRam] = useState("") 
  const [INputrom, setINputRom] = useState("") 
  const [INputchip, setINputChip] = useState("") 
  const [INputbat, setINputBat] = useState("") 
  const [INputcam, setINputCam] = useState("") 
  const [INputprice, setINputPrice] = useState(0)
  const [INputstatus, setINputStatus] = useState("pending")
  const [INputfrom, setINputFrom] = useState("")
  const [INputtanggalMasuk, setINputTanggalMasuk] = useState("") // Add tanggal_masuk input state

  const handleClickItem = (index) => {
    setNamaBarang(storageItem[index].Name)
    setStok(storageItem[index].Stock)
    setRam(storageItem[index].Ram)
    setRom(storageItem[index].Rom)
    setChip(storageItem[index].Chipset)
    setBat(storageItem[index].Battery)
    setCam(storageItem[index].Camera)
    setPrice(storageItem[index].Price)
    setStatus(storageItem[index].Status)
    setFrom(storageItem[index].From || "-")
    setTanggalMasuk(storageItem[index].tanggal_masuk || "-") // Add tanggal_masuk to display
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
    setINputStok(0);
    setINputRam("");
    setINputRom("");
    setINputChip("");
    setINputBat("");
    setINputCam("");
    setINputPrice(0);
    setINputStatus("pending");
    setINputFrom("");
    setINputTanggalMasuk(""); // Clear tanggal_masuk input
  };

  // Function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
                backgroundColor: item.Status === 'accept' ? '#27ae60' : 
                               item.Status === 'decline' ? '#e74c3c' : '#f39c12',
                color: 'white',
                padding: '0.2vw 0.5vw',
                borderRadius: '0.3vw',
                fontSize: '0.8vw',
                marginLeft: '1vw'
              }}>
                {item.Status.toUpperCase()}
              </div>

               <div
                id="DeleteBtn"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete ${item.Name}?`)) {
                    axios
                      .delete(`http://localhost:5000/api/products/${item.Id}`)
                      .then(() => {
                        alert("Item deleted!");
                        axios.get("http://localhost:5000/api/products").then(res => {
                          setStorageItem(res.data);
                        });
                      })
                      .catch(err => {
                        console.error("Delete error:", err);
                        alert("Failed to delete item.");
                      });
                  }
                }}
              >
                🗑
              </div>

              <div
                id="EditBtn"
                onClick={() => {
                  setINputNamaBarang(item.Name);
                  setINputStok(item.Stock);
                  setINputRam(item.Ram);
                  setINputRom(item.Rom);
                  setINputChip(item.Chipset);
                  setINputBat(item.Battery);
                  setINputCam(item.Camera);
                  setINputPrice(item.Price);
                  setINputStatus(item.Status);
                  setINputFrom(item.From || "");
                  setINputTanggalMasuk(item.tanggal_masuk || ""); // Set tanggal_masuk for editing
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
            setINputTanggalMasuk(getCurrentDate());
          }}>+</div>
        </div>

        <div id="StorageImg" />
        <div className="StorageitemDetail">
            Nama barang : {storageItem.length > 0 ? namaBarang : "-"} <br />
            Stok barang : {storageItem.length > 0 ? stok : "-"} <br />
            RAM : {storageItem.length > 0 ? ram : "-"} <br />
            ROM : {storageItem.length > 0 ? rom : "-"} <br />
            Chipset : {storageItem.length > 0 ? chip : "-"} <br />
            Battery : {storageItem.length > 0 ? bat : "-"} <br />
            Camera : {storageItem.length > 0 ? cam : "-"} <br />
            Price : Rp. {storageItem.length > 0 ? price : "-"} <br />
            Status : {storageItem.length > 0 ? status : "-"} <br />
            From : {storageItem.length > 0 ? from : "-"} <br />
            Tanggal Masuk : {storageItem.length > 0 ? tanggalMasuk : "-"} <br />
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
          <div className="navbtn" onClick={() => nav("/managerDashboard")}>Dashboard</div>
          <div className="navbtn" onClick={() => nav("/managerWarehouse")}>Warehouse</div>
           <div className="navbtn" onClick={() => nav("/Transaction")}>Transaction</div>
            <div className="navbtn" onClick={() => nav("/stockchart")}>
              chart
            </div>
            <div className="navbtn" onClick={() => nav("/userlist")}>
              User List
            </div>
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
              onChange={(e) => setINputTanggalMasuk(e.target.value)} 
              className="InpBar" 
            /><br />
           
          </div>

          <button
            className="submitData"
            onClick={() => {
              // Updated data object to include tanggal_masuk field
              const data = {
                Name: INputnamaBarang,
                Stock: INputstok,
                Ram: INputram,
                Rom: INputrom,
                Battery: INputbat,
                Chipset: INputchip,
                Camera: INputcam,
                Price: INputprice,
                Status: INputstatus,
                From: INputfrom,
                tanggal_masuk: INputtanggalMasuk // Add tanggal_masuk field
              };

              if (editMode) {
                // Edit existing item
                axios
                  .put(`http://localhost:5000/api/products/${editingItemId}`, data)
                  .then(() => {
                    alert("Product updated successfully!");
                    setDispInputField(false);
                    setEditMode(false);
                    setEditingItemId(null);
                    clearInputs();
                    // Re-fetch items
                    axios.get("http://localhost:5000/api/products").then(res => {
                      setStorageItem(res.data);
                    });
                  })
                  .catch(err => {
                    console.error("Error updating product:", err);
                    alert("Failed to update product.");
                  });
              } else {
                // Add new item - always set status to pending and ensure tanggal_masuk is set
                data.Status = "pending"; // Force status to pending for new items
                if (!data.tanggal_masuk) {
                  data.tanggal_masuk = getCurrentDate(); // Set current date if not provided
                }
                axios
                  .post("http://localhost:5000/api/products", data)
                  .then(() => {
                    alert("Product added successfully with pending status!");
                    setDispInputField(false);
                    clearInputs();
                    axios.get("http://localhost:5000/api/products").then(res => {
                      setStorageItem(res.data);
                    });
                  })
                  .catch(err => {
                    console.error("Error adding product:", err);
                    alert("Failed to add product.");
                  });
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