import gulp from "gulp";
import gulpSass from "gulp-sass";
import dartSass from "sass";
import cleanCSS from "gulp-clean-css";
import uglify from "gulp-uglify";
import imagemin from "gulp-imagemin";
import htmlmin from "gulp-htmlmin";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";
import browserSyncLib from "browser-sync";
import { deleteAsync } from "del";
import fileInclude from 'gulp-file-include';


const { src, dest, watch, series, parallel } = gulp;
const sass = gulpSass(dartSass);
const browserSync = browserSyncLib.create();

const paths = {
  html: "src/*.html",
  scss: "src/scss/style.scss",
  js: "src/js/**/*.js",
  img: "src/img/**/*",
  dist: "dist/",
};

export function bootstrapCSS() {
  return src('node_modules/bootstrap/dist/css/bootstrap.min.css')
    .pipe(dest(paths.dist + 'css'));
}

export function bootstrapJS() {
  return src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
    .pipe(dest(paths.dist + 'js'));
}

export async function clean() {
  await deleteAsync([paths.dist]);
}

export function styles() {
  return src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        includePaths: ['src/scss'],
      }).on('error', sass.logError)
    )
    .pipe(cleanCSS({ level: 2 }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.dist + 'css'))
    .pipe(browserSync.stream());
}

export function scripts() {
  return src(paths.js, { sourcemaps: true })
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest(paths.dist + "js", { sourcemaps: "." }))
    .pipe(browserSync.stream());
}

export function images() {
  return src(paths.img)
    .pipe(imagemin())
    .pipe(dest(paths.dist + "img"));
}

export function html() {
  return src(paths.html)
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(paths.dist))
    .pipe(browserSync.stream());
}

export function serve() {
  browserSync.init({
    server: { baseDir: paths.dist },
    notify: false,
    open: false,
    port: 3000,
  });

  watch("src/scss/**/*.scss", styles);
  watch(paths.js, scripts);
  watch(paths.html, html);
  watch(paths.img, images);
}

export const build = series(clean, parallel(styles, scripts, images, html, bootstrapCSS, bootstrapJS));
export default series(build, serve);
