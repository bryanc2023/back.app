import { Link } from 'react-router-dom';

import { useState, useEffect, useRef } from "react";


import axios from "../../services/axios";



interface Oferta {
    id_oferta: number;
    estado: string;
    cargo:string;
    areas: {
        nombre_area: string;
    };
    empresa: {
        id_empresa: string,
        nombre_comercial: string;
        logo:string;
    };
    fecha_publi:string;
    mostrar_empresa: number;
    modalidad:string;
    carga_horaria:string;
    experiencia:string;
    // Define otros campos de la oferta según sea necesario
}

function InicioP() {
    const [ofertas, setOfertas] = useState<Oferta[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);


    useEffect(() => {
        fetchOfertas();
    }, []);

    const fetchOfertas = async () => {
        
        try {
            const response = await axios.get(`ofertas`); // Reemplaza con tu URL y ID de empresa
            setOfertas(response.data.ofertas);
        } catch (error) {
            console.error('Error fetching ofertas:', error);
        }
    
    };
    const filteredOfertas = ofertas.filter((oferta) =>
        oferta.cargo.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="w-full p-4">
         
            <h1 className="text-2xl font-semibold mb-4">OFERTAS QUE PUEDEN SER PARA TI:</h1>
            <h2>En base a tu perfil estas ofertas podrian interesarte:</h2>
            <div className="relative overflow-x-auto">
                <div className="flex flex-wrap gap-4">
                    {filteredOfertas.map((oferta) => (
                        <div key={oferta.id_oferta} className="p-4 rounded shadow-md flex-shrink-0 w-full md:w-1/2 lg:w-1/3 bg-gray-100"> 
                            <div className="flex items-center mb-2">
                                <img
                                    src={oferta.mostrar_empresa === 1 ? 'https://guiadelempresario.com/wp-content/uploads/2021/04/Copy-of-Untitled-500x500.png' : `http://localhost:8000/storage/${oferta.empresa.logo}`}
                                    alt="Logo"
                                    className="w-20 h-16 rounded-full shadow-lg mr-4"
                                />
                                <h2 className="text-xl font-semibold">{oferta.cargo}</h2>
                            </div>
                            <p className="text-gray-700 mb-1"><strong>Empresa:</strong> {oferta.mostrar_empresa === 1 ? 'Anónima' : oferta.empresa.nombre_comercial}</p>
                            <p className="text-gray-700 mb-1"><strong>Fecha Publicación:</strong> {oferta.fecha_publi}</p>
                            <p className="text-gray-700 mb-1"><strong>Área:</strong> {oferta.areas.nombre_area}</p>
                            <p className="text-gray-700 mb-1"><strong>Carga Horaria:</strong> {oferta.carga_horaria}</p>
                            <p className="text-gray-700 mb-1"><strong>Experiencia Mínima:</strong> {oferta.experiencia}</p>
                            <Link to={`/postulantes/${oferta.id_oferta}`} className="text-blue-600 hover:underline">Ver Oferta</Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default InicioP