"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./admin.css";
import "./admin-content.css";

type Category = { id: string; title: string; projects: Project[] };
type Project = { id: string; title: string; description?: string | null; imageUrl?: string | null; status?: string | null; categoryId?: string | null };
type DashboardData = { categories: Category[]; projects: Project[]; services: unknown[]; messages: unknown[]; training: unknown[] };
const empty: DashboardData = { categories: [], projects: [], services: [], messages: [], training: [] };

async function send(type: string, data: Record<string, unknown>) {
  const response = await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, data }) });
  if (!response.ok) throw new Error("تعذر الحفظ");
  return response.json();
}

function PortfolioManager({ data, reload }: { data: DashboardData; reload: () => void }) {
  const [section, setSection] = useState("");
  const [project, setProject] = useState({ title: "", description: "", imageUrl: "", categoryId: "", status: "نشط" });
  const [busy, setBusy] = useState(false);
  async function addSection(e: FormEvent) { e.preventDefault(); if (!section.trim()) return; setBusy(true); try { await send("categories", { title: section }); setSection(""); reload(); } finally { setBusy(false); } }
  async function addProject(e: FormEvent) { e.preventDefault(); if (!project.title.trim() || !project.categoryId) return; setBusy(true); try { await send("projects", project); setProject({ title: "", description: "", imageUrl: "", categoryId: project.categoryId, status: "نشط" }); reload(); } finally { setBusy(false); } }
  async function remove(type: string, id: string) { if (!confirm("تأكيد الحذف؟")) return; await fetch("/api/content", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, id }) }); reload(); }
  return <div className="managePanel portfolioManager"><div className="manageTop"><div><span className="adminKicker">SCORPION / PORTFOLIO</span><h2>الأقسام والمشاريع</h2><p className="managerIntro">أنشئ قسمًا، ثم أضف بداخله مشاريع باسمها ووصفها ولوجوها أو صورتها.</p></div></div><form className="addForm sectionForm" onSubmit={addSection}><input value={section} onChange={e => setSection(e.target.value)} placeholder="اسم القسم — مثل: الأنظمة الرقمية" /><button disabled={busy}>إضافة قسم +</button></form><div className="sectionGrid">{data.categories.map(category => <div className="sectionCard" key={category.id}><div className="sectionHead"><div><span>SECTION</span><h3>{category.title}</h3></div><button className="deleteBtn" onClick={() => remove("categories", category.id)}>حذف</button></div><div className="sectionProjects">{category.projects.length ? category.projects.map(item => <div className="projectRow" key={item.id}>{item.imageUrl ? <img src={item.imageUrl} alt="" /> : <div className="projectPlaceholder">✦</div>}<div><strong>{item.title}</strong><small>{item.description || "بدون وصف"}</small></div><button className="deleteBtn" onClick={() => remove("projects", item.id)}>×</button></div>) : <p className="emptyState">لا توجد مشاريع داخل هذا القسم بعد.</p>}</div></div>)}{!data.categories.length && <p className="emptyState">أضف أول قسم لتبدأ تنظيم أعمالك.</p>}</div><form className="projectForm" onSubmit={addProject}><div><span className="adminKicker">NEW PROJECT</span><h3>إضافة مشروع داخل قسم</h3></div><select value={project.categoryId} onChange={e => setProject({ ...project, categoryId: e.target.value })}><option value="">اختر القسم</option>{data.categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select><input value={project.title} onChange={e => setProject({ ...project, title: e.target.value })} placeholder="اسم المشروع" /><input value={project.imageUrl} onChange={e => setProject({ ...project, imageUrl: e.target.value })} placeholder="رابط اللوجو أو صورة المشروع" /><textarea value={project.description} onChange={e => setProject({ ...project, description: e.target.value })} placeholder="وصف مختصر للمشروع" /><button disabled={busy}>حفظ المشروع +</button></form></div>;
}

export default function Admin() {
  const router = useRouter(); const [active, setActive] = useState("overview"); const [open, setOpen] = useState(false); const [data, setData] = useState(empty); const [loading, setLoading] = useState(true);
  const reload = () => fetch("/api/content").then(r => r.json()).then(setData).finally(() => setLoading(false));
  useEffect(() => { fetch("/api/admin/session").then(r => { if (!r.ok) router.replace("/admin/login"); else reload(); }); }, [router]);
  const nav = (id: string) => { setActive(id); setOpen(false); };
  const labels: Record<string, string> = { overview: "نظرة عامة", projects: "المشاريع", services: "الخدمات", messages: "الرسائل", training: "التدريب" };
  return <div className="adminShell"><aside className={open ? "adminSide show" : "adminSide"}><div className="adminLogo"><img src="/brand/logo.svg" alt="SCORPION" /></div><div className="sideLabel">MAIN MENU</div>{[["overview", "نظرة عامة", "⌂"], ["projects", "المشاريع", "◈"], ["services", "الخدمات", "✦"], ["messages", "الرسائل", "✉"], ["training", "التدريب", "▣"]].map(([id, label, icon]) => <button className={active === id ? "sideItem active" : "sideItem"} onClick={() => nav(id)} key={id}><span>{icon}</span>{label}</button>)}<div className="sideLabel lower">SYSTEM</div><a className="sideItem" href="/"><span>↗</span>عرض الموقع</a><button className="sideItem logout" onClick={() => { fetch("/api/admin/logout", { method: "POST" }); router.push("/admin/login"); }}><span>⇥</span>تسجيل الخروج</button><div className="adminUser"><div className="avatar">S</div><div><strong>SCORPION Admin</strong><small>مدير النظام</small></div></div></aside><section className="adminMain"><header className="adminHeader"><button className="adminMenu" onClick={() => setOpen(!open)}>☰</button><div><span className="adminKicker">SCORPION / CONTROL CENTER</span><h1>{labels[active]}</h1></div><div className="headerActions"><div className="avatar small">S</div></div></header>{loading ? <div className="managePanel"><h2>جاري تحميل المحتوى...</h2></div> : active === "projects" ? <PortfolioManager data={data} reload={reload} /> : <div className="managePanel"><div className="manageTop"><div><span className="adminKicker">SCORPION / CONTENT</span><h2>{labels[active]}</h2><p className="managerIntro">هذا القسم جاهز لإدارة محتوى {labels[active]} من لوحة التحكم.</p></div></div><div className="emptyState">سيتم ربط هذا القسم بالمحتوى التفصيلي في المرحلة التالية.</div></div>}</section></div>;
}
