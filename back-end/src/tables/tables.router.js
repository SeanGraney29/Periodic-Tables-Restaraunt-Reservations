const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

//Another classic router setup. Nothing out of the ordinary.

router
  .route("/:tableId/seat")
  .put(controller.update)
  .delete(controller.clearTable)
  .all(methodNotAllowed);
  
router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;