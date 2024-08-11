export const createIPTable = `CREATE TABLE IF NOT EXISTS ip (
  id INTEGER PRIMARY KEY NOT NULL,
  ip TEXT UNIQUE NOT NULL,
  created INTEGER NOT NULL DEFAULT (unixepoch()),
  updated INTEGER NOT NULL DEFAULT (unixepoch())
);
`;
