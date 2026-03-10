import * as bcrypt from "bcrypt";

export const generateHash = async (
  plainText: string,
  saltRounds = Number(process.env.SALT_ROUNDS) || 10,
): Promise<string> => {
  return bcrypt.hash(plainText, saltRounds);
};

export const compareHash = async (
  plainText: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(plainText, hash);
};
