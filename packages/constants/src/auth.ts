/** Account rules shared by the backend (CreateUserDto, ChangePasswordDto, users entity) and the dashboard profile forms. */
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 50;

/** Max length of the account email (the users.email column). */
export const USER_EMAIL_MAX = 70;

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 32;
/** At least one lowercase letter, one uppercase letter, one digit and one of @$!%*?&; only those characters. */
export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
