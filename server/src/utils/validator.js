export const validate = (data) => {
  const { firstName, emailId, password } = data;
  
  if (!firstName || !emailId || !password) {
    throw new Error("All fields are required");
  }
  
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailId)) {
    throw new Error("Invalid email format");
  }
  
  return true;
};