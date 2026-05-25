import fs from "fs";
import path from "path";
import { Topics } from "../../data/topics";

const usedTopicsPath = path.join(process.cwd(), "src/data/usedTopics.json");

export const GET = async () => {
  if (!fs.existsSync(usedTopicsPath)) {
    fs.writeFileSync(
      usedTopicsPath,
      JSON.stringify({ usedTopics: [] }, null, 2),
    );
  }

  const state = JSON.parse(fs.readFileSync(usedTopicsPath, "utf-8"));

  const allUsed = state.usedTopics.length === Topics.length;

  if (allUsed) {
   return new Response(
    JSON.stringify({
      allUsed: true,
      usedCount: state.usedTopics.length,
      totalTopics: Topics.length,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  }

  let randomTopicIndex;

  do {
    randomTopicIndex = Math.floor(Math.random() * Topics.length);
  } while (state.usedTopics.includes(Topics[randomTopicIndex]));

  return new Response(
    JSON.stringify({
      topic: Topics[randomTopicIndex],
      usedCount: state.usedTopics.length,
      totalTopics: Topics.length,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};