import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../api/auth';
import { getErrorMessage } from '../api/errorMessage';
import logo from '../assets/logo1.1.png';
import '../styles/landing.css';
import '../styles/login.css';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export function ResetPasswordPage() {
    const navigate = useNavigate();
    const query = useQuery();
    const token = useMemo(() => query.get("token") ?? "", [query]);
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!token) {
            setError("Missing recovery token in the URL.");
            return;
        }

        if (!password.trim() || !confirmPassword.trim()) {
            setError("Both password fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        try {
            setLoading(true);
            await resetPassword(token, password);
            setSuccess("Password successfully updated. You can now login.");
            setPassword("");
            setConfirmPassword("");
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
                        <h2>Create New Password</h2>
                        <p>Enter your new password to complete the recovery process.</p>
                        <div className="login-register-link">
                            Remember your password? <Link to="/login">Click Here to Login</Link>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="login-right">
                        <form onSubmit={onSubmit}>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label>New Password*</label>
                                <div className="password-input">
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        placeholder="Enter new password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label>Confirm Password*</label>
                                <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    placeholder="Confirm new password" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                />
                            </div>

                            {error && <div className="error-msg">{error}</div>}
                            {success && <div className="error-msg" style={{ color: '#00cc66', fontWeight: 600 }}>{success}</div>}

                            <button type="submit" className="btn-login-submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Reset Password'}
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
