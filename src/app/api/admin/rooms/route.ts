import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function checkAuth() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function POST(request: NextRequest) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, type, description, price, capacity, status, images } = body;

    const room = await prisma.room.create({
      data: {
        name,
        type,
        description,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        status: status || "Available",
        images: {
          create: images?.map((url: string) => ({ imageUrl: url })) || [],
        },
      },
      include: { images: true },
    });

    return NextResponse.json(room, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, name, type, description, price, capacity, status, images } = body;

    await prisma.roomImage.deleteMany({ where: { roomId: id } });

    const room = await prisma.room.update({
      where: { id },
      data: {
        name,
        type,
        description,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        status,
        images: {
          create: images?.map((url: string) => ({ imageUrl: url })) || [],
        },
      },
      include: { images: true },
    });

    return NextResponse.json(room);
  } catch {
    return NextResponse.json(
      { error: "Failed to update room" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Room ID required" }, { status: 400 });
    }

    await prisma.room.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 500 }
    );
  }
}
