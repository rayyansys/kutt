import Queue from "bull";
import path from "path";
import REDIS_CREDENTIALS from "../redis-credentials";

const redis = REDIS_CREDENTIALS;

const removeJob = (job) => job.remove();

export const visit = new Queue("visit", { redis });

visit.clean(5000, "completed");

visit.process(8, path.resolve(__dirname, "visit.js"));

visit.on("completed", removeJob);
