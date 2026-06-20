import React from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import realLogo from '../assets/Logo.png';
import '../styles/dashboard.css';

export function DashboardLayout() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const getInitials = () => {
        const n = user?.nombre?.[0] || "";
        const a = user?.apellido?.[0] || "";
        return (n + a).toUpperCase() || "U";
    };

    return (
        <div className="dashboard-page">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '30px 20px' }}>
                    <img src={realLogo} alt="ALLEvents" style={{ width: '100%', maxWidth: '180px', height: 'auto', objectFit: 'contain' }} />
                </div>
                
                <nav className="sidebar-nav">
                    <NavLink to="/app" className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'} end>
                        <i className="pi pi-home"></i>
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/events" className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'} end>
                        <i className="pi pi-compass"></i>
                        <span>Explorar Eventos</span>
                    </NavLink>
                    <NavLink to="/my-events" className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}>
                        <i className="pi pi-ticket"></i>
                        <span>Mis Eventos</span>
                    </NavLink>
                    <NavLink to="/user" className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}>
                        <i className="pi pi-user"></i>
                        <span>Mi Perfil</span>
                    </NavLink>
                    
                    {isAdmin && (
                        <NavLink to="/admin" className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}>
                            <i className="pi pi-cog"></i>
                            <span>Administración</span>
                        </NavLink>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-connection-box">
                        <div className="user-connection-content">
                            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Conectado como:</div>
                            <div style={{ fontWeight: 700, color: '#1f2937', fontSize: '0.9rem' }}>{user?.nombre} {user?.apellido}</div>
                            <button className="btn-logout" onClick={handleLogout}>
                                <i className="pi pi-sign-out"></i> Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="dashboard-main">
                {/* Top Header */}
                <header className="top-header">
                    <div className="icon-btn">
                        <i className="pi pi-bell"></i>
                        <span className="badge"></span>
                    </div>
                    <div className="avatar-container" onClick={() => navigate('/user')}>
                        <div className="user-avatar">{getInitials()}</div>
                        <i className="pi pi-angle-down" style={{ color: '#6b7280', fontSize: '0.8rem' }}></i>
                    </div>
                </header>

                {/* Page Content */}
                <Outlet />
            </main>
        </div>
    );
}
