const fs = require('fs')
const path = require('path')

const modulePath = path.join(__dirname, 'modules')

// src: https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
const toCamelCase = (str) => {
  return (str.slice(0, 1).toLowerCase() + str.slice(1))
    .replace(/([-_ ]){1,}/g, ' ')
    .split(/[-_ ]/)
    .reduce((cur, acc) => {
      return cur + acc[0].toUpperCase() + acc.substring(1)
    })
}

const getModuleFilePath = (module, fileType) => {
  return path.join(modulePath, module, `${module}.${fileType}.js`)
}

const getModulesList = () => {
  return fs
    .readdirSync(modulePath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
}

const getModulesListOfType = (fileType) => {
  return getModulesList()
    .filter((module) => {
      return fs.existsSync(getModuleFilePath(module, fileType))
    })
    .map((moduleName) => {
      return {
        name: moduleName,
        path: getModuleFilePath(moduleName, fileType),
        camelCaseName: toCamelCase(moduleName),
      }
    })
}

module.exports = {
  getModulesListOfType,
}
