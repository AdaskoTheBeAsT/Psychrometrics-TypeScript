const reportPath = '../../.reports/libs/psychrometrics/';
const reportName = 'test-report';

module.exports = {
  displayName: 'psychrometrics',
  preset: '../../jest.preset.js',
  globals: {},
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!(@adaskothebeast/splines))'],
  moduleFileExtensions: ['ts', 'js', 'html'],
  collectCoverage: true,
  coverageDirectory: `${reportPath}coverage`,
  coverageReporters: ['cobertura', 'html', ['lcov', { projectRoot: '../../' }]],
  reporters: [
    'default',
    [
      'jest-stare',
      {
        resultDir: reportPath,
        reportTitle: 'Test',
        additionalResultsProcessors: [],
        coverageLink: 'coverage/index.html',
        resultJson: `${reportName}.stare.json`,
        resultHtml: `${reportName}.stare.html`,
        report: true,
        reportSummary: true,
      },
    ],
    [
      'jest-html-reporters',
      {
        publicPath: reportPath,
        filename: `${reportName}.html`,
        pageTitle: 'Test',
        expand: true,
      },
    ],
    [
      'jest-xunit',
      {
        outputPath: reportPath,
        filename: `${reportName}.xunit.xml`,
        traitsRegex: [
          { regex: /\(Test Type:([^,)]+)(,|\)).*/g, name: 'Category' },
          { regex: /.*Test Traits: ([^)]+)\).*/g, name: 'Type' },
        ],
      },
    ],
    [
      'jest-sonar',
      {
        outputDirectory: reportPath,
        outputName: `${reportName}.sonar.xml`,
        reportedFilePath: 'relative',
        relativeRootDir: '../../',
      },
    ],
    [
      'jest-trx-results-processor',
      {
        outputFile: `${reportPath}${reportName}.trx`,
      },
    ],
    [
      'jest-junit',
      {
        outputDirectory: reportPath,
        outputName: `${reportName}.junit.xml`,
      },
    ],
  ],
};
