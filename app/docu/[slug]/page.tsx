import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "github-markdown-css/github-markdown.css";
import "highlight.js/styles/github.css"; // Estilo de resaltado de código
import SideMenu from "@/components/SideMenu";
// import "@/styles/custom-scrollbar.css";

// Cargar el contenido del archivo Markdown en el servidor
async function getPost(slug: string) {
  const filePath = path.join(process.cwd(), "content", `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  return { frontmatter: data, content };
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), "content"));
  return files.map((filename) => ({
    slug: filename.replace(".md", ""),
  }));
}

type PostPageParams = {
  slug: string;
};

export default async function PostPage({ params }) {
  const { slug } = params;
  const { content } = await getPost(slug);

  return (
    <div className="min-h-screen flex justify-center bg-gray-100">
      <div className="w-64 bg-white p-4 h-screen">
        <SideMenu />
      </div>
      {/* <div className="layout-scrollbar flex items-center justify-center">
        <div className="markdown-body max-w-3xl mx-auto p-6 w-full bg-white text-slate-900"> */}
      <div className="flex-1 p-6 bg-white text-slate-900 max-w-3xl">
        <div className="markdown-body max-w-full mx-auto">
          <ReactMarkdown
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({ ...props }) => (
                <h1 className="text-2xl font-bold mb-4" {...props} />
              ),
              h2: ({ ...props }) => (
                <h2 className="text-xl font-bold mb-3" {...props} />
              ),
              h3: ({ ...props }) => (
                <h3 className="text-lg font-bold mb-2" {...props} />
              ),
              p: ({ ...props }) => (
                <p className="mb-[1.2em] leading-[25px]" {...props} />
              ),
              code: ({ className, children, ...props }) => {
                const isBlockCode =
                  className && className.includes("language-");
                return isBlockCode ? (
                  <pre className="bg-gray-100 rounded-md p-1 overflow-x-auto w-full min-w-0 mb-[1em]">
                    <code {...props} className="text-sm text-black p-[10px]">
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code
                    className="bg-gray-200 rounded px-2 py-1 text-sm text-black p-1"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              img: ({ src, alt }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={alt} className="w-full h-auto" />
              ),
              a: ({ href, children }) => {
                if (!href) return null;
                // Verificamos si el enlace es de YouTube
                const isYouTubeLink =
                  href.includes("youtube.com") || href.includes("youtu.be");

                if (isYouTubeLink) {
                  // Extraemos el ID del video de YouTube (suponiendo que sea una URL válida)
                  const videoId =
                    href.split("v=")[1]?.split("&")[0] || href.split(".be/")[1];

                  // Si logramos extraer un ID válido, retornamos el iframe
                  if (videoId) {
                    return (
                      <div
                        style={{
                          position: "relative",
                          paddingBottom: "56.25%",
                          height: 0,
                          overflow: "hidden",
                          maxWidth: "100%",
                        }}
                      >
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="YouTube video"
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      </div>
                    );
                  }
                }

                // Si no es un enlace de YouTube, renderizamos un link normal
                return <a href={href}>{children}</a>;
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
