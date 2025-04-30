import fs from "fs";
import path from "path";
import { defaultPresets } from "../utils/theme-presets";

interface ThemeRegistryItem {
  name: string;
  type: "registry:style";
  title: string;
  description: string;
  files: {
    path: string;
    type: "registry:theme";
  }[];
}

interface ThemeRegistry {
  $schema: string;
  name: string;
  homepage: string;
  items: ThemeRegistryItem[];
}

function generateRegistry() {
  const registry: ThemeRegistry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "tweakcn-theme-registry",
    homepage: "http://tweakcn.com",
    items: [],
  };

  // Convert defaultPresets to registry items
  for (const [name, preset] of Object.entries(defaultPresets)) {
    const item: ThemeRegistryItem = {
      name,
      type: "registry:style",
      title: preset.label || name,
      description: `A theme based on the ${
        preset.label || name
      } color palette.`,
      files: [
        {
          path: `themes/${name}.json`,
          type: "registry:theme",
        },
      ],
    };
    registry.items.push(item);
  }

  // Create public/r directory if it doesn't exist
  const publicDir = path.join(process.cwd(), "public", "r");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write the registry file
  const registryPath = path.join(publicDir, "registry.json");
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
  console.log(`Registry file generated at ${registryPath}`);
}

generateRegistry();
