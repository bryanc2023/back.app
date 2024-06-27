import axios from '../../services/axios';
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ExperienceModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (data: Experiencia) => void;
  experiencia: Experiencia | null; // Se añade para diferenciar entre agregar y editar
}

interface Area {
  id: number;
  nombre_area: string;
}

interface Experiencia {
  id_formacion_pro?: number; // Añadir opcionalmente para editar
  empresa: string;
  puesto: string;
  area: string;
  fechaini: string;
  fechafin: string;
  descripcion: string;
  referencia: string;
  contacto: string;
}

const ExperienceModal: React.FC<ExperienceModalProps> = ({ isOpen, onRequestClose, onSubmit, experiencia }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<Experiencia>();
  const [areas, setAreas] = useState<Area[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('areas');
        setAreas(response.data.areas);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (experiencia) {
      setValue('empresa', experiencia.empresa);
      setValue('puesto', experiencia.puesto);
      setValue('area', experiencia.area);
      setValue('fechaini', experiencia.fechaini);
      setValue('fechafin', experiencia.fechafin);
      setValue('descripcion', experiencia.descripcion);
      setValue('referencia', experiencia.referencia);
      setValue('contacto', experiencia.contacto);
    } else {
      reset();
    }
  }, [experiencia, reset, setValue]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (user) {
          const response = await axios.get(`/perfil/${user.id}`);
          setProfileData(response.data);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const onSubmitForm: SubmitHandler<Experiencia> = async (data) => {
    if (!profileData || !profileData.postulante) {
      console.error('Profile data is missing');
      return;
    }

    const dataToSend = {
      ...data,
      id_postulante: profileData.postulante.id_postulante,
    };

    console.log('Data to send:', dataToSend); // Debugging line

    if (experiencia && experiencia.id_formacion_pro) {
      // Editar experiencia
      try {
        await axios.put(`/experiencia/${experiencia.id_formacion_pro}`, {
          ...dataToSend,
          id_experiencia: experiencia.id_formacion_pro,
        });
        onSubmit(data);
      } catch (error) {
        console.error('Error updating experiencia:', error);
      }
    } else {
      // Agregar nueva experiencia
      try {
        const response = await axios.post('/exp', dataToSend);
        console.log('Response:', response.data); // Debugging line
        onSubmit(data);
      } catch (error) {
        console.error('Error adding experiencia:', error);
        console.log('Error details:', error.response?.data); // Detalles del error
      }
    }
    onRequestClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-4 md:mx-auto my-20 relative">
        <button onClick={onRequestClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold">
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-blue-500">{experiencia ? 'Editar Experiencia' : 'Agregar Experiencia'}</h2>
        <div className="max-h-96 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <div>
              <label className="block text-gray-700">Nombre de la Empresa:</label>
              <input 
                {...register('empresa', { 
                  required: 'Este campo es obligatorio', 
                  maxLength: { value: 100, message: 'Máximo 100 caracteres' } 
                })} 
                className="w-full px-4 py-2 border rounded-md text-gray-700" 
              />
              {errors.empresa && <p className="text-red-500">{errors.empresa.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Área del puesto de trabajo:</label>
              <select 
                className="w-full px-4 py-2 border rounded-md text-gray-700" 
                {...register('area', { 
                  required: 'Área es requerida', 
                  maxLength: { value: 250, message: 'Máximo 250 caracteres' } 
                })}
              >
                <option value="">Seleccione</option>
                {areas.map(area => (
                  <option key={area.id} value={area.nombre_area}>
                    {area.nombre_area}
                  </option>
                ))}
              </select>
              {errors.area && <p className="text-red-500">{errors.area.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Puesto en la empresa:</label>
              <input 
                {...register('puesto', { 
                  required: 'Este campo es obligatorio', 
                  maxLength: { value: 100, message: 'Máximo 100 caracteres' } 
                })} 
                className="w-full px-4 py-2 border rounded-md text-gray-700" 
              />
              {errors.puesto && <p className="text-red-500">{errors.puesto.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Fecha de inicio labores:</label>
              <input 
                type="date" 
                {...register('fechaini', { 
                  required: 'Este campo es obligatorio' 
                })} 
                className="w-full px-4 py-2 border rounded-md text-gray-700" 
              />
              {errors.fechaini && <p className="text-red-500">{errors.fechaini.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Fecha de fin de labores:</label>
              <input 
                type="date" 
                {...register('fechafin', { 
                  required: 'Este campo es obligatorio' 
                })} 
                className="w-full px-4 py-2 border rounded-md text-gray-700" 
              />
              {errors.fechafin && <p className="text-red-500">{errors.fechafin.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Descripción de responsabilidades en la empresa:</label>
              <textarea 
                {...register('descripcion', { 
                  required: 'Este campo es obligatorio', 
                  maxLength: { value: 500, message: 'Máximo 500 caracteres' } 
                })} 
                className="w-full px-4 py-2 border rounded-md text-gray-700" 
              />
              {errors.descripcion && <p className="text-red-500">{errors.descripcion.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Nombre Persona Referencia:</label>
              <input 
                {...register('referencia', { 
                  required: 'Este campo es obligatorio', 
                  maxLength: { value: 250, message: 'Máximo 250 caracteres' } 
                })} 
                className="w-full px-4 py-2 border rounded-md text-gray-700" 
              />
              {errors.referencia && <p className="text-red-500">{errors.referencia.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700">Contacto:</label>
              <input 
                type="text" 
                {...register('contacto', { 
                  required: 'Este campo es obligatorio', 
                  maxLength: { value: 250, message: 'Máximo 250 caracteres' } 
                })} 
                className="w-full px-4 py-2 border rounded-md text-gray-700" 
                placeholder="Número o Correo de contacto de la persona de referencia"
              />
              {errors.contacto && <p className="text-red-500">{errors.contacto.message}</p>}
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={onRequestClose} className="px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-500 hover:text-white">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExperienceModal;
