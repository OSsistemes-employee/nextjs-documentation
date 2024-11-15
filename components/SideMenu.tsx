import fs from "fs";
import path from "path";
import Link from "next/link";

export async function getFilesList() {
  const files = fs.readdirSync(path.join(process.cwd(), "content"));
  return files.map((filename) => ({
    slug: filename.replace(".md", ""),
  }));
}

export default async function SideMenu() {
  const files = await getFilesList();

  return (
    <div className="w-full max-w-[260px] px-1 py-8 text-black">
      <div className="space-y-2">
        <div className="text-xl font-bold">Menu Documentation</div>
        {files.map((file) => (
          <div key={file.slug} className="flex items-center">
            <span className="mr-2 text-xl">•</span>
            <Link
              href={`/docu/${file.slug}`}
              className="text-lg hover:underline"
            >
              {file.slug.charAt(0).toUpperCase() + file.slug.slice(1)}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
