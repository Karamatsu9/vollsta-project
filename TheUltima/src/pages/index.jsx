import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/index.css";
import logoImage from '../assets/logow.png';
import Vbg from "../assets/volls.mp4";

const Index = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState('-');
  const [showSignField, setShowSignField] = useState(false);
  const [showError, setShowError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleConfirm = () => {
    if (position === '-') {
      setShowError(true);
      return;
    }
    setShowError(false);
    setShowSignField(true);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.get('http://localhost:5000/api/login', {
        params: {
          email,
          password,
          position,
        }
      });

      const data = response.data;

      if (response.status === 200) {
        // Handle successful login (e.g., redirect or show success message)
        console.log('DATA SERVER:', data);
        console.log('DATA STATE REACT:', email, password, position);
        // Assuming data is an array with one object
      if (Array.isArray(data) && data.length > 0) {
        const userData = data.find(user => 
          user.email === email &&
          user.password === password &&
          user.position === position
        );
        if (userData) {
          if (userData.position === 'manager') {
            localStorage.setItem("userAuth", JSON.stringify(userData))
            navigate('/managerDashboard');
          } else {
            localStorage.setItem("userAuth", JSON.stringify(userData))

            navigate('/dashboard');
          }
        } else {
          setErrorMessage('Login failed: credentials do not match.');
        }
      } else {
        setErrorMessage('Login failed: no user data returned.');
      }
      } else {
        setErrorMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="container">
      <video 
        src={Vbg}
        id="mainBg" 
        autoPlay 
        muted 
        loop 
      />
      <div id="general">
        <img 
          src={logoImage}
          id="logo" 
          alt="Logo" 
        />
      
        {!showSignField ? (
          <div id="earlySelect">
            <div id="QuestionText">Who are you..?</div>
            
            <select 
              id="select"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            >
              <option value="-">-</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
            </select>
            
            {showError && (
              <div id="errorText">Masukan posisimu!</div>
            )}
            
            <button 
              id="Confirm"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        ) : (
          <form id="signField" onSubmit={handleSubmit}>
            <h1>{position =="manager" ? "halo manager silahkan login": "woi staff login dlu"}</h1>
            
            <div id="UsernameInp">
              Masukan Gmail :
              <input
                type="email"
                placeholder="Masukkan Gmail"
                id="gmInp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div id="PassInp">
              Masukan password :
              <input
                type="password"
                placeholder="Masukan kata sandi"
                id="PwInp"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {errorMessage && <div id="errorText">{errorMessage}</div>}
            
            <button id="btnSub" type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Submit'}
            </button>
          </form>
        )}

        <footer>Accompany your need</footer>
      </div>
    </div>
  );
};

export default Index;
