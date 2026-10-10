import type messages from "../messages/en.json";

// English is the source catalog; every locale file has the same flat keys.
export type MessageKey = keyof typeof messages;
