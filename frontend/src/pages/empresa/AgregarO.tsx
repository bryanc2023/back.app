import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import axios from '../../services/axios'
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';

interface Titulo {
    id: number;
    titulo: string;
  }

  interface Criterio {
    id_criterio: number;
    criterio: string;
    descripcion: string;
    valor:string| '';
  }

  interface Area {
    id: number;
    nombre_area: string;
}

interface SelectedCriterio extends Criterio {
    valor: string | '',
    prioridad: number;
  }

function AgregarO() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors },reset } = useForm();
    const [niveles, setNiveles] = useState([]);
    const [areas, setAreas] = useState<Area[]>([]);
    const [campos, setCampos] = useState([]);
    const [titulos, setTitulos] = useState<Titulo[]>([]);
    const [selectedNivel, setSelectedNivel] = useState('');
    const [selectedCampo, setSelectedCampo] = useState('');
    const [selectedTitulo, setSelectedTitulo] = useState('');
    const [selectedTituloId, setSelectedTituloId] = useState<number>();
    const [requireEducation, setRequireEducation] = useState(false);
    const [selectedTitles, setSelectedTitles] = useState<Titulo[]>([]);
    const [showCorreo, setShowCorreo] = useState(false); // Estado para mostrar u ocultar campo de correo
    const [showNumeroContacto, setShowNumeroContacto] = useState(false);
    const [showCriterio, setShowCriterio] = useState(false); // Estado para mostrar u ocultar campo de número de contacto
    const [criterios, setCriterios] = useState<Criterio[]>([]);
    const [selectedCriterios, setSelectedCriterios] = useState<SelectedCriterio[]>([]);
    const [selectedCriterioId, setSelectedCriterioId] = useState<number | null>(null);
    const [valorCriterio, setValorCriterio] = useState<string>('');
    const [prioridadCriterio, setPrioridadCriterio] = useState<number | null>(null);
    const { user } = useSelector((state: RootState) => state.auth);
  
 

    useEffect(() => {
        // Obtener titulo nivel y campo
        const fetchData = async () => {
          try {
            const response = await axios.get('titulos');
            const response2 = await axios.get('areas');
            const response3 = await axios.get('criterios');
            setNiveles(response.data.nivel);
            setCampos(response.data.campo);
            setTitulos(response.data.titulo);
            setAreas(response2.data.areas);
            setCriterios(response3.data.criterios);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();

      }, []);

      useEffect(() => {
        // Obtener campos cuando se selecciona un nivel
        const fetchCampos = async () => {
          if (selectedNivel) {
            try {
              const response = await axios.get(`titulos/${selectedNivel}`);
              setCampos(response.data);
            } catch (error) {
              console.error('Error fetching campos:', error);
            }
          }
        };
    
        fetchCampos();
      }, [selectedNivel]);

      useEffect(() => {
        // Obtener titulos por anteriores
        const fetchTitulos = async () => {
          if (selectedNivel && selectedCampo) {
            try {
              const response = await axios.get(`titulos/${selectedNivel}/${selectedCampo}`);
              setTitulos(response.data);
            } catch (error) {
              console.error('Error fetching titulos:', error);
            }
          }
        };
    
        fetchTitulos();
      }, [selectedNivel,selectedCampo]);

      const handleNivelChange = (event:any) => {
        setSelectedNivel(event.target.value);
        setSelectedTitulo(''); 
        setSelectedTituloId(0);
      };
      const handleCampoChange = (event:any) => {
        setSelectedCampo(event.target.value);
        setSelectedTitulo(''); 
        setSelectedTituloId(0);
        
      };
    
   

      const handleCriterioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const id = parseInt(event.target.value);
        setSelectedCriterioId(id);
        setValorCriterio('');
      };
    
      const handleAgregarCriterio = () => {
        if (selectedCriterioId && prioridadCriterio) {
          const criterioSeleccionado = criterios.find(criterio => criterio.id_criterio === selectedCriterioId);
          if (criterioSeleccionado) {
            const exists = selectedCriterios.some(c => c.id_criterio === selectedCriterioId);
            if (!exists) {
              const criterioConValor: SelectedCriterio = {
                ...criterioSeleccionado,
                valor: valorCriterio || '', // Asignar null si no hay valor definido
                prioridad: prioridadCriterio
              };
              setSelectedCriterios([...selectedCriterios, criterioConValor]);
              setSelectedCriterioId(null);
              setValorCriterio('');
              setPrioridadCriterio(null);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Este criterio ya ha sido seleccionado.'
              });
            }
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Seleccione un criterio y complete la prioridad antes de agregarlo.'
          });
        }
      };
      const handleEliminarCriterio = (id: number) => {
        const updatedCriterios = selectedCriterios.filter(c => c.id_criterio !== id);
        setSelectedCriterios(updatedCriterios);
      };

      const handleTituloChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTituloId = parseInt(event.target.value, 10);
        setSelectedTituloId(selectedTituloId);
    
        // Buscar el título seleccionado en la lista de títulos
        const selectedTituloObject = titulos.find(titulo => titulo.id === selectedTituloId);
        if (selectedTituloObject) {
          setSelectedTitulo(selectedTituloObject.titulo);
        } else {
          setSelectedTitulo('');
        }
      };
    
      const handleAgregarTitulo = () => {
        if (selectedTituloId !== undefined) {
            // Verificar si el título ya está en la lista de seleccionados
            const exists = selectedTitles.some(titulo => titulo.id === selectedTituloId);
            if (exists) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Este título ya ha sido seleccionado.',
              });
            } else {
              // Agregar el título a la lista de seleccionados
              const tituloToAdd = titulos.find(titulo => titulo.id === selectedTituloId);
              if (tituloToAdd) {
                setSelectedTitles([...selectedTitles, tituloToAdd]);
              }
            }
          }
        };
    
      const handleEliminarTitulo = (tituloId: number) => {
        const updatedTitles = selectedTitles.filter(titulo => titulo.id !== tituloId);
        setSelectedTitles(updatedTitles);
      };
    
      useEffect(() => {
        // Limpiar títulos seleccionados cuando requireEducation cambia a false
        if (!requireEducation) {
          setSelectedTitles([]);
        }
      
      }, [requireEducation]);

    const onSubmit = handleSubmit(async (values) => {
        // Aquí podrías añadir la lógica para enviar los datos
        if (user) {
            try {
                const usuario = user.id;
                const dataToSend = {
                    ...values,
                    usuario: usuario,
                    correo_contacto: showCorreo ? values.correo_contacto : null,
                    numero_contacto: showNumeroContacto ? values.numero_contacto : null,
                    titulos: selectedTitles,
                    criterios: selectedCriterios,
                };
    
                console.log('Usuario:', usuario);
                console.log('Datos del formulario:', dataToSend);
                console.log('Títulos seleccionados:', selectedTitles);
                console.log('Criterios seleccionados:', selectedCriterios);
    
                const response = await axios.post('add-oferta', dataToSend, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
        
        
    
        Swal.fire({
            title: '¡Publicada!',
            text: 'La oferta se encuentra publicada',
            icon: 'success',
            confirmButtonText: 'Ok'
        }).then(() => {
            navigate("/inicio-e");
        });
} catch (error) {
    console.log(error)
}
        }
        
    });

 
  
  return  (
    <>
    <div className="bg-white p-6 rounded-lg shadow-lg ">
        <h3 className="text-2xl font-bold mb-4">Publicar Oferta</h3>
        <h3 className="text-1xl text-red-500 font-bold mb-4">Datos de la oferta:</h3>
        <form onSubmit={onSubmit}>
        <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="cargo">Puesto de trabajo</label>
                <input
                    className="w-full p-2 border rounded"
                    type="text"
                    id="cargo"
                    placeholder="Cargo"
                    {...register('cargo', { required: true })}
                />
                {errors.cargo && <p className="text-red-500">Puesto es requerido</p>}
            </div>
        <div className="mb-4">
                <div className="flex items-center">
                    <input
                        className="mr-2 leading-tight"
                        type="checkbox"
                        id="requireEducation"
                        checked={requireEducation}
                        onChange={() => setRequireEducation(!requireEducation)}
                    />
                    <label className="text-sm" htmlFor="requireEducation">
                        ¿Requiere titulo específico?
                    </label>
                </div>
            </div>

            {requireEducation && (
                <>
            <div className=" flex-col bg-gray-200  rounded-lg shadow-md items-center p-10">
        <div className="form-group mb-8">
<label htmlFor="nivelEducacion" className="block text-gray-700 font-semibold mb-2">Nivel de Educación:</label>
<select id="nivelEducacion" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
onChange={handleNivelChange}>
  <option value="">Seleccione</option>
      {niveles.map((nivel, index) => (
        <option key={index} value={nivel}>
          {nivel}
        </option>
      ))}
</select>
</div>

<div className="form-group mb-8">
<label htmlFor="campoAmplio" className="block text-gray-700 font-semibold mb-2">Campo Amplio:</label>
<select id="campoAmplio" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
onChange={handleCampoChange}
disabled={!selectedNivel}>
  <option value="">Seleccione</option>
      {campos.map((campo, index) => (
        <option key={index} value={campo}>
          {campo}
        </option>
      ))}
</select>
</div>

<div className="form-group mb-8">
<label htmlFor="titulo" className="block text-gray-700 font-semibold mb-2">Título:</label>
<select id="titulo" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
 onChange={handleTituloChange}
 disabled={!selectedNivel || !selectedCampo}>
<option value="">Seleccione</option>
      {titulos.map((titulo, index) => (
        <option key={index} value={titulo.id}>
          {titulo.titulo}
        </option>
      ))}
</select>
</div>
<button
                type="button"
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleAgregarTitulo}
              >
                Agregar Título
              </button>
              {selectedTitles.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold">Títulos Seleccionados:</h4>
            <ul className="list-disc pl-4">
              {selectedTitles.map((titulo, index) => (
                <li key={index} className="flex items-center">
                  <span>{titulo.titulo}</span>
                  <button
                    type="button"
                    className="ml-2 text-red-600"
                    onClick={() => handleEliminarTitulo(titulo.id)}
                  >
                    x
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
</>
            )}

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="id_area">Área del puesto de trabajo</label>
                <select className="w-full p-2 border rounded" id="id_area" {...register('id_area', { required: true })}>
                <option value="">Seleccione</option>
                {areas.map(area => (
                        <option key={area.id} value={area.id}>
                            {area.nombre_area}
                        </option>
                    ))}
                </select>
                {errors.id_area && <p className="text-red-500">Área es requerida</p>}
            </div>
           
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="experiencia">Años de Experiencia requerida</label>
                <input
                    className="w-full p-2 border rounded"
                    type="number"
                    id="experiencia"
                    placeholder="Describa los años de experiencia en puestos similares"
                    {...register('experiencia', { required: true })}
                />
                {errors.experiencia && <p className="text-red-500">Experiencia es requerida</p>}
            </div>
          
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="objetivo_cargo">Objetivo del puesto de trabajo</label>
                <textarea
                    className="w-full p-2 border rounded"
                    id="objetivo_cargo"
                    placeholder="Describa en breves palabras el objetivo del puesto de trabajo"
                    {...register('objetivo_cargo', { required: true })}
                />
                {errors.objetivo_cargo && <p className="text-red-500">Objetivo del Cargo es requerido</p>}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="sueldo">Sueldo a ofrecer</label>
                <input
                    className="w-full p-2 border rounded"
                    type="number"
                    id="sueldo"
                    placeholder="Ingrese el sueldo a ofrecer al postulante"
                    {...register('sueldo', { required: true })}
                />
                {errors.sueldo && <p className="text-red-500">Sueldo es requerido</p>}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="funciones">Funciones del puesto:</label>
                <textarea
                    className="w-full p-2 border rounded"
                    id="funciones"
                    placeholder="Describa a manera breve las funciones o actividades a realizarse en el puesto"
                    {...register('funciones', { required: true })}
                />
                {errors.funciones && <p className="text-red-500">Funciones son requeridas</p>}
            </div>
       
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="fecha_max_pos">Fecha Máxima de Postulación</label>
                <input
                    className="w-full p-2 border rounded"
                    type="date"
                    id="fecha_max_pos"
                    placeholder="Fecha Máxima de Postulación"
                    {...register('fecha_max_pos', { required: true })}
                />
                {errors.fecha_max_pos && <p className="text-red-500">Fecha Máxima de Postulación es requerida</p>}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="carga_horaria">Carga Horaria</label>
                <select
                    className="w-full p-2 border rounded"
                    id="carga"
                    {...register('carga_horaria', { required: true })}>
                    <option value="">Seleccione una carga</option>
                    <option value="Tiempo Completo">Tiempo Completo</option>
                    <option value="Tiempo Parcial">Tiempo Parcial</option>
                    </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="modalidad">Modalidad</label>
                <select
                    className="w-full p-2 border rounded"
                    id="modalidad"
                    {...register('modalidad', { required: true })}>
                    <option value="">Seleccione una modalidad</option>
                    <option value="Presencial">Presencial</option>
                    <option value="Virtual">Virtual</option>
                    </select>
                
            </div>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="detalles_adicionales">Detalles Adicionales</label>
                <textarea
                    className="w-full p-2 border rounded"
                    id="detalles_adicionales"
                    placeholder="Detalles Adicionales"
                    {...register('detalles_adicionales', { required: true })}
                ></textarea>
                {errors.detalles_adicionales && <p className="text-red-500">Detalles Adicionales son requeridos</p>}
            </div>
            <div className="flex items-center">
                    <input
                        className="mr-2 leading-tight"
                        type="checkbox"
                        id="showCorreo"
                        checked={showCorreo}
                        onChange={() => setShowCorreo(!showCorreo)}
                    />
                    <label className="text-sm" htmlFor="showCorreo">
                        ¿Requiere correo extra de contacto?
                    </label>
                </div>
                    {showCorreo && (
                <>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="correo_contacto">Correo de Contacto</label>
                <input
                    className="w-full p-2 border rounded"
                    type="email"
                    id="correo_contacto"
                    placeholder="Correo de Contacto"
                    {...register('correo_contacto')}
                />
               
            </div>
            </>)}
            <div className="flex items-center">
                    <input
                        className="mr-2 leading-tight"
                        type="checkbox"
                        id="showNumeroContacto"
                        checked={showNumeroContacto}
                        onChange={() => setShowNumeroContacto(!showNumeroContacto)}
                    />
                    <label className="text-sm" htmlFor="showNumeroContacto">
                        ¿Requiere un número extra de contacto?
                    </label>
                </div>
                    {showNumeroContacto && (
                <>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="numero_contacto">Número de Contacto</label>
                <input
                    className="w-full p-2 border rounded"
                    type="tel"
                    id="numero_contacto"
                    placeholder="Número de Contacto"
                    {...register('numero_contacto')}
                />
               
            </div>
            </>)}
            <label className="block text-sm font-bold mb-2" htmlFor="mostrar_suedlo">¿Desea datos confidenciales? Si no desea que se visualize estos dos datos de click en las siguientes opciones:</label>
            <div className="mb-4">
                <div className="flex items-center">
                    <input
                        className="mr-2 leading-tight"
                        type="checkbox"
                        id="mostrar_sueldo"
                        {...register('mostrar_sueldo')}
                    />
                    <label className="text-sm" htmlFor="mostrar_sueldo">
                        No mostrar el sueldo ofrecido al postulante
                    </label>
                </div>
            </div>
            <div className="mb-4">
                <div className="flex items-center">
                    <input
                        className="mr-2 leading-tight"
                        type="checkbox"
                        id="mostrar_empresa"
                        {...register('mostrar_empresa')}
                    />
                    <label className="text-sm" htmlFor="mostrar_empresa">
                        No mostrar nombre de Empresa publicadora
                    </label>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg py-7" style={{ marginTop: '20px' }}>
<h3 className="text-1xl text-red-500 font-bold mb-4">Criterios de evaluación:</h3>
<span>Para mostrar postulantes capaces, seleccione uno de los criterios importantes a resaltar en un postulante junto con su prioridad de importancia y el valor si es necesario:</span>
<div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="id_criterio">Criterio</label>
                <div className="flex">
              <select
                className="w-2/3 p-2 border rounded mr-2"
                id="criterio"
                onChange={handleCriterioChange}
                value={selectedCriterioId || ''}
                >
                  <option value="0">Seleccione un criterio...</option>
                  {criterios.map(criterio => (
                    <option key={criterio.id_criterio} value={criterio.id_criterio}>
                      {criterio.criterio}
                    </option>
                  ))}
                </select>
                {selectedCriterioId && (
                  <>
                  
                    {selectedCriterioId === 4 ? ( // Ejemplo para el criterio "Género", id 2
                      <select
                        className="w-1/3 p-2 border rounded mr-2"
                        id="valor g"
                        value={valorCriterio}
                        onChange={(e) => setValorCriterio(e.target.value)}
                      >
                        <option value="">Seleccione un género...</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                      </select>
                    ) :selectedCriterioId === 5 ? ( // Ejemplo para el criterio "Género", id 2
                        <select
                          className="w-1/3 p-2 border rounded mr-2"
                          id="valor e"
                          value={valorCriterio}
                          onChange={(e) => setValorCriterio(e.target.value)}
                        >
                          <option value="">Seleccione un estado civil...</option>
                          <option value="Casado">Casado/a</option>
                          <option value="Soltero">Soltero/a</option>
                          <option value="Viudo">Viudo/a</option>
                        </select>
                      ) :
                     (
                      <div></div>
                    )}
                   
                  </>
                )}
             
             <select className="w-1/4 p-1 border rounded mr-2"
              id="prioridad"
              value={prioridadCriterio || ''}
              onChange={(e) => setPrioridadCriterio(parseInt(e.target.value))}>
              <option value="">Seleccione una prioridad...</option>
              <option value="1">Alta</option>
              <option value="2">Media</option>
              <option value="3">Baja</option>
              </select>
            </div>
                    <button
                type="button"
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleAgregarCriterio}
              >
                Agregar Criterio
              </button>
              {selectedCriterios.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold">Criterios Seleccionados:</h4>
            <ul>
                {selectedCriterios.map(criterio => (
                  <li key={criterio.id_criterio} className="flex items-center justify-between mb-2">
                    <span>{criterio.valor ? `${criterio.criterio} = ${criterio.valor}  ` : `${criterio.criterio}`}</span>
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => handleEliminarCriterio(criterio.id_criterio)}
                    >
                    x
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      
   
      
               
            </div>
<button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-lg mt-4"
            >
                Publicar Oferta
            </button>
</div>
     
            
        </form>
        
    </div>


</>
);
}

export default AgregarO