
import { adminControllers } from "./admin/admin.controllers";
import { userControllers } from "./user/user.controllers";
export const controllers = {
  ...adminControllers,
  ...userControllers,
};
