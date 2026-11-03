import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidSession, SESSION_COOKIE } from "@/lib/auth";

async function requireAdmin() {
  const cookieStore = await cookies();
  return isValidSession(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function GET() {
  const [categories, projects, services, messages, training] = await Promise.all([
    prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], include: { projects: { orderBy: { updatedAt: "desc" } } } }),
    prisma.project.findMany({ orderBy: { updatedAt: "desc" }, include: { categoryRef: true } }),
    prisma.service.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.message.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.training.findMany({ orderBy: { updatedAt: "desc" } })
  ]);
  return NextResponse.json({ categories, projects, services, messages, training });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const type = body.type;
  const data = body.data ?? {};
  try {
    if (type === "categories") {
      const title = String(data.title ?? "").trim();
      if (!title) return NextResponse.json({ error: "Category title is required" }, { status: 400 });
      const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "section"}-${Date.now()}`;
      const record = await prisma.category.create({ data: { title, slug, sortOrder: Number(data.sortOrder ?? 0) } });
      return NextResponse.json(record, { status: 201 });
    }
    if (!["projects", "services", "messages", "training"].includes(type)) return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    const record = type === "projects" ? await prisma.project.create({ data }) : type === "services" ? await prisma.service.create({ data }) : type === "messages" ? await prisma.message.create({ data }) : await prisma.training.create({ data });
    return NextResponse.json(record, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not save content" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  if (!body.id || !["categories", "projects"].includes(body.type)) return NextResponse.json({ error: "Invalid delete request" }, { status: 400 });
  if (body.type === "categories") await prisma.category.delete({ where: { id: body.id } });
  else await prisma.project.delete({ where: { id: body.id } });
  return NextResponse.json({ ok: true });
}
