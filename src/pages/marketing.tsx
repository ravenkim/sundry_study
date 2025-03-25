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
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "../components/theme-provider";
import { getPresetThemeStyles, presets } from "../utils/theme-presets";
import { DemoContainer } from "@/components/examples/demo-cards";
import { DemoChat } from "@/components/examples/cards/chat";
import { DemoCookieSettings } from "@/components/examples/cards/cookie-settings";
import { DemoCreateAccount } from "@/components/examples/cards/create-account";
import { DemoDatePicker } from "@/components/examples/cards/date-picker";
import { DemoFontShowcase } from "@/components/examples/cards/font-showcase";
import { DemoGithub } from "@/components/examples/cards/github-card";
import { DemoNotifications } from "@/components/examples/cards/notifications";
import { DemoPaymentMethod } from "@/components/examples/cards/payment-method";
import { DemoReportAnIssue } from "@/components/examples/cards/report-an-issue";
import { DemoShareDocument } from "@/components/examples/cards/share-document";
import { DemoStats } from "@/components/examples/cards/stats";
import { DemoTeamMembers } from "@/components/examples/cards/team-members";
import { Link } from "react-router-dom";
import GitHubIcon from "@/assets/github.svg?react";
import TwitterIcon from "@/assets/twitter.svg?react";

