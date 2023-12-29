import app from "@/app";
import supertest from "supertest";
import * as UserService from "@/services/user";
import { IUser } from "@/models/user";
import { userResource } from "@/resources/userResource";

describe("register", () => {
  const mockedUser: Partial<IUser> = {
    _id: "mockUserId",
    name: "John Doe",
    email: "john.doe@example.com",
    password: "mockPassword",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

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
