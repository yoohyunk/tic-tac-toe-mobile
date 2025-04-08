// src/utils/randomAvatarKey.ts
// Returns the key string, not the require(...) asset
const avatarKeys = [
  "cat",
  "dog",
  "fox",
  "bear",
  "rabbit",
  "pig",
  "tiger",
  "squirrel",
  "wolf",
];

export const randomAvatarKey = (): string => {
  const idx = Math.floor(Math.random() * avatarKeys.length);
  return avatarKeys[idx];
};

// src/utils/avatarMap.ts
import type { ImageSourcePropType } from "react-native";

export const avatarMap: Record<string, ImageSourcePropType> = {
  cat: require("../avatars/cat.png"),
  dog: require("../avatars/dog.png"),
  fox: require("../avatars/fox.png"),
  bear: require("../avatars/bear.png"),
  rabbit: require("../avatars/rabbit.png"),
  pig: require("../avatars/pig.png"),
  tiger: require("../avatars/tiger.png"),
  squirrel: require("../avatars/squirrel.png"),
  wolf: require("../avatars/wolf.png"),
};
