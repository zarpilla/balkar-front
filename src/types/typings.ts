import type { components } from "./api"

/**
 * Users
 */

export type User = components["schemas"]["Users-Permissions-User"]
export type UserLogin = components["schemas"]["Users-Permissions-UserRegistration"]


/**
 * Account
 */
export type Account =
  components["schemas"]["Account"]
export type AccountRequest = components["schemas"]["AccountRequest"]


export type ApplicationRequest = components["schemas"]["ApplicationRequest"]


export type ContainerType = components["schemas"]["ContainerType"]
export type WasteType = components["schemas"]["WasteType"]


// const z: ContainerType
// z.name

