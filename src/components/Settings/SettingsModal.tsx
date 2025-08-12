"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode, KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";

// Types
type NavKey =
  | "general"
  | "notifications"
  | "payments"
  | "preferences"
  | "security"
  | "account"
  | "communication"
  | "privacy";

export interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

// A large, accessible modal with a responsive sidebar and content area
export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [active, setActive] = useState<NavKey>("payments");
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Close on Escape and focus the close button when opened
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Mark mounted for safe portal rendering
  useEffect(() => setMounted(true), []);

  // Basic focus trap inside the modal
  const onTrapFocus = (e: ReactKeyboardEvent) => {
    if (e.key !== "Tab" || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const isShift = e.shiftKey;
    const activeEl = document.activeElement as HTMLElement | null;
    if (!isShift && activeEl === last) {
      e.preventDefault();
      first.focus();
    } else if (isShift && activeEl === first) {
      e.preventDefault();
      (last as HTMLElement).focus();
    }
  };

  const nav = useMemo(
    () => [
      { id: "general" as NavKey, label: "Settings", Icon: GearIcon },
      { id: "notifications" as NavKey, label: "Notifications", Icon: BellIcon },
      { id: "payments" as NavKey, label: "Manage Payment", Icon: CardIcon },
      { id: "preferences" as NavKey, label: "Preferences", Icon: SlidersIcon },
      { id: "security" as NavKey, label: "Security", Icon: LockIcon },
      { id: "account" as NavKey, label: "Account", Icon: UserIcon },
      { id: "communication" as NavKey, label: "Communication", Icon: ChatIcon },
      { id: "privacy" as NavKey, label: "Privacy", Icon: ShieldIcon },
    ],
    []
  );

  if (!open || !mounted) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      onKeyDown={onTrapFocus}
    >
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        tabIndex={-1}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"
      />

      {/* Modal shell */}
      <div ref={modalRef} className="absolute inset-2 sm:inset-6 md:inset-10 z-10 rounded-2xl border border-black/10 bg-white/90 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-black/10 px-4 sm:px-6 py-3 bg-gradient-to-b from-white/70 to-white/40">
          <h2 id="settings-title" className="text-base sm:text-lg md:text-xl font-semibold tracking-tight">
            Profile Management
          </h2>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full p-2 text-neutral-700 hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5271FF] focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900"
          >
            <span className="sr-only">Close</span>
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex min-h-0 flex-1">
          {/* Sidebar - desktop */}
          <aside className="hidden md:flex w-72 shrink-0 flex-col border-r border-black/10 p-3 bg-gradient-to-b from-white/60 to-white/30 relative">
            <nav className="flex-1 space-y-1">
              {nav.map((item) => {
                const activeItem = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActive(item.id)}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                      activeItem
                        ? "bg-[#E9EEFF] text-[#5271FF]"
                        : "text-neutral-700 hover:bg-black/5"
                    }`}
                    aria-current={activeItem ? "page" : undefined}
                  >
                    <item.Icon className={`h-5 w-5 ${activeItem ? "text-[#5271FF]" : "text-neutral-500"}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="pt-3 mt-2 border-t border-black/10">
              <button className="w-full rounded-lg bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 text-left font-medium">
                Log Out
              </button>
            </div>
          </aside>

          {/* Top nav - mobile */}
          <div className="md:hidden border-b border-black/10 overflow-x-auto">
            <div className="flex gap-2 p-2 min-w-max">
              {nav.map(({ id, label }) => {
                const activeItem = active === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActive(id)}
                    className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm ${
                      activeItem
                        ? "border-[#5271FF] bg-[#E9EEFF] text-[#5271FF]"
                        : "border-neutral-200 text-neutral-700"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {active === "payments" && <PaymentsSection />}
            {active === "general" && <GeneralSection />}
            {active === "notifications" && <NotificationsSection />}
            {active === "preferences" && <PreferencesSection />}
            {active === "security" && <SecuritySection />}
            {active === "account" && <AccountSection />}
            {active === "communication" && <CommunicationSection />}
            {active === "privacy" && <PrivacySection />}
          </main>
        </div>
      </div>
    </div>,
    document.body
  );
}

// --- Sections ---------------------------------------------------------------

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-xl sm:text-2xl font-semibold mb-4">{children}</h3>;
}

function PaymentsSection() {
  const [autoRenew, setAutoRenew] = useState(true);
  return (
    <div className="space-y-6 text-neutral-800">
      <SectionTitle>Manage Payment</SectionTitle>

      {/* Card on file */}
      <div className="rounded-xl border border-[#AEBBFF]/40 bg-[#E9EEFF]/40 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white/70 border border-white/60 p-2">
            <CardIcon className="h-6 w-6 text-[#5271FF]" />
          </div>
          <div className="font-semibold">VISA **** 7632</div>
        </div>
        <div className="mt-3 text-sm leading-6 text-neutral-600">
          <div>
            <span className="font-medium">Name on Card:</span> Alex Johnson
          </div>
          <div>
            <span className="font-medium">Billing Address:</span> 123 Nomad Ln, Chicago, IL 60601
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="rounded-md bg-[#E9EEFF] text-[#5271FF] hover:bg-[#dce5ff] px-3 py-1.5 font-medium">
            Update Card
          </button>
          <button className="rounded-md bg-neutral-100 text-neutral-700 hover:bg-neutral-200 px-3 py-1.5 font-medium">
            Remove Card
          </button>
        </div>
      </div>

      {/* Payment history */}
      <div>
        <h4 className="text-base font-semibold mb-2">Payment History</h4>
        <div className="overflow-hidden rounded-xl border border-black/10">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50">
              <tr className="text-left text-neutral-600">
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Description</th>
                <th className="px-4 py-2 font-medium">Amount</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              <tr>
                <td className="px-4 py-2">Jul 1, 2025</td>
                <td className="px-4 py-2">Subscription Renewal</td>
                <td className="px-4 py-2">$9.99</td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 px-2 py-0.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500" /> Pending
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Jun 1, 2025</td>
                <td className="px-4 py-2">Subscription Renewal</td>
                <td className="px-4 py-2">$9.99</td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2 py-0.5">
                    <span className="h-2 w-2 rounded-full bg-green-500" /> Paid
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Auto-renewal */}
      <div className="flex items-center justify-between rounded-xl border border-black/10 bg-white px-4 py-3">
        <div>
          <div className="font-medium">Auto-Renewal</div>
          <p className="text-sm text-neutral-600">
            This card is set as your default for all reservations and subscriptions.
          </p>
        </div>
        <Toggle checked={autoRenew} onChange={setAutoRenew} />
      </div>
    </div>
  );
}

