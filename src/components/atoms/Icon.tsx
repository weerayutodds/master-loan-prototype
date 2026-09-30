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
  | "arrow-left"
  | "arrow-right"
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
  | "scan"
  | "edit"
  | "star"
  | "chevron-up"
  | "chevron-down"
  | "calendar"
  | "money-bag"
  | "check-circle-solid"
  | "refresh"
  | "user-circle"

const viewBoxes: Partial<Record<IconName, string>> = {
  "money-bag": "0 0 13 14",
  "check-circle-solid": "0 0 16 16",
  "user-circle": "0 0 48 48",
}

type IconProps = {
  name: IconName
  className?: string
}

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
  "arrow-left": (
    <path
      d="M19 12H5m0 0 6-6m-6 6 6 6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "arrow-right": (
    <path
      d="M5 12h14m0 0-6-6m6 6-6 6"
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
  check: (
    <path
      d="m5 12.5 4.5 4.5L19 7.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
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
      <path
        d="M12 11v5.5M12 7.75v.01"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  close: (
    <path
      d="M6 6l12 12M18 6 6 18"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
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
  edit: (
    <path
      d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  star: (
    <path
      d="M12 3.5l2.47 5.01 5.53.8-4 3.9.94 5.5L12 15.98l-4.94 2.73.94-5.5-4-3.9 5.53-.8L12 3.5Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  "chevron-up": (
    <path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  "chevron-down": (
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" strokeLinecap="round" />
    </>
  ),
  "money-bag": (
    <g fill="currentColor" stroke="none">
      <path d="M3.84347 2.57C4.37443 2.40714 4.92728 2.31476 5.49824 2.31476C6.06919 2.31476 6.62205 2.40714 7.153 2.57C7.73967 2.14095 8.12538 1.45238 8.12538 0.669524V0.372381C8.1249 0.166667 7.95824 0 7.75252 0H3.24347C3.03776 0 2.87109 0.166667 2.87109 0.372381V0.67C2.87109 1.45238 3.25681 2.14095 3.84347 2.57Z" />
      <path d="M9.78377 1.32812C9.54711 1.32812 9.3552 1.52003 9.3552 1.7567C9.3552 2.22051 8.97806 2.59717 8.51425 2.59717H8.14377C8.06853 2.68955 7.98806 2.77717 7.90234 2.86098C8.23092 3.01717 8.54806 3.20146 8.84853 3.42098C9.6252 3.26527 10.2123 2.5786 10.2123 1.75717C10.2123 1.52003 10.0204 1.32812 9.78377 1.32812Z" />
      <path d="M12.893 9.03021C12.893 9.38164 12.4168 9.68973 11.6996 9.85926C11.3096 9.95497 10.8468 10.0102 10.3511 10.0102C9.85869 10.0102 9.39583 9.95497 9.00583 9.85926C8.28869 9.68973 7.8125 9.38164 7.8125 9.03021C7.8125 8.48783 8.94964 8.04688 10.3515 8.04688C11.7558 8.04688 12.893 8.48783 12.893 9.03021Z" />
      <path d="M11.8744 12.2135C11.422 12.3268 10.8935 12.3873 10.3511 12.3873C9.80679 12.3873 9.27917 12.3263 8.82393 12.2115C8.38583 12.1054 8.05917 11.9663 7.8125 11.813V12.3511C7.8125 12.7025 8.28536 13.0077 8.99917 13.183C9.38917 13.2787 9.85536 13.3344 10.3511 13.3344C10.8501 13.3344 11.313 13.2787 11.7063 13.1835C12.4206 13.0077 12.893 12.7025 12.893 12.3515V11.8125C12.6454 11.9668 12.3163 12.1068 11.8744 12.2135Z" />
      <path d="M11.8639 10.5546C11.4125 10.6651 10.8873 10.7246 10.3511 10.7246C9.81679 10.7246 9.2925 10.6651 8.83536 10.5532C8.38964 10.448 8.06012 10.3061 7.8125 10.1499V10.6913C7.8125 11.0427 8.28536 11.348 8.99917 11.5203C9.38917 11.6189 9.85536 11.6746 10.3511 11.6746C10.8501 11.6746 11.313 11.6194 11.7063 11.5203C12.4206 11.348 12.893 11.0427 12.893 10.6913V10.1484C12.6444 10.3061 12.313 10.4489 11.8639 10.5546Z" />
      <path d="M7.0978 12.3522V10.6912V10.5293V8.85506C7.24589 7.79982 8.81066 7.33268 10.3511 7.33268C10.4726 7.33268 10.5935 7.33649 10.714 7.34268C10.0354 5.06554 8.15685 3.03125 5.4978 3.03125C1.68209 3.03125 -0.534582 7.21982 0.111132 10.3055C0.632085 12.7941 2.87304 13.3351 5.4978 13.3351C6.18685 13.3351 6.84589 13.2932 7.45732 13.1922C7.16446 12.8889 7.0978 12.5727 7.0978 12.3522Z" />
    </g>
  ),
  "check-circle-solid": (
    <path
      d="M12.7159 3.28927C11.4559 2.02927 9.7826 1.33594 8.0026 1.33594C6.2226 1.33594 4.54927 2.02927 3.28927 3.28927C2.02927 4.54927 1.33594 6.2226 1.33594 8.0026C1.33594 9.7826 2.02927 11.4559 3.28927 12.7159C4.54927 13.9759 6.2226 14.6693 8.0026 14.6693C9.7826 14.6693 11.4559 13.9759 12.7159 12.7159C13.9759 11.4559 14.6693 9.7826 14.6693 8.0026C14.6693 6.2226 13.9759 4.54927 12.7159 3.28927ZM11.3626 6.15594L7.54927 11.0226C7.43594 11.1693 7.2826 11.2959 7.10927 11.3826C6.94927 11.4626 6.7626 11.5026 6.5826 11.5026C6.56927 11.5026 6.55594 11.5026 6.54927 11.5026C6.35594 11.5026 6.1626 11.4426 5.99594 11.3493C5.8226 11.2559 5.67594 11.1159 5.56927 10.9559L4.26927 9.11594C4.05594 8.81594 4.12927 8.39594 4.42927 8.18927C4.72927 7.97594 5.14927 8.04927 5.35594 8.34927L6.58927 10.0959L10.3226 5.33594C10.5493 5.0426 10.9693 4.99594 11.2559 5.2226C11.5426 5.44927 11.5959 5.86927 11.3693 6.15594H11.3626Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  refresh: (
    <path
      d="M20 12a8 8 0 1 1-2.34-5.66M20 4v4h-4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "user-circle": (
    <>
      {/* 1. พื้นหลังวงกลม (ใช้สี currentColor เพื่อให้เปลี่ยนสีเทาตาม className ได้) */}
      <circle cx="24" cy="24" r="24" fill="currentColor" stroke="none" />

      <g
        fill="#FFFFFF"
        stroke="none"
        transform="translate(3.6, 3.6) scale(0.85)"
      >
        <circle cx="24" cy="12" r="8.4" />

        <path d="M24 38.88c-6.155 0-11.455-3.327-14.496-8.243.072-4.814 9.65-7.477 14.496-7.477s14.412 2.663 14.496 7.477c-3.04 4.916-8.34 8.243-14.496 8.243z" />
      </g>
    </>
  ),
}

export function Icon({name, className = "size-5"}: IconProps) {
  return (
    <svg
      viewBox={viewBoxes[name] ?? "0 0 24 24"}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
