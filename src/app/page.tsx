import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CalendarCheck, ShieldCheck, Users, Trophy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Trophy className="h-6 w-6 text-primary" />
            MatchPoint Manager
          </Link>
          <nav className="ml-auto flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/tournaments">View Tournaments</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Organizer Dashboard</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Manage Badminton Tournaments Like a Pro
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    MatchPoint Manager is your all-in-one platform to create, manage, and share badminton tournaments with ease.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/dashboard/tournaments/new">
                      Create Your First Tournament
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/tournaments">
                      Explore Tournaments
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://picsum.photos/seed/badmintonhero/600/400"
                alt="Badminton Tournament"
                width={600}
                height={400}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-lg"
                data-ai-hint="badminton action"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need in One Place</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From setting up events to publishing live scores, MatchPoint Manager streamlines every aspect of tournament organization.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CalendarCheck className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Tournament Creation</CardTitle>
                  <CardDescription>Easily set up tournaments with custom categories, venues, and dates.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Player Management</CardTitle>
                  <CardDescription>Manage player registrations, seedings, and profiles efficiently.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-primary lucide lucide-git-fork"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><path d="M12 12v3"/></svg>
                  <CardTitle>Automated Draws</CardTitle>
                  <CardDescription>Generate knockout draws automatically with bye handling and seed placement.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <ShieldCheck className="h-8 w-8 mb-2 text-primary" /> {/* Placeholder for schedule/scores icon */}
                  <CardTitle>Scheduling & Scores</CardTitle>
                  <CardDescription>Intuitive interface for match scheduling and real-time score updates.</CardDescription>
                </CardHeader>
              </Card>
               <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-primary lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                  <CardTitle>Public Portal</CardTitle>
                  <CardDescription>Share tournament details, draws, and live results with players and spectators.</CardDescription>
                </CardHeader>
              </Card>
               <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-primary lucide lucide-layout-dashboard"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                  <CardTitle>Organizer Dashboard</CardTitle>
                  <CardDescription>A comprehensive admin panel to manage all your tournaments.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container py-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MatchPoint Manager. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/terms" className="text-sm hover:underline text-muted-foreground">Terms of Service</Link>
            <Link href="/privacy" className="text-sm hover:underline text-muted-foreground">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
