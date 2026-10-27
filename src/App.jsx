import Icon from "./components/Icon";
import { Routes, Route, Link } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Messages from "./pages/Messages";
import Inbox from "./pages/Inbox";
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="servicos" element={<Services />} />
        <Route path="projetos" element={<Projects />} />
        <Route path="sobre" element={<About />} />
        <Route path="contato" element={<Contact />} />
        <Route path="mensagens" element={<Messages />} />
        <Route path="painel" element={<Inbox />} />
        <Route
          path="*"
          element={
            <section className="page-intro container">
              <span className="eyebrow">404</span>
              <h1>Página não encontrada.</h1>
              <p>Vamos voltar para o começo?</p>
              <Link to="/" className="button">
                Voltar para a Home <Icon />
              </Link>
            </section>
          }
        />
      </Route>
    </Routes>
  );
}
