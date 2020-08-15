import { Request, Response } from "express"
import { allQueries } from "../../query-helpers/queries"

export class EventController {
    static async resetAccountTable(req: Request, res: Response) {
        try {
            await allQueries.queryWithoutInput('DELETE FROM account')
            res.status(200).send("OK")
        }
        catch (err) {
            res.status(404).send(err)
        }
    }
}