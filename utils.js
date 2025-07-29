function calcularTotalCarrito(items) {
  return items.reduce((total, item) => total + item.price, 0);
}

module.exports = { calcularTotalCarrito };
