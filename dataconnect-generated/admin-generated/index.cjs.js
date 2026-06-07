const { validateAdminArgs } = require('firebase-admin/data-connect');

const connectorConfig = {
  connector: 'imanity',
  serviceId: 'herramienta-maplestory-imanity-service',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

function upsertMapleCharacter(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('UpsertMapleCharacter', inputVars, inputOpts);
}
exports.upsertMapleCharacter = upsertMapleCharacter;

function listMyMapleCharacters(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListMyMapleCharacters', undefined, inputOpts);
}
exports.listMyMapleCharacters = listMyMapleCharacters;

function listGuildRoster(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListGuildRoster', undefined, inputOpts);
}
exports.listGuildRoster = listGuildRoster;

function createBossParty(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('CreateBossParty', inputVars, inputOpts);
}
exports.createBossParty = createBossParty;

function deleteBossParty(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('DeleteBossParty', inputVars, inputOpts);
}
exports.deleteBossParty = deleteBossParty;

function upsertPartyMember(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('UpsertPartyMember', inputVars, inputOpts);
}
exports.upsertPartyMember = upsertPartyMember;

function removePartyMember(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('RemovePartyMember', inputVars, inputOpts);
}
exports.removePartyMember = removePartyMember;

function listPartiesByBoss(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListPartiesByBoss', inputVars, inputOpts);
}
exports.listPartiesByBoss = listPartiesByBoss;

function upsertCurrentUser(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('UpsertCurrentUser', inputVars, inputOpts);
}
exports.upsertCurrentUser = upsertCurrentUser;

function getCurrentUser(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('GetCurrentUser', undefined, inputOpts);
}
exports.getCurrentUser = getCurrentUser;

