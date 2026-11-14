import React, { useState, useMemo } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Mail,
  Sparkles,
  Utensils,
  MapPin,
  Phone,
  FileSpreadsheet,
  Globe,
  Share2,
  Send,
  Search,
  MessageSquare,
  HelpCircle,
  Flame,
} from 'lucide-react';
import { Restaurant } from '../types/restaurant';
import { ALL_RESTAURANTS } from '../data/restaurantData';
import { Language } from '../i18n/translations';

interface LeadOutreachModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRestaurant: Restaurant;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  lang: Language;
  initialLeadId?: string;
}

type ChannelType = 'whatsapp' | 'bangla' | 'facebook' | 'email';
type PitchAngle = 'commissions' | 'reservations' | 'full';

export const LeadOutreachModal: React.FC<LeadOutreachModalProps> = ({
  isOpen,
  onClose,
  currentRestaurant,
  onSelectRestaurant,
  lang,
  initialLeadId,
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(
    initialLeadId || currentRestaurant.id
  );
  const [channel, setChannel] = useState<ChannelType>('whatsapp');
  const [angle, setAngle] = useState<PitchAngle>('commissions');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync if initialLeadId changes
  React.useEffect(() => {
    if (initialLeadId) {
      setSelectedLeadId(initialLeadId);
    }
  }, [initialLeadId]);

  const selectedLead = useMemo(() => {
    return (
      ALL_RESTAURANTS.find((r) => r.id === selectedLeadId) ||
      currentRestaurant ||
      ALL_RESTAURANTS[0]
    );
  }, [selectedLeadId, currentRestaurant]);

  // Generate lead-specific direct URL
  const getLeadUrl = (leadId: string) => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      return `${origin}${pathname}?restaurant=${leadId}`;
    }
    return `https://demo.dhakafood.app/?restaurant=${leadId}`;
  };

  const currentLeadUrl = getLeadUrl(selectedLead.id);

  // Format clean phone number for WhatsApp link (e.g. +880 1713-030040 -> 8801713030040)
  const getCleanPhone = (phoneStr: string) => {
    const rawNumber = phoneStr.split('/')[0].trim();
    const digits = rawNumber.replace(/\D/g, '');
    if (digits.startsWith('01')) {
      return `880${digits.substring(1)}`;
    }
    if (digits.startsWith('880')) {
      return digits;
    }
    return digits;
  };

  // Generate customized messages based on channel and angle
  const generatedMessage = useMemo(() => {
    const lead = selectedLead;
    const url = currentLeadUrl;
    const phoneClean = lead.phone.split('/')[0].trim();

    if (channel === 'bangla') {
      if (angle === 'commissions') {
        return `আসসালামু আলাইকুম ${lead.bengaliName} টিম! 👋

আমরা লক্ষ্য করেছি আপনারা ফুড ডেলিভারি প্ল্যাটফর্মগুলোকে প্রতি অর্ডারে ২০%–২৫% পর্যন্ত উচ্চ কমিশন দিচ্ছেন। 

আপনাদের রেস্টুরেন্টের সরাসরি সেলস বাড়ানো এবং মেহমানদের আরও প্রিমিয়াম অভিজ্ঞতা দেওয়ার জন্য আমরা আপনাদের ব্র্যান্ড নামে একটি আধুনিক অনলাইন অর্ডারিং ও টেবিল রিজার্ভেশন ডেমো সিস্টেম তৈরি করেছি:
🔗 লাইভ ডেমো দেখুন: ${url}

✨ এতে কী কী সুবিধা থাকছে:
১. সরাসরি অনলাইন খাবার অর্ডার (০% কমিশন — সম্পূর্ণ লাভ আপনাদের)
২. আপনাদের স্পেশাল "${lead.signatureDishName}" ও সিগনেচার মেনু সহজে কাস্টমাইজ করে অর্ডার
৩. গ্রাহক কোনো সিরিয়াল ছাড়াই সরাসরি টেবিল ও ভিআইপি লাউঞ্জ বুকিং করতে পারবে
৪. বিকাশ/নগদ ও ক্যাশ অন ডেলিভারি ইন্টিগ্রেশন

${lead.areaBn} ব্রাঞ্চের সেলস বাড়াতে এটি আপনারা সরাসরি ব্যবহার করতে পারবেন। ডেমোটি দেখে আপনার মতামত জানালে কৃতজ্ঞ থাকব!`;
      }

      if (angle === 'reservations') {
        return `আসসালামু আলাইকুম ${lead.bengaliName} ম্যানেজমেন্ট! ✨

আপনাদের ${lead.areaBn} লোকেশনের প্রিমিয়াম ডাইনিং ও ভিআইপি সিটিংয়ের জন্য আমরা একটি স্পেশাল অনলাইন টেবিল ও ব্যাঙ্কুয়েট রিজার্ভেশন পোর্টাল ডিজাইন করেছি।

🔗 আপনাদের রেস্টুরেন্টের লাইভ প্রিভিউ দেখুন: ${url}

🔹 মেহমানরা আগেই পছন্দমতো টেবিল, গেস্ট সংখ্যা এবং স্পেশাল রিকোয়েস্ট দিয়ে বুক করতে পারবেন
🔹 বুকিং কোড ও এসএমএস ট্র্যাকিং সুবিধা
🔹 ফোন কলে বুকিং মিস হওয়ার ঝামেলা নেই

আপনারা ফ্রি ট্রায়াল হিসেবে এটি পরীক্ষা করে দেখতে পারেন। বিস্তারিত কথা বলার জন্য অবসর সময়ে একটি রিপ্লাই দেবেন। ধন্যবাদ!`;
      }

      return `আসসালামু আলাইকুম! ${lead.bengaliName}-এর জন্য তৈরি একটি পূর্ণাঙ্গ ডিজিটাল মেনু, অনলাইন অর্ডার ও টেবিল বুকিং সলিউশন:
🔗 লাইভ লিংক: ${url}

খাঁটি ${lead.cuisineBn} স্বাদের আপনার রেস্টুরেন্ট এখন নিজস্ব ওয়েব পোর্টালের মাধ্যমে মেহমানদের ঘরে ঘরে পৌঁছে যেতে পারে। ডেমোটি ভিজিট করে দেখুন এবং ভালো লাগলে জানাবেন!`;
    }

    if (channel === 'whatsapp') {
      if (angle === 'commissions') {
        return `Hello ${lead.name} Management! 👋

Are third-party delivery apps taking 20–25% commission on your orders in ${lead.area}? 

We built an exclusive, direct online ordering & table reservation web experience specifically for *${lead.name}*:
👉 *Check your live demo here:* ${url}

🔥 *Key Highlights for Your Restaurant:*
• 0% Commission Direct Orders — keep 100% of your delivery revenue
• Visual menu gallery highlighting your signature *${lead.signatureDishName}*
• Instant Table & VIP Salon bookings without phone line congestion
• Instant WhatsApp order dispatch & bKash/Nagad/Card checkout

Would you like to try this live for *${lead.name}* this week? Let me know if you have 2 minutes to chat!`;
      }

      if (angle === 'reservations') {
        return `Hello ${lead.name} team! ✨

We’ve designed a bespoke Table & VIP Seating Reservation experience for *${lead.name}* (${lead.area}).

👉 *See your live demo here:* ${url}

• Guests can select seating zones, dates, guest counts & occasions in seconds
• Automatic reservation codes & booking tracker
• Eliminates missed phone reservations during peak lunch/dinner hours

Take a quick look and let me know your thoughts!`;
      }

      return `Hi ${lead.name}! 🚀 We customized a high-converting digital dining & online ordering portal for your restaurant:
👉 ${url}

Featuring your signature *${lead.signatureDishName}*, multi-portion sharing, and live table booking. Would love to hear your feedback!`;
    }

    if (channel === 'facebook') {
      return `Dear ${lead.name} Team,

Big fans of your culinary experience at ${lead.area}! 🍽️

We noticed your guests love ordering your "${lead.signatureDishName}". To help your brand capture direct orders and table reservations without heavy 3rd-party commission cuts, we crafted a tailored interactive demo for ${lead.name}:

👉 Preview your restaurant's portal: ${url}

Features built for you:
✅ Direct mobile ordering with zero platform commissions
✅ Visual photo gallery & chef's specials
✅ Seamless VIP table reservation system

Feel free to check out the link above. We'd love to partner with ${lead.name} to deploy this for your official page!

Best regards,
Dhaka Dining Solutions`;
    }

    // Email
    return {
      subject: `Direct Online Ordering & Table Booking Demo for ${lead.name}`,
      body: `Hi ${lead.name} Team,

I hope this email finds you well.

We have been following the success of ${lead.name} in ${lead.area}, particularly the popularity of your ${lead.signatureDishName}.

Many premier restaurants in Dhaka lose 20% to 25% of their gross revenue to third-party delivery commission fees. To solve this, we built a custom, brand-tailored online ordering and table reservation portal specifically for ${lead.name}:

👉 Live Interactive Demo: ${url}

What this delivers for ${lead.name}:
1. 0% Commission Direct Orders: Customers order directly from your mobile-friendly menu.
2. Automated Table & VIP Hall Reservations: Eliminate lost bookings during peak dinner rushes.
3. Dhaka Neighborhood Delivery Routing: Custom delivery zones and fees for ${lead.area} and neighboring areas.
4. Seamless Payment Options: Cash on delivery, bKash, Nagad, and POS card terminal options.

You can explore your live demo at the link above. If you'd like to launch this for ${lead.name}, please reply to this email or call/WhatsApp us.

Warm regards,
Istiak | Restaurant Digital Partner
Contact: ${phoneClean}`,
    };
  }, [selectedLead, currentLeadUrl, channel, angle]);

  const copyToClipboard = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    }
  };

  const getEmailText = () => {
    if (typeof generatedMessage === 'object' && 'subject' in generatedMessage) {
      return `Subject: ${generatedMessage.subject}\n\n${generatedMessage.body}`;
    }
    return String(generatedMessage);
  };

  const getWhatsAppShareUrl = () => {
    const text = typeof generatedMessage === 'string' ? generatedMessage : getEmailText();
    const cleanPhone = getCleanPhone(selectedLead.phone);
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const getMailtoUrl = () => {
    if (typeof generatedMessage === 'object' && 'subject' in generatedMessage) {
      return `mailto:${selectedLead.email}?subject=${encodeURIComponent(
        generatedMessage.subject
      )}&body=${encodeURIComponent(generatedMessage.body)}`;
    }
    return `mailto:${selectedLead.email}?subject=${encodeURIComponent(
      `Direct Online Ordering for ${selectedLead.name}`
    )}&body=${encodeURIComponent(String(generatedMessage))}`;
  };

  // Filtered leads for search
  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) return ALL_RESTAURANTS;
    const q = searchQuery.toLowerCase();
    return ALL_RESTAURANTS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.bengaliName.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Bulk CSV/TSV copy for spreadsheet
  const copyBulkCsv = () => {
    const headers = ['Restaurant Name', 'Bengali Name', 'Area', 'Cuisine', 'Phone', 'Direct Lead URL', 'Facebook Page'];
    const rows = ALL_RESTAURANTS.map((r) => [
      `"${r.name}"`,
      `"${r.bengaliName}"`,
      `"${r.area}"`,
      `"${r.cuisine}"`,
      `"${r.phone.split('/')[0].trim()}"`,
      `"${getLeadUrl(r.id)}"`,
      `"${r.facebookUrl}"`,
    ]);
    const tsvContent = [headers.join('\t'), ...rows.map((row) => row.join('\t'))].join('\n');
    copyToClipboard(tsvContent, 'bulk_tsv');
  };

  // Bulk copy all messages
  const copyAllMessages = () => {
    const batch = ALL_RESTAURANTS.map((r) => {
      const url = getLeadUrl(r.id);
      return `----------------------------------------
LEAD: ${r.name} (${r.area})
URL: ${url}
PHONE: ${r.phone}
FB: ${r.facebookUrl}
----------------------------------------
আসসালামু আলাইকুম ${r.bengaliName} টিম!
আপনাদের ${r.areaBn} লোকেশনের জন্য আমরা একটি স্পেশাল ডাইরেক্ট অনলাইন অর্ডার ও টেবিল রিজার্ভেশন ডেমো সিস্টেম তৈরি করেছি:
${url}

ফুড অ্যাপের ২৫% কমিশন ছাড়াই গ্রাহকরা সরাসরি "${r.signatureDishName}" ও সিগনেচার খাবার অর্ডার করতে পারবেন। ডেমোটি দেখে আপনার মতামত জানালে খুশি হব!
`;
    }).join('\n\n');

    copyToClipboard(batch, 'all_messages');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-zinc-800 bg-zinc-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-bold text-white tracking-tight">
                  {lang === 'bn' ? 'লিড নির্দিষ্ট লিংক ও কোল্ড মেসেজ হাব' : 'Lead Specific URL & Cold Message Hub'}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  {ALL_RESTAURANTS.length} Verified Dhaka Leads
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {lang === 'bn'
                  ? 'প্রতিটি রেস্টুরেন্টের জন্য পারসোনালাইজড ডেমো লিংক ও সরাসরি পাঠানোর মতো কোল্ড পিচ মেসেজ'
                  : 'Generate lead-tailored direct URLs and high-converting cold outreach pitches instantly'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Single Lead vs Bulk Directory */}
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs">
              <button
                onClick={() => setActiveTab('single')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTab === 'single'
                    ? 'bg-amber-400 text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {lang === 'bn' ? 'একক লিড পিচ' : 'Lead Pitch'}
              </button>
              <button
                onClick={() => setActiveTab('bulk')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === 'bulk'
                    ? 'bg-amber-400 text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'সব লিংক তালিকা' : 'All URLs (Bulk)'}</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Single Lead Outreach Generator */}
        {activeTab === 'single' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Lead Selector Strip */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'bn' ? '১. টার্গেট রেস্টুরেন্ট লিড বেছে নিন:' : '1. Choose Target Restaurant Lead:'}</span>
                </span>
                <span className="text-[11px] text-zinc-500">
                  {selectedLead.name} ({selectedLead.area.split(',')[0]})
                </span>
              </div>

              {/* Horizontal Scrollable Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {ALL_RESTAURANTS.map((rest) => {
                  const isSelected = rest.id === selectedLead.id;
                  return (
                    <button
                      key={rest.id}
                      onClick={() => {
                        setSelectedLeadId(rest.id);
                        onSelectRestaurant(rest);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 text-left border ${
                        isSelected
                          ? 'bg-amber-400 text-zinc-950 font-bold border-amber-300 shadow-md ring-1 ring-amber-300'
                          : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="font-semibold truncate max-w-[170px]">
                        {lang === 'bn' ? rest.bengaliName : rest.name}
                      </div>
                      <div
                        className={`text-[10px] truncate max-w-[170px] ${
                          isSelected ? 'text-zinc-900 font-medium' : 'text-zinc-500'
                        }`}
                      >
                        {rest.area.split(',')[0]} · {rest.cuisine}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Lead Overview Card with Lead URL */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/90 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white font-serif">
                      {selectedLead.name}
                    </h3>
                    <span className="text-xs text-amber-400/90 font-medium">
                      ({selectedLead.bengaliName})
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {selectedLead.address}
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-zinc-500" />
                      {selectedLead.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={selectedLead.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20 transition-colors"
                  >
                    <span>Facebook Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Direct Personalized URL Box */}
              <div className="pt-2 border-t border-zinc-800/70">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
                  <span className="font-semibold text-amber-400 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'এই লিডের সরাসরি URL (লিংকে ক্লিক করলেই এই রেস্টুরেন্ট লোড হবে):' : 'Lead-Specific Direct URL (Instantly loads this restaurant):'}</span>
                  </span>
                  <span className="text-[11px] text-zinc-500 hidden sm:inline">
                    Parameter: <code className="text-zinc-400">?restaurant={selectedLead.id}</code>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 select-all overflow-x-auto truncate">
                    <span className="text-amber-400/70 select-none mr-1.5">🔗</span>
                    <span className="truncate">{currentLeadUrl}</span>
                  </div>

                  <button
                    onClick={() => copyToClipboard(currentLeadUrl, 'lead_url')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-lg transition-all cursor-pointer shrink-0 shadow-sm"
                    title="Copy direct lead URL"
                  >
                    {copiedKey === 'lead_url' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-zinc-950" />
                        <span>{lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'লিংক কপি করুন' : 'Copy URL'}</span>
                      </>
                    )}
                  </button>

                  <a
                    href={currentLeadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors shrink-0"
                    title="Test URL in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Cold Message Pitch Studio */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'bn' ? '২. কোল্ড মেসেজ চ্যানেল ও অ্যাঙ্গেল নির্বাচন করুন:' : '2. Select Outreach Channel & Pitch Angle:'}</span>
                </span>

                {/* Channel Selector */}
                <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-lg text-xs">
                  <button
                    onClick={() => setChannel('whatsapp')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      channel === 'whatsapp'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => setChannel('bangla')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      channel === 'bangla'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>🇧🇩 বাংলা পিচ</span>
                  </button>

                  <button
                    onClick={() => setChannel('facebook')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      channel === 'facebook'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>FB / IG DM</span>
                  </button>

                  <button
                    onClick={() => setChannel('email')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      channel === 'email'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-purple-400" />
                    <span>Email</span>
                  </button>
                </div>
              </div>

              {/* Pitch Angle Pill Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[11px] text-zinc-500">
                  {lang === 'bn' ? 'পিচের মূল বিষয়:' : 'Pitch Focus:'}
                </span>

                <button
                  onClick={() => setAngle('commissions')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    angle === 'commissions'
                      ? 'bg-zinc-100 text-zinc-950 font-bold shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  <Flame className="w-3 h-3 text-amber-500" />
                  <span>{lang === 'bn' ? '০% ফুড ডেলিভারি কমিশন সেভিং' : '0% Aggregator Commission Savings'}</span>
                </button>

                <button
                  onClick={() => setAngle('reservations')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    angle === 'reservations'
                      ? 'bg-zinc-100 text-zinc-950 font-bold shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  <Utensils className="w-3 h-3 text-amber-500" />
                  <span>{lang === 'bn' ? 'ভিআইপি ও টেবিল বুকিং বৃদ্ধি' : 'VIP Table & Banquet Bookings'}</span>
                </button>

                <button
                  onClick={() => setAngle('full')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    angle === 'full'
                      ? 'bg-zinc-100 text-zinc-950 font-bold shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{lang === 'bn' ? 'সম্পূর্ণ ডিজিটাল ট্রান্সফর্মেশন' : 'Complete Digital Experience'}</span>
                </button>
              </div>

              {/* Message Box */}
              <div className="relative rounded-xl border border-zinc-800 bg-zinc-900/90 overflow-hidden">
                {/* Message Header bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-xs">
                  <div className="flex items-center gap-2 text-zinc-300 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>
                      {channel === 'bangla' && 'বাংলা কোল্ড মেসেজ টেমপ্লেট'}
                      {channel === 'whatsapp' && 'WhatsApp / SMS Pitch Ready to Send'}
                      {channel === 'facebook' && 'Facebook Page Inbox / DM Script'}
                      {channel === 'email' && 'Email Pitch (Subject + Body)'}
                    </span>
                  </div>

                  <span className="text-[11px] text-zinc-500">
                    Includes dynamic lead URL & signature item
                  </span>
                </div>

                {/* Message Content */}
                <div className="p-4">
                  {typeof generatedMessage === 'object' && 'subject' in generatedMessage ? (
                    <div className="space-y-3 font-sans text-xs">
                      <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                        <span className="text-zinc-500 font-semibold block text-[11px] uppercase">
                          Subject Line:
                        </span>
                        <p className="text-zinc-100 font-medium mt-0.5 select-all">
                          {generatedMessage.subject}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 whitespace-pre-wrap font-mono text-zinc-200 text-xs leading-relaxed max-h-56 overflow-y-auto select-all">
                        {generatedMessage.body}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800/90 whitespace-pre-wrap font-sans text-xs leading-relaxed text-zinc-100 max-h-64 overflow-y-auto select-all">
                      {String(generatedMessage)}
                    </div>
                  )}
                </div>

                {/* Message Action Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-zinc-900/90 border-t border-zinc-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(getEmailText(), 'message_text')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-lg transition-all cursor-pointer shadow-sm"
                    >
                      {copiedKey === 'message_text' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-zinc-950" />
                          <span>{lang === 'bn' ? 'মেসেজ কপি হয়েছে!' : 'Message Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'মেসেজ কপি করুন' : 'Copy Pitch Message'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => copyToClipboard(currentLeadUrl, 'footer_lead_url')}
                      className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      {copiedKey === 'footer_lead_url' ? (
                        <span className="text-emerald-400">URL Copied!</span>
                      ) : (
                        <span>Copy URL Only</span>
                      )}
                    </button>
                  </div>

                  {/* Direct Launch buttons */}
                  <div className="flex items-center gap-2">
                    {/* WhatsApp direct trigger */}
                    <a
                      href={getWhatsAppShareUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
                      title="Open WhatsApp with message pre-filled"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে পাঠান' : 'Open in WhatsApp'}</span>
                      <Send className="w-3 h-3 ml-0.5" />
                    </a>

                    {/* Facebook trigger */}
                    <a
                      href={selectedLead.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg transition-colors"
                      title="Open Facebook Page to send DM"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    {/* Email trigger */}
                    {selectedLead.email && (
                      <a
                        href={getMailtoUrl()}
                        className="p-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-lg transition-colors"
                        title="Open Mail Client"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Outreach Pro-Tips Box */}
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-amber-300">
                  {lang === 'bn' ? '💡 ঢাকার রেস্টুরেন্ট কোল্ড আউটরিচের কার্যকারী টিপস:' : '💡 Dhaka Restaurant Outreach Tips:'}
                </span>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  {lang === 'bn'
                    ? '১. বিকেল ৩টা থেকে ৫:৩০টার মধ্যে (লাঞ্চ ও ডিনার শিফটের মাঝামাঝি সময়ে) রেস্টুরেন্ট ম্যানেজার বা ওনাররা সবচেয়ে বেশি ফ্রি থাকেন। ২. সরাসরি তাদের নির্দিষ্ট ডেমো লিংক পাঠালে তারা দেখতে পাবেন তাদের নিজস্ব সিগনেচার খাবার ও ঠিকানা অলরেডি সাজানো রয়েছে, যা কনভার্সন রেট ৩ গুণ বাড়িয়ে দেয়।'
                    : '1. Message restaurant decision-makers between 3:00 PM – 5:30 PM (between lunch & dinner services). 2. Always send their personalized URL so they immediately see their own restaurant name, address, and signature dish in action.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Bulk Directory & Spreadsheet Export */}
        {activeTab === 'bulk' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Search & Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'bn' ? 'রেস্টুরেন্টের নাম, এলাকা বা কিউজিন খুঁজুন...' : 'Search restaurant name, area or cuisine...'}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyBulkCsv}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs rounded-lg transition-colors cursor-pointer border border-zinc-700"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {copiedKey === 'bulk_tsv' ? 'কপি হয়েছে (Google Sheets / Excel)!' : 'Copy All as Spreadsheet (TSV)'}
                  </span>
                </button>

                <button
                  onClick={copyAllMessages}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5 text-zinc-950" />
                  <span>
                    {copiedKey === 'all_messages' ? 'সকল মেসেজ কপি হয়েছে!' : 'Copy All 9 Pitches'}
                  </span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="px-4 py-3">Restaurant</th>
                      <th className="px-4 py-3">Area & Cuisine</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Direct URL</th>
                      <th className="px-4 py-3 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80">
                    {filteredLeads.map((lead) => {
                      const url = getLeadUrl(lead.id);
                      return (
                        <tr key={lead.id} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-white">
                              {lead.name}
                            </div>
                            <div className="text-[11px] text-zinc-400">
                              {lead.bengaliName}
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="text-zinc-200">
                              {lead.area}
                            </div>
                            <div className="text-[10px] text-amber-400/80">
                              {lead.cuisine}
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="text-zinc-300 font-mono text-[11px]">
                              {lead.phone.split('/')[0]}
                            </div>
                            {lead.facebookUrl && (
                              <a
                                href={lead.facebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-blue-400 hover:underline inline-flex items-center gap-0.5 mt-0.5"
                              >
                                <span>Facebook</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </td>

                          <td className="px-4 py-3 max-w-[200px]">
                            <div className="font-mono text-[11px] text-amber-400/90 truncate bg-zinc-950 px-2 py-1 rounded border border-zinc-800 select-all">
                              ?restaurant={lead.id}
                            </div>
                          </td>

                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => copyToClipboard(url, `url_${lead.id}`)}
                                className="px-2.5 py-1 text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded transition-colors cursor-pointer"
                                title="Copy direct link"
                              >
                                {copiedKey === `url_${lead.id}` ? (
                                  <span className="text-emerald-400 font-bold">Copied!</span>
                                ) : (
                                  <span>Copy URL</span>
                                )}
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedLeadId(lead.id);
                                  onSelectRestaurant(lead);
                                  setActiveTab('single');
                                }}
                                className="px-2.5 py-1 text-[11px] font-semibold bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded transition-colors cursor-pointer"
                              >
                                Get Pitch
                              </button>

                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-zinc-400 hover:text-white"
                                title="Open preview"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Footer info bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-zinc-900 border-t border-zinc-800 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              {lang === 'bn'
                ? `বর্তমান সক্রিয় লিড: ${selectedLead.name} (${selectedLead.area})`
                : `Currently active demo: ${selectedLead.name} (${selectedLead.area})`}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors cursor-pointer text-xs font-semibold"
          >
            {lang === 'bn' ? 'সম্পন্ন' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
