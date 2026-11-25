import type { ReactNode, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

// The flatwork icon style: 16px inline stroke SVG, 1.4 stroke, currentColor.
function icon(name: string, paths: ReactNode) {
  const Icon = (props: IconProps) => (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {paths}
    </svg>
  );
  Icon.displayName = name;
  return Icon;
}

export const IconHome = icon("IconHome", <><path d="M2 6.5 8 2l6 4.5V14H2z" /><path d="M6.25 14V9.5h3.5V14" /></>);
export const IconUser = icon("IconUser", <><circle cx="8" cy="5.5" r="2.75" /><path d="M2.75 14c.6-2.6 2.7-4 5.25-4s4.65 1.4 5.25 4" /></>);
export const IconSettings = icon("IconSettings", <><circle cx="8" cy="8" r="2" /><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" /></>);
export const IconPlus = icon("IconPlus", <path d="M8 3v10M3 8h10" />);
export const IconDownload = icon("IconDownload", <path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M2.5 13.5h11" />);
export const IconUpload = icon("IconUpload", <path d="M8 10.5v-8M4.5 6 8 2.5 11.5 6M2.5 13.5h11" />);
export const IconChevronDown = icon("IconChevronDown", <path d="m4 6 4 4 4-4" />);
export const IconChevronUp = icon("IconChevronUp", <path d="m4 10 4-4 4 4" />);
export const IconChevronRight = icon("IconChevronRight", <path d="m6 3.5 4 4.5-4 4.5" />);
export const IconChevronLeft = icon("IconChevronLeft", <path d="m10 3.5-4 4.5 4 4.5" />);
export const IconArrowRight = icon("IconArrowRight", <path d="M3 8h10M9 4l4 4-4 4" />);
export const IconPencil = icon("IconPencil", <path d="M10.5 2.5 13.5 5.5 5.5 13.5H2.5V10.5z" />);
export const IconCopy = icon("IconCopy", <><rect x="5" y="5" width="8.5" height="8.5" rx="1.5" /><path d="M3 10.5V3.5A1 1 0 0 1 4 2.5h6.5" /></>);
export const IconMore = icon("IconMore", <><circle cx="3.5" cy="8" r="1.25" /><circle cx="8" cy="8" r="1.25" /><circle cx="12.5" cy="8" r="1.25" /></>);
export const IconX = icon("IconX", <path d="m4 4 8 8M12 4l-8 8" />);
export const IconTrash = icon("IconTrash", <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" />);
export const IconSearch = icon("IconSearch", <><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3.5 3.5" /></>);
export const IconEye = icon("IconEye", <><path d="M1.5 8S3.9 3.5 8 3.5 14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z" /><circle cx="8" cy="8" r="2" /></>);
export const IconInfo = icon("IconInfo", <><circle cx="8" cy="8" r="6.25" /><path d="M8 7.25v4M8 4.75v.25" /></>);
export const IconCheckCircle = icon("IconCheckCircle", <><circle cx="8" cy="8" r="6.25" /><path d="m5.5 8.25 1.75 1.75 3.25-3.5" /></>);
export const IconWarning = icon("IconWarning", <><path d="M8 2 14.5 13.5h-13z" /><path d="M8 6.5v3.25M8 11.5v.25" /></>);
export const IconError = icon("IconError", <><circle cx="8" cy="8" r="6.25" /><path d="M8 4.75v3.75M8 10.75v.5" /></>);
export const IconFolder = icon("IconFolder", <path d="M2 4.5h4l1.5 1.5H14V13H2z" />);
export const IconBell = icon("IconBell", <><path d="M4 6.5a4 4 0 0 1 8 0c0 3.5 1.5 4.5 1.5 4.5h-11S4 10 4 6.5z" /><path d="M6.75 13.5a1.4 1.4 0 0 0 2.5 0" /></>);
export const IconChart = icon("IconChart", <path d="M2 13V9M6 13V5M10 13V7M14 13V3" />);
export const IconLock = icon("IconLock", <><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></>);
export const IconGrid = icon("IconGrid", <><rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" /><rect x="9" y="2.5" width="4.5" height="4.5" rx="1" /><rect x="2.5" y="9" width="4.5" height="4.5" rx="1" /><rect x="9" y="9" width="4.5" height="4.5" rx="1" /></>);
export const IconList = icon("IconList", <path d="M2.5 4h11M2.5 8h11M2.5 12h11" />);
export const IconCheck = icon("IconCheck", <path d="m3 8.5 3 3 7-7" />);
