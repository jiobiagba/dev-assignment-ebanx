const app = require("../compiled/server").mainApp
const request = require("supertest")
const expect = require("expect")

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
})

setTimeout(() => process.exit(0), 5000)