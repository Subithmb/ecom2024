import * as bcrypt from 'bcrypt';

export const encodePassword = async (rawPassword: string): Promise<string> => {
  const salt = await bcrypt.genSaltSync();
  return bcrypt.hash(rawPassword, salt);
};
