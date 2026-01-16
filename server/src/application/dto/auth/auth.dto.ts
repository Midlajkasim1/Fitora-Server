

export interface RegisterDTO {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "user" | "trainer";
}

