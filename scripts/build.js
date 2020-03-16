const fs = require('fs');
const rollup = require('rollup');

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

let builds = require('./config').builds;

build(builds);

function build (builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built])
      .then(() => {
        built++
        if (built < total) {
          next()
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
  next();
}

function buildEntry (config) {
  return rollup.rollup(config)
    .then(bundle => bundle.generate(config.output))
    .then(({ output: [{ code }] }) => {
      return write(config.output.file, code)
    })
}

function write (dest, code) {
  return new Promise((resolve, reject) => {
    fs.writeFile(dest, code, err => {
      if (err) return reject(err);
      resolve();
    })
  })
}
