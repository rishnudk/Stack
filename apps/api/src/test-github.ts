import { getPinnedRepos } from "./modules/github/github.service";
import * as dotenv from "dotenv";
import path from "path";

console.log("Starting test script...");

// Load environment variables from .env file
const envPath = path.resolve(__dirname, "../../.env");
console.log(`Loading .env from ${envPath}`);
dotenv.config({ path: envPath });

async function test() {
  const username = "rishnudk"; 
  console.log(`Fetching pinned repos for ${username}...`);
  try {
    const repos = await getPinnedRepos(username);
    console.log("Result:", JSON.stringify(repos, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
