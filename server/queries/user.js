const { addMinutes } = require("date-fns");
const { v4: uuid } = require("uuid");

const knex = require("../knex");
const env = require("../env");

async function find(match) {
  if (env.REDIS_ENABLED && match.email || match.apikey) {
    const r = require("../redis");
    const key = r.key.user(match.email || match.apikey);
    const cachedUser = await r.client.get(key);
    if (cachedUser) return JSON.parse(cachedUser);
  }
  
  const user = await knex("users").where(match).first();
  
  if (env.REDIS_ENABLED && user) {
    const redis = require("../redis");
    const emailKey = redis.key.user(user.email);
    redis.client.set(emailKey, JSON.stringify(user), "EX", 60 * 60 * 1);
  
    if (user.apikey) {
      const apikeyKey = redis.key.user(user.apikey);
      redis.client.set(apikeyKey, JSON.stringify(user), "EX", 60 * 60 * 1);
    }
  }
  
  return user;

}

async function add(params, user) {
  const data = {
    email: params.email,
    password: params.password,
    verification_token: uuid(),
    verification_expires: addMinutes(new Date(), 60).toISOString()
  };
  
  if (user) {
    await knex("users")
      .where("id", user.id)
      .update({ ...data, updated_at: new Date().toISOString() });
  } else {
    await knex("users").insert(data);
  }
  
  if (env.REDIS_ENABLED) {
    const redis = require('../redis');
    redis.remove.user(user);
  }
  
  return {
    ...user,
    ...data
  };
}

async function update(match, update) {
  const query = knex("users");
  
  Object.entries(match).forEach(([key, value]) => {
    query.andWhere(key, ...(Array.isArray(value) ? value : [value]));
  });
  
  const users = await query.update(
    { ...update, updated_at: new Date().toISOString() },
    "*"
  );
  
  if (env.REDIS_ENABLED) {
    const redis = require('../redis');
    users.forEach(redis.remove.user);
  }
  
  return users;
}

async function remove(user) {
  const deletedUser = await knex("users").where("id", user.id).delete();
  
  if (env.REDIS_ENABLED) {
    const redis = require('../redis');
    redis.remove.user(user);
  }
  
  return !!deletedUser;
}

module.exports = {
  add,
  find,
  remove,
  update,
}
