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

export interface ChallengerProposal_Key {
  id: UUIDString;
  __typename?: 'ChallengerProposal_Key';
}

export interface TradePost_Key {
  id: UUIDString;
  __typename?: 'TradePost_Key';
}

export interface TradeApplication_Key {
  id: UUIDString;
  __typename?: 'TradeApplication_Key';
}

export interface CreateBossPartyData {
  bossParty_insert: BossParty_Key;
}

export interface CreateBossPartyVariables {
  bossId: string;
  label?: string | null;
  category?: string | null;
  difficulty?: string | null;
  timezone?: string | null;
  runTime?: string | null;
}

export interface CreateChallengerProposalData {
  challengerProposal_insert: ChallengerProposal_Key;
}

export interface CreateChallengerProposalVariables {
  nickname: string;
  className?: string | null;
  timezone?: string | null;
  playingHours?: string | null;
  expectedBosses?: string | null;
  expectedLevelGoal?: string | null;
}

export interface DeleteBossPartyData {
  bossParty_delete?: BossParty_Key | null;
}

export interface DeleteBossPartyVariables {
  id: UUIDString;
}

export interface DeleteChallengerProposalData {
  challengerProposal_delete?: ChallengerProposal_Key | null;
}

export interface DeleteChallengerProposalVariables {
  id: UUIDString;
}

export interface CreateTradePostData {
  tradePost_insert: TradePost_Key;
}

export interface CreateTradePostVariables {
  title: string;
  tradeType?: string | null;
  bossId?: string | null;
  bossIds?: string | null;
  category?: string | null;
  desiredTrades?: number | null;
  weeklyRuns?: number | null;
  preferredDay?: string | null;
  preferredTime?: string | null;
  timezone?: string | null;
  itemsOffered?: string | null;
  minCombatPower?: number | null;
  minSacredPower?: number | null;
  notes?: string | null;
  status?: string | null;
}

export interface UpdateTradePostData {
  tradePost_update?: TradePost_Key | null;
}

export interface UpdateTradePostVariables extends CreateTradePostVariables {
  id: UUIDString;
}

export interface DeleteTradePostData {
  tradePost_delete?: TradePost_Key | null;
}

export interface DeleteTradePostVariables {
  id: UUIDString;
}

export interface ArchiveTradePostData {
  tradePost_update?: TradePost_Key | null;
}

export interface ArchiveTradePostVariables {
  id: UUIDString;
}

export interface ApplyToTradeData {
  tradeApplication_insert: TradeApplication_Key;
}

export interface ApplyToTradeVariables {
  tradeId: UUIDString;
  characterOwnerId: string;
  characterRegion: string;
  characterName: string;
  message?: string | null;
}

export interface UpdateTradeApplicationStatusData {
  tradeApplication_update?: TradeApplication_Key | null;
}

export interface UpdateTradeApplicationStatusVariables {
  id: UUIDString;
  status: string;
}

export interface DeleteTradeApplicationData {
  tradeApplication_delete?: TradeApplication_Key | null;
}

export interface DeleteTradeApplicationVariables {
  id: UUIDString;
}

