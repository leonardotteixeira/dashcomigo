import { Link } from "react-router";
import { LandingNav } from "../components/LandingNav";
import { LandingFooter } from "../components/LandingFooter";
import { blogPosts } from "../data/blogPosts";

export function Blog() {
  return (
    <div className="min-h-screen" style={{ background: "#F4EFE6" }}>
      <LandingNav />

      {/* Header */}
      <section className="pt-32 pb-16" style={{ background: "#0E3B2E" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-extrabold text-5xl mb-4" style={{ color: "#F4EFE6" }}>Blog DashComigo</h1>
          <p className="text-xl font-light" style={{ color: "rgba(244,239,230,0.8)" }}>
            Dicas, guias e novidades para MEIs prosperarem
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-20" style={{ background: "#EBE4D6" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                style={{ background: "#F4EFE6", border: "1px solid rgba(20,18,15,0.1)" }}
              >
                <span
                  className="inline-block self-start text-xs font-semibold px-3 py-1 rounded-full mb-4"
                  style={{ background: "rgba(127,209,159,0.2)", color: "#1F5A3A" }}
                >
                  {post.category}
                </span>
                <h2 className="font-bold text-xl mb-3 leading-snug" style={{ color: "#0E3B2E" }}>{post.title}</h2>
                <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "rgba(14,59,46,0.6)" }}>{post.excerpt}</p>
                <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: "1px solid rgba(20,18,15,0.13)" }}>
                  <div className="flex items-center gap-2">
                    <img src="/autor.jpeg" alt={post.author} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: "#0E3B2E" }}>{post.author}</p>
                      <p className="text-xs" style={{ color: "rgba(14,59,46,0.5)" }}>{post.date} · {post.readTime}</p>
                    </div>
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-sm font-semibold transition-colors"
                    style={{ color: "#1F5A3A" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#0E3B2E")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#1F5A3A")}
                  >
                    Ler mais &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
