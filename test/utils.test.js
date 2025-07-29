const { calcularTotalCarrito } = require('../utils');

test('calcula correctamente el total del carrito', () => {
  const carrito = [
    { name: 'Producto 1', price: 10 },
    { name: 'Producto 2', price: 20 }
  ];
  expect(calcularTotalCarrito(carrito)).toBe(30);
});
