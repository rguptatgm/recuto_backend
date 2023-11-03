import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, 14);
  return hashedPassword;
};

export const checkIfPasswordIsValid = async (args: {
  reqPassword: string;
  storedPassword: string;
}): Promise<boolean> => {
  const isEqual = await bcrypt.compare(args.reqPassword, args.storedPassword);
  return isEqual;
};
