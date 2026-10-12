"use client";

import Link from "next/link";
import { useState } from "react";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <div className="mobile-menu">
      <button
        className="mobile-menu__trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="mobile-menu__icon" aria-hidden="true">
          {isOpen ? "×" : "☰"}
        </span>
      </button>
      <nav
        id="mobile-navigation"
        className="mobile-menu__panel"
        aria-label="Mobile navigation"
        hidden={!isOpen}
      >
        <Link href="/#how-it-works" onClick={close}>
          How it works
        </Link>
        <Link href="/#teams" onClick={close}>
          Who it helps
        </Link>
        <Link href="/resources" onClick={close}>
          Field notes
        </Link>
        <Link href="/login" data-analytics-event="sign_in_header_clicked" onClick={close}>
          Sign in
        </Link>
      </nav>
    </div>
  );
}
