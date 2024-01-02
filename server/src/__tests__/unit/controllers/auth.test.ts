import * as UserService from "@/services/user";
import { IUser } from "@/models/user";
import { userResource } from "@/resources/userResource";
import * as MailService from "@/utils/mail";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import {
  forgotPassword,
  login,
  register,
  resetPassword,
} from "@/controllers/auth";
import * as Token from "@/utils/token";
import { ErrorResponse } from "@/utils/errorResponse";

let mockedUser: Partial<IUser> = {
  _id: "mockUserId",
  name: "John Doe",
  email: "john.doe@example.com",
  password: bcrypt.hashSync("P@sswor8", 10),
  createdAt: new Date(),
  updatedAt: new Date(),
  save: jest.fn(),
};

let req: Request;
let res: Response;
let next: NextFunction;

describe("register", () => {
  beforeEach(() => {
    req = {
      body: {
        name: mockedUser.name,
        email: mockedUser.email,
        password: "mockedPassword",
      },
    } as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  it("should register a user", async () => {
    jest
      .spyOn(UserService, "registerUser")
      .mockImplementationOnce(() => Promise.resolve(mockedUser as IUser));
    await register(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 201,
      message: "Account registered successfully",
      data: {
        user: userResource(mockedUser as IUser),
      },
    });
  });
});

describe("login", () => {
  beforeEach(() => {
    req = {
      body: {
        email: mockedUser.email,
        password: "P@sswor8",
      },
    } as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  it("should authenticate the user with valid credentials", async () => {
    jest
      .spyOn(UserService, "findByEmail")
      .mockImplementation(() => Promise.resolve(mockedUser as IUser));
    jest.spyOn(Token, "generateJWTToken").mockResolvedValue("mockedToken");
    await login(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 200,
      data: {
        user: userResource(mockedUser as IUser),
        token: "mockedToken",
      },
    });
  });

  it("should not authenticate the user with invalid credentials", async () => {
    jest
      .spyOn(UserService, "findByEmail")
      .mockImplementation(() => Promise.resolve(null));
    await login(req, res, next);
    expect(next).toHaveBeenCalledWith(
      new ErrorResponse("Invalid Credentials", 401)
    );
  });
});

describe("forgot password", () => {
  beforeEach(() => {
    req = {
      body: {
        email: mockedUser.email,
      },
    } as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  it("should send password reset email", async () => {
    jest
      .spyOn(UserService, "findByEmail")
      .mockImplementationOnce(() => Promise.resolve(mockedUser as IUser));
    jest
      .spyOn(MailService, "sendMail")
      .mockImplementationOnce(() => Promise.resolve("mockedMailId"));
    jest
      .spyOn(mockedUser, "save")
      .mockImplementationOnce(() => Promise.resolve(mockedUser as IUser));
    await forgotPassword(req, res, next);
    expect(mockedUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith({
      statusCode: 200,
      message:
        "Password reset link has been send successfully to your provided email",
    });
  });
});

describe("reset password", () => {
  beforeEach(() => {
    req = {
      body: {
        email: mockedUser.email,
        token: "mockedToken",
        password: "P@sswor8",
      },
    } as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  it("should reset password with valid email and token", async () => {
    jest
      .spyOn(UserService, "findByEmailAndToken")
      .mockImplementationOnce(() => Promise.resolve(mockedUser as IUser));
    jest
      .spyOn(mockedUser, "save")
      .mockImplementationOnce(() => Promise.resolve(mockedUser as IUser));
    await resetPassword(req, res, next);
    expect(mockedUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith({
      statusCode: 200,
      message: "Password updated successfully",
    });
  });

  it("should not reset password with invalid email or token", async () => {
    jest
      .spyOn(UserService, "findByEmailAndToken")
      .mockImplementationOnce(() => Promise.resolve(null));
    await resetPassword(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenLastCalledWith({
      statusCode: 400,
      message:
        "Password reset link has expired, Please try again with a new link",
    });
  });
});
