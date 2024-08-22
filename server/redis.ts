import { pickCredentials } from "./redis-credentials";

const client = pickCredentials(["host", "port", "password", "db"]);

export default client;

export const key = {
  link: (address: string, domain_id?: number, user_id?: number) =>
    `${address}-${domain_id || ""}-${user_id || ""}`,
  domain: (address: string) => `d-${address}`,
  stats: (link_id: number) => `s-${link_id}`,
  host: (address: string) => `h-${address}`,
  user: (emailOrKey: string) => `u-${emailOrKey}`
};

export const remove = {
  domain: (domain?: Domain) => {
    if (!domain) return;
    return client.del(key.domain(domain.address));
  },
  host: (host?: Host) => {
    if (!host) return;
    return client.del(key.host(host.address));
  },
  link: (link?: Link) => {
    if (!link) return;
    return client.del(key.link(link.address, link.domain_id));
  },
  user: (user?: User) => {
    if (!user) return;
    return Promise.all([
      client.del(key.user(user.email)),
      client.del(key.user(user.apikey))
    ]);
  }
};
