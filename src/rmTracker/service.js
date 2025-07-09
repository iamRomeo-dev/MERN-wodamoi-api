export const sanitizeRegexOptions = (filter) => {
  const regexFlags = ["i", "m", "x", "s"]; // Valid MongoDB flags
  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitizeObject(obj[key]);
      } else if (key === "$options" && typeof obj[key] === "string") {
        obj[key] = obj[key]
          .split("")
          .filter((char) => regexFlags.includes(char))
          .join("");
      }
    }
  };
  sanitizeObject(filter);
};
