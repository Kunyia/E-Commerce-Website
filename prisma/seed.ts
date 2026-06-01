import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  {
    name: "Royal Satin Lip Glow",
    description: "A moisturizing gloss with a soft rose finish and a glassy, non-sticky shine.",
    price: "24.00",
    imageUrl: "/products/lip-glow.jpg",
    stock: 42,
    category: "Lips"
  },
  {
    name: "Crown Renewal Serum",
    description: "Brightening daily serum with niacinamide, peptides, and a featherlight texture.",
    price: "58.00",
    imageUrl: "/products/serum.jpg",
    stock: 28,
    category: "Skincare"
  },
  {
    name: "Velvet Reign Palette",
    description: "Twelve richly pigmented shadows in pearl, matte, and metallic queenly neutrals.",
    price: "48.00",
    imageUrl: "/products/palette.jpg",
    stock: 19,
    category: "Eyes"
  },
  {
    name: "Pearl Veil Cloud Cream",
    description: "A plush barrier cream that leaves skin cushiony, hydrated, and luminous.",
    price: "44.00",
    imageUrl: "/products/cream.jpg",
    stock: 35,
    category: "Skincare"
  },
  {
    name: "Majesty Eau de Parfum",
    description: "A polished floral fragrance with rose, pear, sandalwood, and warm amber.",
    price: "76.00",
    imageUrl: "/products/fragrance.jpg",
    stock: 16,
    category: "Fragrance"
  },
  {
    name: "Glow Court Clay Mask",
    description: "A gentle clarifying mask for smooth texture and a fresh, camera-ready glow.",
    price: "32.00",
    imageUrl: "/products/mask.jpg",
    stock: 23,
    category: "Skincare"
  }
];

async function main() {
  const adminPassword = await bcrypt.hash("Admin123!", 12);
  const customerPassword = await bcrypt.hash("Customer123!", 12);

  await prisma.user.upsert({
    where: { email: "admin@beautyqueens.test" },
    update: {},
    create: {
      name: "Beauty Queens Admin",
      email: "admin@beautyqueens.test",
      password: adminPassword,
      role: Role.ADMIN
    }
  });

  await prisma.user.upsert({
    where: { email: "customer@beautyqueens.test" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "customer@beautyqueens.test",
      password: customerPassword,
      role: Role.CUSTOMER
    }
  });

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: product,
      create: product
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
