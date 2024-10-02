import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";

const router = Router();

router.route("/send-message/:receiverId").post(verifyJWT, sendMessage);
router.route("/get-all-messages/:receiverId").post(verifyJWT, getMessages);

export default router;
