import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import yaml from "yaml";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "src/app/api/docs/openapi.yaml");
    const fileContents = readFileSync(filePath, "utf8");
    const swaggerDoc = yaml.parse(fileContents);

    return NextResponse.json(swaggerDoc);
  } catch (error) {
    console.error("Failed to load OpenAPI documentation:", error);
    return NextResponse.json(
      { error: "Failed to load API documentation" },
      { status: 500 }
    );
  }
} 