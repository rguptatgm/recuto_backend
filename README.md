# vondot - NestJS Template

## Overview

The vondot NestJS Template is a robust backend solution, ideally paired with the [reactJS_template](https://github.com/vondot-GmbH/reactJS_template) for full-stack web application development. This template harnesses the power of NestJS to offer a comprehensive, scalable backend structure, rich with best practices and optimized for building SaaS solutions. It includes everything from authentication and error handling to a solid permissions system, laying the groundwork essential for any project.

For an in-depth understanding and additional details on each aspect of the template, refer to our extensive documentation at [vondot docs](https://docs.vondot.dev/nestjs.docs/overview)

## Installation

```bash
git clone https://github.com/vondot-GmbH/nestJS_template.git
cd nestJS_template
npm install
npm run start
```

## Key Features

### Permission Guard

- **Role-Based Access Control:** Implements a customizable PermissionGuard for role-based access to endpoints and resources.
- **Resource-Specific Permissions:** Differentiates between resource-specific and general permissions, handling them efficiently based on the `ignoreResource` flag.

### Services in User Role Assign Module

- **UserRoleAssignService:** Manages user-role-resource relationships and offers methods like `getUserPermissionsForAllResources`, `assignUserToResource`, and `checkIfUserIsAssignedToResource`.

### Authentication

- **Customizable Authentication Service:** Extends `GenericAuthenticationService` for tailored user authentication, including user identification, post-sign-up actions, and controller integration for sign-up and sign-in endpoints.

### Roles and Permissions Definition

- **Introduction to RBAC:** Simplifies access management, grouping users into roles based on responsibilities.
- **Permission Types:** Organizes permissions into server-side and client-side categories, with the flexibility to extend as needed.

### Localization

- **Efficient Localization Handling:** Utilizes `localizeDocument` method for document localization, offering simplicity and backward compatibility.

### Error Handling and Logging

- **Structured Error Management:** Uses custom `RequestHttpException` class for consistent and informative error handling across the application.
- **Global Exception Handling:** Integrates with NestJS's `HttpExceptionFilter` for uniform error responses and optional Sentry logging.

### Generic CRUD Client

- **Efficient Data Operations:** Abstract `GenericCrudService` class provides essential CRUD operations, reducing repetitive code and enhancing efficiency.
- **Customization Flexibility:** Allows for the addition of specific functionalities to meet unique project requirements.
