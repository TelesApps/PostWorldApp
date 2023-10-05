//import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
import { neonApi } from "./neon-api";

// export { onUserCreated } from "./onUserCreated";
// export { onUserDeleted } from "./onUserDeleted";


// APIs
export const neon = neonApi;
