import express, { Application, Request, Response } from "express"
import http, { Server } from "http"
import cors from "cors"
import helmet from "helmet"
const port = process.env.EBANX_PORT || 3002

const app: Application = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet())

app.use("*", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Joseph's Solution for Ebanx's Software Developer Take-Home Assignment!"
    })
})

export const mainApp = app

const server:Server = http.createServer(app)
server.listen(port, () => {
    console.log(`Server up and running on port ${port}!!!`)
})