function GeneralSection() {
  const [units, setUnits] = useState('metric');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState('12h');
  
  return (
    <div className="space-y-8 text-neutral-800">
      <div>
        <SectionTitle>Profile Information</SectionTitle>
        <p className="text-sm text-neutral-600 mb-4">Update your personal information and preferences.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabeledInput label="Full Name" placeholder="Alex Johnson" />
          <LabeledInput label="Email" type="email" placeholder="alex@example.com" />
          <LabeledInput label="Phone Number" placeholder="+1 (555) 123-4567" />
          <LabeledInput label="Date of Birth" type="date" />
        </div>
      </div>

      <div>
        <h4 className="text-base font-semibold mb-3">Location & Time</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Time Zone</label>
            <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#5271FF] focus:border-transparent">
              <option>America/New_York (EST)</option>
              <option>America/Chicago (CST)</option>
              <option>America/Denver (MST)</option>
              <option>America/Los_Angeles (PST)</option>
              <option>Europe/London (GMT)</option>
              <option>Europe/Paris (CET)</option>
              <option>Asia/Tokyo (JST)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#5271FF] focus:border-transparent">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Italian</option>
              <option>Portuguese</option>
              <option>Japanese</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-base font-semibold mb-3">Display Preferences</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Units</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input type="radio" name="units" value="metric" checked={units === 'metric'} onChange={(e) => setUnits(e.target.value)} className="mr-2" />
                <span className="text-sm">Metric (km, °C)</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="units" value="imperial" checked={units === 'imperial'} onChange={(e) => setUnits(e.target.value)} className="mr-2" />
                <span className="text-sm">Imperial (miles, °F)</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Date Format</label>
            <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} className="w-full md:w-48 px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#5271FF] focus:border-transparent">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Time Format</label>
            <select value={timeFormat} onChange={(e) => setTimeFormat(e.target.value)} className="w-full md:w-48 px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#5271FF] focus:border-transparent">
              <option value="12h">12-hour (2:30 PM)</option>
              <option value="24h">24-hour (14:30)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-neutral-200">
        <button className="rounded-lg bg-[#5271FF] text-white px-6 py-2.5 font-medium hover:bg-[#4461E7] transition-colors">Save Changes</button>
        <button className="rounded-lg border border-neutral-200 text-neutral-700 px-6 py-2.5 font-medium hover:bg-neutral-50 transition-colors">Cancel</button>
      </div>
    </div>
  );
}

