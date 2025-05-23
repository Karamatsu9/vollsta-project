import { useState } from 'react';
import "./index.css";
import logoImage from './assets/logow.png';
import Vbg from "./assets/volls.mp4";

const LoginComponent = () => {
  const [position, setPosition] = useState('-');
  const [showSignField, setShowSignField] = useState(false);
  const [showError, setShowError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleConfirm = () => {
    if (position === '-') {
      setShowError(true);
      return;
    }
    setShowError(false);
    setShowSignField(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ email, password });
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
              <option value="Manager">Manager</option>
              <option value="StaZ">StaZ</option>
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
            <h1>hai bang login dlu gih</h1>
            
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
            
            <button id="btnSub" type="submit">
              Submit
            </button>
          </form>
        )}

        <footer>Accompany your need</footer>
      </div>
    </div>
  );
};

export default LoginComponent;