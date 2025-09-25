"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  MutableRefObject,
  KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { BellIcon, SparklesIcon, TagIcon, XIcon } from "lucide-react";

export type NotificationItem = {
  id: number | string;
  title: string;
  message: string;
  time: string;
  type?: "deal" | "reminder" | "welcome" | string;
  unread?: boolean;
};

export interface NotificationModalProps {
  open: boolean;
  notifications: NotificationItem[];
  onClose: () => void;
  anchorRef?: MutableRefObject<HTMLElement | null>;
  id?: string;
}

export default function NotificationModal({
  open,
  notifications,
  onClose,
  anchorRef,
  id,
}: NotificationModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 96, right: 16 });
  const baseId = useId();
  const [isVisible, setIsVisible] = useState(false);

  // Delay portal rendering until mounted to avoid hydration mismatches.
  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!open) {
      setIsVisible(false);
      return;
    }
    const animationFrame = requestAnimationFrame(() => setIsVisible(true));
    return () => {
      cancelAnimationFrame(animationFrame);
      setIsVisible(false);
    };
  }, [open]);

  // Close on Escape when open.
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Disable background scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Track viewport size to adjust layout without relying on CSS alone.
  useEffect(() => {
    if (!open) return;
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const updateMatches = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };
    updateMatches(mediaQuery);
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateMatches);
      return () => mediaQuery.removeEventListener("change", updateMatches);
    }
    mediaQuery.addListener(updateMatches);
    return () => mediaQuery.removeListener(updateMatches);
  }, [open]);

  // Compute desktop positioning relative to the trigger button.
  useLayoutEffect(() => {
    if (!open || isMobile) return;
    const updatePosition = () => {
      const rect = anchorRef?.current?.getBoundingClientRect();
      if (!rect) {
        setPosition({ top: 96, right: 16 });
        return;
      }

      const preferredTop = rect.bottom + 12;
      const preferredRight = window.innerWidth - rect.right - 12;
      const top = Math.max(12, preferredTop);
      const right = Math.max(16, preferredRight);

      setPosition({ top, right });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, isMobile, anchorRef]);

  const labelledBy = `${baseId}-title`;

  const onTrapFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const activeElement = document.activeElement as HTMLElement | null;

    if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && activeElement === first) {
      event.preventDefault();
      last.focus();
    }
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const renderedList = useMemo(
    () =>
      notifications.map((notification) => {
        const icon = getNotificationIcon(notification.type);
        const unread = Boolean(notification.unread);
        return (
          <li
            key={notification.id}
            className={`
              group flex flex-col gap-3 rounded-2xl border p-4 transition-all duration-200
              ${
                unread
                  ? "border-primary/30 bg-gradient-to-br from-primary/15 via-white to-white ring-1 ring-inset ring-primary/20"
                  : "border-white/20 bg-white/75 hover:border-white/40 hover:bg-white"
              }
              md:hover:-translate-y-1 md:hover:shadow-[0_16px_35px_rgba(15,23,42,0.12)]
            `}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${icon.background} ${icon.ring}`}
              >
                {icon.node}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {notification.title}
                  </p>
                  {unread && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                      New
                    </span>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600 group-hover:text-gray-700">
                  {notification.message}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{notification.time}</span>
              <span className="hidden items-center gap-1 text-primary/70 transition-colors group-hover:inline-flex">
                View details
              </span>
            </div>
          </li>
        );
      }),
    [notifications]
  );

  if (!isMounted || !open) return null;

  const containerBaseClass = `pointer-events-auto flex flex-col focus-visible:outline-none transition-[transform,opacity] duration-200 ease-out ${
    isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
  }`;

  const containerClassName = `${containerBaseClass} ${
    isMobile
      ? "fixed inset-x-0 bottom-0 top-0 rounded-none border-0 pb-[calc(env(safe-area-inset-bottom,0)+1rem)] pt-[calc(env(safe-area-inset-top,0)+1rem)] bg-white"
      : "absolute w-[24rem] max-w-[calc(100vw-2rem)] rounded-3xl border border-white/20 bg-white/85 backdrop-blur-2xl shadow-[0_24px_70px_rgba(15,23,42,0.35)]"
  }`;

  return createPortal(
    <div
      className="fixed inset-0 z-50"
      role="presentation"
      onKeyDown={onTrapFocus}
    >
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px] md:bg-slate-900/30"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        id={id}
        className={containerClassName}
        style={
          isMobile
            ? undefined
            : {
                top: position.top,
                right: position.right,
                maxHeight: "min(80vh, 32rem)",
              }
        }
      >
        <header className="flex items-center justify-between gap-2 border-b border-white/30 bg-gradient-to-r from-primary/10 via-white/40 to-purple-500/10 px-5 py-4 md:px-6">
          <h2 id={labelledBy} className="text-base font-semibold text-gray-900 md:text-lg">
            Notifications
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5271FF] focus-visible:ring-offset-white"
          >
            <span className="sr-only">Close notifications</span>
            <XIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-5 py-4 md:px-6 md:py-5">
            {notifications.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="space-y-3" aria-label="Recent notifications">
                {renderedList}
              </ul>
            )}
          </div>
          <div className="border-t border-white/30 px-5 py-4 md:px-6">
            <button
              type="button"
              className="w-full rounded-lg bg-primary/12 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/16 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5271FF] focus-visible:ring-offset-white"
            >
              View all notifications
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function getNotificationIcon(type: NotificationItem["type"]) {
  switch (type) {
    case "deal":
      return {
        node: <TagIcon className="h-5 w-5 text-green-600" aria-hidden="true" />,
        background: "bg-gradient-to-br from-green-100 via-green-50 to-white",
        ring: "ring-1 ring-inset ring-green-200/60",
      };
    case "reminder":
      return {
        node: <BellIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />,
        background: "bg-gradient-to-br from-blue-100 via-blue-50 to-white",
        ring: "ring-1 ring-inset ring-blue-200/60",
      };
    default:
      return {
        node: <SparklesIcon className="h-5 w-5 text-purple-600" aria-hidden="true" />,
        background: "bg-gradient-to-br from-purple-100 via-purple-50 to-white",
        ring: "ring-1 ring-inset ring-purple-200/60",
      };
  }
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/70 px-6 py-12 text-center">
      <SparklesIcon className="h-8 w-8 text-primary" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-gray-900">You&apos;re all caught up!</p>
        <p className="mt-1 text-sm text-gray-500">
          We&apos;ll let you know when there&apos;s something new to see.
        </p>
      </div>
    </div>
  );
}
