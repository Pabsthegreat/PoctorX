import React, {useEffect} from 'react';
import '../styles/landingpage.css'; // Importing the updated CSS file
import { Link } from 'react-router-dom';

function LandingPage() {
  useEffect(() => {
    localStorage.removeItem('user'); // Clear user data on landing page load
  }, []);
    const handle = () => {
        // Redirect to the login page
        window.location.href = '/login';
    };
  return (
    <div className="container">
      <header className="header">
        <h1 className="logo">ProctorX</h1>
        <nav className="nav">
          <ul>
            <li className='l1'><Link className='link1' to="/">Home</Link></li>
            <li className='l2'><Link className='link2' to="/about">About Us</Link></li>
            <li className='l3'><Link className='link3'  to="/features">Features</Link></li>
            <li className='l4'><Link className='link4'  to="/contact">Contact</Link></li>
          </ul>
        </nav>
      </header>

      <main className="main">
        <div className="content">
          <h2 className="title">Online Proctoring System</h2>
          <p className="description">
            Ensure academic integrity with behavior analysis, real-time risk
            scoring, and seamless monitoring.
          </p>

          <button className="btn" onClick={handle}>Login</button>
 
        </div>

        {/* <div className="image-container">
          <img src="/exam_image.png" alt="Exam Illustration" className="image" />
        </div> */}
      </main>

      <footer className="footer">
        &copy; 2025 ProctorX - All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;