import { Client } from "./v4";

type TestFunction<T = unknown> = (cilent: Client) => Promise<T> | T;

const tests: Record<string, TestFunction> = {
  test: async (client) => {
    const a = await client.seasons.get('Spring', 2024, {
      continuing: true
    })
    const b = await client.seasons.get('Spring', 2024, {
      continuing: false
    })
    const c = await client.seasons.get('Spring', 2024)

    const result = [a[0], b[0], c[0]]
    return result.map((anime) => `${anime.title}`)
  },
};

const client = new Client();

client.on("debug", (scope, message) => console.log(`[${scope}] ${message}`));

void (async () => tests[process.argv[2]](client))().then((data) => {
  if (data != null) {
    console.log(data);
  }
});
