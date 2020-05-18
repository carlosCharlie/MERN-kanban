StateDao = require("../integration/stateDao.js");

module.exports = {
    getStates: () => StateDao.readAll()
}
