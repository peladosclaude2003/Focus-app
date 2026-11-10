module.exports = function (api) {
  api.cache(true);
  return {
    // babel-preset-expo ya incluye el plugin de Reanimated/Worklets.
    presets: ['babel-preset-expo'],
    // Permite importar los .sql de las migraciones de Drizzle como strings.
    plugins: [['inline-import', { extensions: ['.sql'] }]],
  };
};
