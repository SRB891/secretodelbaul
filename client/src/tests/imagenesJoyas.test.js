import { describe, it, expect } from 'vitest';
import { IMAGENES_JOYAS, obtenerImagenProducto } from '../assets/imagenesJoyas';

describe('Pruebas Unitarias - Utilidad de Imágenes SVG y Rutas Relativas (Catálogo)', () => {
  it('retorna la URL externa cuando el producto tiene imagen_url válida con https', () => {
    const prod = { nombre: 'Collar Prueba', categoria: 'Collares', imagen_url: 'https://ejemplo.com/collar.jpg' };
    expect(obtenerImagenProducto(prod)).toBe('https://ejemplo.com/collar.jpg');
  });

  it('usa el SVG de collar cuando imagen_url es una ruta relativa con ../ (ej. ../../public/img/collar.jpg)', () => {
    const prod = { nombre: 'Collar Tejido Esmeralda', categoria: 'Collares', imagen_url: '../../public/img/collar.jpg' };
    expect(obtenerImagenProducto(prod)).toBe(IMAGENES_JOYAS.collar);
  });

  it('usa el SVG de anillo cuando imagen_url es una ruta relativa desde raíz (ej. /img/anillo.svg)', () => {
    const prod = { nombre: 'Anillo Filigrana Dorada', categoria: 'Anillos', imagen_url: '/img/anillo.svg' };
    expect(obtenerImagenProducto(prod)).toBe(IMAGENES_JOYAS.anillo);
  });

  it('usa el SVG de pulsera cuando imagen_url es una ruta relativa con ./ (ej. ./assets/pulsera.png)', () => {
    const prod = { nombre: 'Pulsera Mompox Bronce', categoria: 'Pulseras', imagen_url: './assets/pulsera.png' };
    expect(obtenerImagenProducto(prod)).toBe(IMAGENES_JOYAS.pulsera);
  });

  it('asigna el SVG de aretes cuando el nombre incluye "candonga" o categoría "arreta"', () => {
    const prod = { nombre: 'candonga', categoria: 'arreta', imagen_url: '../img/candonga.jpg' };
    expect(obtenerImagenProducto(prod)).toBe(IMAGENES_JOYAS.aretes);
  });

  it('retorna el SVG por defecto cuando no coincide con ninguna categoría conocida ni tiene URL web', () => {
    const prod = { nombre: 'Cofre Artesanal', categoria: 'Accesorios', imagen_url: '' };
    expect(obtenerImagenProducto(prod)).toBe(IMAGENES_JOYAS.default);
  });
});