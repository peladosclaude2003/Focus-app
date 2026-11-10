const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Migraciones de Drizzle (.sql) incluidas en el bundle.
config.resolver.sourceExts.push('sql');

module.exports = config;
