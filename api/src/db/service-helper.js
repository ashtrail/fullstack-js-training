const { NotFoundError } = require('../errors')

getById = async (model, id, eagerConf = null) => {
  let data
  if (eagerConf !== null) {
    data = await model.findByPk(id, eagerConf)
  } else {
    data = await model.findByPk(id)
  }
  if (data == null) throw NotFoundError
  return data
}

updateById = async (model, id, newData, eagerConf = null) => {
  await model.update(newData, {
    where: { id: id },
  })
  return getById(model, id, eagerConf)
}

module.exports = {
  getById,
  updateById,
}
