import "dotenv/config";
import { get } from "env-var";

export const envs = {
  PORT: get("PORT").required().asPortNumber(),
  MONGO_URL: get("MONGO_URL").required().asString(),
  MONGO_DB_NAME: get("MONGO_DB_NAME").required().asString(),
  JWT_SECRET: get("JWT_SECRET").required().asString(),
  JWT_EXPIRES_IN: get("JWT_EXPIRES_IN").required().asString(),
  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: get('MAILER_EMAIL').required().asEmailString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),
  HOST: get('HOST').required().asString(),
  SEND_EMAIL: get('SEND_EMAIL').required().asBool(),
};
