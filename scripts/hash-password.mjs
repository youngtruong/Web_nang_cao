import { hash } from "bcryptjs";
import { createInterface } from "node:readline/promises";
const rl = createInterface({ input: process.stdin, output: process.stdout });
const password = await rl.question("Password (input visible; use a private terminal): ");
rl.close();
if (password.length < 12 || password.length > 128) throw new Error("Use 12–128 characters");
console.log((await hash(password, 12)).replaceAll("$", "\\$"));
