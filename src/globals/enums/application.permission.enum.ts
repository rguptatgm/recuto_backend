/**
 *! PERMISSIONS AND ROLES TEMPLATE
 *
 *? Overview:
 * - This module defines global permissions and assigns them to user roles and subscription plans.
 *
 *? Key Components:
 * 1. PermissionType: Differentiates between server and client permissions. Useful for multi-platform apps.
 * 2. ServerPermission: Checks rights against specific endpoints.
 * 3. ClientPermission: Controls UI elements for frontend display.
 *
 *? Usage:
 * - Adjust the user roles and permissions assignments as needed for specific application roles (e.g., admin, user).
 * - The plans section provides examples of assigning permissions based on subscription tiers. Adapt for application-specific plans.
 */

export enum PermissionType {
  APP_SERVER = 'APP_SERVER',
  APP_CLIENT = 'APP_CLIENT',
}

//! ================= PERMISSIONS DEFINITION =================

export enum ServerPermission {
  UPDATE_CURRENT_PROJECT = 'UPDATE_CURRENT_PROJECT',
  GET_USER_ME = 'GET_USER_ME',
  UPDATE_USER_ME = 'UPDATE_USER_ME',
  GET_PROJECTS = 'GET_PROJECTS',
  GET_CLIENT_PERMISSIONS = 'GET_CLIENT_PERMISSIONS',
}

export enum ClientPermission {
  USER_PROFILE_MENU = 'USER_PROFILE_MENU',
}

//! ================= USERS - ROLES / PERMISSIONS ASSIGNMENT =================

export const userServerPermission = [
  ServerPermission.UPDATE_CURRENT_PROJECT,
  ServerPermission.GET_CLIENT_PERMISSIONS,
];

export const userServerPermissionNoneResource = [
  ServerPermission.GET_USER_ME,
  ServerPermission.UPDATE_USER_ME,
  ServerPermission.GET_PROJECTS,
];

export const userClientPermission = [ClientPermission.USER_PROFILE_MENU];

//! ================= PLANS - ROLES / PERMISSIONS ASSIGNMENT  =================

export const examplePlanServerPermission = [
  ServerPermission.GET_PROJECTS,
  ServerPermission.UPDATE_CURRENT_PROJECT,
];

export const examplePlanClientPermission = [ClientPermission.USER_PROFILE_MENU];
