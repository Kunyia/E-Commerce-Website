import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { createSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      ...parsed.data,
      password: await bcrypt.hash(parsed.data.password, 12),
      role: Role.CUSTOMER
    }
  });

  await createSession({ id: user.id, name: user.name, email: user.email, role: user.role });
  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}
