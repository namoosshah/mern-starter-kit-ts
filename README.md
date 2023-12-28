## MERN stack starter kit using typescript

### Server Detail

Express.js server with auth module

##### Tech

- Node v20.10.0
- Express v^4.18.2
- MongoDB via Mongoose v^8.0.3
- Nodemailer v^6.9.7
- Multer v^1.4.5-lts.1

  ```
  import { uploader } from "@/utils/uploader"
  uploader().single("avatar") or uploader("users").single("avatar")
  takes directory as optional param for grouping
  ```

- jsonwebtoken v^9.0.2
- bcryptjs v^2.4.3
- cors v^2.8.5
- yup v^1.3.3 - for validation
- morgan v^1.10.0 - for logging
- helmet v^7.1.0 - for security

##### Environment

Make a copy of `.env.example` with following command

```sh
 cp .env.example .env
```

Content of `.env.example`, please modify it to better suit your application's needs.

```sh
APP_NAME=
APP_URL="http://127.0.0.1:8000"

PORT=8000
MONGO_CONNECTION_URL=

# JWT
JWT_SECRET=
JWT_EXPIRY=7d

# Mailer
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=

MAIL_FROM_EMAIL=
MAIL_FROM_USER=
```

##### Auth module api

`Note: Using JWT for authentication as bearer token`

###### Registration

```sh
POST /register
{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "P@sswor8"
}
```

`Password Note: The password must be 8 to 20 characters long and include at least one number, one special character, one uppercase letter, and one lowercase letter.`

###### Log in

```sh
POST /login
{
    "email": "john.doe@example.com",
    "password": "P@sswor8"
}
```

###### Forgot Password

```sh
POST /forgot-password
{
    "email": "john.doe@example.com"
}
```

`Note: To modify the reset password email template: server/templates/mails/forgot-password.html`

###### Reset Password

```sh
POST /reset-password
{
    "email": "john.doe@example.com",
    "token": "6d11ad016cb86960cf63ae07f12610cfa0d886fcf124b0897fe4988ef0ea40ef",
    "password": "P@sswor8"
}
```

###### Update Profile

```sh
Authorization: Bearer [JWT Token]
Content-Type: multipart/form-data

PUT /profile
{
    "name": "Jane Doe",
    "avatar": [image file] // optional
}
```
