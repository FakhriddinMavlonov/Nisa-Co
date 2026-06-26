import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateSlug } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") || "50");
  const page = parseInt(searchParams.get("page") || "1");

  const where: Record<string, unknown> = {};

  if (category) where.category = { slug: category };
  if (featured === "true") where.featured = true;
  if (search) {
    where.OR = [
      { nameEn: { contains: search } },
      { nameUz: { contains: search } },
      { descriptionEn: { contains: search } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        sizes: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, limit });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const slug = generateSlug(body.nameEn);

  const product = await prisma.product.create({
    data: {
      slug,
      nameEn: body.nameEn,
      nameUz: body.nameUz || body.nameEn,
      nameNo: body.nameNo || body.nameEn,
      nameSv: body.nameSv || body.nameEn,
      nameEs: body.nameEs || body.nameEn,
      descriptionEn: body.descriptionEn || "",
      descriptionUz: body.descriptionUz || body.descriptionEn || "",
      descriptionNo: body.descriptionNo || body.descriptionEn || "",
      descriptionSv: body.descriptionSv || body.descriptionEn || "",
      descriptionEs: body.descriptionEs || body.descriptionEn || "",
      price: parseFloat(body.price),
      oldPrice: body.oldPrice ? parseFloat(body.oldPrice) : null,
      currency: body.currency || "GBP",
      categoryId: body.categoryId,
      featured: body.featured || false,
      inStock: body.inStock !== false,
      seoTitleEn: body.seoTitleEn,
      seoTitleUz: body.seoTitleUz,
      seoTitleNo: body.seoTitleNo,
      seoTitleSv: body.seoTitleSv,
      seoTitleEs: body.seoTitleEs,
      seoDescEn: body.seoDescEn,
      seoDescUz: body.seoDescUz,
      seoDescNo: body.seoDescNo,
      seoDescSv: body.seoDescSv,
      seoDescEs: body.seoDescEs,
      images: {
        create: (body.images || []).map(
          (img: { url: string; alt?: string }, i: number) => ({
            url: img.url,
            alt: img.alt,
            order: i,
          })
        ),
      },
      sizes: {
        create: (body.sizes || []).map(
          (size: { name: string; stock: number }) => ({
            name: size.name,
            stock: size.stock || 0,
          })
        ),
      },
    },
    include: {
      category: true,
      images: true,
      sizes: true,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