function NotificationsSection() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  
  return (
    <div className="space-y-8 text-neutral-800">
      <div>
        <SectionTitle>Email Notifications</SectionTitle>
        <p className="text-sm text-neutral-600 mb-4">Choose what email notifications you'd like to receive.</p>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <div className="font-medium">Trip Updates</div>
              <div className="text-sm text-neutral-600">Get notified about changes to your bookings and itineraries</div>
            </div>
            <Toggle checked={emailNotifications} onChange={setEmailNotifications} />
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <div className="font-medium">Deals & Offers</div>
              <div className="text-sm text-neutral-600">Receive exclusive travel deals and promotional offers</div>
            </div>
            <CheckboxRow label="" defaultChecked={false} />
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <div className="font-medium">Travel Inspiration</div>
              <div className="text-sm text-neutral-600">Weekly newsletter with destination ideas and travel tips</div>
            </div>
            <CheckboxRow label="" defaultChecked={true} />
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <div className="font-medium">Price Alerts</div>
              <div className="text-sm text-neutral-600">Get notified when prices drop for your saved trips</div>
            </div>
            <CheckboxRow label="" defaultChecked={true} />
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium">Security Alerts</div>
              <div className="text-sm text-neutral-600">Important account security and login notifications</div>
            </div>
            <CheckboxRow label="" defaultChecked={true} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-base font-semibold mb-3">Push Notifications</h4>
        <p className="text-sm text-neutral-600 mb-4">Manage notifications sent to your devices.</p>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <div className="font-medium">Real-time Updates</div>
              <div className="text-sm text-neutral-600">Flight delays, gate changes, and urgent travel alerts</div>
            </div>
            <Toggle checked={pushNotifications} onChange={setPushNotifications} />
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <div className="font-medium">Itinerary Reminders</div>
              <div className="text-sm text-neutral-600">Reminders about upcoming activities and reservations</div>
            </div>
            <CheckboxRow label="" defaultChecked={true} />
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium">Check-in Reminders</div>
              <div className="text-sm text-neutral-600">Reminders to check in for flights and hotels</div>
            </div>
            <CheckboxRow label="" defaultChecked={false} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-base font-semibold mb-3">SMS Notifications</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <div className="font-medium">Emergency Alerts</div>
              <div className="text-sm text-neutral-600">Critical travel disruptions and safety alerts</div>
            </div>
            <Toggle checked={smsNotifications} onChange={setSmsNotifications} />
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium">Booking Confirmations</div>
              <div className="text-sm text-neutral-600">SMS confirmations for new bookings and changes</div>
            </div>
            <CheckboxRow label="" defaultChecked={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PreferencesSection() {
  const [defaultBudget, setDefaultBudget] = useState('moderate');
  const [travelStyle, setTravelStyle] = useState('balanced');
  const [accessibility, setAccessibility] = useState(false);
  
  return (
    <div className="space-y-8 text-neutral-800">
      <div>
        <SectionTitle>Travel Preferences</SectionTitle>
        <p className="text-sm text-neutral-600 mb-4">Set your default travel preferences to get personalized recommendations.</p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">Default Budget Range</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                defaultBudget === 'budget' ? 'border-[#5271FF] bg-[#5271FF]/5' : 'border-neutral-200 hover:border-neutral-300'
              }`}>
                <input type="radio" name="budget" value="budget" checked={defaultBudget === 'budget'} onChange={(e) => setDefaultBudget(e.target.value)} className="sr-only" />
                <div className="font-medium">Budget</div>
                <div className="text-sm text-neutral-600">$50-150/day</div>
              </label>
              <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                defaultBudget === 'moderate' ? 'border-[#5271FF] bg-[#5271FF]/5' : 'border-neutral-200 hover:border-neutral-300'
              }`}>
                <input type="radio" name="budget" value="moderate" checked={defaultBudget === 'moderate'} onChange={(e) => setDefaultBudget(e.target.value)} className="sr-only" />
                <div className="font-medium">Moderate</div>
                <div className="text-sm text-neutral-600">$150-300/day</div>
              </label>
              <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                defaultBudget === 'luxury' ? 'border-[#5271FF] bg-[#5271FF]/5' : 'border-neutral-200 hover:border-neutral-300'
              }`}>
                <input type="radio" name="budget" value="luxury" checked={defaultBudget === 'luxury'} onChange={(e) => setDefaultBudget(e.target.value)} className="sr-only" />
                <div className="font-medium">Luxury</div>
                <div className="text-sm text-neutral-600">$300+/day</div>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3">Travel Style</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                travelStyle === 'adventure' ? 'border-[#5271FF] bg-[#5271FF]/5' : 'border-neutral-200 hover:border-neutral-300'
              }`}>
                <input type="radio" name="style" value="adventure" checked={travelStyle === 'adventure'} onChange={(e) => setTravelStyle(e.target.value)} className="sr-only" />
                <div className="font-medium">Adventure</div>
                <div className="text-sm text-neutral-600">Outdoor activities, hiking, extreme sports</div>
              </label>
              <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                travelStyle === 'cultural' ? 'border-[#5271FF] bg-[#5271FF]/5' : 'border-neutral-200 hover:border-neutral-300'
              }`}>
                <input type="radio" name="style" value="cultural" checked={travelStyle === 'cultural'} onChange={(e) => setTravelStyle(e.target.value)} className="sr-only" />
                <div className="font-medium">Cultural</div>
                <div className="text-sm text-neutral-600">Museums, history, local experiences</div>
              </label>
              <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                travelStyle === 'relaxation' ? 'border-[#5271FF] bg-[#5271FF]/5' : 'border-neutral-200 hover:border-neutral-300'
              }`}>
                <input type="radio" name="style" value="relaxation" checked={travelStyle === 'relaxation'} onChange={(e) => setTravelStyle(e.target.value)} className="sr-only" />
                <div className="font-medium">Relaxation</div>
                <div className="text-sm text-neutral-600">Beaches, spas, leisurely pace</div>
              </label>
              <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                travelStyle === 'balanced' ? 'border-[#5271FF] bg-[#5271FF]/5' : 'border-neutral-200 hover:border-neutral-300'
              }`}>
                <input type="radio" name="style" value="balanced" checked={travelStyle === 'balanced'} onChange={(e) => setTravelStyle(e.target.value)} className="sr-only" />
                <div className="font-medium">Balanced</div>
                <div className="text-sm text-neutral-600">Mix of activities and relaxation</div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-base font-semibold mb-3">App Preferences</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <div className="font-medium">Show travel tips in feed</div>
              <div className="text-sm text-neutral-600">Display helpful travel tips and advice in your dashboard</div>
            </div>
            <CheckboxRow label="" defaultChecked={true} />
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <div className="font-medium">Remember search filters</div>
              <div className="text-sm text-neutral-600">Save your last used search preferences</div>
            </div>
            <CheckboxRow label="" defaultChecked={true} />
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <div className="font-medium">Auto-save itineraries</div>
              <div className="text-sm text-neutral-600">Automatically save changes to your trip plans</div>
            </div>
            <CheckboxRow label="" defaultChecked={false} />
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium">Accessibility features</div>
              <div className="text-sm text-neutral-600">Enable enhanced accessibility options</div>
            </div>
            <Toggle checked={accessibility} onChange={setAccessibility} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SecuritySection() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  
  return (
    <div className="space-y-8 text-neutral-800">
      <div>
        <SectionTitle>Password & Authentication</SectionTitle>
        <p className="text-sm text-neutral-600 mb-4">Keep your account secure with a strong password and two-factor authentication.</p>
        
        <div className="space-y-4">
          <LabeledInput label="Current Password" type="password" placeholder="Enter current password" />
          <LabeledInput label="New Password" type="password" placeholder="Enter new password" />
          <LabeledInput label="Confirm New Password" type="password" placeholder="Confirm new password" />
          
          <div className="bg-neutral-50 p-4 rounded-lg">
            <h5 className="font-medium mb-2">Password Requirements</h5>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Include uppercase and lowercase letters</li>
              <li>• Include at least one number</li>
              <li>• Include at least one special character</li>
            </ul>
          </div>
          
          <button className="rounded-lg bg-[#5271FF] text-white px-6 py-2.5 font-medium hover:bg-[#4461E7] transition-colors">
            Update Password
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-base font-semibold mb-3">Two-Factor Authentication</h4>
        <p className="text-sm text-neutral-600 mb-4">Add an extra layer of security to your account.</p>
        
        <div className="border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-medium">Authenticator App</div>
              <div className="text-sm text-neutral-600">Use an app like Google Authenticator or Authy</div>
            </div>
            <Toggle checked={twoFactorEnabled} onChange={setTwoFactorEnabled} />
          </div>
          
          {!twoFactorEnabled && (
            <button className="text-[#5271FF] text-sm font-medium hover:underline">
              Set up two-factor authentication
            </button>
          )}
          
          {twoFactorEnabled && (
            <div className="space-y-3">
              <div className="text-sm text-green-600 font-medium">✓ Two-factor authentication is enabled</div>
              <div className="flex gap-2">
                <button className="text-[#5271FF] text-sm font-medium hover:underline">View backup codes</button>
                <button className="text-red-600 text-sm font-medium hover:underline">Disable 2FA</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-base font-semibold mb-3">Login Activity</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <div className="font-medium">Login alerts</div>
              <div className="text-sm text-neutral-600">Get notified of new sign-ins to your account</div>
            </div>
            <Toggle checked={loginAlerts} onChange={setLoginAlerts} />
          </div>
          
          <div>
            <div className="font-medium mb-3">Recent Activity</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium">Current session</div>
                  <div className="text-xs text-neutral-600">MacBook Pro • Chrome • San Francisco, CA</div>
                </div>
                <div className="text-xs text-green-600">Active now</div>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                <div>
                  <div className="text-sm font-medium">iPhone</div>
                  <div className="text-xs text-neutral-600">Safari • San Francisco, CA</div>
                </div>
                <div className="text-xs text-neutral-600">2 hours ago</div>
              </div>
            </div>
            
            <button className="text-[#5271FF] text-sm font-medium hover:underline mt-3">
              View all login activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountSection() {
  const [accountType, setAccountType] = useState('free');
  
  return (
    <div className="space-y-8 text-neutral-800">
      <div>
        <SectionTitle>Account Information</SectionTitle>
        <p className="text-sm text-neutral-600 mb-4">Manage your account details and subscription.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-neutral-600">Account Type</div>
              <div className="font-semibold">Voyagr Pro</div>
            </div>
            <div>
              <div className="text-sm font-medium text-neutral-600">Member Since</div>
              <div>January 15, 2024</div>
            </div>
            <div>
              <div className="text-sm font-medium text-neutral-600">Account ID</div>
              <div className="font-mono text-sm">VGR-2024-001234</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-neutral-600">Next Billing Date</div>
              <div>February 15, 2025</div>
            </div>
            <div>
              <div className="text-sm font-medium text-neutral-600">Storage Used</div>
              <div>2.3 GB of 10 GB</div>
              <div className="w-full bg-neutral-200 rounded-full h-2 mt-1">
                <div className="bg-[#5271FF] h-2 rounded-full" style={{width: '23%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-base font-semibold mb-3">Subscription Management</h4>
        <div className="border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-medium">Voyagr Pro - Annual</div>
              <div className="text-sm text-neutral-600">$99.99/year • Renews February 15, 2025</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-600 font-medium">Active</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="text-[#5271FF] text-sm font-medium hover:underline">Change plan</button>
            <button className="text-neutral-600 text-sm font-medium hover:underline">Cancel subscription</button>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-base font-semibold mb-3">Data & Privacy</h4>
        <div className="space-y-3">
          <button className="w-full md:w-auto rounded-lg border border-neutral-200 text-neutral-700 px-6 py-2.5 font-medium hover:bg-neutral-50 transition-colors">
            Download My Data
          </button>
          <p className="text-sm text-neutral-600">Export all your travel data, itineraries, and account information.</p>
        </div>
      </div>

      <div>
        <h4 className="text-base font-semibold mb-3 text-red-700">Danger Zone</h4>
        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
          <div className="mb-3">
            <div className="font-medium text-red-700">Delete Account</div>
            <div className="text-sm text-red-600">Permanently delete your account and all associated data. This action cannot be undone.</div>
          </div>
          <button className="rounded-lg bg-red-600 text-white px-6 py-2.5 font-medium hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

function CommunicationSection() {
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [partnerOffers, setPartnerOffers] = useState(false);
  
  return (
    <div className="space-y-8 text-neutral-800">
      <div>
        <SectionTitle>Email Preferences</SectionTitle>
        <p className="text-sm text-neutral-600 mb-4">Choose what types of emails you'd like to receive from us.</p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <div className="font-medium">Product Updates</div>
              <div className="text-sm text-neutral-600">New features, improvements, and important announcements</div>
            </div>
            <CheckboxRow label="" defaultChecked={true} />
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <div className="font-medium">Travel Inspiration</div>
              <div className="text-sm text-neutral-600">Weekly destination guides, travel tips, and curated content</div>
            </div>
            <Toggle checked={marketingEmails} onChange={setMarketingEmails} />
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <div className="font-medium">Community Highlights</div>
              <div className="text-sm text-neutral-600">Featured trips and stories from the Voyagr community</div>
            </div>
            <CheckboxRow label="" defaultChecked={false} />
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <div className="font-medium">Partner Offers</div>
              <div className="text-sm text-neutral-600">Special deals from our travel partners and affiliates</div>
            </div>
            <Toggle checked={partnerOffers} onChange={setPartnerOffers} />
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium">Survey Invitations</div>
              <div className="text-sm text-neutral-600">Occasional requests for feedback to help improve Voyagr</div>
            </div>
            <CheckboxRow label="" defaultChecked={true} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-base font-semibold mb-3">Communication Frequency</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email Frequency</label>
            <select className="w-full md:w-64 px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#5271FF] focus:border-transparent">
              <option>Daily digest</option>
              <option>Weekly summary</option>
              <option>Monthly newsletter</option>
              <option>Only important updates</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Best time to contact</label>
            <select className="w-full md:w-64 px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#5271FF] focus:border-transparent">
              <option>Morning (8 AM - 12 PM)</option>
              <option>Afternoon (12 PM - 5 PM)</option>
              <option>Evening (5 PM - 9 PM)</option>
              <option>No preference</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-base font-semibold mb-3">Unsubscribe</h4>
        <div className="bg-neutral-50 p-4 rounded-lg">
          <p className="text-sm text-neutral-600 mb-3">
            You can unsubscribe from all marketing emails at any time. You'll still receive important account and booking-related notifications.
          </p>
          <button className="text-red-600 text-sm font-medium hover:underline">
            Unsubscribe from all marketing emails
          </button>
        </div>
      </div>
    </div>
  );
}

function PrivacySection() {
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [dataSharing, setDataSharing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  
  return (
    <div className="space-y-8 text-neutral-800">
      <div>
        <SectionTitle>Profile Privacy</SectionTitle>
        <p className="text-sm text-neutral-600 mb-4">Control who can see your profile and travel information.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">Profile Visibility</label>
            <div className="space-y-3">
              <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                profileVisibility === 'public' ? 'border-[#5271FF] bg-[#5271FF]/5' : 'border-neutral-200 hover:border-neutral-300'
              }`}>
                <input type="radio" name="visibility" value="public" checked={profileVisibility === 'public'} onChange={(e) => setProfileVisibility(e.target.value)} className="mt-1 mr-3" />
                <div>
                  <div className="font-medium">Public</div>
                  <div className="text-sm text-neutral-600">Anyone can view your profile and travel history</div>
                </div>
              </label>
              
              <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                profileVisibility === 'friends' ? 'border-[#5271FF] bg-[#5271FF]/5' : 'border-neutral-200 hover:border-neutral-300'
              }`}>
                <input type="radio" name="visibility" value="friends" checked={profileVisibility === 'friends'} onChange={(e) => setProfileVisibility(e.target.value)} className="mt-1 mr-3" />
                <div>
                  <div className="font-medium">Friends Only</div>
                  <div className="text-sm text-neutral-600">Only people you've connected with can see your profile</div>
                </div>
              </label>
              
              <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                profileVisibility === 'private' ? 'border-[#5271FF] bg-[#5271FF]/5' : 'border-neutral-200 hover:border-neutral-300'
              }`}>
                <input type="radio" name="visibility" value="private" checked={profileVisibility === 'private'} onChange={(e) => setProfileVisibility(e.target.value)} className="mt-1 mr-3" />
                <div>
                  <div className="font-medium">Private</div>
                  <div className="text-sm text-neutral-600">Your profile is completely private and hidden from others</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-base font-semibold mb-3">Data & Sharing</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <div className="font-medium">Share travel data with partners</div>
              <div className="text-sm text-neutral-600">Allow trusted partners to provide personalized recommendations</div>
            </div>
            <Toggle checked={dataSharing} onChange={setDataSharing} />
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <div className="font-medium">Analytics and performance</div>
              <div className="text-sm text-neutral-600">Help us improve Voyagr by sharing anonymous usage data</div>
            </div>
            <Toggle checked={analytics} onChange={setAnalytics} />
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-neutral-100">
            <div>
              <div className="font-medium">Location tracking</div>
              <div className="text-sm text-neutral-600">Allow location-based features and recommendations</div>
            </div>
            <CheckboxRow label="" defaultChecked={true} />
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium">Personalized advertising</div>
              <div className="text-sm text-neutral-600">Show ads based on your travel interests and behavior</div>
            </div>
            <CheckboxRow label="" defaultChecked={false} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-base font-semibold mb-3">Data Rights</h4>
        <div className="space-y-3">
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-sm text-neutral-600 mb-3">
              You have the right to access, update, or delete your personal data at any time. Learn more about your privacy rights and how we protect your data.
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="text-[#5271FF] text-sm font-medium hover:underline">View Privacy Policy</button>
              <button className="text-[#5271FF] text-sm font-medium hover:underline">Request Data Copy</button>
              <button className="text-red-600 text-sm font-medium hover:underline">Delete My Data</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Reusable UI ------------------------------------------------------------

