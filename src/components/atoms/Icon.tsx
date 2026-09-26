export type IconName =
  | "home"
  | "credit-card"
  | "shield"
  | "users"
  | "calendar-check"
  | "bar-chart"
  | "bell"
  | "coin"
  | "arrow-up"
  | "arrow-down"
  | "motorcycle"
  | "car"
  | "truck"
  | "map-pin"
  | "check"
  | "menu"
  | "card-reader"
  | "user"
  | "phone"
  | "info"
  | "close"
  | "document"
  | "scan";

type IconProps = {
  name: IconName;
  className?: string;
};

const paths: Record<IconName, React.ReactNode> = {
  home: (
    <path
      d="M4 11.5 12 4l8 7.5M6 9.5V20h12V9.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "credit-card": (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10.5h18" strokeLinecap="round" />
    </>
  ),
  shield: (
    <path
      d="M12 4 5 6.5V11c0 4.4 3 8.1 7 9 4-.9 7-4.6 7-9V6.5L12 4Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  users: (
    <>
      <circle cx="9" cy="9" r="3" />
      <path
        d="M3.5 19c.6-3 3-5 5.5-5s4.9 2 5.5 5M15.5 9a3 3 0 1 0 0-6M16 14.2c2 .3 3.9 2.1 4.5 4.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  "calendar-check": (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" strokeLinecap="round" />
      <path d="m9 13.5 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "bar-chart": (
    <path
      d="M5 19V10M12 19V5M19 19v-6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  bell: (
    <path
      d="M6 17h12l-1.5-2V10a4.5 4.5 0 0 0-9 0v5L6 17Zm4 3a2 2 0 0 0 4 0"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  coin: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path
        d="M12 7.5v9M14.75 9.5c0-1.1-1.15-1.9-2.55-1.9h-.15a1.9 1.9 0 0 0 0 3.8h.9a1.9 1.9 0 0 1 0 3.8h-.15c-1.4 0-2.55-.8-2.55-1.9"
        strokeLinecap="round"
      />
    </>
  ),
  "arrow-up": (
    <path
      d="M12 19V5m0 0-6 6m6-6 6 6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "arrow-down": (
    <path
      d="M12 5v14m0 0 6-6m-6 6-6-6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  motorcycle: (
    <>
      <circle cx="6" cy="17" r="2.5" />
      <circle cx="18" cy="17" r="2.5" />
      <path
        d="M8.5 17h6l2-5h2M13 12l-2-3H8m3 3-3 5M15 8.5h2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  car: (
    <>
      <path
        d="M4 16.5v-3l1.8-4A2 2 0 0 1 7.6 8h8.8a2 2 0 0 1 1.9 1.4l1.3 4.1v3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 16.5h16" strokeLinecap="round" />
      <circle cx="7.5" cy="16.5" r="1.7" />
      <circle cx="16.5" cy="16.5" r="1.7" />
    </>
  ),
  truck: (
    <>
      <rect x="2.5" y="9" width="11" height="7.5" rx="1" />
      <path
        d="M13.5 11.5h3.8l3.2 3v2h-7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="18" r="1.7" />
      <circle cx="17" cy="18" r="1.7" />
    </>
  ),
  "map-pin": (
    <>
      <path
        d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />,
  "card-reader": (
    <>
      <rect x="5" y="4.5" width="14" height="8" rx="1.5" />
      <rect x="7.5" y="11" width="9" height="8" rx="1" />
      <path d="M9.5 15h5" strokeLinecap="round" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path
        d="M5 20c.7-3.6 3.6-6 7-6s6.3 2.4 7 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  phone: (
    <path
      d="M6.6 10.2c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V19c0 .6-.4 1-1 1C10.9 20 4 13.1 4 4.6c0-.6.4-1 1-1h3c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.2Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.75v.01" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" strokeLinejoin="round" />,
  document: (
    <>
      <path
        d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 3.5V8h4M9 12.5h6M9 16h6" strokeLinecap="round" />
    </>
  ),
  scan: (
    <>
      <path
        d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2M20 8V6a2 2 0 0 0-2-2h-2M20 16v2a2 2 0 0 1-2 2h-2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 12h16" strokeLinecap="round" />
    </>
  ),
};

export function Icon({ name, className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
