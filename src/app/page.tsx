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
            Trình quản lý MatchPoint
          </Link>
          <nav className="ml-auto flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/tournaments">Xem Giải đấu</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Bảng điều khiển BTC</Link>
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
                    Quản lý Giải đấu Cầu lông Chuyên nghiệp
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    MatchPoint Manager là nền tảng tất cả trong một để bạn tạo, quản lý và chia sẻ các giải đấu cầu lông một cách dễ dàng.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/dashboard/tournaments/new">
                      Tạo Giải đấu Đầu tiên
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/tournaments">
                      Khám phá Giải đấu
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://picsum.photos/seed/badmintonhero/600/400"
                alt="Giải đấu Cầu lông"
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
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">Tính năng Chính</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Mọi thứ Bạn cần ở một Nơi</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Từ việc thiết lập sự kiện đến công bố tỷ số trực tiếp, MatchPoint Manager hợp lý hóa mọi khía cạnh của việc tổ chức giải đấu.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CalendarCheck className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Tạo Giải đấu</CardTitle>
                  <CardDescription>Dễ dàng thiết lập giải đấu với các hạng mục, địa điểm và ngày tùy chỉnh.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Quản lý Vận động viên</CardTitle>
                  <CardDescription>Quản lý đăng ký, xếp hạng hạt giống và hồ sơ vận động viên hiệu quả.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-primary lucide lucide-git-fork"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><path d="M12 12v3"/></svg>
                  <CardTitle>Bốc thăm Tự động</CardTitle>
                  <CardDescription>Tạo nhánh đấu loại trực tiếp tự động với xử lý miễn đấu và xếp hạt giống.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <ShieldCheck className="h-8 w-8 mb-2 text-primary" /> {/* Placeholder for schedule/scores icon */}
                  <CardTitle>Lịch thi đấu & Tỷ số</CardTitle>
                  <CardDescription>Giao diện trực quan để lên lịch thi đấu và cập nhật tỷ số theo thời gian thực.</CardDescription>
                </CardHeader>
              </Card>
               <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-primary lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                  <CardTitle>Cổng Thông tin Công khai</CardTitle>
                  <CardDescription>Chia sẻ thông tin giải đấu, nhánh đấu và kết quả trực tiếp với vận động viên và khán giả.</CardDescription>
                </CardHeader>
              </Card>
               <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-primary lucide lucide-layout-dashboard"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                  <CardTitle>Bảng điều khiển BTC</CardTitle>
                  <CardDescription>Bảng quản trị toàn diện để quản lý tất cả các giải đấu của bạn.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container py-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Trình quản lý MatchPoint. Bảo lưu mọi quyền.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/terms" className="text-sm hover:underline text-muted-foreground">Điều khoản Dịch vụ</Link>
            <Link href="/privacy" className="text-sm hover:underline text-muted-foreground">Chính sách Bảo mật</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
