var fs = require('fs')
var path = require('path')

function I18NPM (opts) {
  opts = opts || {}
  this.verison = opts.verison || '0.0.0'
  this.path = opts.path || './locales/en/'
  this.fallbackPath = opts.fallbackFile = this.path

  this._file = path.join(opts.path, this.verison + '.json')
  this._fallbackFile = path.join(opts.fallbackPath, this.verison + '.json')
  this._cache = {}
}

I18NPM.prototype.__ = function () {
  var args = Array.prototype.slice.call(arguments)
  var str = args.shift()
  if (!this._cache[this._file]) {
    this._readLocaleFile(this._file)
  }

  if (this._cache[this._file][str]) {
    return this._cache[this._file][str]
  }

  if (!this._cache[this._fallbackFile]) {
    this._readLocaleFile(this._fallbackFile)
  }

  if (this._cache[this._fallbackFile][str]) {
    return this._cache[this._fallbackFile][str]
  }

  throw new Error('text not found: ' + str)
}

I18NPM.prototype._readLocaleFile = function (file) {
  var localeLookup = {}

  try {
    localeLookup = JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch (e) {
    throw e
  }

  this._cache[file] = localeLookup
}

module.exports = function (opts) {
  var i18n = new I18NPM(opts)

  for (var key in i18n) {
    if (typeof i18n[key] === 'function') {
      i18n[key] = i18n[key].bind(i18n)
    }
  }

  return i18n
}
