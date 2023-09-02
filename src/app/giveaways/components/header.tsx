import Link from 'next/link';
import Image from 'next/image';

import { GiveawayDialog } from './giveaway-dialog';

export function Header() {
  return (
    <header className="border-b-1 relative z-20 w-full border-b border-slate-200 bg-white/90 shadow-lg shadow-slate-700/5 after:absolute after:top-full after:left-0 after:z-10 after:block after:h-px after:w-full after:bg-slate-200 lg:border-slate-200 lg:backdrop-blur-sm lg:after:hidden">
      <div className="relative mx-auto max-w-full px-6 lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[96rem]">
        <nav
          aria-label="main navigation"
          className="flex h-[5.5rem] items-stretch justify-between font-medium"
          role="navigation"
        >
          <Link
            className="flex items-center gap-2 whitespace-nowrap py-3 text-lg text-slate-700 focus:outline-none lg:flex-1"
            href="/"
          >
            <Image src="/logo.svg" width={64} height={64} priority={true} alt="Win Fusion Logo" />
            Win Fusion
          </Link>

          <div className="ml-auto flex items-center px-6 lg:ml-0 lg:p-0 gap-3">
            <GiveawayDialog />

            <a className="btn" href="/api/auth/logout">
              Logout
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
