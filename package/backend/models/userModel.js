const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const provincesData = {
    'Pinar del Río': ['Pinar del Río', 'Consolación del Sur', 'Viñales', '...'],
    'Artemisa': ['Artemisa', 'Bauta', 'Güira de Melena', '...'],
    'La Habana': ['La Habana Vieja', 'Centro Habana', 'Playa', '...'],
    'Mayabeque': ['San José de las Lajas', 'Bejucal', 'Santa Cruz del Norte', '...'],
    'Matanzas': ['Matanzas', 'Varadero', 'Cárdenas', '...'],
    'Cienfuegos': ['Cienfuegos', 'Palmira', 'Cruces', '...'],
    'Villa Clara': ['Santa Clara', 'Caibarién', 'Camajuaní', '...'],
    'Sancti Spíritus': ['Sancti Spíritus', 'Trinidad', 'Jatibonico', '...'],
    'Ciego de Ávila': ['Ciego de Ávila', 'Morón', 'Venezuela', '...'],
    'Camagüey': ['Camagüey', 'Florida', 'Nuevitas', '...'],
    'Las Tunas': ['Las Tunas', 'Puerto Padre', 'Amancio', '...'],
    'Holguín': ['Holguín', 'Gibara', 'Moa', '...'],
    'Granma': ['Bayamo', 'Manzanillo', 'Jiguaní', '...'],
    'Santiago de Cuba': ['Santiago de Cuba', 'Palma Soriano', 'San Luis', '...'],
    'Guantánamo': ['Guantánamo', 'Baracoa', 'Caimanera', '...'],
    'Isla de la Juventud': ['Nueva Gerona', 'La Fe', '...']
};

const categories = ['especialista', 'tecnico', 'ingeniero'];

// Función para crear un usuario (solo con datos básicos)
const createUser = async (userData) => {
  const { name, email, password } = userData;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const query = {
    text: 'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING id, name, email',
    values: [name, email, hashedPassword]
  };
  
  const result = await pool.query(query);
  return result.rows[0];
};

// Función para actualizar datos adicionales después con validaciones
const updateUserDetails = async (userId, { provincia, municipality, categoria }) => {
  // Validar provincia
  if (provincia && !provincesData[provincia]) {
    throw new Error('Provincia inválida');
  }

  // Validar municipio
  if (provincia && municipality) {
    if (!provincesData[provincia].includes(municipality)) {
      throw new Error('Municipio no pertenece a la provincia seleccionada');
    }
  }

  // Validar categoría
  if (categoria && !categories.includes(categoria)) {
    throw new Error('Categoría inválida');
  }

  const query = {
    text: `UPDATE users 
           SET provincia = $1, municipality = $2, categoria = $3, updated_at = NOW()
           WHERE id = $4
           RETURNING id, name, email, provincia, municipality, categoria`,
    values: [provincia, municipality, categoria, userId]
  };
  
  const result = await pool.query(query);
  return result.rows[0];
};

// Función para encontrar usuario por email
const findUserByEmail = async (email) => {
  const query = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email]
  };
  
  const result = await pool.query(query);
  return result.rows[0];
};

// Función para comparar contraseñas
const comparePasswords = async (candidatePassword, hashedPassword) => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

// Función para encontrar usuario por ID (ahora incluye los nuevos campos)
const findUserById = async (id) => {
  const query = {
    text: 'SELECT id, name, email, provincia, municipality, categoria FROM users WHERE id = $1',
    values: [id]
  };
  
  const result = await pool.query(query);
  return result.rows[0];
};

module.exports = {
  createUser,
  updateUserDetails,
  findUserByEmail,
  comparePasswords,
  findUserById
};
