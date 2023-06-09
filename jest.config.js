module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transformIgnorePatterns: ['/node_modules/(?!@ionic/vue|@ionic/vue-router|@ionic/core|@stencil/core|ionicons)'],
  roots: [
    '<rootDir>/tests/unit'
  ],
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
}
