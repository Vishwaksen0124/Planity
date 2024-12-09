
import React from 'react';
import './Footer.css';
import PlanityImage from '/favicon.ico';
import { useNavigate } from 'react-router-dom';
const Footer = () => {
  const navigate = useNavigate()
  return (
    <div className="footer">
      <div className="footer-container">
        <div className="logo"><img src={PlanityImage} alt="Planity Logo" style={{ height: "30px", width: "30px", marginTop: "5px", marginRight: "8px" }} /></div>

        <div className="button-group">
          <button className="custom-button" onClick={()=>{navigate("/about")}}>About Planity</button>
          <button className="custom-button" onClick={()=>{navigate("/termsofservice")}}>Terms of Service</button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
