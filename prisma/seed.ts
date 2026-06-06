import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hash } from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create admin user
  const hashedPassword = await hash("admin123", 12);

  const admin = await prisma.admin.upsert({
    where: { email: "admin@hotel.com" },
    update: {},
    create: {
      name: "Hotel Admin",
      email: "admin@hotel.com",
      password: hashedPassword,
    },
  });

  console.log("Admin created:", admin.email);

  // Create sample rooms
  const rooms = [
    {
      name: "Deluxe King Room",
      type: "Deluxe",
      description: "WiFi, Air Conditioning, TV, Minibar, Room Service",
      price: 199,
      capacity: 2,
      status: "Available",
      images: [
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
        "https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800&q=80",
      ],
    },
    {
      name: "Executive Suite",
      type: "Suite",
      description: "WiFi, Air Conditioning, TV, Kitchen, Minibar, Living Room, Bathtub",
      price: 349,
      capacity: 4,
      status: "Available",
      images: [
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
      ],
    },
    {
      name: "Standard Double Room",
      type: "Standard",
      description: "WiFi, Air Conditioning, TV, Room Service",
      price: 129,
      capacity: 2,
      status: "Available",
      images: [
        "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      ],
    },
    {
      name: "Penthouse Suite",
      type: "Suite",
      description: "WiFi, Air Conditioning, TV, Kitchen, Minibar, Living Room, Dining Area, Bathtub, Terrace",
      price: 599,
      capacity: 6,
      status: "Available",
      images: [
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
      ],
    },
    {
      name: "Family Room",
      type: "Family",
      description: "WiFi, Air Conditioning, TV, Kitchen, Minibar, Room Service",
      price: 249,
      capacity: 4,
      status: "Available",
      images: [
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
      ],
    },
    {
      name: "Single Economy Room",
      type: "Economy",
      description: "WiFi, Air Conditioning, TV",
      price: 89,
      capacity: 1,
      status: "Available",
      images: [
        "https://images.unsplash.com/photo-1522771739015-7c6c3fc0c84c?w=800&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      ],
    },
  ];

  for (const roomData of rooms) {
    const { images, ...roomInfo } = roomData;
    await prisma.room.create({
      data: {
        ...roomInfo,
        images: {
          create: images.map((url) => ({ imageUrl: url })),
        },
      },
    });
  }

  console.log("Sample rooms created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
