import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface AppUser_Key {
  id: string;
  __typename?: 'AppUser_Key';
}

export interface GetCurrentUserData {
  appUser?: {
    id: string;
    username: string;
    displayName?: string | null;
    email?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & AppUser_Key;
}

export interface LegacyCharacter_Key {
  id: UUIDString;
  __typename?: 'LegacyCharacter_Key';
}

export interface LegacyUser_Key {
  id: UUIDString;
  __typename?: 'LegacyUser_Key';
}

export interface ListMyMapleCharactersData {
  mapleCharacters: ({
    region: string;
    name: string;
    jobName?: string | null;
    level?: number | null;
    worldName?: string | null;
    characterImgURL?: string | null;
    source?: string | null;
    fetchedAt?: TimestampString | null;
    updatedAt: TimestampString;
  })[];
}

export interface MapleCharacter_Key {
  ownerId: string;
  region: string;
  name: string;
  __typename?: 'MapleCharacter_Key';
}

export interface UpsertCurrentUserData {
  appUser_upsert: AppUser_Key;
}

export interface UpsertCurrentUserVariables {
  username: string;
  displayName?: string | null;
  email?: string | null;
}

export interface UpsertMapleCharacterData {
  mapleCharacter_upsert: MapleCharacter_Key;
}

export interface UpsertMapleCharacterVariables {
  region: string;
  name: string;
  jobName?: string | null;
  level?: number | null;
  worldName?: string | null;
  characterImgURL?: string | null;
  source?: string | null;
  fetchedAt?: TimestampString | null;
}

/** Generated Node Admin SDK operation action function for the 'UpsertMapleCharacter' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertMapleCharacter(dc: DataConnect, vars: UpsertMapleCharacterVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertMapleCharacterData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertMapleCharacter' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertMapleCharacter(vars: UpsertMapleCharacterVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertMapleCharacterData>>;

/** Generated Node Admin SDK operation action function for the 'ListMyMapleCharacters' Query. Allow users to execute without passing in DataConnect. */
export function listMyMapleCharacters(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListMyMapleCharactersData>>;
/** Generated Node Admin SDK operation action function for the 'ListMyMapleCharacters' Query. Allow users to pass in custom DataConnect instances. */
export function listMyMapleCharacters(options?: OperationOptions): Promise<ExecuteOperationResponse<ListMyMapleCharactersData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertCurrentUser' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertCurrentUser(dc: DataConnect, vars: UpsertCurrentUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertCurrentUserData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertCurrentUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertCurrentUser(vars: UpsertCurrentUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertCurrentUserData>>;

/** Generated Node Admin SDK operation action function for the 'GetCurrentUser' Query. Allow users to execute without passing in DataConnect. */
export function getCurrentUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetCurrentUserData>>;
/** Generated Node Admin SDK operation action function for the 'GetCurrentUser' Query. Allow users to pass in custom DataConnect instances. */
export function getCurrentUser(options?: OperationOptions): Promise<ExecuteOperationResponse<GetCurrentUserData>>;

