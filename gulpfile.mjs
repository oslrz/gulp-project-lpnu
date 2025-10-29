import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
import cleanCSS from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import htmlmin from 'gulp-htmlmin';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import browserSyncLib from 'browser-sync';
import { deleteAsync } from 'del';

const { src, dest, watch, series, parallel } = gulp;
const sass = gulpSass(dartSass);
const browserSync = browserSyncLib.create();

const paths = {
  html: 'src/*.html',
  scss: 'src/scss/style.scss',
  js: 'src/js/**/*.js',
  img: 'src/img/**/*',
  dist: 'dist/',
};

// 🧹 Очистка dist
export async function clean() {
  await deleteAsync([paths.dist]);
}

// 🎨 Стилі
export function styles() {
  return src(paths.scss, { sourcemaps: true })
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.dist + 'css', { sourcemaps: '.' }))
    .pipe(browserSync.stream());
}

// ⚙️ Скрипти
export function scripts() {
  return src(paths.js, { sourcemaps: true })
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.dist + 'js', { sourcemaps: '.' }))
    .pipe(browserSync.stream());
}

// 🖼️ Зображення
export function images() {
  return src(paths.img)
    .pipe(imagemin())
    .pipe(dest(paths.dist + 'img'));
}

// 🧱 HTML
export function html() {
  return src(paths.html)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(paths.dist))
    .pipe(browserSync.stream());
}

// 🧭 Сервер + watcher
export function serve() {
  browserSync.init({
    server: { baseDir: paths.dist },
    notify: false,
    open: false,
    port: 3000,
  });

  watch('src/scss/**/*.scss', styles);
  watch(paths.js, scripts);
  watch(paths.html, html);
  watch(paths.img, images);
}

// 🏗️ Збірка
export const build = series(clean, parallel(styles, scripts, images, html));
export default series(build, serve);
