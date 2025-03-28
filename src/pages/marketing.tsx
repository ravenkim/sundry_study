import logo from "@/assets/logo.png";
import og from "@/assets/og-image.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEditorStore } from "@/store/editor-store";
import { motion } from "motion/react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Code,
  FileCode,
  Folder,
  Grid,
  Layers,
  Menu,
  Moon,
  Paintbrush,
  PaintBucket,
  Palette,
  Repeat,
  Sun,
  Users,
  X,
  Eye,
  Copy,
  Circle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "../components/theme-provider";
import { getPresetThemeStyles, presets } from "../utils/theme-presets";
import { DemoContainer } from "@/components/examples/demo-cards";
import { DemoGithub } from "@/components/examples/cards/github-card";
import { DemoStats } from "@/components/examples/cards/stats";
import { Link } from "react-router-dom";
import GitHubIcon from "@/assets/github.svg?react";
import TwitterIcon from "@/assets/twitter.svg?react";
import DemoMail from "@/components/examples/mail";
import { cn } from "@/lib/utils";
import { colorFormatter } from "@/utils/color-converter";

const ColorBox = ({ color }: { color: string }) => {
  return (
    <div className="w-3 h-3 rounded-sm border" style={{ backgroundColor: color }} />
  );
};

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { themeState, applyThemePreset } = useEditorStore();
  const mode = themeState.currentMode;
  const presetNames = Object.keys(presets);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const features = [
    {
      title: "Visual Theme Customizer",
      description:
        "Customize your shadcn/ui components with a real-time preview to see changes instantly.",
      icon: <Palette className="size-5" />,
    },
    {
      title: "Color Control",
      description:
        "Customize background, text, and border colors with an intuitive color picker interface.",
      icon: <Paintbrush className="size-5" />,
    },
    {
      title: "Typography Settings",
      description:
        "Fine-tune font size, weight, and text transform to create the perfect look.",
      icon: <FileCode className="size-5" />,
    },
    {
      title: "Tailwind v4 & v3 Support",
      description:
        "Seamlessly switch between Tailwind v4 and v3, with support for multiple color formats including OKLCH & HSL.",
      icon: <Code className="size-5" />,
    },
    {
      title: "Dimension Control",
      description:
        "Adjust padding, border radius, and other dimensions to match your design system.",
      icon: <Layers className="size-5" />,
    },
    {
      title: "Beautiful Theme Presets",
      description:
        "Choose from stunning pre-designed themes and customize both light and dark mode colors effortlessly.",
      icon: <PaintBucket className="size-5" />,
    },
  ];

  return (
    <div className="flex min-h-[100dvh] justify-items-center items-center flex-col bg-background text-foreground">
      <header
        className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${
          isScrolled
            ? "bg-background/90 shadow-xs border-b border-border/20"
            : "bg-transparent"
        }`}
      >
        <div className="container flex h-16 px-4 min-w-full items-center justify-between">
          <Link to="/">
            <div className="flex items-center gap-2 font-bold">
              <motion.img
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.5 }}
                src={logo}
                alt="tweakcn"
                className="h-8 w-8 mr-1 md:mr-2"
              />
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                tweakcn
              </motion.span>
            </div>
          </Link>
          <nav className="hidden md:flex gap-8">
            {["Examples", "Features", "How It Works", "Roadmap", "FAQ"].map(
              (item, i) => (
                <motion.a
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </motion.a>
              )
            )}
          </nav>
          <div className="hidden md:flex gap-4 items-center cursor-pointer">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Button
                variant="secondary"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full transition-transform hover:scale-105"
              >
                {theme === "light" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Link to="/editor/theme">
                <Button className="rounded-full cursor-pointer transition-transform hover:scale-105 font-medium">
                  Try It Now
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
          <div className="flex items-center gap-4 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full cursor-pointer"
            >
              {mounted && theme === "dark" ? (
                <Sun className="size-[18px]" />
              ) : (
                <Moon className="size-[18px]" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-lg border-b"
          >
            <div className="container py-4 flex flex-col gap-4 px-4">
              {["Examples", "Features", "How It Works", "Roadmap", "FAQ"].map(
                (item, i) => (
                  <motion.a
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="py-2 text-sm font-medium relative overflow-hidden group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="relative z-10">{item}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </motion.a>
                )
              )}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="pt-2 mt-2 border-t border-border/30"
              >
                <Link to="/editor/theme" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full rounded-full">
                    Try It Now
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="container px-4 md:px-6 relative">
            <div className="absolute inset-0 -z-10 h-full w-full bg-background"></div>
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.08),transparent_50%)]"></div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              {/* Left Column - Text Content */}
              <div className="text-left max-w-2xl mx-auto lg:mx-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Badge
                    className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium shadow-sm"
                    variant="secondary"
                  >
                    <span className="mr-1 text-primary">✦</span> Visual Theme Editor
                  </Badge>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70"
                >
                  Design Your Perfect <span className="text-primary">shadcn/ui</span>{" "}
                  Theme
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="text-muted-foreground mb-8 text-lg md:text-xl leading-relaxed"
                >
                  Create stunning shadcn/ui themes with our powerful visual editor.
                  Customize colors, typography, and layouts with a real-time preview.
                  No signup required—start designing instantly.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link to="/editor/theme">
                    <Button
                      size="lg"
                      className="rounded-full h-12 px-8 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] text-base"
                    >
                      Start Customizing
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </Link>
                  <a href="#examples">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full h-12 px-8 cursor-pointer border-primary/20 hover:border-primary/50 transition-all duration-300 hover:translate-y-[-2px] text-base"
                    >
                      View Examples
                    </Button>
                  </a>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                  className="flex flex-wrap items-center gap-6 mt-8"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="size-5 text-primary" />
                    <span>Real-time Preview</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="size-5 text-primary" />
                    <span>Export to Tailwind</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="size-5 text-primary" />
                    <span>Beautiful Presets</span>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Preview Card */}
              <motion.div
                initial={{ opacity: 0, x: 20, rotate: 2 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="relative hidden lg:block"
              >
                <Card className="relative overflow-hidden border-border/40 bg-gradient-to-b from-background to-background/95 backdrop-blur shadow-xl rounded-2xl">
                  <CardContent className="p-0">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-2">
                          <div className="size-3 rounded-full bg-red-500"></div>
                          <div className="size-3 rounded-full bg-yellow-500"></div>
                          <div className="size-3 rounded-full bg-green-500"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs font-normal capitalize"
                        >
                          {themeState.preset ?? "Default"}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                      {/* Color Palette */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Color Palette</div>
                          <Palette className="size-4 text-muted-foreground" />
                        </div>
                        <div className="space-y-2 text-center">
                          <div className="h-24 w-full bg-gradient-to-r from-primary via-secondary via-accent via-muted to-background rounded-xl"></div>
                          <div className="grid grid-cols-5 gap-2 text-xs text-muted-foreground">
                            <div>Primary</div>
                            <div>Secondary</div>
                            <div>Accent</div>
                            <div>Muted</div>
                            <div>Background</div>
                          </div>
                        </div>
                      </div>

                      {/* Preview */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Preview</div>
                          <Eye className="size-4 text-muted-foreground" />
                        </div>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Button className="w-full shadow-sm" variant="secondary">
                              <Copy className="size-4 mr-2" />
                              Copy Code
                            </Button>
                            <Button className="w-full shadow-sm" variant="outline">
                              <Circle className="size-4 mr-2" />
                              oklch, hsl, rgb, hex
                            </Button>
                          </div>
                          <Card className="w-full">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-xs text-primary">UI</span>
                                </div>
                                <div className="flex-1">
                                  <div className="h-2 w-24 bg-foreground/90 rounded mb-2"></div>
                                  <div className="h-2 w-16 bg-muted-foreground/60 rounded"></div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Theme Preset Selector Section */}
        <section id="examples" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <Badge
                  className="rounded-full px-4 py-1.5 text-sm font-medium shadow-sm"
                  variant="secondary"
                >
                  <span className="mr-1 text-primary">✦</span> Theme Presets
                </Badge>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                Preview and Select a Theme
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Click on a theme below to preview how it transforms the page.
              </p>
            </motion.div>

            {/* Theme Selector Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8"
            >
              {presetNames?.slice(4, 10).map((presetName, index) => {
                const themeStyles = getPresetThemeStyles(presetName)[mode];
                const bgColor = colorFormatter(themeStyles.primary, "hsl", "4");
                const isSelected = presetName === themeState.preset;
                return (
                  <motion.div
                    key={presetName}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  >
                    <Button
                      className={cn(
                        "flex w-full items-center relative transition-all hover:shadow-md bg-primary/10 hover:bg-primary/20 hover:translate-y-[-2px]",
                        isSelected ? "ring-2 ring-primary/30 shadow-md" : ""
                      )}
                      variant="ghost"
                      style={{
                        backgroundColor: bgColor
                          .replace("hsl", "hsla")
                          .replace(/\s+/g, ", ")
                          .replace(")", ", 0.15)"),
                        color: themeStyles.foreground,
                        borderRadius: themeStyles.radius,
                      }}
                      onClick={() => applyThemePreset(presetName)}
                    >
                      <div className="flex gap-0.5 mr-1">
                        <ColorBox color={themeStyles.primary} />
                        <ColorBox color={themeStyles.accent} />
                      </div>
                      <span className="capitalize">
                        {presetName.replace(/-/g, " ")}
                      </span>
                    </Button>
                  </motion.div>
                );
              })}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="@container relative overflow-hidden border rounded-lg max-h-[60vh] md:max-h-[70vh] shadow-lg bg-gradient-to-b from-card/50 to-card/30 backdrop-blur-sm"
            >
              <div
                className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-10"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0), var(--background))",
                }}
              />
              <div className="hidden md:block">
                <DemoMail />
              </div>
              <div className="block md:hidden p-4 flex flex-col gap-4">
                <DemoContainer>
                  <DemoStats />
                </DemoContainer>
                <DemoContainer>
                  <DemoGithub />
                </DemoContainer>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32 relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.03),transparent_70%)]"></div>
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge
                className="rounded-full px-4 py-1.5 text-sm font-medium shadow-sm"
                variant="secondary"
              >
                <span className="mr-1 text-primary">✦</span> Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                Powerful Customization Tools
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                tweakcn provides all the tools you need to customize your shadcn/ui
                components and make them unique.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  variants={item}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-card to-card/50 backdrop-blur transition-all hover:shadow-lg hover:border-primary/20 group">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 -z-10 h-full w-full bg-background"></div>
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(var(--muted-rgb),0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--muted-rgb),0.05)_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            >
              <Badge
                className="rounded-full px-4 py-1.5 text-sm font-medium shadow-sm"
                variant="secondary"
              >
                <span className="mr-1 text-primary">✦</span> How It Works
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                Simple Process, Beautiful Results
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Customize your shadcn/ui components in just a few simple steps.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
              {[
                {
                  step: "01",
                  title: "Select Component",
                  description:
                    "Choose the shadcn/ui component you want to customize from our growing library.",
                },
                {
                  step: "02",
                  title: "Customize Visually",
                  description:
                    "Use our intuitive interface to adjust colors, dimensions, typography, and effects.",
                },
                {
                  step: "03",
                  title: "Export Code",
                  description:
                    "Copy the generated React component or Tailwind CSS code directly into your project.",
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  className="relative z-10 flex flex-col items-center text-center space-y-4"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-bold shadow-lg relative">
                    {step.step}
                    <div
                      className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75"
                      style={{
                        animationDuration: "3s",
                        animationDelay: `${i * 0.5}s`,
                      }}
                    ></div>
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section
          id="roadmap"
          className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 -z-10 h-full w-full bg-background/20"></div>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(var(--secondary-rgb),0.05),transparent_50%)]"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            >
              <Badge
                className="rounded-full px-4 py-1.5 text-sm font-medium shadow-sm"
                variant="secondary"
              >
                <span className="mr-1 text-primary">✦</span> Roadmap
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                What's Coming Next
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                We're constantly working to improve tweakcn and add new features.
                Here's what's on our roadmap.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Global Theme Editor",
                  description:
                    "Create and manage complete themes with presets for your entire application.",
                  status: "In Progress",
                  icon: <Palette className="size-5" />,
                },
                {
                  title: "Theme Import/Export",
                  description: "Save and share your custom themes with others.",
                  status: "In Progress",
                  icon: <Repeat className="size-5" />,
                },
                {
                  title: "More Components",
                  description:
                    "Support for Input, Select, and other shadcn/ui components.",
                  status: "Coming Soon",
                  icon: <Layers className="size-5" />,
                },
                {
                  title: "Community Themes",
                  description:
                    "Allow users to submit themes, vote on the best designs",
                  status: "Planned",
                  icon: <Users className="size-5" />,
                },
                {
                  title: "Multi-Project Management",
                  description:
                    "Save and manage multiple theme projects, making it easy to switch between designs.",
                  status: "Planned",
                  icon: <Folder className="size-5" />,
                },
                {
                  title: "Way More Preset Options",
                  description:
                    "Expand the preset library with a wider variety of stunning themes for quick customization.",
                  status: "Planned",
                  icon: <Grid className="size-5" />,
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-card to-card/50 backdrop-blur transition-all hover:shadow-lg hover:border-primary/20">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                        {item.icon}
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold">{item.title}</h3>
                        <Badge
                          variant={
                            item.status === "In Progress"
                              ? "default"
                              : item.status === "Coming Soon"
                              ? "secondary"
                              : "outline"
                          }
                          className="shadow-sm"
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge
                className="rounded-full px-4 py-1.5 text-sm font-medium shadow-sm"
                variant="secondary"
              >
                <span className="mr-1 text-primary">✦</span> FAQ
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                Frequently Asked Questions
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Find answers to common questions about tweakcn.
              </p>
            </motion.div>

            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "What is tweakcn?",
                    answer:
                      "tweakcn is a visual theme editor for shadcn/ui components with Tailwind CSS support. It helps you customize your components to make them stand out, without having to write complex CSS or Tailwind classes manually.",
                  },
                  {
                    question: "Is tweakcn free to use?",
                    answer:
                      "Yes, tweakcn is completely free to use during the beta period. We may introduce premium features in the future, but the core functionality will always remain free.",
                  },
                  {
                    question: "Do I need to know Tailwind CSS to use tweakcn?",
                    answer:
                      "No, you don't need to know Tailwind CSS to use tweakcn. Our visual editor makes it easy to customize components without writing any code. However, having some knowledge of Tailwind CSS will help you understand the generated code better.",
                  },
                  {
                    question: "Which components are currently supported?",
                    answer:
                      "Currently, tweakcn supports the Button component from shadcn/ui. We're actively working on adding support for more components like Input, Select, and others in future updates.",
                  },
                  {
                    question:
                      "Can I use tweakcn with my existing shadcn/ui project?",
                    answer:
                      "Yes, tweakcn is designed to work with existing shadcn/ui projects. You can customize components and export the code to integrate with your project seamlessly.",
                  },
                  {
                    question: "Is tweakcn open source?",
                    answer:
                      "Yes, tweakcn is open source. You can find the source code on GitHub and contribute to the project if you'd like to help improve it.",
                  },
                ].map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <AccordionItem
                      value={`item-${i}`}
                      className="border-b border-border/40 py-2 group"
                    >
                      <AccordionTrigger className="text-left font-medium hover:no-underline group-hover:text-primary transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-6 text-center"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
              >
                Ready to Make Your Components Stand Out?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl"
              >
                Start customizing your shadcn/ui components today and create a unique
                look for your application.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 mt-4"
              >
                <Link to="/editor/theme">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full h-12 px-8 text-base cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
                  >
                    Try It Now
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link to="https://github.com/jnsahaj/tweakcn">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full h-12 px-8 text-base bg-transparent border-white text-white hover:bg-white/10 transition-all duration-300 hover:translate-y-[-2px]"
                  >
                    View on GitHub
                  </Button>
                </Link>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-sm text-primary-foreground/80 mt-4"
              >
                No login required. Free to use. Open source.
              </motion.p>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background/95 backdrop-blur-sm">
        <div className="container max-w-8xl mx-auto flex flex-col gap-8 px-4 md:px-0 py-10 lg:py-16">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-4 col-span-2 max-w-md">
              <div className="flex items-center gap-2 font-bold">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="tweakcn"
                  className="h-8 w-8 mr-1 md:mr-2"
                  title="Nothing here yet..."
                />
                <span>tweakcn</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A powerful visual theme editor for shadcn/ui components with Tailwind
                CSS support. Make your components stand out.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://github.com/jnsahaj/tweakcn"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <GitHubIcon className="size-5" />
                  <span className="sr-only">GitHub</span>
                </a>
                <a
                  href="https://x.com/iamsahaj_xyz"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <TwitterIcon className="size-5" />
                  <span className="sr-only">Twitter</span>
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#features"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#examples"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Examples
                  </a>
                </li>
                <li>
                  <a
                    href="#roadmap"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://github.com/jnsahaj/tweakcn"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.com/invite/qYkxuJyd"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/messages/compose?recipient_id=1426676644152889345"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row justify-between items-center border-t border-border/40 pt-8">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} tweakcn. All rights reserved.
            </p>
            {/*<div className="flex gap-4">
              <a
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </a>
            </div>*/}
          </div>
        </div>
      </footer>
    </div>
  );
}