function LabeledInput({
  label,
  type = "text",
  placeholder,
}: {
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-medium text-neutral-700">{label}</div>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#5271FF]"
      />
    </label>
  );
}

function CheckboxRow({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <label className="flex items-center gap-3">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-neutral-300 text-[#5271FF] focus:ring-[#5271FF]"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <span className="text-sm text-neutral-800">{label}</span>
    </label>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
        checked ? "bg-[#5271FF]" : "bg-neutral-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// --- Icons ------------------------------------------------------------------

function CloseIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path strokeLinecap="round" d="M6 6l8 8M14 6l-8 8" />
    </svg>
  );
}

function GearIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317a1 1 0 011.35-.936l.862.287a2 2 0 001.314 0l.862-.287a1 1 0 011.35.936l.054.908a2 2 0 00.586 1.282l.653.653a1 1 0 010 1.414l-.653.653a2 2 0 00-.586 1.282l-.054.908a1 1 0 01-1.35.936l-.862-.287a2 2 0 00-1.314 0l-.862.287a1 1 0 01-1.35-.936l-.054-.908a2 2 0 00-.586-1.282l-.653-.653a1 1 0 010-1.414l.653-.653a2 2 0 00.586-1.282l.054-.908z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function BellIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function CardIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function SlidersIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 21v-7" />
      <path d="M4 10V3" />
      <path d="M12 21v-9" />
      <path d="M12 8V3" />
      <path d="M20 21v-5" />
      <path d="M20 12V3" />
      <path d="M1 14h6" />
      <path d="M9 10h6" />
      <path d="M17 16h6" />
    </svg>
  );
}

function LockIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function UserIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="7" r="4" />
      <path d="M6 21v-2a6 6 0 0112 0v2" />
    </svg>
  );
}

function ChatIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M21 15a4 4 0 01-4 4H7l-4 4V7a4 4 0 014-4h10a4 4 0 014 4z" />
    </svg>
  );
}

function ShieldIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6z" />
    </svg>
  );
}
