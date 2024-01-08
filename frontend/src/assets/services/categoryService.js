// categoryService.js
import axios from 'axios';

const CATEGORY_API_URL = 'http://127.0.0.1:3000/categories'; // Ajusta a la URL de tu backend

export const getCategories = async () => {
  return await axios.get(CATEGORY_API_URL);
};
