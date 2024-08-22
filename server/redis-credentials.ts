import env from "./env";

let tls = {};
if (env.REDIS_TLS) {
  tls = { rejectUnauthorized: !env.REDIS_TLS_SKIP_VERIFY }
  if (env.REDIS_TLS_CERT) {
    tls['ca'] = env.REDIS_TLS_CERT
  }
}

const credentials = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
  tls: env.REDIS_TLS ? tls : false,
  ...(env.REDIS_PASSWORD && { password: env.REDIS_PASSWORD })
} as const;

export default credentials;
