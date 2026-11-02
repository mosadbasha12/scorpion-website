import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
await prisma.project.createMany({ data: [
  { title: "نظام إدارة شركات", description: "منصة موحدة لإدارة الأعمال", category: "Digital System", status: "PUBLISHED" },
  { title: "تجربة مطعم رقمية", description: "منيو وطلبات وإدارة", category: "Hospitality", status: "PUBLISHED" },
  { title: "هوية بصرية كاملة", description: "فكرة وتصميم ومحتوى", category: "Brand World", status: "DRAFT" }
], skipDuplicates: true });
await prisma.service.createMany({ data: [
  { title: "أنظمة الأعمال", description: "إدارة الشركات والموارد البشرية والفنادق والمطاعم.", sortOrder: 1 },
  { title: "التجارب الرقمية", description: "مواقع وتطبيقات ومنيوهات رقمية.", sortOrder: 2 },
  { title: "الهوية والإبداع", description: "هويات، لوجوهات، إعلانات وفيديوهات.", sortOrder: 3 },
  { title: "التعلم والتطوير", description: "تدريبات عملية ومسارات تعلم.", sortOrder: 4 }
], skipDuplicates: true });
await prisma.$disconnect();
console.log("SCORPION seed complete");
