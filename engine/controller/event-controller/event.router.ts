import { Router } from "express"
import { EventController } from "./event.controller"

const router: Router = Router()

router.post("/reset", EventController.resetAccountTable)
router.get("/balance", EventController.getBalance)
router.post("/event", EventController.depositWithdrawOrTransfer)

export const EventRouter = router