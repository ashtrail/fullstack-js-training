const conf = require('../common-eslint-conf')

conf.extends = [...conf.extends, 'plugin:vue/vue3-essential', '@vue/prettier']

module.exports = {
  ...conf,
}
