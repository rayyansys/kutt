import env from "./env";

if (env.DB_SSL) {
  var ssl = { rejectUnauthorized: !env.DB_SSL_SKIP_VERIFY }
  if (env.DB_SSL_CERT) {
    ssl['ca'] = env.DB_SSL_CERT
  }
}

const credentials = {
  host: env.DB_HOST,
  database: env.DB_NAME,
  user: env.DB_USER,
  port: env.DB_PORT,
  password: env.DB_PASSWORD,
  ssl: env.DB_SSL ? ssl : false
} as const;

export default credentials;
