import machines from "../shared/machines";

export const specificTypeRules = (type, format) => {
  if (type === "OFFSET") {
    const formatsVsop = [
      '28"',
      '26"',
      '22"',
      '20"',
      '18"',
      '17"',
      '16"',
      '14"',
      '13"',
      '11"',
      '10"',
      '9"',
      '8.5"',
      '7"',
    ];
    if (format) {
      const isVsop = formatsVsop.find((f) => format === f);
      return isVsop
        ? machines.find((m) => m.id === "VSOP")
        : machines.find((m) => m.id === "MULLER 8 coul");
    }
  }
};

export const getDefaultMachine = (type, formats) => {
  if (type === "OFFSET") {
    if (formats && formats[0]) {
      return specificTypeRules(type, formats[0]);
    } else {
      return machines.find((m) => m.type === type);
    }
  } else {
    return machines.find((m) => m.type === type);
  }
};
