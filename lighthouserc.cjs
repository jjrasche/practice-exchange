module.exports = {
  ci: {
    collect: {
      url: ['https://localhost/'],
      settings: {
        chromeFlags: '--ignore-certificate-errors --no-sandbox',
        onlyCategories: ['performance', 'accessibility'],
      },
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
}
