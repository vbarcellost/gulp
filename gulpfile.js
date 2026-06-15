// =============================================================================
// Gulpfile.js — Automatização de tarefas com Gulp
// Tarefas:
//   1. compileSass  → Compila SCSS para CSS (com sourcemaps)
//   2. compressImages → Comprime imagens JPG/PNG
//   3. minifyJS     → Minifica arquivos JavaScript
//   4. watch        → Observa mudanças nos arquivos (desenvolvimento)
//   default         → Executa tudo em paralelo e ativa o watch
// =============================================================================

const gulp        = require('gulp');
const sass        = require('gulp-sass')(require('sass'));
const uglify      = require('gulp-uglify');
const imagemin    = require('gulp-imagemin');
const sourcemaps  = require('gulp-sourcemaps');
const rename      = require('gulp-rename');

// -----------------------------------------------------------------------------
// Caminhos (paths)
// -----------------------------------------------------------------------------
const paths = {
  scss: {
    src:  'scss/**/*.scss',
    dest: 'dist/css'
  },
  js: {
    src:  'js/**/*.js',
    dest: 'dist/js'
  },
  images: {
    src:  'images/**/*.{jpg,jpeg,png,gif,svg}',
    dest: 'dist/images'
  }
};

// -----------------------------------------------------------------------------
// 1. Compilação do SASS
//    • Compila SCSS → CSS com sourcemaps para facilitar o debug
//    • Gera versão comprimida (.min.css) e copia o mapa de origem
// -----------------------------------------------------------------------------
function compileSass() {
  return gulp
    .src(paths.scss.src)
    .pipe(sourcemaps.init())
    .pipe(
      sass({ outputStyle: 'compressed' })
        .on('error', sass.logError)
    )
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scss.dest));
}

// -----------------------------------------------------------------------------
// 2. Compressão de Imagens
//    • JPG: qualidade 80 (progressivo)
//    • PNG: otimizado com optipng nível 5
//    • SVG: svgo ativado
// -----------------------------------------------------------------------------
function compressImages() {
  return gulp
    .src(paths.images.src)
    .pipe(
      imagemin([
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            { removeViewBox: false },
            { cleanupIDs: false }
          ]
        })
      ], { verbose: true })
    )
    .pipe(gulp.dest(paths.images.dest));
}

// -----------------------------------------------------------------------------
// 3. Compressão (minificação) de JavaScript
//    • Minifica com UglifyJS (remove comentários, espaços, encurta variáveis)
//    • Salva como .min.js
// -----------------------------------------------------------------------------
function minifyJS() {
  return gulp
    .src(paths.js.src)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.js.dest));
}

// -----------------------------------------------------------------------------
// 4. Watch — Observa mudanças para desenvolvimento
// -----------------------------------------------------------------------------
function watch() {
  console.log('👀 Observando mudanças nos arquivos...');
  gulp.watch(paths.scss.src,   compileSass);
  gulp.watch(paths.js.src,     minifyJS);
  gulp.watch(paths.images.src, compressImages);
}

// -----------------------------------------------------------------------------
// Exportações das tarefas individuais
// -----------------------------------------------------------------------------
exports.compileSass     = compileSass;
exports.compressImages  = compressImages;
exports.minifyJS        = minifyJS;
exports.watch           = watch;

// -----------------------------------------------------------------------------
// Tarefa padrão: executa as 3 tarefas em paralelo e inicia o watch
// -----------------------------------------------------------------------------
exports.default = gulp.series(
  gulp.parallel(compileSass, compressImages, minifyJS),
  watch
);
