/**
 * Style Dictionary configuration.
 *
 * Source : tokens/{base,semantic,components}/**.json
 * Output : dist/{css,tailwind,ios,android}
 *
 * The `--token-*` CSS variable prefix isolates raw tokens from Tailwind v4's
 * own `--color-*` / `--font-*` / `--radius-*` namespaces (used by the @theme
 * block in src/app.css). This avoids self-referential variable loops.
 */
export default {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'token',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: { outputReferences: true }
        }
      ]
    },
    tailwind: {
      transformGroup: 'css',
      prefix: 'token',
      buildPath: 'dist/tailwind/',
      files: [
        {
          destination: 'theme.css',
          format: 'css/variables',
          options: { selector: ':root', outputReferences: true }
        }
      ]
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6'
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations'
        }
      ]
    },
    ios: {
      transformGroup: 'ios-swift',
      buildPath: 'dist/ios/',
      files: [
        {
          destination: 'DesignTokens.swift',
          format: 'ios-swift/class.swift',
          className: 'DesignTokens'
        }
      ]
    },
    android: {
      transformGroup: 'android',
      buildPath: 'dist/android/',
      files: [
        {
          destination: 'colors.xml',
          format: 'android/colors',
          filter: (token) => token.attributes?.category === 'color'
        },
        {
          destination: 'dimens.xml',
          format: 'android/dimens',
          filter: (token) =>
            token.attributes?.category === 'size' ||
            token.attributes?.category === 'spacing' ||
            token.attributes?.category === 'radius'
        }
      ]
    }
  }
};
