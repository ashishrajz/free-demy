"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CartButtonWithCount() {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await fetch("/api/cart/count"); // Make sure this API exists
        const data = await res.json();
        setCartItemCount(data.count || 0);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount();
  }, []);

  return (
    <Link href="/cart" className="relative">
      <Button
        variant="ghost"
        className="hover:bg-purple-200 hover:text-purple-900 dark:hover:bg-purple-400/20 dark:text-white dark:hover:text-purple-100"
      >
        <ShoppingCart className="w-4 h-4" />
        {cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
            {cartItemCount}
          </span>
        )}
      </Button>
    </Link>
  );
}
