import { Pool } from "pg"
const connectionUri = process.env.EBANX_ASSIGNMENT_DB

const pool: Pool = new Pool({
    connectionString: connectionUri
})

export const allQueries = {
    query: async(queryText: string, inputArray: Array<any>) => {
        return await pool.query(queryText, inputArray)
    },
    queryWithoutInput: async(queryText: string) => {
        return await pool.query(queryText)
    },
    queryByTransaction: async(queryText: string, inputArray: Array<any>) => {
        return await (async () => {
            const client = await pool.connect()
            try {
                await client.query("BEGIN")
                const result = await client.query(queryText, inputArray)
                await client.query("COMMIT")
                return result
            }
            catch (err) {
                await client.query("ROLLBACK")
                throw err
            }
            finally {
                client.release()
            }
        })().catch(err => console.error(err.stact))
    }
}