import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [projects, services, messages, training] = await Promise.all([
    prisma.project.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.service.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.message.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.training.findMany({ orderBy: { updatedAt: "desc" } })
  ]);
  return NextResponse.json({ projects, services, messages, training });
}

export async function POST(request: Request) {
  const body = await request.json();
  const type = body.type;
  const data = body.data ?? {};
  if (!["projects", "services", "messages", "training"].includes(type)) return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  const record = type === "projects" ? await prisma.project.create({ data }) : type === "services" ? await prisma.service.create({ data }) : type === "messages" ? await prisma.message.create({ data }) : await prisma.training.create({ data });
  return NextResponse.json(record, { status: 201 });
}
