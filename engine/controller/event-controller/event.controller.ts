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

    static async getBalance(req: Request, res: Response) {
        try {
            const result = await allQueries.query('SELECT balance FROM account WHERE id = $1', [req.query.account_id])
            if( result.rows.length === 0) throw "0"
            res.status(200).json(result.rows[0].balance)
        }
        catch (err) {
            res.status(404).send(err)
        }
    }

    static async depositWithdrawOrTransfer(req: Request, res: Response) {
        try {
            if(!req.body.type) throw "Please specify transaction type - deposit, transfer, or withdrawal"
            // Logic for Depositing, Withdrawing and Transferring
            if( req.body.type === "deposit") {
                // If account exists, add the amount to its balance else create a new account
                const account = await allQueries.query('SELECT * FROM account WHERE id = $1', [req.body.destination])
                if( account.rows.length === 0) {
                    // Account doesn't exist so create a new account
                    const result = await allQueries.query('INSERT INTO account (id,balance) VALUES ($1,$2) RETURNING *', [req.body.destination, req.body.amount])
                    return res.status(201).json({
                        destination: result.rows[0]
                    })
                } else {
                    // Account exists. Add amount to balance
                    const result: any = await allQueries.queryByTransaction('UPDATE account SET balance=$1 WHERE id=$2 RETURNING *', [account.rows[0].balance + req.body.amount, req.body.destination])
                    return res.status(201).json({
                        destination: result.rows[0]
                    })
                }
            }
            else if( req.body.type === "withdraw") {
                // If account exists reduce balance else throw "0"
                const account = await allQueries.query('SELECT * FROM account WHERE id = $1', [req.body.origin])
                if( account.rows.length === 0) throw "0"
                const result: any = await allQueries.queryByTransaction('UPDATE account SET balance=$1 WHERE id=$2 RETURNING *', [account.rows[0].balance - req.body.amount, req.body.origin])
                    return res.status(201).json({
                        origin: result.rows[0]
                    })
            }
            else if( req.body.type === "transfer") {
                // If origin account exists, do transfer, else throw "0"
                const account = await allQueries.query('SELECT * FROM account WHERE id = $1', [req.body.origin])
                if( account.rows.length === 0) throw "0"
                // If destination account does not exist, create it with initial balance of 0
                const destAcct = await allQueries.query('SELECT * FROM account WHERE id = $1', [req.body.destination])
                if( destAcct.rows.length === 0) {
                    const newAccount = await allQueries.query('INSERT INTO account (id,balance) VALUES ($1,$2) RETURNING *', [req.body.destination, 0])
                    const originTransaction: any = await allQueries.queryByTransaction('UPDATE account SET balance=$1 WHERE id=$2 RETURNING *', [account.rows[0].balance - req.body.amount, req.body.origin])
                    const destinationTransaction: any = await allQueries.queryByTransaction('UPDATE account SET balance=$1 WHERE id=$2 RETURNING *', [newAccount.rows[0].balance + req.body.amount, req.body.destination])
                
                    return res.status(201).json({
                        origin: originTransaction.rows[0],
                        destination: destinationTransaction.rows[0]
                    })
                } else {
                    const originTransaction: any = await allQueries.queryByTransaction('UPDATE account SET balance=$1 WHERE id=$2 RETURNING *', [account.rows[0].balance - req.body.amount, req.body.origin])
                    const destinationTransaction: any = await allQueries.queryByTransaction('UPDATE account SET balance=$1 WHERE id=$2 RETURNING *', [destAcct.rows[0].balance + req.body.amount, req.body.destination])
                    
                    return res.status(201).json({
                        origin: originTransaction.rows[0],
                        destination: destinationTransaction.rows[0]
                    })
                }
            }
        }
        catch (err) {
            return res.status(404).send(err)
        }
    }
}