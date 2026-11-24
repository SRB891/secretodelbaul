import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default function Auth({ onLoginExitoso }) {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      if (modoRegistro) {
        const res = await axios.post(`${API_URL}/auth/registro`, { nombre, email, password });
        onLoginExitoso(res.data);
      } else {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        onLoginExitoso(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error de conexión con el servidor');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card-panel auth-card">
        <h2 className="seccion-titulo" style={{ marginBottom: '16px' }}>
          {modoRegistro ? 'Crear Cuenta de Cliente' : 'Iniciar Sesión'}
        </h2>
        <p className="auth-subtexto">
          {modoRegistro
            ? 'Regístrate para explorar el catálogo, comprar joyas y rastrear tus envíos.'
            : 'Ingresa con tu cuenta de cliente o administrador.'}
        </p>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={manejarSubmit} className="form-stack">
          {modoRegistro && (
            <label className="form-label">
              Nombre completo:
              <input
                type="text"
                className="form-input"
                placeholder="Ej. María Gómez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </label>
          )}

          <label className="form-label">
            Correo electrónico:
            <input
              type="email"
              className="form-input"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="form-label">
            Contraseña:
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={cargando} className="btn-primary btn-full">
            {cargando ? 'Procesando...' : modoRegistro ? 'Registrarme' : 'Entrar'}
          </button>
        </form>

        <div className="auth-switch">
          <span>{modoRegistro ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?'}</span>
          <button
            type="button"
            className="btn-link"
            onClick={() => {
              setModoRegistro(!modoRegistro);
              setError('');
            }}
          >
            {modoRegistro ? 'Inicia sesión aquí' : 'Regístrate gratis'}
          </button>
        </div>
      </div>
    </div>
  );
}