const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.patch("/status", userController.changeStatus);
router.patch("/lastLogin", userController.changeLoginDate);
router.get("/auth", authMiddleware, userController.check);
router.get("/", userController.getALL);
router.get("/one", userController.getOne);
router.delete("/", userController.delete);

module.exports = router;
