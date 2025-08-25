/**
 * Utilidades para manejo de fechas en la aplicación
 */

// Nombres de meses en español
const MONTHS_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

// Nombres cortos de meses en español
const MONTHS_ES_SHORT = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic"
];

/**
 * Convierte un string en formato DD/MM/AAAA a un objeto Date
 * @param {string} dateString - String en formato DD/MM/AAAA
 * @returns {Date|null} - Objeto Date o null si es inválido
 */
export const parseDateFromString = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return null;
  
  try {
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/').map(num => parseInt(num));
      if (day && month && year && !isNaN(day) && !isNaN(month) && !isNaN(year)) {
        // month - 1 porque Date usa 0-11 para meses
        return new Date(year, month - 1, day);
      }
    }
    return null;
  } catch (error) {
    console.log("Error parsing date string:", error);
    return null;
  }
};

/**
 * Convierte un objeto Date a string en formato DD/MM/AAAA
 * @param {Date} date - Objeto Date
 * @returns {string} - String en formato DD/MM/AAAA
 */
export const formatDateToString = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  
  return `${day}/${month}/${year}`;
};

/**
 * Formatea una fecha en español largo (ej: "15 de enero, 1990")
 * @param {Date} date - Objeto Date
 * @returns {string} - Fecha formateada en español
 */
export const formatDateToSpanish = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "Fecha inválida";
  }
  
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  
  return `${day} de ${MONTHS_ES[month]}, ${year}`;
};

/**
 * Formatea una fecha en español corto (ej: "15 ene 1990")
 * @param {Date} date - Objeto Date
 * @returns {string} - Fecha formateada en español corto
 */
export const formatDateToSpanishShort = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "Fecha inválida";
  }
  
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  
  return `${day} ${MONTHS_ES_SHORT[month]} ${year}`;
};

/**
 * Obtiene la fecha por defecto (5 años atrás de hoy)
 * @returns {Date} - Objeto Date de hace 5 años
 */
export const getDefaultDate = () => {
  const today = new Date();
  const defaultYear = today.getFullYear() - 5;
  const defaultMonth = today.getMonth();
  const defaultDay = today.getDate();
  
  // Manejar año bisiesto
  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };
  
  // Ajustar día si es 29 de febrero en año no bisiesto
  if (defaultMonth === 1 && defaultDay === 29 && !isLeapYear(defaultYear)) {
    return new Date(defaultYear, 1, 28); // 28 de febrero
  }
  
  return new Date(defaultYear, defaultMonth, defaultDay);
};

/**
 * Valida si una fecha es válida y no es posterior a 5 años atrás
 * @param {Date} date - Objeto Date a validar
 * @returns {boolean} - true si la fecha es válida
 */
export const isValidDate = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }
  
  // Verificar que la fecha no sea posterior a 5 años atrás de hoy
  const today = new Date();
  const maxAllowedYear = today.getFullYear() - 5;
  const maxAllowedDate = new Date(maxAllowedYear, today.getMonth(), today.getDate());
  
  return date <= maxAllowedDate;
};

/**
 * Valida si una fecha específica (día, mes, año) es válida
 * @param {number} day - Día del mes (1-31)
 * @param {number} month - Mes del año (1-12)
 * @param {number} year - Año
 * @returns {boolean} - true si la fecha es válida
 */
export const isValidDateComponents = (day, month, year) => {
  if (day < 1 || month < 1 || month > 12 || year < 1900 || year > 2100) {
    return false;
  }
  
  // Verificar que la fecha no sea posterior a 5 años atrás de hoy
  const today = new Date();
  const maxAllowedYear = today.getFullYear() - 5;
  const maxAllowedDate = new Date(maxAllowedYear, today.getMonth(), today.getDate());
  const selectedDate = new Date(year, month - 1, day);
  
  if (selectedDate > maxAllowedDate) {
    return false;
  }
  
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  // Ajustar febrero para años bisiestos
  if (month === 2) {
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    daysInMonth[1] = isLeap ? 29 : 28;
  }
  
  return day <= daysInMonth[month - 1];
};

/**
 * Obtiene la edad a partir de una fecha de nacimiento
 * @param {Date} birthDate - Fecha de nacimiento
 * @returns {number} - Edad en años
 */
export const getAge = (birthDate) => {
  if (!birthDate || !(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
    return 0;
  }
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Formatea una fecha para mostrar en la interfaz de usuario
 * @param {Date|string} date - Fecha como Date o string DD/MM/AAAA
 * @param {string} format - Formato deseado ('long', 'short', 'string')
 * @returns {string} - Fecha formateada
 */
export const formatDateForDisplay = (date, format = 'long') => {
  let dateObj = date;
  
  // Si es string, convertirlo a Date
  if (typeof date === 'string') {
    dateObj = parseDateFromString(date);
  }
  
  if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return "No especificado";
  }
  
  switch (format) {
    case 'long':
      return formatDateToSpanish(dateObj);
    case 'short':
      return formatDateToSpanishShort(dateObj);
    case 'string':
      return formatDateToString(dateObj);
    default:
      return formatDateToSpanish(dateObj);
  }
};
