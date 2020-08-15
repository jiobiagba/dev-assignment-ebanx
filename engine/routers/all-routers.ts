import { Router } from "express"
import { EventRouter } from "../controller/event-controller/event.router"

const mainRouter: Router = Router()

mainRouter.use("/", EventRouter)

export const AllRoutes = mainRouter