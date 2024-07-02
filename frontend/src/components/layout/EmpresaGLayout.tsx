import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faBars, faTimes,  faUsers, faUser, faFileAlt,faClipboardList, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import axios from '../../services/axios';
import { RootState } from '../../store';

interface Empresa {
    id_empresa: number;
    nombre_comercial: string;
    logo: string;
}

function EmpresaLayout() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpen2, setDropdownOpen2] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [empresa, setEmpresa] = useState<Empresa | null>(null);
    const { user } = useSelector((state: RootState) => state.auth);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
        const fetchEmpresa = async () => {
            if (user) {
                try {
                    const response = await axios.get<Empresa>(`http://localhost:8000/api/empresaById/${user.id}`);
                    setEmpresa(response.data);
                } catch (err) {
                    console.error('Error fetching empresa data:', err);
                }
            }
        };

        fetchEmpresa();
    }, [user]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleDropdown2 = () => {
        setDropdownOpen2(!dropdownOpen2);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleContentClick = () => {
        if (sidebarOpen) {
            setSidebarOpen(false);
        }
    };

    const getLogoUrl = (logoPath: string) => {
        return logoPath.startsWith('http') ? logoPath : `http://localhost:8000/storage/${logoPath}`;
    };

    return (
        <div className="flex h-screen overflow-hidden" onClick={handleContentClick}>
            {/* Lateral Nav */}
            <nav className={`bg-orange-700 text-white p-4 fixed top-16 bottom-0 lg:relative lg:translate-x-0 transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:w-64 z-20`}>
                <div className="flex flex-col items-center mb-4">
                    {empresa && (
                        <img
                            src={getLogoUrl(empresa.logo)}
                            alt="Foto de Perfil"
                            className="rounded-full profile-image w-24 h-24 object-cover border-4 border-white"
                        />
                    )}
                    <span className="mt-2">{empresa ? empresa.nombre_comercial : 'Nombre del Usuario'}</span>
                </div>
                <ul>
                    <li className={`mb-4 flex items-center hover:bg-gray-700 rounded-md p-2 relative`}>
                        <div onClick={toggleDropdown2} className="flex items-center w-full cursor-pointer">
                            <FontAwesomeIcon icon={faChevronDown} className={`mr-2 ${dropdownOpen ? 'transform rotate-180' : ''}`} />
                            <span className="mr-2">Ofertas</span>
                        </div>
                        {dropdownOpen2 && (
                            <ul className="mt-2 bg-white text-black shadow-lg rounded-md overflow-hidden z-20 absolute left-0 top-full w-full">
                                <li className={`p-2 ${location.pathname === '/InicioG' ? 'bg-gray-200' : ''}`}>
                                    <Link to="/InicioG" className="flex items-center w-full pl-6">
                                        <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                                        <span>Gestión de Ofertas</span>
                                    </Link>
                                </li>
                                <li className={`p-2 ${location.pathname === '/ConsultoPostuG' ? 'bg-gray-200' : ''}`}>
                                    <Link to="/ConsultoPostuG" className="flex items-center w-full pl-6">
                                        <FontAwesomeIcon icon={faUsers} className="mr-2" />
                                        <span>Consultar Postulantes</span>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className={`mb-4 flex items-center hover:bg-gray-700 rounded-md p-2 ${location.pathname === '/CatalogoRegistro' ? 'bg-gray-700' : ''}`}>
                        <Link to="/CatalogoRegistro" className="flex items-center w-full">
                            <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                            <span className="lg:inline">Registro de catálogos</span>
                        </Link>
                    </li>
                    <li className={`mb-4 flex items-center hover:bg-gray-700 rounded-md p-2 ${location.pathname === '/MonitoreoG' ? 'bg-gray-700' : ''}`}>
                        <Link to="/MonitoreoG" className="flex items-center w-full">
                            <FontAwesomeIcon icon={faUsers} className="mr-2" />
                            <span className="lg:inline">Control y monitoreo</span>
                        </Link>
                    </li>
                    <li className={`mb-4 flex items-center hover:bg-gray-700 rounded-md p-2 ${location.pathname === '/ReportesG' ? 'bg-gray-700' : ''}`}>
                        <Link to="/ReportesG" className="flex items-center w-full">
                            <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                            <span className="lg:inline">Reportes</span>
                        </Link>
                    </li>
                    <li className={`mb-4 flex items-center hover:bg-gray-700 rounded-md p-2 ${location.pathname === '/PerfilG' ? 'bg-gray-700' : ''}`}>
                        <Link to="/PerfilG" className="flex items-center w-full">
                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                            <span className="lg:inline">Mi perfil</span>
                        </Link>
                    </li>
                </ul>
            </nav>
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-auto">
                {/* Top Nav */}
                <nav className="bg-orange-700 text-white p-4 flex justify-between items-center w-full fixed top-0 left-0 right-0 z-30">
                    <div>
                        <span>ProaJob Empresa</span>
                    </div>
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
                            {empresa && (
                                <img
                                    src={getLogoUrl(empresa.logo)}
                                    alt="Logo"
                                    className="w-8 h-8 object-cover border-2 border-white rounded-full mr-2"
                                />
                            )}
                            <span className="hidden lg:inline">{empresa ? empresa.nombre_comercial : 'Empresa oferente'}</span>
                            <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                        </button>
                        {dropdownOpen && (
                            <ul className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md overflow-hidden z-20">
                                <li className="px-4 py-2 hover:bg-gray-200 rounded-md">
                                    <Link to="/employer/profile">Profile</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-200 rounded-md">
                                    <Link to="/employer/jobs">Jobs</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-200 rounded-md">
                                    <Link to="/employer/account">Account</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-200 rounded-md">
                                    <Link to="/" onClick={() => dispatch(logout())}>Cerrar Sesión</Link>
                                </li>
                            </ul>
                        )}
                    </div>
                    <button className="lg:hidden flex items-center focus:outline-none" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
                    </button>
                </nav>

                <div className="flex-1 p-4 mt-16 overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default EmpresaLayout;
