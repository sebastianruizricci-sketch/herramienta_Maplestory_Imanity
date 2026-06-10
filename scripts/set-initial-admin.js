// One-off script to bootstrap the first admin user.
// Run once after the `role` column has been deployed to Data Connect:
//   FIREBASE_SERVICE_ACCOUNT_JSON='...' node scripts/set-initial-admin.js
//
// Requires FIREBASE_SERVICE_ACCOUNT_JSON (same value used by server.js / Render).

const path = require("path");
const dotenv = require("dotenv");
const { cert, getApps, initializeApp } = require("firebase-admin/app");
const { updateUserRole } = require("@dataconnect/admin-generated");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const ADMIN_USER_ID = "bIgp7XyS0WPlC3I3joEpsRmjUG53"; // sebatest / sebastiantest@gmail.com

function initializeFirebaseAdmin() {
  if (getApps().length) return;
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) });
    return;
  }
  initializeApp();
}

async function main() {
  initializeFirebaseAdmin();
  await updateUserRole(
    { userId: ADMIN_USER_ID, role: "admin" },
    { impersonate: { authClaims: { sub: ADMIN_USER_ID } } }
  );
  console.log(`User ${ADMIN_USER_ID} is now admin.`);
}

main().catch((error) => {
  console.error("Failed to set initial admin:", error);
  process.exit(1);
});
