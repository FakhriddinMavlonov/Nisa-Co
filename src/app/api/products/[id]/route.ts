import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateSlug } from "@/lib/utils";
import { deleteImage } from "@/lib/storage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      sizes: true,
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const currentProduct = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!currentProduct) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Delete physical files for images removed from the product
  const newImageUrls = new Set(
    (body.images || []).map((img: { url: string }) => img.url)
  );
  const removedImages = currentProduct.images.filter(
    (img) => !newImageUrls.has(img.url)
  );
  await Promise.all(removedImages.map((img) => deleteImage(img.url)));

  const slug = body.nameEn ? generateSlug(body.nameEn) : undefined;

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(slug && { slug }),
      nameEn: body.nameEn,
      nameUz: body.nameUz,
      nameNo: body.nameNo,
      nameSv: body.nameSv,
      nameEs: body.nameEs,
      descriptionEn: body.descriptionEn,
      descriptionUz: body.descriptionUz,
      descriptionNo: body.descriptionNo,
      descriptionSv: body.descriptionSv,
      descriptionEs: body.descriptionEs,
      price: body.price !== undefined ? parseFloat(body.price) : undefined,
      currency: body.currency,
      categoryId: body.categoryId,
      featured: body.featured,
      inStock: body.inStock,
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
        deleteMany: {},
        create: (body.images || []).map(
          (img: { url: string; alt?: string }, i: number) => ({
            url: img.url,
            alt: img.alt || "",
            order: i,
          })
        ),
      },
      sizes: {
        deleteMany: {},
        create: (body.sizes || []).map(
          (size: { name: string; stock: number }) => ({
            name: size.name,
            stock: size.stock || 0,
          })
        ),
      },
    },
    include: { category: true, images: true, sizes: true },
  });

  return NextResponse.json(product);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Delete physical image files before removing DB record
  await Promise.all(product.images.map((img) => deleteImage(img.url)));

  // Prisma cascade deletes ProductImage and ProductSize records
  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
