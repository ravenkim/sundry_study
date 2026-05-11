"use client";

import { useState, useEffect } from "react";
import type { Theme } from "@/types/theme";
import { ThemeCard } from "./theme-card";
import { Search, ArrowUpDown, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface ThemesListProps {
  themes: Theme[];
  totalCount: number;
}

export function ThemesList({ themes, totalCount }: ThemesListProps) {
  const [filteredThemes, setFilteredThemes] = useState<Theme[]>(themes);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const isMobile = useIsMobile();

  useEffect(() => {
    const filtered = themes.filter((theme) =>
      theme.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort based on selected option
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
        case "oldest":
          return (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0);
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        default:
          return 0;
      }
    });

    setFilteredThemes(sorted);
  }, [themes, searchTerm, sortOption]);

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border p-4">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:gap-4 mb-6">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-2 bg-accent px-3 py-1.5 rounded-full text-accent-foreground">
              <Layers className="h-4 w-4" />
              <span className="font-medium">{totalCount}</span>
              <span className="font-normal">
                theme{totalCount === 1 ? "" : "s"}
              </span>
            </div>
          </div>
          <div className="flex flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search themes..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full w-[80px] md:w-[180px] gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                {!isMobile && <SelectValue placeholder="Sort by" />}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredThemes.length === 0 && searchTerm ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No themes found</h3>
            <p className="text-muted-foreground">
              No themes match your search term &quot;{searchTerm}&quot;
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredThemes.map((theme: Theme) => (
              <ThemeCard key={theme.id} theme={theme} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
