const nameRegex = /^[A-Za-z\s]*$/;
const usernameRegex = /^[A-Za-z0-9]*$/;

const validateName = (name) => {
  return nameRegex.test(name);
};

const validateUsername = (username) => {
  return usernameRegex.test(username);
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