const ColorBox = ({ color }: { color: string }) => {
  return (
    <div
      className="w-3 h-3 rounded-sm border-muted"
      style={{ backgroundColor: color }}
    />
  );
};
export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [styles, setStyles] = useState({});
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
    <div
      className="flex min-h-[100dvh] justify-items-center items-center flex-col bg-background text-foreground"
      style={styles}
    >
      <header
        className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${isScrolled ? "bg-background/80 shadow-sm" : "bg-transparent"
          }`}
      >
        <div className="container flex h-16 px-4 min-w-full items-center justify-between">
          <Link to="/">
            <div className="flex items-center gap-2 font-bold">
              <img
                src={logo}
                alt="tweakcn"
                className="h-8 w-8 mr-1 md:mr-2"
              />
              <span>tweakcn</span>
            </div>
          </Link>
          <nav className="hidden md:flex gap-8">
            <a
              href="#examples"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Examples
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </a>
            <a
              href="#roadmap"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Roadmap
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              FAQ
            </a>
          </nav>
          <div className="hidden md:flex gap-4 items-center cursor-pointer">
            <Button variant="secondary" size="icon" onClick={toggleTheme}>
              {theme === "light" ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
            </Button>
            <Link to="/editor/theme">
              <Button className="rounded-full cursor-pointer">
                Try It Now
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </Link>
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
              <a
                href="#examples"
                className="py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Example
              </a>
              <a
                href="#features"
                className="py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#roadmap"
                className="py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Roadmap
              </a>
              <a
                href="#faq"
                className="py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
            </div>
          </motion.div>
        )}
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="container px-4 md:px-6 relative">
            <div className="absolute inset-0 -z-10 h-full w-full bg-background"></div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <Badge
                className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium"
                variant="secondary"
              >
                Currently in Beta
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Make Your shadcn/ui Components Stand Out
              </h1>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                A powerful visual theme editor for shadcn/ui components with Tailwind
                CSS support. <span className="hidden md:inline">Customize your components visually and export the code
                  instantly.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/editor/theme">
                  <Button
                    size="lg"
                    className="rounded-full h-12 px-8 cursor-pointer"
                  >
                    Try It Now
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <a href="#examples">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full h-12 px-8 cursor-pointer"
                  >
                    View Examples
                  </Button>
                </a>
              </div>
              <div className="flex items-center justify-center gap-4 mt-6 text-xs md:text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Check className="size-4 text-primary" />
                  <span>No login required</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="size-4 text-primary" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="size-4 text-primary" />
                  <span>Open source</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto max-w-5xl"
            >
              <div className="rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20">
                <img
                  src={og}
                  alt="tweakcn interface showing button customization"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
              <div className="absolute -top-6 -left-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
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
                  className="rounded-full px-4 py-1.5 text-sm font-medium"
                  variant="secondary"
                >
                  Theme Presets
                </Badge>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Preview and Select a Theme
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Click on a theme below to preview how it transforms the page.
              </p>
            </motion.div>

            {/* Theme Selector Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {presetNames?.slice(4, 10).map((presetName) => {
                const themeStyles =
                  getPresetThemeStyles(presetName)[
                  mode === "dark" ? "dark" : "light"
                  ];
                const isSelected = presetName === themeState.preset;
                return (
                  <Button
                    key={presetName}
                    className={`flex items-center relative border transition-all`}
                    variant="outline"
                    style={{
                      backgroundColor: themeStyles.background,
                      color: themeStyles.foreground,
                      borderColor: themeStyles.border,
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
                    {isSelected && (
                      <span className=" right-2 text-xs">
                        <Check className="h-10 w-10" />
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
            <div className="@container relative overflow-hidden border rounded-lg p-4 max-h-[60vh] md:max-h-[80vh]">

              <div
                className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-10"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0), var(--background))",
                }}
              />
              <div className="flex flex-row gap-4 justify-center">
                <div className="flex flex-col gap-4 max-w-lg flex-1">
                  <DemoContainer>
                    <DemoStats />
                  </DemoContainer>
                  <DemoContainer>
                    <DemoCreateAccount />
                  </DemoContainer>
                  <DemoContainer>
                    <DemoGithub />
                  </DemoContainer>
                  <DemoContainer>
                    <DemoCookieSettings />
                  </DemoContainer>
                  <DemoContainer>
                    <DemoTeamMembers />
                  </DemoContainer>
                  <DemoContainer>
                    <DemoFontShowcase />
                  </DemoContainer>
                  <DemoContainer>
                    <DemoDatePicker />
                  </DemoContainer>
                </div>

                {/* Third column */}
                <div className=" flex-col gap-4 max-w-lg flex-1 hidden md:flex">
                  <DemoContainer>
                    <DemoReportAnIssue />
                  </DemoContainer>
                  <DemoContainer>
                    <DemoPaymentMethod />
                  </DemoContainer>
                  <DemoContainer>
                    <DemoShareDocument />
                  </DemoContainer>
                  <DemoContainer>
                    <DemoNotifications />
                  </DemoContainer>
                  <DemoContainer>
                    <DemoChat />
                  </DemoContainer>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge
                className="rounded-full px-4 py-1.5 text-sm font-medium"
                variant="secondary"
              >
                Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
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
                <motion.div key={i} variants={item}>
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-card to-card/50 backdrop-blur transition-all hover:shadow-md">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
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

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            >
              <Badge
                className="rounded-full px-4 py-1.5 text-sm font-medium"
                variant="secondary"
              >
                How It Works
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
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
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative z-10 flex flex-col items-center text-center space-y-4"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-bold shadow-lg">
                    {step.step}
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
          <div className="absolute inset-0 -z-10 h-full w-full bg-background/20 "></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            >
              <Badge
                className="rounded-full px-4 py-1.5 text-sm font-medium"
                variant="secondary"
              >
                Roadmap
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                What's Coming Next
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                We're constantly working to improve tweakcn and add new features.
                Here's what's on our roadmap.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {
                [
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
                ]
                  .map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-card to-card/50 backdrop-blur transition-all hover:shadow-md">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                            {item.icon}
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-bold">{item.title}</h3>
                            <Badge
                              variant={
                                item.status === "In Progress" || item.status === "Completed"
                                  ? "default"
                                  : item.status === "Coming Soon"
                                    ? "secondary"
                                    : "outline"
                              }
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
                className="rounded-full px-4 py-1.5 text-sm font-medium"
                variant="secondary"
              >
                FAQ
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
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
                      className="border-b border-border/40 py-2"
                    >
                      <AccordionTrigger className="text-left font-medium hover:no-underline">
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
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-6 text-center"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Ready to Make Your Components Stand Out?
              </h2>
              <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                Start customizing your shadcn/ui components today and create a unique
                look for your application.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link to="/editor/theme">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full h-12 px-8 text-base cursor-pointer"
                  >
                    Try It Now
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link to="https://github.com/jnsahaj/tweakcn">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full h-12 px-8 text-base bg-transparent border-white text-white hover:bg-white/10"
                  >
                    View on GitHub
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-primary-foreground/80 mt-4">
                No login required. Free to use. Open source.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background/95 backdrop-blur-sm">
        <div className="container max-w-8xl mx-auto flex flex-col gap-8 px-4 md:px-0 py-10 lg:py-16">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            I<div className="space-y-4 col-span-2 max-w-md">
              <div className="flex items-center gap-2 font-bold">
                <img
                  src={logo}
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
            <div className="flex gap-4">
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
