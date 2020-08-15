import { Router } from "express"
import { EventController } from "./event.controller"

const router: Router = Router()

router.post("/reset", EventController.resetAccountTable)

export const EventRouter = router