import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/storage";
import { generateFilename } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  if (!files.length) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const urls: string[] = [];

  for (const file of files) {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}` },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = generateFilename(file.name);
    try {
      const url = await uploadImage(buffer, filename);
      urls.push(url);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("Upload failed:", msg, "| BLOB_TOKEN set:", !!process.env.BLOB_READ_WRITE_TOKEN);
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  return NextResponse.json({ urls });
}

export const config = {
  api: { bodyParser: false },
};