export interface GetCurrentUserData {
  appUser?: {
    id: string;
    username: string;
    displayName?: string | null;
    email?: string | null;
    guild?: string | null;
    role?: string | null;
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

export interface ListAppUsersData {
  appUsers: ({
    id: string;
    username: string;
    displayName?: string | null;
    email?: string | null;
    guild?: string | null;
    role?: string | null;
  } & AppUser_Key)[];
}

export interface ListChallengerProposalsData {
  challengerProposals: ({
    id: UUIDString;
    nickname: string;
    className?: string | null;
    timezone?: string | null;
    playingHours?: string | null;
    expectedBosses?: string | null;
    expectedLevelGoal?: string | null;
    ownerId: string;
    createdAt: TimestampString;
    owner: {
      username: string;
      guild?: string | null;
    };
  } & ChallengerProposal_Key)[];
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
    difficulty?: string | null;
    timezone?: string | null;
    runTime?: string | null;
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

export interface ListPartiesByCategoryData {
  bossParties: ({
    id: UUIDString;
    bossId: string;
    label?: string | null;
    category?: string | null;
    difficulty?: string | null;
    timezone?: string | null;
    runTime?: string | null;
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

export interface ListPartiesByCategoryVariables {
  category?: string | null;
}

export interface ListTradePostsData {
  tradePosts: ({
    id: UUIDString;
    title: string;
    tradeType?: string | null;
    bossId?: string | null;
    bossIds?: string | null;
    category?: string | null;
    desiredTrades?: number | null;
    weeklyRuns?: number | null;
    preferredDay?: string | null;
    preferredTime?: string | null;
    timezone?: string | null;
    itemsOffered?: string | null;
    minCombatPower?: number | null;
    minSacredPower?: number | null;
    notes?: string | null;
    status?: string | null;
    ownerId: string;
    createdAt: TimestampString;
    owner?: {
      username: string;
      guild?: string | null;
      timezone?: string | null;
    } | null;
    applications: ({
      id: UUIDString;
      applicantId: string;
      characterOwnerId: string;
      characterRegion: string;
      characterName: string;
      message?: string | null;
      status?: string | null;
      createdAt: TimestampString;
      applicant: {
        username: string;
        guild?: string | null;
        timezone?: string | null;
      };
    } & TradeApplication_Key)[];
  } & TradePost_Key)[];
}

export interface ListTradePostsVariables {
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

export interface UpdateUserGuildData {
  appUser_update?: AppUser_Key | null;
}

export interface UpdateUserGuildVariables {
  userId: string;
  guild?: string | null;
}

export interface UpdateUserRoleData {
  appUser_update?: AppUser_Key | null;
}

export interface UpdateUserRoleVariables {
  userId: string;
  role: string;
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

/** Generated Node Admin SDK operation action function for the 'ListChallengerProposals' Query. Allow users to execute without passing in DataConnect. */
export function listChallengerProposals(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListChallengerProposalsData>>;
/** Generated Node Admin SDK operation action function for the 'ListChallengerProposals' Query. Allow users to pass in custom DataConnect instances. */
export function listChallengerProposals(options?: OperationOptions): Promise<ExecuteOperationResponse<ListChallengerProposalsData>>;

/** Generated Node Admin SDK operation action function for the 'CreateChallengerProposal' Mutation. Allow users to execute without passing in DataConnect. */
export function createChallengerProposal(dc: DataConnect, vars: CreateChallengerProposalVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateChallengerProposalData>>;
/** Generated Node Admin SDK operation action function for the 'CreateChallengerProposal' Mutation. Allow users to pass in custom DataConnect instances. */
export function createChallengerProposal(vars: CreateChallengerProposalVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateChallengerProposalData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteChallengerProposal' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteChallengerProposal(dc: DataConnect, vars: DeleteChallengerProposalVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteChallengerProposalData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteChallengerProposal' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteChallengerProposal(vars: DeleteChallengerProposalVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteChallengerProposalData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertCurrentUser' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertCurrentUser(dc: DataConnect, vars: UpsertCurrentUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertCurrentUserData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertCurrentUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertCurrentUser(vars: UpsertCurrentUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertCurrentUserData>>;

/** Generated Node Admin SDK operation action function for the 'GetCurrentUser' Query. Allow users to execute without passing in DataConnect. */
export function getCurrentUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetCurrentUserData>>;
/** Generated Node Admin SDK operation action function for the 'GetCurrentUser' Query. Allow users to pass in custom DataConnect instances. */
export function getCurrentUser(options?: OperationOptions): Promise<ExecuteOperationResponse<GetCurrentUserData>>;

/** Generated Node Admin SDK operation action function for the 'ListAppUsers' Query. Allow users to execute without passing in DataConnect. */
export function listAppUsers(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAppUsersData>>;
/** Generated Node Admin SDK operation action function for the 'ListAppUsers' Query. Allow users to pass in custom DataConnect instances. */
export function listAppUsers(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAppUsersData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateUserRole' Mutation. Allow users to execute without passing in DataConnect. */
export function updateUserRole(dc: DataConnect, vars: UpdateUserRoleVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserRoleData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateUserRole' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateUserRole(vars: UpdateUserRoleVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserRoleData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateUserGuild' Mutation. Allow users to execute without passing in DataConnect. */
export function updateUserGuild(dc: DataConnect, vars: UpdateUserGuildVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserGuildData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateUserGuild' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateUserGuild(vars: UpdateUserGuildVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateUserGuildData>>;

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

/** Generated Node Admin SDK operation action function for the 'ListPartiesByCategory' Query. Allow users to execute without passing in DataConnect. */
export function listPartiesByCategory(dc: DataConnect, vars?: ListPartiesByCategoryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListPartiesByCategoryData>>;
/** Generated Node Admin SDK operation action function for the 'ListPartiesByCategory' Query. Allow users to pass in custom DataConnect instances. */
export function listPartiesByCategory(vars?: ListPartiesByCategoryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListPartiesByCategoryData>>;

export function createTradePost(dc: DataConnect, vars: CreateTradePostVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateTradePostData>>;
export function createTradePost(vars: CreateTradePostVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateTradePostData>>;

export function updateTradePost(dc: DataConnect, vars: UpdateTradePostVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateTradePostData>>;
export function updateTradePost(vars: UpdateTradePostVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateTradePostData>>;

export function deleteTradePost(dc: DataConnect, vars: DeleteTradePostVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteTradePostData>>;
export function deleteTradePost(vars: DeleteTradePostVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteTradePostData>>;

export function archiveTradePost(dc: DataConnect, vars: ArchiveTradePostVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ArchiveTradePostData>>;
export function archiveTradePost(vars: ArchiveTradePostVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ArchiveTradePostData>>;

export function applyToTrade(dc: DataConnect, vars: ApplyToTradeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ApplyToTradeData>>;
export function applyToTrade(vars: ApplyToTradeVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ApplyToTradeData>>;

export function updateTradeApplicationStatus(dc: DataConnect, vars: UpdateTradeApplicationStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateTradeApplicationStatusData>>;
export function updateTradeApplicationStatus(vars: UpdateTradeApplicationStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateTradeApplicationStatusData>>;

export function deleteTradeApplication(dc: DataConnect, vars: DeleteTradeApplicationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteTradeApplicationData>>;
export function deleteTradeApplication(vars: DeleteTradeApplicationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteTradeApplicationData>>;

export function listTradePosts(dc: DataConnect, vars?: ListTradePostsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListTradePostsData>>;
export function listTradePosts(vars?: ListTradePostsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListTradePostsData>>;
