import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Vbg from "../assets/volls.mp4";
import Logow from "../assets/logow.png";
import axios from 'axios';
import '../css/ul.css';

function UserList() {
  const nav = useNavigate();
  const [userDATA, setUserDATA] = useState([]);
       useEffect(() => {
          const getUser  = JSON.parse(localStorage.getItem("userAuth"));
          if (getUser && getUser.position =="manager") {
          } else {
            nav("/"); // Redirect if not authenticated
          }
        }, [nav]);

  useEffect(() => {
    const fetchUserx = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/login');
        setUserDATA(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUserx();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/login/${userId}`);
      setUserDATA(userDATA.filter(user => user.id !== userId)); // Update state to remove deleted user
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <div id="body">
        <video src={Vbg} className="mainBg" autoPlay muted loop></video>
        <p id="copyright">Kenny Azril Ghazi© Copyright 2025</p>
        <h1 id="titleWindow">🥼 UserList</h1>
        <h2 id="desWindow">User Data and List (onlyManager)</h2>
        <div id="LunchCountdown">-</div>
        <section id="updateWarehouse">
          <h1>User List</h1>
          <div id="updatelistUL"> 
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Position</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userDATA.map(user => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.username}</td>
                    <td>{user.password}</td>
                    <td>{user.position}</td>
                    <td>
                      <button onClick={() => handleDelete(user.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <nav>
          <marquee id="movingtext" behavior="" direction="">
            User list member Vollsta
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
            <button id="exit" className="btnBelow" onClick={() => {
              localStorage.removeItem("userAuth");
              nav("/");
            }}> Exit</button>
          </footer>
          <img src={Logow} id="abc"/>
        </nav>
      </div>
    </div>
  );
}

export default UserList;
