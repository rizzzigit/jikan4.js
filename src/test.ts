import { Client } from "./v4";

type TestFunction<T = unknown> = (cilent: Client) => Promise<T> | T;

const tests: Record<string, TestFunction> = {
  test: (client) => client.seasons.get('Spring', 2024, {
    continuing: true
  }),
};

const client = new Client();

client.on("debug", (scope, message) => console.log(`[${scope}] ${message}`));

void (async () => tests[process.argv[2]](client))().then((data) => {
  if (data != null) {
    console.log(data);
  }
});
