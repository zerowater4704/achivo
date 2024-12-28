import bcrypt from "bcrypt";

async function generateRandomPassword() {
  const rawPassword = Math.random().toString(36).slice(-10);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(rawPassword, salt);
  return hashedPassword;
}

export default generateRandomPassword;
