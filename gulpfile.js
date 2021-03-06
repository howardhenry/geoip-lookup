const path = require('path');
const fs = require('fs');
const argv = require('yargs').argv;
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const istanbul = require('gulp-istanbul');
const nodemon = require('gulp-nodemon');
const mocha = require('gulp-mocha');
const sourcemaps = require('gulp-sourcemaps');
const shell = require('shelljs');
const logger = require('./src/utils/logger');

const REPORTS_DIR = './reports';

// During development or testing, import appropriate environment variables
const envFile = argv['env-file'];
const envFilePath = envFile ? path.join(__dirname, envFile) : null;
if (fs.existsSync(envFilePath)) {
    // eslint-disable-next-line
    require('dotenv').config({ path: envFilePath });
    logger.info(`Environment variables loaded from ${envFilePath.replace(__dirname, '.')}`);
}

gulp.task('development', () => {
    return nodemon({
        script: 'src/index.js',
        watch: ['src/**/*.js']
    });
});

gulp.task('eslint', () => {
    if (!fs.existsSync(REPORTS_DIR)) {
        shell.mkdir('-p', REPORTS_DIR);
    }

    const reportFile = path.join(__dirname, `${REPORTS_DIR}/eslint-checkstyle.xml`);
    return gulp.src(['./src/**/*.js', './tests/**/*.js', './gulpfile.js'])
        .pipe(eslint())
        .pipe(eslint.format('checkstyle', fs.createWriteStream(reportFile)))
        .pipe(eslint.failAfterError());
});

gulp.task('eslint-cli', () => {
    return gulp.src(['./src/**/*.js', './tests/**/*.js', './gulpfile.js'])
        .pipe(eslint())
        .pipe(eslint.format('compact'))
        .pipe(eslint.failAfterError());
});

gulp.task('pre-test', () => {
    return gulp.src('./src/**/*.js')
        .pipe(istanbul())
        .pipe(sourcemaps.write('.'))
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], () => {
    if (!fs.existsSync(REPORTS_DIR)) {
        shell.mkdir('-p', REPORTS_DIR);
    }

    return gulp.src('./tests/**/*.spec.js', { read: false })
        .pipe(mocha({
            reporter: 'mocha-junit-reporter',
            reporterOptions: {
                mochaFile: path.join(__dirname, `${REPORTS_DIR}/tests-junit.xml`)
            }
        }))
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 95 } }));
});

gulp.task('test-cli', ['pre-test'], () => {
    return gulp.src('./tests/**/*.spec.js', { read: false })
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 95 } }));
});
