import Link from "next/link";

function Logo() {
  return (
    <Link
      href="/"
      dir="ltr"
      aria-label="Velora - صفحه اصلی"
      className="group inline-flex shrink-0 items-center gap-2.5 rounded-xl select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* Layered Metallic Silver & Ice-Blue V Emblem */}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className="size-8 shrink-0 drop-shadow-[0_2px_6px_rgba(56,189,248,0.22)] transition-transform duration-200 group-hover:scale-105 sm:size-9"
      >
        <defs>
          {/* Outer metallic silver gradient */}
          <linearGradient
            id="velora-silver-outer"
            x1="10"
            y1="10"
            x2="54"
            y2="54"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="45%" stopColor="#CBD5E1" />
            <stop offset="80%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Outer bevel highlight */}
          <linearGradient
            id="velora-silver-highlight"
            x1="32"
            y1="10"
            x2="32"
            y2="54"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#94A3B8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.8" />
          </linearGradient>

          {/* Inner ice-blue / sky metallic gradient */}
          <linearGradient
            id="velora-blue-inner"
            x1="16"
            y1="20"
            x2="48"
            y2="46"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="35%" stopColor="#7DD3FC" />
            <stop offset="70%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          {/* Inner recessed groove shadow */}
          <linearGradient
            id="velora-groove"
            x1="32"
            y1="18"
            x2="32"
            y2="48"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#0F172A" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#1E293B" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {/* Outer sculpted silver V wings */}
        <path
          d="M7 13.5C7 11.8 8.6 10.8 10.2 11.4C14.2 12.9 17.5 15.1 19.8 18.8L29.6 34.5C30.7 36.3 33.3 36.3 34.4 34.5L44.2 18.8C46.5 15.1 49.8 12.9 53.8 11.4C55.4 10.8 57 11.8 57 13.5C56.9 21.5 52.8 30.2 46.8 39.2C42.5 45.7 37.9 51.4 34.8 54C33.2 55.3 30.8 55.3 29.2 54C26.1 51.4 21.5 45.7 17.2 39.2C11.2 30.2 7.1 21.5 7 13.5Z"
          fill="url(#velora-silver-outer)"
          stroke="url(#velora-silver-highlight)"
          strokeWidth="1"
        />

        {/* Dark shadow groove separating silver rim & blue inner core */}
        <path
          d="M12.2 21.8C15.5 28.4 20.8 37.2 28.8 46.2C30.5 48.1 33.5 48.1 35.2 46.2C43.2 37.2 48.5 28.4 51.8 21.8C49.5 21.6 46.5 23.2 44.3 26.2L35.4 38.6C33.7 41 30.3 41 28.6 38.6L19.7 26.2C17.5 23.2 14.5 21.6 12.2 21.8Z"
          fill="url(#velora-groove)"
        />

        {/* Layered ice-blue metallic inner V */}
        <path
          d="M14.2 23.6C17.4 29.8 22.3 37.6 29.3 45.2C30.8 46.8 33.2 46.8 34.7 45.2C41.7 37.6 46.6 29.8 49.8 23.6C47.7 24.1 45.6 25.8 43.9 28.2L35.2 40.3C33.6 42.5 30.4 42.5 28.8 40.3L20.1 28.2C18.4 25.8 16.3 24.1 14.2 23.6Z"
          fill="url(#velora-blue-inner)"
        />
      </svg>

      {/* Clean geometric wordmark */}
      <span className="font-[family-name:var(--font-inter)] bg-gradient-to-b from-zinc-900 via-zinc-700 to-zinc-600 bg-clip-text text-2xl font-bold leading-none tracking-tight text-transparent dark:from-white dark:via-zinc-200 dark:to-zinc-400 sm:text-[1.75rem]">
        Velora
      </span>
    </Link>
  );
}

export default Logo;
