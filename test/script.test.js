const { calcularTotalCarrito } = require('../script');

test('calcula correctamente el total del carrito', () => {
  const carrito = [
    { name: 'A', price: 10 },
    { name: 'B', price: 20 },
    { name: 'C', price: 30 }
  ];
  expect(calcularTotalCarrito(carrito)).toBe(60);
});
