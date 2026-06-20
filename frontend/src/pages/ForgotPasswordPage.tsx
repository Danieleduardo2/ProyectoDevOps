import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../api/auth';
import { getErrorMessage } from '../api/errorMessage';
import logo from '../assets/logo1.1.png';
import '../styles/landing.css';
import '../styles/login.css';

export function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!email.trim()) {
            setError('Email is required.');
            return;
        }

        try {
            setLoading(true);
            await forgotPassword(email.trim());
            setSuccess('If the email exists, you will receive instructions to reset your password.');
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="landing-page login-page-bg">
            <nav className="landing-nav solid-nav">
                <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <img src={logo} alt="ALLEVENTS Logo" />
                </div>
                <ul>
                    <li><Link to="/">Events</Link></li>
                    <li><Link to="/">About Us</Link></li>
                    <li><Link to="/">Blog</Link></li>
                    <li><Link to="/">Contact</Link></li>
                </ul>
                <div className="nav-actions">
                    <button className="btn-icon rounded-full bg-white text-dark"><i className="pi pi-search"></i> Search</button>
                    <button className="btn-login" onClick={() => navigate('/login')}>Login</button>
                </div>
            </nav>

            <div className="login-container">
                <div className="login-split-card">
                    {/* LEFT SIDE */}
                    <div className="login-left">
                        <h2>Forgot Password?</h2>
                        <p>Enter your email to receive instructions on how to reset your password.</p>
                        <div className="login-register-link">
                            Remember your password? <Link to="/login">Click Here to Login</Link>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="login-right">
                        <form onSubmit={onSubmit}>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label>Email address*</label>
                                <input 
                                    type="email" 
                                    placeholder="Enter your email address" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </div>

                            {error && <div className="error-msg">{error}</div>}
                            {success && <div className="error-msg" style={{ color: '#00cc66', fontWeight: 600 }}>{success}</div>}

                            <button type="submit" className="btn-login-submit" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Instructions'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="landing-footer">
                <div className="footer-cols">
                    <div className="footer-col brand-col">
                        <div className="logo">
                            <img src={logo} alt="ALLEVENTS" />
                        </div>
                        <p>Eventick is a global self-service ticketing platform for live experiences that allows anyone to create, share, find and attend events that fuel their passions and enrich their lives.</p>
                        <div className="social-links">
                            <i className="pi pi-facebook"></i>
                            <i className="pi pi-twitter"></i>
                            <i className="pi pi-linkedin"></i>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h4>Plan Events</h4>
                        <ul>
                            <li>Create and Set Up</li>
                            <li>Sell Tickets</li>
                            <li>Online RSVP</li>
                            <li>Online Events</li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Eventick</h4>
                        <ul>
                            <li>About Us</li>
                            <li>Press</li>
                            <li>Contact Us</li>
                            <li>Help Center</li>
                            <li>How it Works</li>
                            <li>Privacy</li>
                            <li>Terms</li>
                        </ul>
                    </div>
                    <div className="footer-col subscribe-col">
                        <h4>Stay In The Loop</h4>
                        <p>Join our mailing list to stay in the loop with our newest for Event and concert</p>
                        <div className="subscribe-input">
                            <input type="email" placeholder="Enter your email address.." />
                            <button className="btn-primary" style={{ backgroundColor: '#ff007f' }}>Subscribe Now</button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
