import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../styles/landing.css';
import logo from '../assets/logo1.1.png';

export function LandingPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <div className="landing-page">
            {/* HERO SECTION */}
            <section className="hero-wrapper">
                <nav className="landing-nav">
                    <div className="logo">
                        <img src={logo} alt="ALLEVENTS Logo" />
                    </div>
                    <ul>
                        <li><a href="#events">Events</a></li>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#blog">Blog</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                    <div className="nav-actions">
                        <button className="btn-icon rounded-full bg-white text-dark"><i className="pi pi-search"></i> Search</button>
                        {isAuthenticated ? (
                            <button className="btn-login" onClick={() => navigate('/app')}>Dashboard</button>
                        ) : (
                            <button className="btn-login" onClick={() => navigate('/login')}>Login</button>
                        )}
                    </div>
                </nav>

                <div className="hero-content">
                    <div className="featured-event-slider">
                        <button className="slider-btn prev"><i className="pi pi-angle-left"></i></button>
                        <div className="featured-event-info">
                            <h2>Grand Opening Concert</h2>
                            <p className="subtitle">National Stadium</p>
                            <p className="desc">Enjoy the best event of the year with surprise guest artists and much more.</p>
                            <button className="btn-primary" style={{ backgroundColor: '#ff007f' }}>Learn More</button>
                        </div>
                        <div className="featured-event-title">
                            <h1>ALL Events</h1>
                            <p>Stay up to date with the latest events, workshops, and meetups. Whether you are here to learn, connect, or have fun, there is something for you!</p>
                            <button className="btn-primary" style={{ backgroundColor: '#ff007f' }}>About Us</button>
                        </div>
                        <button className="slider-btn next"><i className="pi pi-angle-right"></i></button>
                    </div>
                    <div className="slider-dots">
                        <span className="dot active"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                </div>
            {/* OVERLAPPING SEARCH BAR */}
            <div className="search-bar-wrapper">
                <div className="search-bar">
                    <div className="search-field">
                        <label>Date:</label>
                        <div className="input-group">
                            <input type="text" placeholder="Select Month" />
                            <i className="pi pi-calendar"></i>
                        </div>
                    </div>
                    <div className="search-field">
                        <label>Location:</label>
                        <div className="input-group">
                            <select>
                                <option>Select City</option>
                                <option>New York</option>
                                <option>London</option>
                                <option>Tokyo</option>
                            </select>
                        </div>
                    </div>
                    <div className="search-field">
                        <label>Event:</label>
                        <div className="input-group">
                            <select>
                                <option>Search Event</option>
                                <option>Concerts</option>
                                <option>Technology</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* CATEGORIES */}
            <section className="categories-section">
                <div className="category-item">
                    <div className="category-icon"><i className="pi pi-headphones"></i></div>
                    <p>Music Events</p>
                </div>
                <div className="category-item">
                    <div className="category-icon"><i className="pi pi-users"></i></div>
                    <p>Conferences</p>
                </div>
                <div className="category-item">
                    <div className="category-icon"><i className="pi pi-star"></i></div>
                    <p>Annual Celebrations</p>
                </div>
                <div className="category-item">
                    <div className="category-icon"><i className="pi pi-play"></i></div>
                    <p>Games</p>
                </div>
            </section>
            </section>

            {/* UPCOMING EVENTS */}
            <section id="events" className="events-section">
                <div className="section-header">
                    <div className="header-title-box">
                        <h2>Upcoming Events</h2>
                    </div>
                    <div className="header-filters">
                        <select><option>Weekdays</option></select>
                        <select><option>Popular</option></select>
                        <select><option>Latest</option></select>
                    </div>
                </div>
                
                <div className="events-grid">
                    {[
                        { title: "Lights Festival", org: "Civil Engineering Department", tags: "Musical Event\nAll public can join", date: { m: "MAY", d: "11" }, img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500" },
                        { title: "Folk Dance", org: "Chemical Department", tags: "Cultural Event\nAll public can join", date: { m: "APR", d: "14" }, img: "https://images.unsplash.com/photo-1540511546927-13c3402a8a18?w=500" },
                        { title: "Spandana", org: "Medical Faculty", tags: "Musical Event\nAll public can join", date: { m: "APR", d: "14" }, img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500" },
                        { title: "Devthon", org: "Leo Club UOM", tags: "Web designing competition\nAll students can join", date: { m: "APR", d: "14" }, img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500" },
                        { title: "SLIOT", org: "CSE Department", tags: "New Innovation Competition\nAll students can join", date: { m: "APR", d: "14" }, img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500" },
                        { title: "CSE 40", org: "CSE Department", tags: "Coding Competition\nAll students can join", date: { m: "APR", d: "14" }, img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500" },
                    ].map((ev, idx) => (
                        <div className="event-card" key={idx}>
                            <div className="event-img" style={{ backgroundImage: `url(${ev.img})` }}>
                                <span className="badge-free">FREE</span>
                            </div>
                            <div className="event-content">
                                <div className="event-date">
                                    <span className="month">{ev.date.m}</span>
                                    <span className="day">{ev.date.d}</span>
                                </div>
                                <div className="event-details">
                                    <h3>{ev.title}</h3>
                                    <p className="organizer">By {ev.org}</p>
                                    <p className="tags">
                                        {ev.tags.split('\n').map((line, i) => <React.Fragment key={i}>&gt;&gt; {line}<br/></React.Fragment>)}
                                    </p>
                                </div>
                            </div>
                            <div className="event-footer">
                                <span className="location"><i className="pi pi-map-marker"></i> Convention Center</span>
                                <i className="pi pi-bookmark bookmark-icon"></i>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* PAST EVENTS */}
            <section className="past-events-section">
                <h2>Past Successful Events</h2>
                <p className="subtitle-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <div className="past-grid">
                    {[
                        { title: "6 Strategies to Find Your Conference Keynote and Other Speakers", date: "12 Mar - Jhon Doe", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=500" },
                        { title: "How Successfully Used Paid Marketing to Drive Incremental Ticket Sales", date: "12 Mar - Jhon Doe", img: "https://images.unsplash.com/photo-1475721025505-15e34790dd43?w=500" },
                        { title: "Introducing Workspaces: Work smarter, not harder with new navigation", date: "12 Mar - Jhon Doe", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500" }
                    ].map((pe, idx) => (
                        <div className="past-card" key={idx}>
                            <div className="past-img" style={{ backgroundImage: `url(${pe.img})` }}></div>
                            <div className="past-content">
                                <h3>{pe.title}</h3>
                                <p>Sekarang, kamu bisa produksi tiket fisik untuk eventmu bersama Bostiketbos. Hanya perlu mengikuti beberapa langkah mudah.</p>
                                <span className="past-meta">{pe.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <button className="btn-outline-primary">Load More</button>
                </div>
            </section>

            {/* REVIEWS */}
            <section className="reviews-section">
                <h2>Reviews About Us</h2>
                <p className="subtitle-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <div className="reviews-grid">
                    {[1, 2, 3].map((rev) => (
                        <div className="review-card" key={rev}>
                            <div className="review-header">
                                <img src={`https://i.pravatar.cc/150?img=${rev + 10}`} alt="User Avatar" className="avatar" />
                                <div>
                                    <div className="stars">
                                        <i className="pi pi-star-fill"></i><i className="pi pi-star-fill"></i><i className="pi pi-star-fill"></i><i className="pi pi-star-fill"></i><i className="pi pi-star-fill"></i>
                                    </div>
                                    <h4>Taylor Swifft</h4>
                                    <span>20 th March 2025</span>
                                </div>
                            </div>
                            <p>Sekarang, kamu bisa produksi tiket fisik untuk eventmu bersama Bostiketbos. Hanya perlu mengikuti beberapa langkah mudah.</p>
                        </div>
                    ))}
                    <div className="review-card add-yours">
                        <i className="pi pi-plus"></i>
                        <h4>Add Yours</h4>
                    </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <button className="btn-outline-primary">See All</button>
                </div>
            </section>

            {/* FOOTER */}
            <footer id="contact" className="landing-footer">
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
