import { Trophy } from 'lucide-react';
import Link from 'next/link';

interface AppLogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

export function AppLogo({ className, iconSize = 6, textSize = "lg" }: AppLogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 font-bold text-${textSize} ${className}`}>
      <Trophy className={`h-${iconSize} w-${iconSize} text-primary`} />
      Trình quản lý MatchPoint
    </Link>
  );
}
