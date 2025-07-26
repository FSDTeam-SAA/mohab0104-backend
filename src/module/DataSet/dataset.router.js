const { Router } = require("express");
const dataSetController = require("./dataset.controller");
const auth = require("../../middleware/auth");
const USER_ROLE = require("../user/user.constant");

const router = Router();

router.post("/create/:userId", dataSetController.createDataSet);
router.get("/all", dataSetController.getDataSet);
router.get(
  "/my",
  auth(USER_ROLE.user, USER_ROLE.admin),
  dataSetController.getMyDataSet
);

router.get(
  "/:dataSetId",
  //   auth(USER_ROLE.user, USER_ROLE.admin),
  dataSetController.getSingleDataSet
);

router.put(
  "/update/:dataSetId",
  //   auth(USER_ROLE.user, USER_ROLE.admin),
  dataSetController.updateDataSet
);

router.delete(
  "/delete/:dataSetId",
  //   auth(USER_ROLE.user, USER_ROLE.admin),
  dataSetController.deletedDataSet
);

const dataSetRouter = router;
module.exports = dataSetRouter;
