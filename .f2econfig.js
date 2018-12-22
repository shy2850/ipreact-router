const { argv } = process
const build = argv[argv.length - 1] === 'build'
module.exports = {
    livereload: !build,
    build,
    useLess: true,
    gzip: true,
    onRoute: p => {
        if (!p) {
            return 'index.html'
        }
    },
    buildFilter: p => /src|index/.test(p),
    middlewares: [ { middleware: 'rollup' } ],
    output: require('path').join(__dirname, './docs')
}
