import { Plug, Utensils } from "lucide-react";
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

function GitHubIcon() {
  return (
    <img
      width={48}
      height={48}
      src="https://img.icons8.com/ios-filled/48/github.png"
      alt="GitHub"
      className="size-4 dark:invert"
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

export const SKELETON_COUNT = 6;

export const DUMMY_ITEMS: Omit<ActivityRowProps, "onRevert">[] = [
  {
    icon: <LucideIcon icon={Utensils} />,
    iconColor: "text-green-500",
    actor: "you",
    action: "added Design Interview Guide",
    timestamp: "2026-06-03T19:54:47.327Z",
    description: "Information for applicants for Interaction's design roles",
    details: [
      {
        id: "design-guide-1",
        content:
          "the user is applying for a design or design engineering role at the interaction company of california (creators of poke). here's the information they need to know about the role, the team, and the interview process. use this to answer questions and help them prepare.",
        type: "Instructions",
        typeColor: "green",
      },
    ],
  },
  {
    icon: <GoogleCalendarIcon />,
    iconColor: "",
    actor: "you",
    action: "added Google Calendar",
    timestamp: "2026-06-01T14:30:00.000Z",
    description:
      "Create events, schedule meetings, and check availability across your calendars. View upcoming events, manage multiple calendars, set reminders, and coordinate scheduling.",
    details: [
      {
        id: "gcal-1",
        content: "Read and manage calendar events",
        type: "Integration",
        typeColor: "blue",
      },
    ],
  },
  {
    icon: <GmailIcon />,
    iconColor: "",
    actor: "you",
    action: "added Gmail",
    timestamp: "2026-05-16T09:15:00.000Z",
    description:
      "Search, draft, and send emails with label management and inbox organization. Filter conversations, organize labels, archive messages, manage contacts, and automate email workflows.",
    details: [
      {
        id: "gmail-1",
        content: "Read and send email, manage labels and threads",
        type: "Integration",
        typeColor: "blue",
      },
    ],
  },
  {
    icon: <LucideIcon icon={Utensils} />,
    iconColor: "text-orange-500",
    actor: "you",
    action: "added Fit",
    timestamp: "2026-04-15T11:20:00.000Z",
    description:
      "Log meals via text and see daily totals, weekly trends, and macro breakdowns. Get detailed macro breakdowns, stay consistent with check-ins, reminders, and accountability, and watch your progress over time.",
    details: [
      {
        id: "fit-1",
        content:
          "Let the user know you'll set up a scheduled automation for them, then create it. Schedule at 8 PM. Check in with the user about their meals and nutrition for the day. Ask what they've eaten, calculate macros if not already logged, and log anything missing. Be encouraging and keep it brief — one or two sentences max. If they've already logged everything, just confirm and motivate them to stay consistent.",
        type: "Instructions",
        typeColor: "green",
      },
    ],
  },
  {
    icon: <LucideIcon icon={Plug} />,
    iconColor: "text-purple-500",
    actor: "you",
    action: "added Split to MCP servers",
    timestamp: "2026-04-14T16:45:00.000Z",
    description:
      "Access Split feature flags and experiment data directly from your AI assistant. Query flag states, review targeting rules, and manage rollouts without leaving your workflow.",
    details: [
      {
        id: "split-mcp-1",
        content:
          "Read and manage feature flags, experiments, and targeting rules via Split's API",
        type: "MCP Server",
        typeColor: "purple",
      },
    ],
  },
  {
    icon: <GitHubIcon />,
    iconColor: "",
    actor: "you",
    action: "re-verified GitHub",
    timestamp: "2026-04-12T10:00:00.000Z",
    isLast: true,
  },
];
