import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where, doc, setDoc, Timestamp } from 'firebase/firestore';
import { app } from '../firebaseConfig'; // Ensure Firebase is initialized
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing
import '../styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // Default role selection
    const [testid, setTestid] = useState('');
    const navigate = useNavigate();
    const db = getFirestore(app);

    useEffect(() => {
        localStorage.removeItem("user"); // Clear user data on login page load
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Logging in as ' + role);

        const collectionName = role === 'admin' ? 'admins' : 'students';
        const q = query(collection(db, collectionName), where('email', '==', email)); // Fetch user data

        try {
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const userData = snapshot.docs[0].data(); // Get first matching user

                // Compare entered password with the hashed password stored in Firestore
                const isPasswordValid = bcrypt.compareSync(password, userData.password);

                if (isPasswordValid) {
                    localStorage.setItem('user', JSON.stringify({ email, role, testid }));
                    if(role==='student'){
                        const testRef = doc(db, "students", email);
                        await setDoc(testRef, {
                            login_time: Timestamp.now(),
                            active: true, // ✅ Stores the current timestamp
                          }, { merge: true });
                    }

                    console.log(`Logged in as ${role}, email: ${email}, testid: ${testid}`);
                    navigate(role === 'admin' ? '/admin' : '/assessment');
                } else {
                    alert('Invalid password. Please try again.');
                }
            } else {
                alert('User not found. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Error logging in. Please check console.');
        }
    };

    return (
        <div className='container'>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '500px' }}>
                <div className='login'>Login</div>

                {/* Role Selection Dropdown */}
                <div className='role-select'>
                    <label>Select Role:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} style={{ marginBottom: '10px', padding: '8px' }}>
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {/* Email Input */}
                <div className='email'>
                    <label style={{ marginRight: '10px' }}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ marginBottom: '10px', padding: '8px' }}
                        placeholder='Email'
                    />
                </div>

                {/* Password Input */}
                <div className='password'>
                    <label style={{ marginRight: '10px' }}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ marginBottom: '10px', padding: '8px' }}
                        placeholder='Password'
                    />
                </div>

                {/* Test ID Input for Students */}
                {role === 'student' && (
                    <div className='testid'>
                        <label style={{ marginRight: '10px' }}>Test ID:</label>
                        <input
                            type="text"
                            value={testid}
                            onChange={(e) => setTestid(e.target.value)}
                            required
                            style={{ marginBottom: '10px', padding: '8px' }}
                            placeholder='Test ID'
                        />
                    </div>
                )}

                {/* Login Button */}
                <button type='submit' style={{ padding: '8px', cursor: 'pointer' }}>Login</button>
            </form>
        </div>
    );
};

export default Login;