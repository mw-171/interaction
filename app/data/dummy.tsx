import { Globe, Heart, Plug, Utensils } from "lucide-react";
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

export const DUMMY_ITEMS: Omit<ActivityRowProps, "onRevert">[] = [
  {
    icon: <LucideIcon icon={Heart} />,
    iconColor: "text-pink-500",
    actor: "Period Tracker",
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
        href: "https://notion.so",
      },
    ],
  },
  {
    icon: <LucideIcon icon={Utensils} />,
    iconColor: "text-amber-500",
    actor: "Restaurant Reservations",
    action: "was reverted",
    timestamp: "2026-06-04T07:51:00.000Z",
    description:
      "Finds dining options and autonomously makes reservations using Browserbase",
    details: [
      {
        id: "rr-revert-browserbase",
        label: "Browserbase",
        icon: (
          <Globe size={14} className="text-neutral-400 dark:text-neutral-500" />
        ),
        href: "https://www.browserbase.com",
      },
    ],
  },
  {
    icon: <LucideIcon icon={Utensils} />,
    iconColor: "text-amber-500",
    actor: "Restaurant Reservations",
    action: "was added",
    timestamp: "2026-06-03T15:00:00.000Z",
    description:
      "Find tables and book them automatically without lifting a finger.",
    stops: [
      "Finding available restaurants and tables",
      "Booking reservations automatically",
    ],
    details: [
      {
        id: "rr-browserbase",
        label: "Browserbase",
        icon: (
          <Globe size={14} className="text-neutral-400 dark:text-neutral-500" />
        ),
        href: "https://www.browserbase.com",
      },
    ],
  },
  {
    icon: <LucideIcon icon={Utensils} />,
    iconColor: "text-green-500",
    actor: "Design Interview Guide",
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
    action: "was connected",
    timestamp: "2026-06-02T10:00:00.000Z",
    description:
      "Search and edit your entire workspace directly from your texts.",
    stops: ["Searching your Notion workspace", "Editing pages from Poke"],
    details: [
      {
        id: "notion-1",
        label: "Notion",
        icon: <NotionIcon />,
        href: "https://notion.so",
      },
    ],
  },
  {
    icon: <GoogleCalendarIcon />,
    iconColor: "",
    actor: "Google Calendar",
    action: "was connected",
    timestamp: "2026-06-01T14:30:00.000Z",
    description: "Manage your schedule and book meetings with a quick text.",
    stops: [
      "Managing your schedule from Poke",
      "Booking meetings automatically",
    ],
    details: [
      {
        id: "gcal-1",
        label: "Google Calendar",
        icon: <GoogleCalendarIcon />,
        href: "https://calendar.google.com",
      },
    ],
  },
  {
    icon: <GmailIcon />,
    iconColor: "",
    actor: "Gmail",
    action: "was connected",
    timestamp: "2026-05-16T09:15:00.000Z",
    description: "Search your inbox and draft replies while you're on the go.",
    stops: ["Searching your inbox", "Drafting and sending email replies"],
    details: [
      {
        id: "gmail-1",
        label: "Gmail",
        icon: <GmailIcon />,
        href: "https://mail.google.com",
      },
    ],
  },
  {
    icon: <LucideIcon icon={Utensils} />,
    iconColor: "text-orange-500",
    actor: "Fit",
    action: "was added",
    timestamp: "2026-04-15T11:20:00.000Z",
    description: "Track meals and macros with a daily accountability check-in.",
    stops: ["Tracking meals and macros", "Daily accountability check-ins"],
  },
  {
    icon: <LucideIcon icon={Plug} />,
    iconColor: "text-purple-500",
    actor: "Split",
    action: "was added to MCP servers",
    timestamp: "2026-04-14T16:45:00.000Z",
    description:
      "Access Split feature flags and experiment data directly from your AI assistant.",
    stops: ["Accessing Split feature flags", "Viewing experiment data in Poke"],
    details: [
      { id: "split-mcp-1", label: "Split", href: "https://app.split.io" },
    ],
    isLast: true,
  },
];

