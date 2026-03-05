import { model } from "mongoose";
import { PaymentSchema } from "../schemas/payment.schema";


export const PaymentModel = model("Payment",PaymentSchema);