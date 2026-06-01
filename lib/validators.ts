import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Use a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const loginSchema = z.object({
  email: z.string().trim().email("Use a valid email"),
  password: z.string().min(1, "Password is required")
});

export const productSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().min(10),
  price: z.coerce.number().positive(),
  imageUrl: z.string().trim().min(1),
  stock: z.coerce.number().int().min(0),
  category: z.string().trim().min(2)
});

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().min(1)
      })
    )
    .min(1)
});

export const orderStatusSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"])
});
