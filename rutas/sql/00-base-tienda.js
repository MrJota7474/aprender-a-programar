// La base de datos de ejemplo de la ruta de SQL: una tienda de barrio.
//
// Es texto SQL. El motor lo ejecuta en una base nueva antes de cada
// "Ejecutar", así que los datos siempre vuelven a este punto de partida.
// Los datos son inventados.

globalThis.BASE_SQL_POR_DEFECTO = 'tienda';

globalThis.BASES_SQL = {
  ...(globalThis.BASES_SQL || {}),
  tienda: `
    CREATE TABLE productos (
      id INTEGER PRIMARY KEY,
      nombre TEXT NOT NULL,
      categoria TEXT NOT NULL,
      precio INTEGER NOT NULL,
      existencias INTEGER NOT NULL
    );

    INSERT INTO productos (id, nombre, categoria, precio, existencias) VALUES
      (1, 'Arepa de queso', 'Comidas', 3500, 40),
      (2, 'Empanada', 'Comidas', 2500, 60),
      (3, 'Buñuelo', 'Comidas', 1500, 80),
      (4, 'Tinto', 'Bebidas', 2000, 100),
      (5, 'Jugo de lulo', 'Bebidas', 4500, 25),
      (6, 'Aromática', 'Bebidas', 2500, 30),
      (7, 'Café en grano', 'Mercado', 18000, 12),
      (8, 'Panela', 'Mercado', 4000, 20),
      (9, 'Bocadillo veleño', 'Dulces', 3000, 0),
      (10, 'Oblea', 'Dulces', 3500, 15);

    CREATE TABLE clientes (
      id INTEGER PRIMARY KEY,
      nombre TEXT NOT NULL,
      ciudad TEXT NOT NULL
    );

    INSERT INTO clientes (id, nombre, ciudad) VALUES
      (1, 'Laura Gómez', 'Bogotá'),
      (2, 'Mateo Ríos', 'Medellín'),
      (3, 'Isabela Torres', 'Cali'),
      (4, 'Samuel Díaz', 'Bogotá'),
      (5, 'Valentina Cruz', 'Barranquilla'),
      (6, 'Andrés Mora', 'Medellín');

    CREATE TABLE pedidos (
      id INTEGER PRIMARY KEY,
      cliente_id INTEGER NOT NULL,
      producto_id INTEGER NOT NULL,
      cantidad INTEGER NOT NULL,
      fecha TEXT NOT NULL
    );

    INSERT INTO pedidos (id, cliente_id, producto_id, cantidad, fecha) VALUES
      (1, 1, 1, 2, '2026-03-01'),
      (2, 1, 4, 2, '2026-03-01'),
      (3, 2, 7, 1, '2026-03-02'),
      (4, 3, 2, 6, '2026-03-02'),
      (5, 3, 5, 3, '2026-03-03'),
      (6, 4, 3, 10, '2026-03-04'),
      (7, 5, 10, 4, '2026-03-04'),
      (8, 2, 8, 2, '2026-03-05'),
      (9, 1, 5, 1, '2026-03-06'),
      (10, 4, 4, 3, '2026-03-06');
  `,
};
