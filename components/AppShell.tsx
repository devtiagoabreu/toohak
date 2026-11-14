"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  ChevronDown,
  FilePlus2,
  FolderKanban,
  LayoutDashboard,
  LogIn,
  Menu,
  Palette,
  Plus,
  Presentation,
  Search,
  Settings2,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

const navItems = [
  { href: "/", label: "Visão geral", icon: LayoutDashboard },
  { href: "/library", label: "Biblioteca", icon: FolderKanban },
  { href: "/courses", label: "Cursos", icon: BookOpen },
  { href: "/reports", label: "Relatórios", icon: BarChart3 },
  { href: "/present", label: "Apresentar", icon: Presentation },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const location = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const { theme, setTheme, themeOptions } = useTheme();

  const isActive = (href: string) => (href === "/" ? location === "/" : location.startsWith(href));
  const selectedTheme = themeOptions.find(option => option.id === theme) ?? themeOptions[0];
  const createItems = [
    { title: "Quiz", detail: "Perguntas rápidas para jogar ou atribuir", href: "/create", icon: FilePlus2, tone: "coral" },
    { title: "História", detail: "Narrativa com blocos, mídia e reflexão", href: "/create?kind=story", icon: Sparkles, tone: "violet" },
    { title: "Curso", detail: "Uma trilha com várias atividades", href: "/courses?new=1", icon: BookOpen, tone: "mint" },
  ];

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="brand-lockup"><img className="brand-logo" src="/toohak-logo.jpg" alt="Toohak" /><button className="icon-button mobile-close" onClick={() => setMobileOpen(false)} aria-label="Fechar menu"><X size={19} /></button></div>
      <div className="workspace-switcher"><div className="workspace-avatar">N</div><div className="workspace-copy"><strong>Northstar Lab</strong><span>Espaço pessoal</span></div><ChevronDown size={16} className="muted-icon" /></div>
      <nav className="primary-nav" aria-label="Navegação principal"><span className="nav-label">Trabalhar</span>{navItems.map(item => { const Icon = item.icon; return <Link key={item.href} href={item.href} className={`nav-item ${isActive(item.href) ? "active" : ""}`} onClick={() => setMobileOpen(false)}><Icon size={18} /><span>{item.label}</span>{item.href === "/reports" && <span className="nav-pill">3</span>}</Link>; })}<span className="nav-label nav-label-spaced">Colaborar</span><Link href="/library?shared=1" className="nav-item"><UsersRound size={18} /><span>Grupos</span></Link><Link href="/join" className="nav-item"><LogIn size={18} /><span>Entrar em uma sessão</span></Link></nav>
      <div className="sidebar-footer">
        <div className="theme-picker"><button className="theme-picker-trigger" onClick={() => setThemeOpen(value => !value)} aria-expanded={themeOpen}><span className="theme-palette"><Palette size={15} /></span><span><strong>Tema: {selectedTheme.label}</strong><small>{selectedTheme.description}</small></span><ChevronDown size={15} /></button>{themeOpen && <div className="theme-menu">{themeOptions.map(option => <button key={option.id} className={`theme-option ${theme === option.id ? "selected" : ""}`} onClick={() => { setTheme(option.id); setThemeOpen(false); }}><span className="theme-swatches">{option.swatches.map(color => <i key={color} style={{ background: color }} />)}</span><span><strong>{option.label}</strong><small>{option.description}</small></span>{theme === option.id && <span className="theme-check">✓</span>}</button>)}</div>}</div>
        <div className="upgrade-mini"><div className="upgrade-icon"><Sparkles size={16} /></div><div><strong>Desbloqueie mais</strong><span>Recursos para sua equipe</span></div><ChevronDown size={15} /></div>
        <Link href="/settings" className="nav-item"><Settings2 size={18} /><span>Configurações</span></Link>
        <div className="profile-row"><div className="profile-avatar">AM</div><div><strong>Ana Martins</strong><span>Plano gratuito</span></div><button className="icon-button"><ChevronDown size={16} /></button></div>
      </div>
    </aside>
    {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Fechar navegação" />}
    <main className="main-area"><header className="topbar"><button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Menu size={20} /></button><div className="search-box"><Search size={17} /><input placeholder="Buscar conteúdos, pessoas ou atividades" aria-label="Buscar conteúdos" /><kbd>⌘ K</kbd></div><div className="topbar-actions"><button className="help-link">Ajuda</button><div className="create-wrap"><button className="create-button" onClick={() => setCreateOpen(value => !value)}><Plus size={18} strokeWidth={2.5} /> Criar <ChevronDown size={15} /></button>{createOpen && <div className="create-menu">{createItems.map(item => { const Icon = item.icon; return <Link key={item.title} href={item.href} onClick={() => setCreateOpen(false)} className="create-menu-item"><span className={`create-menu-icon ${item.tone}`}><Icon size={18} /></span><span><strong>{item.title}</strong><small>{item.detail}</small></span></Link>; })}</div>}</div><div className="top-avatar">AM</div></div></header><div className="page-content">{children}</div></main>
  </div>;
}
