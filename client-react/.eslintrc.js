const conf = require('../common-eslint-conf')

conf.extends = [...conf.extends, 'react-app', 'plugin:react-hooks/recommended']

module.exports = {
  ...conf,
}
