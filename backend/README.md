# Backend Application

This is the backend part of my application, built using the `NestJS` framework and `TypeORM`.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- `Node.js` version >= 16.13.0
- `npm` version >= 8.1.0

## Installation

To install the backend, follow these steps:

```bash
npm install
```

## Using the Backend

To start the backend, you can use the following command:

```bash
npm run start
```

For development, you can use:

## Dependencies

* `@nestjs/common` version ^10.0.0
* `@nestjs/core` version ^10.0.0
* `@nestjs/platform-express` version ^10.0.0
* `@nestjs/typeorm` version ^10.0.1
* `typeorm version` ^0.3.19

## Dev Dependencies

* `@nestjs/cli` version ^10.0.0
* `@typescript-eslint/eslint-plugin` version ^6.0.0
* `typescript` version ^5.1.3

For a full list of dependencies, please refer to the package.json file.

### Note

Don't forget to create an .env file in the root of this backend folder and assign the environment variables the necessary values:

```
DB_USER=your-db-user
DB_PASS=your-db-password
DB_NAME=your-db-name
DB_SERVER=your-db-name
DB_PORT=port
```

The database is created in **SQL Server** and you can refer to the `DB-README.md` file to access the schema.

