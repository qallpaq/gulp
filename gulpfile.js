const gulp = require('gulp')
const scss = require('gulp-sass')
const browserSync = require('browser-sync').create()
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default
const cleanCSS = require('gulp-clean-css')
const rename = require('gulp-rename')
const del = require('del')
const imagemin = require('gulp-imagemin')
const cache = require('gulp-cache')
const autoprefixer = require('gulp-autoprefixer')
const notify = require('gulp-notify')

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {baseDir: 'public'},
    notify: false
  })
})

gulp.task('html', () => gulp.src('app/index.html')
  .pipe(gulp.dest('public'))
  .pipe(browserSync.reload({stream: true})))

gulp.task('scss', () => {
  return gulp.src('app/scss/**/*.scss')
    .pipe(scss({outputStyle: 'expanded'}).on('error', notify.onError()))
    .pipe(rename({suffix: '.min', prefix: ''}))
    .pipe(autoprefixer({overrideBrowserslist: ['last 10 versions']}))
    .pipe(cleanCSS())
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream())
})

gulp.task('js', () => {
  return gulp.src([
    'app/libs/jquery/jquery.min.js',
    'app/libs/slick/slick.min.js',
    'app/js/main.js'
  ])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
    .pipe(browserSync.reload({stream: true}))
})

gulp.task('imagemin', () => gulp.src('app/img/**/*')
  .pipe(cache(imagemin()))
  .pipe(gulp.dest('public/img')))

gulp.task('clean', () => del(['public'], {force: true}))

gulp.task('fonts', () => gulp.src(['app/fonts/**/*']).pipe(gulp.dest('public/fonts')))

gulp.task('build', gulp.series('imagemin', 'html', 'fonts', 'scss', 'js'))

gulp.task('watch', () => {
  gulp.watch('app/*.html', gulp.parallel('html'))
  gulp.watch('app/fonts/**/*', gulp.parallel('fonts'))
  gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'))
  gulp.watch('app/img/**/*', gulp.parallel('imagemin'))
  gulp.watch(['libs/**/*.js', 'app/js/main.js'], gulp.parallel('js'))
})

gulp.task('server', gulp.parallel('browser-sync', 'watch'))

gulp.task('default', gulp.series('clean', 'build', 'server'))
