import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateSlug } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { nameEn: "asc" },
  });

  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const slug = generateSlug(body.nameEn);

  const category = await prisma.category.create({
    data: {
      slug,
      nameEn: body.nameEn,
      nameUz: body.nameUz || body.nameEn,
      nameNo: body.nameNo || body.nameEn,
      nameSv: body.nameSv || body.nameEn,
      nameEs: body.nameEs || body.nameEn,
      description: body.description,
      image: body.image,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
