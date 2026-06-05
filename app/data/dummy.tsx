import { Heart, Plug, Utensils } from "lucide-react";
import type { ActivityRowProps } from "../components/activity-row";

function GmailIcon() {
  return (
    <img
      width={48}
      height={48}
      src="https://img.icons8.com/fluency/48/gmail-new.png"
      alt="Gmail"
      className="size-4"
    />
  );
}

function GoogleCalendarIcon() {
  return (
    <img
      width={48}
      height={48}
      src="https://img.icons8.com/fluency/48/google-calendar--v1.png"
      alt="Google Calendar"
      className="size-4"
    />
  );
}

function NotionIcon() {
  return (
    <img
      width={48}
      height={48}
      src="https://img.icons8.com/color/48/notion--v1.png"
      alt="Notion"
      className="size-4"
    />
  );
}

function BrowserbaseIcon() {
  return (
    <img
      src="https://cdn.brandfetch.io/idbdCQaufv/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1779255186717"
      alt="Browserbase"
      className="h-4 w-auto"
    />
  );
}

function LucideIcon({
  icon: Icon,
  className,
}: {
  icon: React.ElementType;
  className?: string;
}) {
  return <Icon size={16} className={className} aria-hidden="true" />;
}

export const SKELETON_COUNT = 9;

type DummyItem = Omit<ActivityRowProps, "onRevert" | "onRestore"> & {
  original?: Omit<ActivityRowProps, "onRevert" | "onRestore">;
};

export const DUMMY_ITEMS: DummyItem[] = [
  {
    icon: <LucideIcon icon={Heart} />,
    iconColor: "text-pink-500",
    actor: "Period Tracker",
    kind: "recipe",
    recipeSlug: "period-tracker",
    action: "was added",
    timestamp: "2026-06-04T08:00:00.000Z",
    description:
      "Log cycles and symptoms via text to get a visual wellness forecast.",
    stops: [
      "Logging cycles and symptoms via text",
      "Your visual wellness forecast",
    ],
    details: [
      {
        id: "pt-notion",
        label: "Notion",
        icon: <NotionIcon />,
        href: "https://poke.com/recipes/notion",
      },
      {
        id: "pt-gcal",
        label: "Google Calendar",
        icon: <GoogleCalendarIcon />,
        href: "https://poke.com/recipes/google-calendar",
      },
    ],
  },
  {
    icon: <LucideIcon icon={Utensils} />,
    iconColor: "text-amber-500",
    actor: "Restaurant Reservations",
    kind: "recipe",
    recipeSlug: "restaurant-reservations",
    action: "was reverted",
    timestamp: "2026-06-04T07:51:00.000Z",
    description:
      "Finds dining options and autonomously makes reservations using Browserbase.",
    original: {
      icon: <LucideIcon icon={Utensils} />,
      iconColor: "text-amber-500",
      actor: "Restaurant Reservations",
      kind: "recipe",
      recipeSlug: "restaurant-reservations",
      action: "was added",
      timestamp: "2026-06-04T07:51:00.000Z",
      description:
        "Finds dining options and autonomously makes reservations using Browserbase.",
      stops: [
        "Finding available restaurants and tables",
        "Booking reservations automatically",
      ],
      details: [
        {
          id: "rr-revert-browserbase",
          label: "Browserbase",
          icon: <BrowserbaseIcon />,
          href: "https://poke.com/recipes/restaurant-reservations",
        },
      ],
    },
  },
  {
    icon: <LucideIcon icon={Utensils} />,
    iconColor: "text-amber-500",
    actor: "Restaurant Reservations",
    kind: "recipe",
    recipeSlug: "restaurant-reservations",
    action: "was added",
    timestamp: "2026-06-03T15:00:00.000Z",
    description:
      "Finds dining options and autonomously makes reservations using Browserbase.",
    stops: [
      "Finding available restaurants and tables",
      "Booking reservations automatically",
    ],
    details: [
      {
        id: "rr-browserbase",
        label: "Browserbase",
        icon: <BrowserbaseIcon />,
        href: "https://poke.com/recipes/restaurant-reservations",
      },
    ],
  },
  {
    icon: <LucideIcon icon={Utensils} />,
    iconColor: "text-green-500",
    actor: "Design Interview Guide",
    kind: "recipe",
    recipeSlug: "design-interview-guide",
    recipeUrl: "https://poke.com/r/lQJITXX1aqI",
    action: "was added",
    timestamp: "2026-06-03T09:00:00.000Z",
    description:
      "Your internal handbook for crushing the Interaction design challenge.",
    stops: ["Your design interview preparation guide"],
  },
  {
    icon: <NotionIcon />,
    iconColor: "",
    actor: "Notion",
    kind: "integration",
    recipeSlug: "notion",
    action: "was connected",
    timestamp: "2026-06-02T10:00:00.000Z",
    description:
      "Search and edit your entire workspace directly from your texts.",
    accessLabel: "Notion workspace and search access",
    details: [
      {
        id: "notion-1",
        label: "Notion",
        icon: <NotionIcon />,
        href: "https://poke.com/recipes/notion",
      },
    ],
  },
  {
    icon: <GoogleCalendarIcon />,
    iconColor: "",
    actor: "Google Calendar",
    kind: "integration",
    recipeSlug: "google-calendar",
    action: "was connected",
    timestamp: "2026-06-01T14:30:00.000Z",
    description: "Manage your schedule and book meetings with a quick text.",
    accessLabel: "Google Calendar access",
    details: [
      {
        id: "gcal-1",
        label: "Google Calendar",
        icon: <GoogleCalendarIcon />,
        href: "https://poke.com/recipes/google-calendar",
      },
    ],
  },
  {
    icon: <GmailIcon />,
    iconColor: "",
    actor: "Gmail",
    kind: "integration",
    recipeSlug: "gmail",
    action: "was connected",
    timestamp: "2026-05-16T09:15:00.000Z",
    description: "Search your inbox and draft replies while you're on the go.",
    accessLabel: "Gmail inbox access",
    details: [
      {
        id: "gmail-1",
        label: "Gmail",
        icon: <GmailIcon />,
        href: "https://poke.com/recipes/gmail",
      },
    ],
  },
  {
    icon: <LucideIcon icon={Utensils} />,
    iconColor: "text-orange-500",
    actor: "Fit",
    kind: "recipe",
    recipeSlug: "fit",
    action: "was added",
    timestamp: "2026-04-15T11:20:00.000Z",
    description: "Track meals and macros with a daily accountability check-in.",
    stops: ["Tracking meals and macros", "Daily accountability check-ins"],
  },
  {
    icon: <LucideIcon icon={Plug} />,
    iconColor: "text-purple-500",
    actor: "Split",
    kind: "integration",
    recipeSlug: "split",
    action: "was added to MCP servers",
    timestamp: "2026-04-14T16:45:00.000Z",
    description:
      "Record expenses and get updates from Split directly with Poke.",
    accessLabel: "Split feature flag access",
    details: [
      {
        id: "split-mcp-1",
        label: "Split",
        href: "https://split-0.vercel.app/",
      },
    ],
    isLast: true,
  },
];

