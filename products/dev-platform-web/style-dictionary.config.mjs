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
    }
  }
};
