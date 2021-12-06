const router = require("express").Router();
 const controller = require("./reservations.controller");
 const methodNotAllowed = require("../errors/methodNotAllowed");

 //classic router set-up!! Nothing out of the ordinary
 router
  .route("/:reservationId/status")
  .put(controller.updateStatus)
  .all(methodNotAllowed);

 router
   .route("/:reservationId")
   .get(controller.read)
   .put(controller.update)
   .all(methodNotAllowed);
  
router
   .route("/")
   .get(controller.list)
   .post(controller.create)
   .all(methodNotAllowed);
 
 module.exports = router;