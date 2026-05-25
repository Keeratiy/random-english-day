import fs from "fs";
import path from "path";

const usedTopicsPath = path.join(process.cwd(), "src/data/usedTopics.json");

export const POST = async ({ request }) => {
  const state = JSON.parse(fs.readFileSync(usedTopicsPath, "utf-8"));
  const body = await request.json();
  const used = state.usedTopics.includes(body.topic);

  if (!used) {
    state.usedTopics.push(body.topic);
  }
  fs.writeFileSync(usedTopicsPath, JSON.stringify(state, null, 2));

  return new Response(
    JSON.stringify({
      usedCount: state.usedTopics.length,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
