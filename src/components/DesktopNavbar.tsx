
import { BellIcon, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import ModeToggle from "./ModeToggle";
import { currentUser } from "@clerk/nextjs/server";
import SearchInput from "./SearchInput";
import Image from 'next/image';
import CategoriesPopover from "./CategoriesPopover";
import CartButtonWithCount from "@/components/CartButtonWithCount";

async function DesktopNavbar() {
  const user = await currentUser();

  

  return (
    <div className="hidden lg:flex items-center justify-between w-full px-6 py-4 space-x-4">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Image
            src="/freedemylogoblack.png"
            alt="learn"
            width={130}
            height={130}
            className="dark:hidden"
          />
        </Link>
        <Link href="/">
          <Image
            src="/freedemylogowhite.png"
            alt="learn"
            width={130}
            height={130}
            className="hidden dark:block"
          />
        </Link>
      </div>

      <div className="flex items-center gap-4 flex-1 justify-center">
        <CategoriesPopover />
        <Button
          variant="ghost"
          className="hover:bg-purple-200 hover:text-purple-900 dark:hover:bg-purple-400/20 dark:text-white dark:hover:text-purple-100"
          asChild
        >
          <Link href="/plans">
            <span className="hidden lg:inline">Plans & Pricing</span>
          </Link>
        </Button>
        <SearchInput />
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Button
              variant="ghost"
              className="hover:bg-purple-200 hover:text-purple-900 dark:hover:bg-purple-400/20 dark:text-white dark:hover:text-purple-100"
              asChild
            >
              <Link href="/instructors">
                <span className="hidden lg:inline">Teach on freedemy</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="hover:bg-purple-200 hover:text-purple-900 dark:hover:bg-purple-400/20 dark:text-white dark:hover:text-purple-100"
              asChild
            >
              <Link href="/my-learning">
                <span className="hidden lg:inline">My Learning</span>
              </Link>
            </Button>

            <Link href="/wishlist">
              <Button variant="ghost" className="hover:bg-purple-200 hover:text-purple-900 dark:hover:bg-purple-400/20 dark:text-white dark:hover:text-purple-100">
                <Heart className="w-4 h-4" />
              </Button>
            </Link>
            <CartButtonWithCount />

            <Link href="/notifications">
              <Button variant="ghost" className="hover:bg-purple-200 hover:text-purple-900 dark:hover:bg-purple-400/20 dark:text-white dark:hover:text-purple-100">
                <BellIcon className="w-4 h-4" />
              </Button>
            </Link>
            <ModeToggle />
            <UserButton />
          </>
        ) : (
          <SignInButton mode="modal">
            <Button variant="default">Sign In</Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
}
export default DesktopNavbar;
