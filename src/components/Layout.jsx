import Icon from "./Icon";
import { useState, useEffect, useRef } from "react";
import { NavLink, Link, Outlet, useLocation } from "react-router-dom";
import { contact, whatsappUrl, emailUrl } from "../lib/contact";
const links = [
  ["/", "Home"],
  ["/servicos", "Serviços"],
  ["/projetos", "Projetos"],
  ["/sobre", "Sobre"],
  ["/contato", "Contato"],
];
export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  const menuButton = useRef(null);
  const mainContent = useRef(null);
  useEffect(() => {
    setOpen(false);
    if (previousPath.current !== pathname) {
      mainContent.current?.focus({ preventScroll: true });
      previousPath.current = pathname;
    }
    window.scrollTo(0, 0);
    const name =
      links.find(([url]) => url === pathname)?.[1] || "Página não encontrada";
    document.title = `${pathname === "/mensagens" ? "Minhas mensagens" : pathname === "/painel" ? "Painel do desenvolvedor" : name} | rick_dev — Desenvolvimento web`;
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);
  return (
    <>
      <a className="skip" href="#main" onClick={(event) => {event.preventDefault(); mainContent.current?.focus();mainContent.current?.scrollIntoView();}}>
        Pular para o conteúdo
      </a>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label="rick dev, início">
            rick<span>_dev</span>
            <small>FREELANCER</small>
          </Link>
          <button
            ref={menuButton}
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? "Fechar ✕" : "Menu ☰"}
          </button>
          <nav
            id="main-nav"
            className={open ? "nav open" : "nav"}
            aria-label="Navegação principal"
          >
            {links.map(([url, label]) => (
              <NavLink key={url} to={url} end={url === "/"}>
                {label}
              </NavLink>
            ))}
          </nav>
          <Link to="/contato" className="header-cta">
            Vamos conversar{" "}
            <span aria-hidden="true">
              <Icon />
            </span>
          </Link>
        </div>
      </header>
      <main id="main" ref={mainContent} tabIndex="-1">
        <Outlet />
      </main>
      <footer>
        <div className="container footer-top">
          <Link to="/" className="brand">
            rick<span>_dev</span>
            <small>FREELANCER</small>
          </Link>
          <p>
            Boas ideias merecem
            <br />
            uma boa presença digital.
          </p>
          <div className="footer-contacts">
            <a href={whatsappUrl()} target="_blank" rel="noreferrer">
              WhatsApp · {contact.phoneLabel} <Icon />
            </a>
            <a href={emailUrl()}>
              {contact.email} <Icon />
            </a>
            <a
              href="https://github.com/rick-dev-rick"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <Icon />
            </a>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} rick_dev. Desenvolvimento web.
          </span>
          <nav aria-label="Navegação do rodapé">
            {links.slice(1).map(([url, label]) => (
              <Link to={url} key={url}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="footer-message-links">
            <Link to="/mensagens">Minhas mensagens</Link>
            <Link to="/painel">Área do desenvolvedor</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
