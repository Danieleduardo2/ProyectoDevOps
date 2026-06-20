import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { getErrorMessage } from '../api/errorMessage';
import logo from '../assets/logo1.1.png';
import '../styles/landing.css';
import '../styles/login.css';

export function RegisterPage() {
    const navigate = useNavigate();

    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agree, setAgree] = useState(false);
    
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!fullname.trim()) return setError('Fullname is required.');
        if (!email.trim()) return setError('Email is required.');
        if (!password.trim()) return setError('Password is required.');
        if (password.length < 8) return setError('Password must be at least 8 characters.');
        if (!agree) return setError('You must agree to the terms & conditions.');

        const parts = fullname.trim().split(" ");
        const nombre = parts[0];
        const apellido = parts.slice(1).join(" ") || " ";

        try {
            setLoading(true);
            await register({
                nombre,
                apellido,
                telefono: "0000000000",
                email: email.trim(),
                password,
            });

            navigate('/login', { replace: true });
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
                        <h2>Register Individual Account!</h2>
                        <p>For the purpose of industry regulation, your details are required.</p>
                        <div className="login-register-link">
                            Already have an Account? <Link to="/login">Click Here to Login</Link>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="login-right">
                        <form onSubmit={onSubmit}>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label>Your fullname*</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter name here" 
                                    value={fullname} 
                                    onChange={(e) => setFullname(e.target.value)} 
                                />
                            </div>
                            
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label>Email address*</label>
                                <input 
                                    type="email" 
                                    placeholder="Enter email address" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label>Create password*</label>
                                <div className="password-input">
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        placeholder="Enter your password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>

                            <div className="checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <input 
                                    type="checkbox" 
                                    id="agree" 
                                    checked={agree} 
                                    onChange={(e) => setAgree(e.target.checked)} 
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <label htmlFor="agree" style={{ margin: 0, fontWeight: 500, fontSize: '0.9rem', color: '#555', cursor: 'pointer' }}>
                                    I agree to terms & conditions
                                </label>
                            </div>

                            {error && <div className="error-msg">{error}</div>}

                            <button type="submit" className="btn-login-submit" disabled={loading}>
                                {loading ? 'Registering...' : 'Register Account'}
                            </button>

                            <div className="divider" style={{ margin: '15px 0' }}><span>Or</span></div>

                            <button type="button" className="btn-google">
                                <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="Google" />
                                Register with Google
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
