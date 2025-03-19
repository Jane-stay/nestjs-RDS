import * as bcrypt from 'bcrypt';

export function checkPasswordConfirm(
  password: string,
  passwordConfirm: string,
): boolean {
  if (password !== passwordConfirm) return false;
  return true;
} // 이건 필요 없을듯? 아래꺼 쓰기기

export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<Boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export async function encryptPassword(
  plainTextPassword: string,
): Promise<String> {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(plainTextPassword, salt);

  return hashedPassword;
}
