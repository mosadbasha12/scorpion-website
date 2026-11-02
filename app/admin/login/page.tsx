"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css";

export default function AdminLogin() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!form.get("email") || !form.get("password")) { setError("اكتب البريد الإلكتروني وكلمة المرور للمتابعة"); return; }
    window.localStorage.setItem("scorpion_admin_session", "active");
    router.push("/admin");
  }
  return <main className="loginPage"><div className="loginVisual"><img src="/brand/hero-premium.png" alt="SCORPION" /><div><span>SCORPION / CONTROL CENTER</span><h1>كل تفصيلة<br /><em>في مكانها.</em></h1></div></div><section className="loginPanel"><a className="loginLogo" href="/"><img src="/brand/logo.svg" alt="SCORPION" /></a><div className="loginIntro"><span>WELCOME BACK</span><h2>تسجيل الدخول</h2><p>أدخل بياناتك للوصول إلى لوحة التحكم.</p></div><form onSubmit={submit}><label>البريد الإلكتروني<input name="email" type="email" placeholder="admin@scorpion.com" /></label><label>كلمة المرور<div className="passwordField"><input name="password" type={show ? "text" : "password"} placeholder="••••••••" /><button type="button" onClick={() => setShow(!show)}>{show ? "إخفاء" : "إظهار"}</button></div></label>{error && <small className="loginError">{error}</small>}<button className="loginSubmit" type="submit">دخول لوحة التحكم <span>↗</span></button></form><a className="backHome" href="/">← العودة للموقع</a></section></main>;
}
