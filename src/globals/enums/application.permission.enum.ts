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
    CREATE_PROJECT = 'CREATE_PROJECT',
    GET_CLIENT_PERMISSIONS = 'GET_CLIENT_PERMISSIONS',
    DASHBOARD_CHANGE_USER_PASSWORD = 'DASHBOARD_CHANGE_USER_PASSWORD',
    CREATE_PROJECT_INVITATION = 'CREATE_PROJECT_INVITATION',
    GET_OPEN_PROJECT_INVITATIONS = 'GET_OPEN_PROJECT_INVITATIONS',
    DELETE_PROJECT_INVITATION = 'DELETE_PROJECT_INVITATION',
    ACCEPT_PROJECT_INVITATION = 'ACCEPT_PROJECT_INVITATION',
    DECLINE_PROJECT_INVITATION = 'DECLINE_PROJECT_INVITATION',
    GET_ORGANIZATION = 'GET_ORGANIZATION',
    CREATE_ORGANIZATION = 'CREATE_ORGANIZATION',
    CREATE_INTERVIEW = 'CREATE_INTERVIEW',
    GET_INTERVIEW = 'GET_INTERVIEW',
    CREATE_QUESTION = 'CREATE_QUESTION',
    GET_QUESTION = 'GET_QUESTION',
    GET_PARTICIPANT = "GET_PARTICIPANT",
    CREATE_PARTICIPANT = "CREATE_PARTICIPANT",
    GET_ANSWER = "GET_ANSWER",
    CREATE_ANSWER = "CREATE_ANSWER",
  
}

export enum ClientPermission {
  USER_PROFILE_MENU = 'USER_PROFILE_MENU',
}

//! ================= USERS - ROLES / PERMISSIONS ASSIGNMENT =================

export const userServerPermission = [
  ServerPermission.UPDATE_CURRENT_PROJECT,
  ServerPermission.GET_CLIENT_PERMISSIONS,
  ServerPermission.CREATE_PROJECT_INVITATION,
  ServerPermission.GET_OPEN_PROJECT_INVITATIONS,
  ServerPermission.DELETE_PROJECT_INVITATION,
];

export const userServerPermissionNoneResource = [
  ServerPermission.GET_USER_ME,
  ServerPermission.UPDATE_USER_ME,
  ServerPermission.GET_PROJECTS,
  ServerPermission.DASHBOARD_CHANGE_USER_PASSWORD,
  ServerPermission.ACCEPT_PROJECT_INVITATION,
  ServerPermission.DECLINE_PROJECT_INVITATION,
  ServerPermission.CREATE_PROJECT,
  ServerPermission.CREATE_ORGANIZATION,
  ServerPermission.GET_ORGANIZATION,
  ServerPermission.CREATE_INTERVIEW,
  ServerPermission.GET_INTERVIEW,
  ServerPermission.CREATE_QUESTION,
  ServerPermission.GET_QUESTION,
  ServerPermission.CREATE_ANSWER,
  ServerPermission.GET_ANSWER,
  ServerPermission.CREATE_PARTICIPANT,
  ServerPermission.GET_PARTICIPANT,
];

export const userClientPermission = [ClientPermission.USER_PROFILE_MENU];

//! ================= PLANS - ROLES / PERMISSIONS ASSIGNMENT  =================

export const examplePlanServerPermission = [...userServerPermission];

export const examplePlanClientPermission = [ClientPermission.USER_PROFILE_MENU];
