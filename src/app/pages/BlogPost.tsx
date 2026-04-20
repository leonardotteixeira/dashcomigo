import { useParams, Link, Navigate } from "react-router";
import { LandingNav } from "../components/LandingNav";
import { LandingFooter } from "../components/LandingFooter";
import { getPostBySlug, type Section } from "../data/blogPosts";
import { ArrowLeft, Clock } from "lucide-react";

function renderSection(section: Section, idx: number) {
  switch (section.type) {
    case "heading":
      return (
        <h2 key={idx} className="text-2xl font-bold mt-10 mb-4" style={{ color: "#0E3B2E" }}>
          {section.text}
        </h2>
      );
    case "subheading":
      return (
        <h3 key={idx} className="text-lg font-semibold mt-6 mb-2" style={{ color: "#1F5A3A" }}>
          {section.text}
        </h3>
      );
    case "paragraph":
      return (
        <p key={idx} className="text-base leading-relaxed mb-5" style={{ color: "rgba(14,59,46,0.8)" }}>
          {section.text}
        </p>
      );
    case "list":
      return (
        <ul key={idx} className="mb-5 space-y-2">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#7FD19F" }} />
              <span className="text-base leading-relaxed" style={{ color: "rgba(14,59,46,0.8)" }}>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "tip":
      return (
        <div key={idx} className="my-6 p-5 rounded-2xl border-l-4" style={{ background: "rgba(127,209,159,0.12)", borderColor: "#7FD19F" }}>
          <p className="text-sm font-semibold mb-1" style={{ color: "#1F5A3A" }}>💡 Dica prática</p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(14,59,46,0.8)" }}>{section.text}</p>
        </div>
      );
    default:
      return null;
  }
}

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen" style={{ background: "#F4EFE6" }}>
      <LandingNav />

      {/* Hero */}
      <section className="pt-32 pb-16" style={{ background: "#0E3B2E" }}>
        <div className="max-w-3xl mx-auto px-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
            style={{ color: "rgba(244,239,230,0.6)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#F4EFE6")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(244,239,230,0.6)")}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao blog
          </Link>

          <span
            className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-5"
            style={{ background: "rgba(127,209,159,0.25)", color: "#7FD19F" }}
          >
            {post.category}
          </span>

          <h1 className="font-extrabold text-3xl md:text-4xl leading-tight mb-6" style={{ color: "#F4EFE6" }}>
            {post.title}
          </h1>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <img src="/autor.jpeg" alt={post.author} className="w-8 h-8 rounded-full object-cover" />
              <span className="text-sm font-medium" style={{ color: "rgba(244,239,230,0.8)" }}>{post.author}</span>
            </div>
            <span style={{ color: "rgba(244,239,230,0.3)" }}>•</span>
            <span className="text-sm" style={{ color: "rgba(244,239,230,0.6)" }}>{post.date}</span>
            <span style={{ color: "rgba(244,239,230,0.3)" }}>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" style={{ color: "rgba(244,239,230,0.5)" }} />
              <span className="text-sm" style={{ color: "rgba(244,239,230,0.6)" }}>{post.readTime} de leitura</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="p-8 md:p-12 rounded-3xl" style={{ background: "#EBE4D6" }}>
            {/* Excerpt lead */}
            <p className="text-lg font-medium leading-relaxed mb-8 pb-8" style={{ color: "#0E3B2E", borderBottom: "2px solid rgba(20,18,15,0.1)" }}>
              {post.excerpt}
            </p>

            {/* Body */}
            {post.content.map((section, idx) => renderSection(section, idx))}
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-3xl text-center" style={{ background: "#0E3B2E" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(127,209,159,0.7)" }}>
              Coloque em prática
            </p>
            <h3 className="text-2xl font-bold mb-3" style={{ color: "#F4EFE6" }}>
              Controle suas finanças com o DashComigo
            </h3>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: "rgba(244,239,230,0.65)" }}>
              Fluxo de caixa, controle PF/PJ, relatórios e simuladores — tudo em um lugar. Comece grátis agora.
            </p>
            <Link
              to="/signup"
              className="inline-block px-8 py-3 rounded-xl text-sm font-bold transition-all"
              style={{ background: "#7FD19F", color: "#0E3B2E" }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = "#F4EFE6")}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = "#7FD19F")}
            >
              Criar conta gratuita →
            </Link>
          </div>

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link
              to="/blog"
              className="text-sm font-semibold transition-colors"
              style={{ color: "#1F5A3A" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#0E3B2E")}
              onMouseLeave={e => (e.currentTarget.style.color = "#1F5A3A")}
            >
              ← Ver todos os artigos
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
