// import { useForm } from "react-hook-form";
// import { adminLogin } from "../api/auth.api";
// import axios from "axios";

// type AdminLoginFormData = {
//   email: string;
//   password: string;
// };

// export default function AdminLogin() {
//   const { register, handleSubmit } = useForm<AdminLoginFormData>();
// // 
//   const onSubmit = async (data: AdminLoginFormData) => {
//     try {
//       const res = await adminLogin(data);
//       alert(res.data.message);
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         alert(err.response?.data?.message);
//       } else {
//         alert("Something went wrong");
//       }
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="max-w-sm mx-auto p-6 border rounded space-y-3"
//     >
//       <h2 className="text-xl font-bold">Admin Login</h2>

//       <input
//         {...register("email", { required: true })}
//         placeholder="Email"
//         className="input"
//       />

//       <input
//         type="password"
//         {...register("password", { required: true })}
//         placeholder="Password"
//         className="input"
//       />

//       <button className="btn">Login</button>
//     </form>
//   );
// }
