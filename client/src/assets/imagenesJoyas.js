const svgToDataUri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export const IMAGENES_JOYAS = {
  anillo: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
      <rect width="300" height="200" fill="#ede9fe"/>
      <circle cx="150" cy="115" r="45" fill="none" stroke="#1e3a8a" stroke-width="12"/>
      <polygon points="150,45 170,68 150,82 130,68" fill="#6d28d9"/>
      <text x="150" y="185" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Anillo Artesanal</text>
    </svg>
  `),
  collar: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
      <rect width="300" height="200" fill="#e0e7ff"/>
      <path d="M 85 45 Q 150 155 215 45" fill="none" stroke="#1e3a8a" stroke-width="6"/>
      <circle cx="150" cy="112" r="16" fill="#6d28d9"/>
      <circle cx="150" cy="112" r="6" fill="#ffffff"/>
      <text x="150" y="185" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Collar Artesanal</text>
    </svg>
  `),
  pulsera: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
      <rect width="300" height="200" fill="#f3e8ff"/>
      <ellipse cx="150" cy="100" rx="65" ry="38" fill="none" stroke="#6d28d9" stroke-width="10"/>
      <circle cx="150" cy="62" r="9" fill="#1e3a8a"/>
      <circle cx="120" cy="67" r="7" fill="#1e3a8a"/>
      <circle cx="180" cy="67" r="7" fill="#1e3a8a"/>
      <text x="150" y="185" font-family="sans-serif" font-size="14" font-weight="bold" fill="#6d28d9" text-anchor="middle">Pulsera Artesanal</text>
    </svg>
  `),
  aretes: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
      <rect width="300" height="200" fill="#ede9fe"/>
      <circle cx="120" cy="80" r="18" fill="none" stroke="#1e3a8a" stroke-width="7"/>
      <circle cx="120" cy="112" r="10" fill="#6d28d9"/>
      <circle cx="180" cy="80" r="18" fill="none" stroke="#1e3a8a" stroke-width="7"/>
      <circle cx="180" cy="112" r="10" fill="#6d28d9"/>
      <text x="150" y="185" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Aretes &amp; Candongas</text>
    </svg>
  `),
  default: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
      <rect width="300" height="200" fill="#ede9fe"/>
      <rect x="95" y="65" width="110" height="70" rx="10" fill="#1e3a8a"/>
      <rect x="95" y="65" width="110" height="25" rx="6" fill="#6d28d9"/>
      <circle cx="150" cy="95" r="8" fill="#ffffff"/>
      <text x="150" y="175" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e3a8a" text-anchor="middle">El Secreto del Baúl</text>
    </svg>
  `),
};

export function obtenerImagenProducto(producto) {
  // Si el usuario ingresó una URL web válida (http/https), usarla
  if (producto.imagen_url && /^https?:\/\//i.test(producto.imagen_url.trim())) {
    return producto.imagen_url.trim();
  }

  const texto = `${producto.nombre || ''} ${producto.categoria || ''}`.toLowerCase();
  if (texto.includes('anillo')) return IMAGENES_JOYAS.anillo;
  if (texto.includes('collar')) return IMAGENES_JOYAS.collar;
  if (texto.includes('pulsera')) return IMAGENES_JOYAS.pulsera;
  if (texto.includes('arete') || texto.includes('arreta') || texto.includes('candonga')) {
    return IMAGENES_JOYAS.aretes;
  }

  return IMAGENES_JOYAS.default;
}