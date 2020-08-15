const app = require("../compiled/server").mainApp
const request = require("supertest")
const expect = require("expect")

// Needed Variables
let accountId = "1234"
let accountBalance
let newAccount = {
    "id": "100",
    "balance": 10
}
let nonExistingId = "200"
let transferId = "300"
let withdrawalAmt = 5


// Start Up and Reset Tests
describe("Basic Checks and Resetting", function() {
    it("starts and falls back to default endpoint", function(done) {
        request(app)
            .get("/")
            .expect(200)
            .end((err, res) => {
                if(err) console.error("\nError in testing fallback endpoint:    ", err)
                expect(res.body.message).not.toBe(undefined)
                done()
            })
    })

    it("resets state before starting other tests", function(done) {
        request(app)
            .post("/reset")
            .expect(200)
            .end((err, res) => {
                if(err) console.error("\nError in testing reset:    ", err)
                expect(res.text).toBe("OK")
                done()
            })
    })
})



// Event Tests
describe("Transaction Behaviours Testing", function() {
    it("returns zero as account does not exist", function(done) {
        request(app)
            .get("/balance")
            .query({
                account_id: accountId
            })
            .expect(404)
            .end((err, res) => {
                if(err) console.log("Error in testing GET for non-existing account:  ", err)
                expect(res.text).toBe("0")
                done()
            })
    })

    it("creates new account with initial balance", function(done) {
        request(app)
            .post("/event")
            .send({
                "type": "deposit",
                "destination": newAccount.id,
                "amount": newAccount.balance
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if(err) console.error("Error in testing creating new account: ", err)
                expect(res.body.destination.id).toBe(newAccount.id)
                expect(res.body.destination.balance).toBe(newAccount.balance)
                accountId = res.body.destination.id
                accountBalance = res.body.destination.balance
                done()
            })
    })

    it("deposits into existing account", function(done) {
        request(app)
            .post("/event")
            .send({
                "type": "deposit",
                "destination": accountId,
                "amount": accountBalance
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if(err) console.error("Error in testing depositing into existing account: ", err)
                expect(res.body.destination.id).toBe(newAccount.id)
                expect(res.body.destination.balance).toBeGreaterThan(accountBalance)
                accountBalance = res.body.destination.balance
                done()
            })
    })

    it("gets balance for existing account", function(done) {
        request(app)
            .get("/balance")
            .query({
                account_id: accountId
            })
            .expect(200)
            .end((err, res) => {
                if(err) console.log("Error in testing GET balance for existing account:  ", err)
                expect(res.body).toBe(accountBalance)
                done()
            })
    })

    it("withdraws from non-existing account", function(done) {
        request(app)
            .post("/event")
            .send({
                "type": "withdraw",
                "origin": nonExistingId,
                "amount": newAccount.balance
            })
            .set('Accept', 'application/json')
            .expect(404)
            .end((err, res) => {
                if(err) console.error("Error in testing withdrawal for non-existing account: ", err)
                expect(res.text).toBe("0")
                done()
            })
    })

    it("withdraws from existing account", function(done) {
        request(app)
            .post("/event")
            .send({
                "type": "withdraw",
                "origin": accountId,
                "amount": withdrawalAmt
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if(err) console.error("Error in testing withdrawals from existing account: ", err)
                expect(res.body.origin.id).toBe(newAccount.id)
                expect(res.body.origin.balance).toBe(accountBalance - withdrawalAmt)
                accountBalance = res.body.origin.balance
                done()
            })
    })

    it("transfers from existing account", function(done) {
        request(app)
            .post("/event")
            .send({
                "type": "transfer",
                "origin": accountId,
                "amount": accountBalance,
                "destination": transferId
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                if(err) console.error("Error in testing transfers from existing account: ", err)
                expect(res.body.origin.id).toBe(accountId)
                expect(res.body.origin.balance).toBe(0)
                expect(res.body.destination.id).toBe(transferId)
                expect(res.body.destination.balance).toBe(accountBalance)
                accountBalance = res.body.origin.balance
                done()
            })
    })

    it("transfers from non-existing account", function(done) {
        request(app)
            .post("/event")
            .send({
                "type": "transfer",
                "origin": nonExistingId,
                "amount": accountBalance,
                "destination": transferId
            })
            .set('Accept', 'application/json')
            .expect(404)
            .end((err, res) => {
                if(err) console.error("Error in testing transfers from non-existing account: ", err)
                expect(res.text).toBe("0")
                done()
            })
    })
})


setTimeout(() => process.exit(0), 5000)