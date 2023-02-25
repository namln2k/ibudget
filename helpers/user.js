export const REGEX_NAME = /^[A-Za-z\s]*$/;
export const REGEX_USERNAME = /^[A-Za-z0-9]*$/;
export const REGEX_EMAIL = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const validateName = (name) => {
  return REGEX_NAME.test(name);
};

const validateUsername = (username) => {
  return REGEX_USERNAME.test(username);
};

const validatePassword = (password) => {
  return password.length > 7;
};

/**
 * Validate account signup info
 * 1. Firstname and lastname must contain only letters (A-Z, a-z) and spaces.
 * 2. Username must contain only letters (A-Z, a-z) and numbers (0-9).
 * 3. Password must be at least 8 characters long
 *
 * @param {object} user
 * @returns
 */
export function validateSignupInfo(user) {
  const { firstname, lastname, username, password } = user;

  if (!validateName(firstname)) {
    throw new Error(
      'Firstname must contain only letters (A-Z, a-z) and spaces.'
    );
  } else if (!validateName(lastname)) {
    throw new Error(
      'Lastname must contain only letters (A-Z, a-z) and spaces.'
    );
  } else if (!validateUsername(username)) {
    throw new Error(
      'Username must contain only letters (A-Z, a-z) and numbers (0-9).'
    );
  } else if (!validatePassword(password)) {
    throw new Error('Password must be at least 8 characters long');
  }

  return true;
}
