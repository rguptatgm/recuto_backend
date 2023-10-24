# Project Requirements

## Overview

This project is a TypeScript-based Node.js application that uses the NestJS framework and the Mongoose library to interact with a MongoDB database. The application provides a GenericCrudService class that provides default CRUD (Create, Read, Update, Delete) methods for working with MongoDB documents.

## Folder Structure

The project should follow this folder structure:

https://tree.nathanfriend.io/

```plaintext
.
└── src/
    ├── api/
    │   └── <name>/
    │       ├── controllers/
    │       │   └── <name>.controller.ts
    │       ├── services/
    │       │   └── <name>.service.ts
    │       └── <name>.module.ts
    ├── dto/
    │   └── <name>/
    │       ├── base.<name>.dto.ts
    │       ├── create.<name>.dto.ts
    │       └── update.<name>.dto.ts
    ├── globals/
    │   ├── enums/
    │   │   └── <name>.enum.ts
    │   ├── helpers/
    │   │   └── <name>.helper.ts
    │   ├── interfaces/
    │   │   └── <name>.helper.ts
    │   └── services/
    │       └── <name>.service.ts
    ├── guards/
    │   └── <name>.guard.ts
    ├── interceptors/
    │   └── <name>.interceptor.ts
    └── schemas/
        └── <name>/
            └── <name>.schema.ts
```

- `src/`: Contains the source code for the application.
- `src/app.module.ts`: Defines the main application module.
- `src/main.ts`: Defines the entry point for the application.
- `src/controllers/`: Contains the controllers for the application.
- `src/services/`: Contains the services for the application.
- `src/models/`: Contains the Mongoose models for the application.
- `src/interfaces/`: Contains the TypeScript interfaces for the application.
- `src/utils/`: Contains utility functions for the application.
- `test/`: Contains the unit tests for the application.
- `node_modules/`: Contains the dependencies for the application.
- `package.json`: Defines the dependencies and scripts for the application.
- `tsconfig.json`: Defines the TypeScript compiler options for the application.
- `README.md`: Contains the documentation for the application.

## Coding Conventions

The project should follow these coding conventions:

- Use TypeScript as the primary programming language.
- Use npm to manage dependencies.
- Use the NestJS framework to build the application.
- Use the Mongoose library to interact with MongoDB databases.
- Use the GenericCrudService class to provide default CRUD methods for     working with MongoDB documents.
- Use the ObjectId class from the mongodb package to represent MongoDB ObjectIds.
- Use the `async/await syntax` for handling asynchronous operations.
- Use the `prepareCondition` function to prepare a filter query for finding a single document by its _id field.

## Naming Conventions
Use the following naming conventions:
- Use `PascalCase` for class names.
- Use `camelCase` for variable and function names.
- Use `dot.notation` for file names.


## Comments
Use `comments` to document the code as necessary.
- Use comments to explain what the code does, not how it does it. The code should be self-explanatory, and comments should provide additional context or explain complex logic.
- Use comments to document the purpose of functions, classes, and variables. Comments should explain what the code is intended to do, not how it does it.
- Use comments to document any assumptions or constraints that the code relies on. This can help other developers understand the context in which the code is used.
- Use comments to document any known issues or limitations with the code. This can help other developers avoid common pitfalls or work around known issues.
- Use consistent formatting for comments. For example, use a consistent style for commenting function parameters, return values, and exceptions.
Avoid commenting obvious or trivial code. Comments should add value to the code, not clutter it with unnecessary information.

## Missing stuff for outsourcing
- Explain queryHelper
- Explain documentation
- Explain idea behind folder structure