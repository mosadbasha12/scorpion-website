"use client";

import { useEffect, useState } from "react";

const services = [
  ["01", "أنظمة الأعمال", "أنظمة إدارة الشركات، الموارد البشرية، الفنادق، والمطاعم المصممة حول طريقة عملك."],
  ["02", "التجارب الرقمية", "مواقع وتطبيقات ومنيوهات رقمية تجعل علامتك أسهل في الاستخدام وأكثر حضورًا."],
  ["03", "الهوية والإبداع", "هويات بصرية، لوجوهات، تصميمات داخلية، إعلانات وفيديوهات تحمل شخصية حقيقية."],
  ["04", "التعلم والتطوير", "تدريبات عملية ومسارات تعلم تساعد الأفراد والفرق على بناء مهارات المستقبل."],
];
type PortfolioProject = { id: string; title: string; description?: string | null; logoUrl?: string | null; coverUrl?: string | null; imageUrl?: string | null; websiteUrl?: string | null; categoryRef?: { title: string } | null };

export default function Home() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [menu, setMenu] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const ar = lang === "ar";
  useEffect(() => { fetch("/api/content").then(r => r.json()).then(d => setPortfolio(d.projects || [])).catch(() => {}); }, []);
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }), { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return <main className={ar ? "site" : "site en"}>
    <nav className="nav container">
      <a className="brand" href="#top"><img src="/brand/logo.svg" alt="SCORPION" /></a>
      <div className={menu ? "navLinks open" : "navLinks"}>
        <a href="#services">{ar ? "خدماتنا" : "Services"}</a><a href="#work">{ar ? "أعمالنا" : "Selected work"}</a><a href="#about">{ar ? "عن SCORPION" : "About"}</a><a href="#contact">{ar ? "تواصل معنا" : "Contact"}</a>
      </div>
      <div className="navActions"><button className="lang" onClick={() => setLang(ar ? "en" : "ar")}>{ar ? "EN" : "ع"}</button><a className="outlineBtn" href="/admin">{ar ? "لوحة التحكم" : "Dashboard"}</a><button className="hamburger" onClick={() => setMenu(!menu)}>☰</button></div>
    </nav>

    <section id="top" className="hero container">
      <div className="heroCopy"><p className="eyebrow"><span /> {ar ? "نصنع حضورًا لا يُنسى" : "Built for bold businesses"}</p><h1>{ar ? <>نحوّل الأفكار<br /><em>إلى تأثير.</em></> : <>Ideas into<br /><em>impact.</em></>}</h1><p className="lead">{ar ? "SCORPION شريكك في بناء الأنظمة الرقمية، التجارب الذكية، والهوية التي تستحقها علامتك." : "SCORPION is your partner for digital systems, smart experiences and a brand presence that moves people."}</p><div className="heroCtas"><a className="goldBtn" href="#contact">{ar ? "ابدأ مشروعك معنا" : "Start a project"}<span>↗</span></a><a className="textLink" href="#work">{ar ? "شاهد أعمالنا" : "Explore our work"} <span>↓</span></a></div></div>
      <div className="heroVisual"><div className="orb" /><div className="heroCard"><span>SCORPION / 2026</span><strong>Systems<br />with a soul.</strong><i>↗</i></div><div className="heroMeta"><b>01</b><span>{ar ? "استراتيجية" : "Strategy"}</span><b>02</b><span>{ar ? "تصميم" : "Design"}</span><b>03</b><span>{ar ? "تنفيذ" : "Build"}</span></div></div>
    </section>

    <div className="ticker"><div>{["DIGITAL SYSTEMS", "CREATIVE DIRECTION", "BRAND EXPERIENCES", "SCORPION STUDIO", "DIGITAL SYSTEMS", "CREATIVE DIRECTION"].map((x,i) => <span key={i}>{x} <b>✦</b></span>)}</div></div>

    <section id="services" className="section container" data-reveal><div className="sectionIntro"><p className="eyebrow"><span /> {ar ? "ما نفعله" : "What we do"}</p><h2>{ar ? <>كل ما تحتاجه<br /><em>لتتقدم.</em></> : <>Everything you need<br /><em>to move forward.</em></>}</h2></div><div className="serviceGrid">{services.map(([n,t,d]) => <article className="service" key={n}><small>{n}</small><h3>{t}</h3><p>{d}</p><a href="#contact">↗</a></article>)}</div></section>

    <section id="work" className="workSection" data-reveal><div className="container"><div className="workTop"><div><p className="eyebrow"><span /> {ar ? "مختارات من أعمالنا" : "Selected work"}</p><h2>{ar ? <>نترك أثرًا<br /><em>في كل مشروع.</em></> : <>A mark in<br /><em>every project.</em></>}</h2></div><p>{ar ? "مشاريع نُفذت بفكر واضح، وهوية قوية، وتفاصيل تفضل أن تتكلم عن نفسها." : "Projects shaped by clear thinking, strong identity and details that speak for themselves."}</p></div><div className="projectList">{(portfolio.length ? portfolio : [{ id: "1", title: ar ? "نظام إدارة شركات" : "Business management system", description: ar ? "استراتيجية · تجربة مستخدم · تطوير" : "Strategy · UX · Development" }, { id: "2", title: ar ? "تجربة مطعم رقمية" : "Digital restaurant experience", description: ar ? "هوية · منيو رقمي · طلبات" : "Identity · Digital menu · Orders" }, { id: "3", title: ar ? "هوية بصرية كاملة" : "Complete brand identity", description: ar ? "فكرة · تصميم · محتوى" : "Concept · Design · Content" }]).map((item, index) => <article key={item.id} className="projectCard"><div className="projectThumb">{item.coverUrl || item.imageUrl ? <img src={item.coverUrl || item.imageUrl || ""} alt="" /> : <span>✦</span>}</div><div><small>{String(index + 1).padStart(2, "0")} / {item.categoryRef?.title || "SCORPION PROJECT"}</small><h3>{item.title}</h3><span>{item.description || (ar ? "مشروع من أعمال SCORPION" : "A SCORPION project")}</span></div>{item.websiteUrl ? <a className="projectVisit" href={item.websiteUrl} target="_blank" rel="noreferrer">{ar ? "زيارة المشروع" : "Visit project"} ↗</a> : <b>↗</b>}</article>)}</div></div></section>

    <section id="about" className="manifesto container" data-reveal><div className="aboutPhoto"><img src="/brand/building.png" alt="SCORPION headquarters" /><span>SCORPION / HQ</span></div><div className="aboutCopy"><p className="eyebrow"><span /> {ar ? "عن الشركة" : "About SCORPION"}</p><h2>{ar ? <>نبني من<br /><em>مكان حقيقي.</em></> : <>Built from<br /><em>somewhere real.</em></>}</h2><p className="manifestoText">{ar ? "ده بيتنا، والمساحة اللي بتبدأ منها كل فكرة وكل مشروع. نؤمن أن التكنولوجيا لا يجب أن تكون معقدة، وأن التصميم ليس مجرد شكل." : "This is our home, where every idea and project begins. Technology should not be complicated, and design is more than a surface."}</p></div></section>

    <section id="contact" className="contactSection"><div className="container contact"><div><p className="eyebrow"><span /> {ar ? "لنبني شيئًا مميزًا" : "Let&apos;s build something"}</p><h2>{ar ? <>جاهز تخلي<br /><em>علامتك تتكلم؟</em></> : <>Ready to make<br /><em>your mark?</em></>}</h2></div><div className="contactDetails"><a href="mailto:support@scorpionos.dynv6.net">support@scorpionos.dynv6.net</a><a href="https://wa.me/201146300015">011 463 000 15 ↗</a><span>© 2026 SCORPION</span></div></div></section>
    <footer className="footer container"><img src="/brand/logo.svg" alt="SCORPION" /><span>{ar ? "نصنع المستقبل، بتصميم مختلف." : "Building the future, differently."}</span><a href="/admin">{ar ? "دخول الإدارة" : "Admin login"} ↗</a></footer>
  </main>;
}
