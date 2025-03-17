import React from 'react';
import '../styles/about.css'; // Linking CSS for styling

const About = () => {
    return (
        <div className="about-container">
            <h1>About Us</h1>
            <p>
                Welcome to <strong>ProctorX</strong>, an innovative online proctoring system designed to ensure academic integrity through advanced behavioral analysis and real-time risk scoring.
            </p>

            <div className="about-content">
                <div className="about-card">
                    <h2>Our Mission</h2>
                    <p>
                        Our mission is to provide a secure and reliable platform that helps institutions conduct fair and trustworthy online assessments without compromising privacy.
                    </p>
                </div>

                <div className="about-card">
                    <h2>Our Vision</h2>
                    <p>
                        We envision a future where online examinations are seamless, transparent, and focused on promoting honest academic practices.
                    </p>
                </div>

                <div className="about-card">
                    <h2>Why Choose Us?</h2>
                    <ul>
                        <li>Real-time behavior tracking</li>
                        <li>Accurate risk assessment</li>
                        <li>Privacy-first approach</li>
                        <li>User-friendly interface</li>
                    </ul>
                </div>
            </div>

            
        </div>
            );
};

export default About;
