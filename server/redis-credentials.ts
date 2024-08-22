import env from "./env";
import pickBy from "lodash.pickby";

const credentials = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
  ...(env.REDIS_PASSWORD && { password: env.REDIS_PASSWORD })
} as const;

type TCredentialProperty = keyof typeof credentials;

export const pickCredentials = (keysToPick: TCredentialProperty[]) => {
  const pickPredicate = (val, key) => val && keysToPick.includes(key);
  return pickBy(credentials, pickPredicate);
};

export default credentials;
