/* eslint-env jest */
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const User = require("../../models/User");

describe("Auth API", () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/testdb"
    );
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("should signup a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      email: "test@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.userId).toBeDefined();
  });

  it("should login an existing user", async () => {
    await request(app).post("/api/auth/signup").send({
      email: "test@test.com",
      password: "123456",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});