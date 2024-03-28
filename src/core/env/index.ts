const env = {} as typeof process.env;

function booleanType(value: string) {
  return value === "true" ? true : value === "false" ? false : undefined;
}

function numberType(value: string) {
  return Number(value);
}

for (const key in process.env) {
  if (Object.prototype.hasOwnProperty.call(process.env, key)) {
    const value = process.env[key];

    env[key] =
      typeof value !== "undefined"
        ? booleanType(value.toLowerCase()) !== undefined
          ? booleanType(value.toLowerCase())
          : !Number.isNaN(numberType(value))
          ? numberType(value)
          : value
        : (value as any);
  }
}

export default env;
