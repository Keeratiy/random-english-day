import fs from "fs";
import path from "path";

const usedTopicsPath = path.join(process.cwd(), "src/data/usedTopics.json");

export const POST = async () => {
  fs.writeFileSync(usedTopicsPath, JSON.stringify({ usedTopics: [] }, null, 2));

  return new Response({
    headers: {
      "Content-Type": "application/json",
    },
  });
};
