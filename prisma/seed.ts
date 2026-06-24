import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "dresses" },
      update: {},
      create: {
        slug: "dresses",
        nameEn: "Dresses",
        nameUz: "Ko'ylaklar",
        nameNo: "Kjoler",
        nameSv: "Klänningar",
        nameEs: "Vestidos",
        description: "Elegant dresses for every occasion",
      },
    }),
    prisma.category.upsert({
      where: { slug: "tops" },
      update: {},
      create: {
        slug: "tops",
        nameEn: "Tops & Blouses",
        nameUz: "Koftalar va Bluzalar",
        nameNo: "Topper og Bluser",
        nameSv: "Toppar och Blusar",
        nameEs: "Tops y Blusas",
        description: "Stylish tops and blouses",
      },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: {
        slug: "accessories",
        nameEn: "Accessories",
        nameUz: "Aksessuarlar",
        nameNo: "Tilbehør",
        nameSv: "Tillbehör",
        nameEs: "Accesorios",
        description: "Complete your look with our accessories",
      },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  // Sample products
  const dressCategory = categories[0];

  const product = await prisma.product.upsert({
    where: { slug: "floral-silk-midi-dress" },
    update: {},
    create: {
      slug: "floral-silk-midi-dress",
      nameEn: "Floral Silk Midi Dress",
      nameUz: "Gulli Ipak Midi Ko'ylak",
      nameNo: "Blomstret Silke Midi-kjole",
      nameSv: "Blommig Silkes Midi-klänning",
      nameEs: "Vestido Midi de Seda Floral",
      descriptionEn: "An elegant floral silk midi dress perfect for any occasion. Features a flattering A-line silhouette with delicate floral print on premium silk fabric.",
      descriptionUz: "Har qanday tadbirga mos keladigan nafis gulli ipak midi ko'ylak.",
      descriptionNo: "En elegant blomstret silke midi-kjole perfekt for enhver anledning.",
      descriptionSv: "En elegant blommig sidenmidi-klänning perfekt för alla tillfällen.",
      descriptionEs: "Un elegante vestido midi de seda floral perfecto para cualquier ocasión.",
      price: 189.99,
      currency: "GBP",
      categoryId: dressCategory.id,
      featured: true,
      inStock: true,
      seoTitleEn: "Floral Silk Midi Dress | Nisa&Co Premium Fashion",
      seoDescEn: "Shop our elegant Floral Silk Midi Dress at Nisa&Co. Premium quality fashion for the modern woman.",
      sizes: {
        createMany: {
          data: [
            { name: "XS", stock: 5 },
            { name: "S", stock: 8 },
            { name: "M", stock: 10 },
            { name: "L", stock: 6 },
            { name: "XL", stock: 3 },
          ],
        },
      },
    },
  });

  console.log(`Created product: ${product.nameEn}`);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
