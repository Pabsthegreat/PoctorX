import React, { useState } from 'react';
import '../styles/features.css'; // Linking CSS for styling

const Features = () => {
    const [activeFeature, setActiveFeature] = useState(null);

    const toggleFeature = (feature) => {
        setActiveFeature(activeFeature === feature ? null : feature);
    };

    return (
        <div className="features-container">
            
            <h1>Our Features</h1>
            <p>
                ProctorX offers powerful features designed to ensure secure, fair, and efficient online assessments.
            </p>

            <div className="features-list">
                {[
                    { title: "Behavior Analysis", description: "Tracks mouse movement, keystrokes, and screen focus to detect suspicious behavior." },
                    { title: "Real-time Risk Scoring", description: "Assigns dynamic risk scores to candidates based on observed behavior patterns." },
                    { title: "Seamless Monitoring", description: "Provides live monitoring without intrusive video surveillance for enhanced privacy." },
                    { title: "User-Friendly Interface", description: "Designed to be intuitive for both students and administrators." },
                ].map((feature, index) => (
                    <div
                        key={index}
                        className={`feature-card ${activeFeature === index ? 'active' : ''}`}
                        onClick={() => toggleFeature(index)}
                    >
                        <h2>{feature.title}</h2>
                        {activeFeature === index && <p>{feature.description}</p>}
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Features;
