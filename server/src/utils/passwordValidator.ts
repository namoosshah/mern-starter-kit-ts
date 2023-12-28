/**
 * Validate password
 * Must be 8-20 characters long
 * Must contain 1 number, 1 uppercase, 1 lowercase and 1 special characters (!@#$%^&*)
 *
 * @param password
 * @returns
 */
export const isPasswordValid = (password: string) => {
  const passwordRegex =
    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
  return passwordRegex.test(password);
};
