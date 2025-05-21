// utils/passwordValidation.js
export function validatePassword(password) {
    // At least 8 chars, one uppercase, one lowercase, one number, one special
    const minLength = 8;
    const upper = /[A-Z]/;
    const lower = /[a-z]/;
    const num = /\d/;
    const special = /[!@#$%^&*(),.?":{}|<>]/;
    return (
      password.length >= minLength &&
      upper.test(password) &&
      lower.test(password) &&
      num.test(password) &&
      special.test(password)
    );
  }
  