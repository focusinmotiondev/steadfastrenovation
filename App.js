import { useState } from "react";
import { C } from "./constants";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import ProjectsPage from "./pages/ProjectsPage";
import BeforeAfterPage from "./pages/BeforeAfterPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  const [page, setPage] = useState("home");

  const pages = {
    home: <HomePage setPage={setPage} />,
    services: <ServicesPage setPage={setPage} />,
    projects: <ProjectsPage />,
    beforeafter: <BeforeAfterPage />,
    about: <AboutPage setPage={setPage} />,
    contact: <ContactPage />,
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        :root {
          --font-display: 'Outfit', sans-serif;
          --font-body: 'DM Sans', sans-serif;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${C.bg}; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        ::selection { background: rgba(201,169,110,0.25); }
        ::-webkit-scrollbar { width: 7px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.textLight}; }
        img { user-select: none; -webkit-user-drag: none; }
        input, textarea, select { -webkit-appearance: none; }

        @media(max-width:800px){
          .dsk-nav{display:none!important}
          .mob-btn{display:block!important}
          .intro-grid,.testi-grid,.about-grid,.contact-grid{grid-template-columns:1fr!important}
          .svc-grid{grid-template-columns:1fr!important}
          .svc-grid>div{order:0!important}
          .proj-home-grid{grid-template-columns:1fr!important}
          .proj-home-grid>div{grid-row:auto!important}
          .proj-grid,.ba-grid{grid-template-columns:1fr!important}
          .form-grid{grid-template-columns:1fr!important}
          .footer-grid{grid-template-columns:1fr 1fr!important}
        }
      `}</style>
      <Nav page={page} setPage={setPage} />
      {pages[page]}
      <Footer setPage={setPage} />
    </div>
  );
}
