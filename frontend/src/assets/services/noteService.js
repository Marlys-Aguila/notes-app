// noteService.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:3000/notes'; // Ajusta a la URL de tu backend

// Obtener todas las notas
export const getNotes = async () => {
  return await axios.get(API_URL);
};

// Obtener una nota específica por ID
export const getNote = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
};

// Crear una nueva nota
export const createNote = async (noteData) => {
  const payload = {
    title: noteData.title,
    content: noteData.content,
    categories: noteData.categories,
    isArchived: noteData.isArchived !== undefined ? noteData.isArchived : false // Por defecto a false si no está definido
  };
  const response = await axios.post(API_URL, payload);
  return response.data; // Devuelve la nota creada desde el backend
};

// Actualizar una nota existente
export const updateNote = async (id, noteData) => {
  const response = await axios.put(`${API_URL}/${id}`, {
    title: noteData.title,
    content: noteData.content,
    categories: noteData.categories, // Asegúrate de que esto sea un array de IDs de categoría
    isArchived: noteData.isArchived
  });
  return response.data; // Devuelve la nota actualizada desde el backend
};

// Eliminar una nota por su ID
export const deleteNote = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};

