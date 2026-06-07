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

export interface BossPartyMember_Key {
  partyId: UUIDString;
  slotIndex: number;
  __typename?: 'BossPartyMember_Key';
}

export interface BossParty_Key {
  id: UUIDString;
  __typename?: 'BossParty_Key';
}

export interface CreateBossPartyData {
  bossParty_insert: BossParty_Key;
}

export interface CreateBossPartyVariables {
  bossId: string;
  label?: string | null;
  category?: string | null;
  timezone?: string | null;
}

export interface DeleteBossPartyData {
  bossParty_delete?: BossParty_Key | null;
}

export interface DeleteBossPartyVariables {
  id: UUIDString;
}

export interface GetCurrentUserData {
  appUser?: {
    id: string;
    username: string;
    displayName?: string | null;
    email?: string | null;
    guild?: string | null;
    timezone?: string | null;
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

export interface ListAllianceRosterData {
  mapleCharacters: ({
    ownerId: string;
    region: string;
    name: string;
    jobName?: string | null;
    level?: number | null;
    worldName?: string | null;
    characterImgURL?: string | null;
    owner: {
      username: string;
      guild?: string | null;
      timezone?: string | null;
    };
  } & MapleCharacter_Key)[];
}

export interface ListGuildRosterData {
  mapleCharacters: ({
    ownerId: string;
    region: string;
    name: string;
    jobName?: string | null;
    level?: number | null;
    worldName?: string | null;
    characterImgURL?: string | null;
    owner: {
      username: string;
      guild?: string | null;
      timezone?: string | null;
    };
  } & MapleCharacter_Key)[];
}

export interface ListGuildRosterVariables {
  guild?: string | null;
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

export interface ListPartiesByBossData {
  bossParties: ({
    id: UUIDString;
    bossId: string;
    label?: string | null;
    category?: string | null;
    timezone?: string | null;
    ownerId: string;
    createdAt: TimestampString;
    members: ({
      slotIndex: number;
      characterOwnerId: string;
      characterRegion: string;
      characterName: string;
    })[];
  } & BossParty_Key)[];
}

export interface ListPartiesByBossVariables {
  bossId: string;
  category?: string | null;
}

export interface MapleCharacter_Key {
  ownerId: string;
  region: string;
  name: string;
  __typename?: 'MapleCharacter_Key';
}

export interface RemovePartyMemberData {
  bossPartyMember_delete?: BossPartyMember_Key | null;
}

export interface RemovePartyMemberVariables {
  partyId: UUIDString;
  slotIndex: number;
}

export interface UpsertCurrentUserData {
  appUser_upsert: AppUser_Key;
}

export interface UpsertCurrentUserVariables {
  username: string;
  displayName?: string | null;
  email?: string | null;
  guild?: string | null;
  timezone?: string | null;
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

export interface UpsertPartyMemberData {
  bossPartyMember_upsert: BossPartyMember_Key;
}

export interface UpsertPartyMemberVariables {
  partyId: UUIDString;
  slotIndex: number;
  characterOwnerId: string;
  characterRegion: string;
  characterName: string;
}

/** Generated Node Admin SDK operation action function for the 'UpsertMapleCharacter' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertMapleCharacter(dc: DataConnect, vars: UpsertMapleCharacterVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertMapleCharacterData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertMapleCharacter' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertMapleCharacter(vars: UpsertMapleCharacterVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertMapleCharacterData>>;

/** Generated Node Admin SDK operation action function for the 'ListMyMapleCharacters' Query. Allow users to execute without passing in DataConnect. */
export function listMyMapleCharacters(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListMyMapleCharactersData>>;
/** Generated Node Admin SDK operation action function for the 'ListMyMapleCharacters' Query. Allow users to pass in custom DataConnect instances. */
export function listMyMapleCharacters(options?: OperationOptions): Promise<ExecuteOperationResponse<ListMyMapleCharactersData>>;

/** Generated Node Admin SDK operation action function for the 'ListGuildRoster' Query. Allow users to execute without passing in DataConnect. */
export function listGuildRoster(dc: DataConnect, vars?: ListGuildRosterVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListGuildRosterData>>;
/** Generated Node Admin SDK operation action function for the 'ListGuildRoster' Query. Allow users to pass in custom DataConnect instances. */
export function listGuildRoster(vars?: ListGuildRosterVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListGuildRosterData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllianceRoster' Query. Allow users to execute without passing in DataConnect. */
export function listAllianceRoster(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllianceRosterData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllianceRoster' Query. Allow users to pass in custom DataConnect instances. */
export function listAllianceRoster(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllianceRosterData>>;

/** Generated Node Admin SDK operation action function for the 'CreateBossParty' Mutation. Allow users to execute without passing in DataConnect. */
export function createBossParty(dc: DataConnect, vars: CreateBossPartyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateBossPartyData>>;
/** Generated Node Admin SDK operation action function for the 'CreateBossParty' Mutation. Allow users to pass in custom DataConnect instances. */
export function createBossParty(vars: CreateBossPartyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateBossPartyData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteBossParty' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteBossParty(dc: DataConnect, vars: DeleteBossPartyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteBossPartyData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteBossParty' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteBossParty(vars: DeleteBossPartyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteBossPartyData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertPartyMember' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertPartyMember(dc: DataConnect, vars: UpsertPartyMemberVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertPartyMemberData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertPartyMember' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertPartyMember(vars: UpsertPartyMemberVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertPartyMemberData>>;

/** Generated Node Admin SDK operation action function for the 'RemovePartyMember' Mutation. Allow users to execute without passing in DataConnect. */
export function removePartyMember(dc: DataConnect, vars: RemovePartyMemberVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<RemovePartyMemberData>>;
/** Generated Node Admin SDK operation action function for the 'RemovePartyMember' Mutation. Allow users to pass in custom DataConnect instances. */
export function removePartyMember(vars: RemovePartyMemberVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<RemovePartyMemberData>>;

/** Generated Node Admin SDK operation action function for the 'ListPartiesByBoss' Query. Allow users to execute without passing in DataConnect. */
export function listPartiesByBoss(dc: DataConnect, vars: ListPartiesByBossVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListPartiesByBossData>>;
/** Generated Node Admin SDK operation action function for the 'ListPartiesByBoss' Query. Allow users to pass in custom DataConnect instances. */
export function listPartiesByBoss(vars: ListPartiesByBossVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListPartiesByBossData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertCurrentUser' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertCurrentUser(dc: DataConnect, vars: UpsertCurrentUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertCurrentUserData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertCurrentUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertCurrentUser(vars: UpsertCurrentUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertCurrentUserData>>;

/** Generated Node Admin SDK operation action function for the 'GetCurrentUser' Query. Allow users to execute without passing in DataConnect. */
export function getCurrentUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetCurrentUserData>>;
/** Generated Node Admin SDK operation action function for the 'GetCurrentUser' Query. Allow users to pass in custom DataConnect instances. */
export function getCurrentUser(options?: OperationOptions): Promise<ExecuteOperationResponse<GetCurrentUserData>>;

