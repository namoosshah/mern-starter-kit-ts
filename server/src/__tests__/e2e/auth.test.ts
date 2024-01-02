import app from "@/app";
import supertest from "supertest";
import * as UserService from "@/services/user";
import { IUser } from "@/models/user";
import { userResource } from "@/resources/userResource";
import bcrypt from "bcryptjs";
import * as Token from "@/utils/token";
import * as MailService from "@/utils/mail";

const mockedUser: Partial<IUser> = {
  _id: "mockUserId",
  name: "John Doe",
  email: "john.doe@example.com",
  password: bcrypt.hashSync("P@sswor8", 10),
  createdAt: new Date(),
  updatedAt: new Date(),
  save: jest.fn(),
};

describe("register", () => {
  beforeEach(() => {
    jest
      .spyOn(UserService, "findByEmail")
      .mockImplementation(() => Promise.resolve(null));
    jest
      .spyOn(UserService, "registerUser")
      .mockImplementationOnce(() => Promise.resolve(mockedUser as IUser));
  });

  it("should return validation errors with 422 status code", async () => {
    const { status, body } = await supertest(app)
      .post("/api/v1/register")
      .send({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "mockedPassword",
      });
    expect(status).toBe(422);
    expect(body.message).toEqual("Unprocessable Entity");
    expect(body.errors.password).toEqual(
      "The password must be 8 to 20 characters long and include at least one number, one special character, one uppercase letter, and one lowercase letter."
    );
  });

  it("should register a user", async () => {
    const { status, body } = await supertest(app)
      .post("/api/v1/register")
      .send({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "P@sswor8",
      });
    expect(status).toBe(201);
    expect(body.data.user).toEqual(userResource(mockedUser as IUser));
  });

  it("should return email already exists with status code 404", async () => {
    jest
      .spyOn(UserService, "findByEmail")
      .mockImplementation(() => Promise.resolve(mockedUser as IUser));
    const { status, body } = await supertest(app)
      .post("/api/v1/register")
      .send({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "P@sswor8",
      });
    expect(status).toBe(422);
    expect(body.errors.email).toEqual("Email already taken!");
  });
});

describe("login", () => {
  it("should authenticate user with valid credentials", async () => {
    jest
      .spyOn(UserService, "findByEmail")
      .mockImplementation(() => Promise.resolve(mockedUser as IUser));
    jest.spyOn(Token, "generateJWTToken").mockResolvedValue("mockedToken");
    const { status, body } = await supertest(app).post("/api/v1/login").send({
      email: mockedUser.email,
      password: "P@sswor8",
    });
    expect(status).toBe(200);
    expect(body).toEqual({
      statusCode: 200,
      data: {
        user: userResource(mockedUser as IUser),
        token: "mockedToken",
      },
    });
  });

  it("should forbid user with invalid credentials", async () => {
    jest
      .spyOn(UserService, "findByEmail")
      .mockImplementation(() => Promise.resolve(null));
    const { status, body } = await supertest(app).post("/api/v1/login").send({
      email: mockedUser.email,
      password: "mockedPassword",
    });
    expect(status).toBe(401);
    expect(body).toEqual({
      statusCode: 401,
      message: "Invalid Credentials",
    });
  });
});

describe("forgot password", () => {
  it("should send password reset email to user", async () => {
    jest
      .spyOn(UserService, "findByEmail")
      .mockImplementation(() => Promise.resolve(mockedUser as IUser));
    jest
      .spyOn(mockedUser, "save")
      .mockImplementationOnce(() => Promise.resolve(mockedUser as IUser));
    jest
      .spyOn(MailService, "sendMail")
      .mockImplementationOnce(() => Promise.resolve("mockedMailId"));
    const { status, body } = await supertest(app)
      .post("/api/v1/forgot-password")
      .send({
        email: mockedUser.email,
      });
    expect(status).toBe(200);
    expect(body).toEqual({
      statusCode: 200,
      message:
        "Password reset link has been send successfully to your provided email",
    });
  });
});

describe("rest password", () => {
  it("should reset password with valid email and token", async () => {
    jest
      .spyOn(UserService, "findByEmailAndToken")
      .mockImplementation(() => Promise.resolve(mockedUser as IUser));
    jest
      .spyOn(mockedUser, "save")
      .mockImplementationOnce(() => Promise.resolve(mockedUser as IUser));
    const { status, body } = await supertest(app)
      .post("/api/v1/reset-password")
      .send({
        email: mockedUser.email,
        token: "mockedToken",
        password: "P@sswor8",
      });
    expect(status).toBe(200);
    expect(body).toEqual({
      statusCode: 200,
      message: "Password updated successfully",
    });
  });

  it("should not reset password with invalid email or token", async () => {
    jest
      .spyOn(UserService, "findByEmailAndToken")
      .mockImplementation(() => Promise.resolve(null));
    jest
      .spyOn(mockedUser, "save")
      .mockImplementationOnce(() => Promise.resolve(mockedUser as IUser));
    const { status, body } = await supertest(app)
      .post("/api/v1/reset-password")
      .send({
        email: mockedUser.email,
        token: "mockedToken",
        password: "P@sswor8",
      });
    expect(status).toBe(400);
    expect(body).toEqual({
      statusCode: 400,
      message:
        "Password reset link has expired, Please try again with a new link",
    });
  });
});
