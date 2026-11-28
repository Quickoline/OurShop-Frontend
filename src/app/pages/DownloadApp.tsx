import { motion } from 'motion/react';
import {
  Download,
  ShieldCheck,
  Zap,
  Star,
  Package,
  Gift,
  IndianRupee,
  Users,
  Truck,
  PhoneCall,
  Sparkles,
  AlertCircle,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { shop } from '../config/shop';

const APP_DOWNLOAD_URL =
  'https://drive.google.com/file/d/1__K3DeD2GWLLxPM-yBueM9AxhPfxAp6e/view?usp=sharing';

const noticePoints = [
  {
    number: '1',
    badge: 'पहला फायदा · सीधी बचत व फ्री गिफ्ट',
    badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    icon: Gift,
    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    borderClass: 'border-emerald-200 dark:border-emerald-800/40 hover:border-emerald-400',
    title: 'हर जगह से सस्ता सामान और फ्री गिफ्ट',
    highlight: 'हर शॉपिंग पर कुछ फ्री गिफ्ट भी मिलेगा',
    desc: 'फिलहाल जो भी सामान हमारे पास उपलब्ध है उसको हर जगह से सस्ता देने की कोसिस की गई है। साथ ही हर शॉपिंग पर कुछ फ्री गिफ्ट भी दिया जायेगा।',
  },
  {
    number: '2',
    badge: 'अनोखा सिस्टम · 6 लेवल रियल कैश',
    badgeClass: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
    icon: Users,
    iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    borderClass: 'border-blue-200 dark:border-blue-800/40 hover:border-blue-400',
    title: '6 लेवल तक रियल कैश इनकम',
    highlight: 'शॉपिंग करें या सीधे बैंक अकाउंट में लें',
    desc: 'Quicko मे जो सिस्टम लगवाया गया है वो अभी बाकि किसी ऐप मे नहीं है। उन ऐपस मे किसी को रेफर करने पर कुछ रिवार्ड कुपन आदि मिलते हैं जो सायेद ही किसी के काम आते होंगे। लेकिन Quicko मे अगर आप किसी को रेफर करते हैं तो उसकी शॉपिंग से आपको रियल कैस इनकम मिलती है। आपकी इनकम आपको ऐप के अंदर वॉलेट मे दिखती रहेगी। जिससे आप शॉपिंग भी कर सकते हैं, या फिर चाहें तो बैंक अकाउंट मे भी ले सकते हैं। ये इनकम कई लेवल तक मिलती है। यानि जिसको आपने Quicko जोइन कराया है वो भी अगर किसी को जोइन कराता है तो वहाँ से भी आपको इनकम आएगी। ऐसे टोटल 6 लेवल से आपको इनकम आएगी। आपकी टीम मे कोई भी किसी भी लेवल पर कोई भी सामान या सर्विस लेता है तो आपको हमेशा इनकम आती रहेगी। जितने जादा लोगों को आप रेफर करेंगे, उतनी जादा आपकी इनकम होगी।',
    extraNote: '6 लेवल इनकम की पूरी जानकारी के लिए 9873294297 पर कॉल कर सकते हैं।',
    phone: '9873294297',
  },
  {
    number: '3',
    badge: 'होम डिलीवरी · स्पष्ट नियम',
    badgeClass: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20',
    icon: Truck,
    iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    borderClass: 'border-amber-200 dark:border-amber-800/40 hover:border-amber-400',
    title: 'कम से कम ₹500 का आर्डर लगाना अनिवार्य',
    highlight: 'कम का आर्डर करने पर ₹50 डिलीवरी चार्ज',
    desc: 'अब बात करते हैं होम डिलीवरी की। डिलीवरी बोय को डिलीवरी चार्ज देने के लिए इतनी कमाई होनी जरूरी है जिससे उसको उसका किराया दिया जा सके। इसलिए कम से कम 500 रूपये का आर्डर लगाना अनिवार्य है। इससे कम का आर्डर करने पर 50 रूपये डिलीवरी चार्ज लगेगा।',
  },
  {
    number: '4',
    badge: 'महत्वपूर्ण सूचना · सेलर / सर्विस पार्टनर',
    badgeClass: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20',
    icon: PhoneCall,
    iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    borderClass: 'border-indigo-200 dark:border-indigo-800/40 hover:border-indigo-400',
    title: 'Quicko पर अपना सामान या सर्विस बेचें',
    highlight: 'दुकानदार एवं सेलर तुरंत संपर्क करें',
    desc: 'महत्वपूर्ण सूचना :- यदि कोई भी हमारे साथ जुड़कर अपना कोई भी सामान या सर्विस Quicko पर बेचना चाहते हैं तो 9873294297 पर सम्पर्क कर सकते हैं।',
    phone: '9873294297',
  },
];

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Browse groceries and book trusted local services in seconds.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Private',
    desc: 'Your data is encrypted and never shared with third parties.',
  },
  {
    icon: Package,
    title: 'Order Tracking',
    desc: 'Real-time updates from checkout to doorstep delivery.',
  },
  {
    icon: Star,
    title: 'Exclusive Deals',
    desc: 'App-only offers, free gifts with every order, and referral income.',
  },
];

export function DownloadApp() {
  return (
    <main className="min-h-screen bg-background pt-24 sm:pt-28 pb-16">
      {/* IMPORTANT NOTICE SECTION (Hindi Points) */}
      <section
        id="important-notice"
        className="container mx-auto px-4 sm:px-6 py-6 sm:py-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          {/* Main Notice Banner Card */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/30 bg-gradient-to-b from-amber-50/80 via-background to-teal-50/40 dark:from-amber-950/20 dark:via-background dark:to-teal-950/20 shadow-xl p-6 sm:p-10 mb-10">
            {/* Top Badge & Download Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                <AlertCircle size={16} className="text-amber-600 dark:text-amber-400" />
                महत्वपूर्ण सूचना · Important Information
              </span>
              <a
                href={APP_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold shadow-md hover:bg-primary/90 transition-all"
              >
                <Download size={16} />
                Download Quicko APK
              </a>
            </div>

            {/* Official Complete Message Letter Box */}
            <div className="space-y-4 text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                नमस्कार 🙏 दोस्तों। <span className="text-primary">{shop.name}</span> मे आपका स्वागत है।
              </h1>

              {/* Complete Message Box */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white/95 dark:bg-slate-900/95 border-2 border-amber-300 dark:border-amber-700/50 shadow-md space-y-4 text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-100">
                <p>
                  जैसा की आप जानते हैं, आज के समय मे हर कोई ऑनलाइन शॉपिंग की और आकर्षित हो रहा है। क्युकी इनके द्वारा पैसे और समय दोनों की ही बचत होती है।
                </p>
                <p>
                  चाहे किसी सामान की शॉपिंग हो या किसी सर्विस की। हर तरह की शॉपिंग के लिए कई ऐप्स आज मार्किट मे उपलब्ध हैं। उन ऐप्स को देखते हुए <strong>Quicko</strong> को कुछ अलग तरह से डिजाइन किया गया है।
                </p>
                <p>
                  इसकी अभी शुरुआत है इसलिए अभी यहां पर एक घर की जरूरत का सारा सामान और बाकि ऐप्स वाली सारी सुविधा उपलब्ध नहीं है। लेकिन हमारी कोसिस रहेगी जल्दी से जल्दी वो सारी सुविधाएं इसपर उपलब्ध कराने की।
                </p>
                <p className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-medium">
                  🌱 <em>Quicko अभी हर तरह से परिपूर्ण नहीं है। ये एक छोटा पौधा है जिसे बड़ा करने के लिए हमें आप सभी के साथ की जरूरत है।</em>
                </p>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <p className="font-semibold text-foreground">
                    🎁 <strong>सस्ता सामान &amp; फ्री गिफ्ट:</strong> फिलहाल जो भी सामान हमारे पास उपलब्ध है उसको हर जगह से सस्ता देने की कोसिस की गई है। साथ ही हर शॉपिंग पर कुछ फ्री गिफ्ट भी दिया जायेगा।
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 space-y-2">
                  <p className="font-semibold text-sky-950 dark:text-sky-200">
                    💰 <strong>अनोखा सिस्टम &amp; 6-लेवल रियल कैश रेफरल इनकम:</strong> इसके अलावा Quicko मे जो सिस्टम लगवाया गया है वो अभी बाकि किसी ऐप मे नहीं है। उन ऐपस मे किसी को रेफर करने पर कुछ रिवार्ड कुपन आदि मिलते हैं जो सायेद ही किसी के काम आते होंगे।
                  </p>
                  <p className="text-sm sm:text-base text-sky-900 dark:text-sky-200 leading-relaxed">
                    लेकिन Quicko मे अगर आप किसी को रेफर करते हैं तो उसकी शॉपिंग से आपको <strong>रियल कैस इनकम</strong> मिलती है। आपकी इनकम आपको ऐप के अंदर वॉलेट मे दिखती रहेगी। जिससे आप शॉपिंग भी कर सकते हैं, या फिर चाहें तो <strong>बैंक अकाउंट मे भी ले सकते हैं</strong>। ये इनकम कई लेवल तक मिलती है। यानि जिसको आपने Quicko जोइन कराया है वो भी अगर किसी को जोइन कराता है तो वहाँ से भी आपको इनकम आएगी। <strong>ऐसे टोटल 6 लेवल से आपको इनकम आएगी।</strong> आपकी टीम मे कोई भी किसी भी लेवल पर कोई भी सामान या सर्विस लेता है तो आपको हमेशा इनकम आती रहेगी। जितने जादा लोगों को आप रेफर करेंगे, उतनी जादा आपकी इनकम होगी।
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
                  <p className="font-semibold text-amber-950 dark:text-amber-200">
                    🚚 <strong>होम डिलीवरी नियम:</strong> अब बात करते हैं होम डिलीवरी की। डिलीवरी बोय को डिलीवरी चार्ज देने के लिए इतनी कमाई होनी जरूरी है जिससे उसको उसका किराया दिया जा सके। <strong>इसलिए कम से कम 500 रूपये का आर्डर लगाना अनिवार्य है।</strong> इससे कम का आर्डर करने पर <strong>50 रूपये डिलीवरी चार्ज</strong> लगेगा।
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 flex flex-wrap items-center justify-between gap-3">
                  <p className="font-bold text-indigo-950 dark:text-indigo-200">
                    📢 <strong>महत्वपूर्ण सूचना :-</strong> यदि कोई भी हमारे साथ जुड़कर अपना कोई भी सामान या सर्विस Quicko पर बेचना चाहते हैं तो <a href="tel:9873294297" className="underline font-extrabold text-indigo-700 dark:text-indigo-400">9873294297</a> पर सम्पर्क कर सकते हैं।
                  </p>
                  <a
                    href="tel:9873294297"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    <PhoneCall size={14} />
                    कॉल करें: 9873294297
                  </a>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <p className="font-medium text-slate-700 dark:text-slate-300">
                    आशा करते हैं आप हमारे साथ जुड़कर Quicko को घर घर तक पहुंचाने मे हमारी मदद करेंगे।
                  </p>
                  <p className="font-bold text-primary text-xl shrink-0">
                    धन्यवाद 🙏
                  </p>
                </div>
              </div>
            </div>

            {/* Clear Points Grid */}
            <div className="mt-10 space-y-4 sm:space-y-5 text-left">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <CheckCircle2 size={20} className="text-primary" />
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  Quicko मुख्य नियम एवं विशेषताएं (Overview):
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
                {noticePoints.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.number}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                      className={`relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border ${item.borderClass} shadow-sm transition-all`}
                    >
                      <div>
                        {/* Top Row: Number & Badge */}
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${item.badgeClass}`}>
                            {item.badge}
                          </span>
                          <span className="w-7 h-7 rounded-full bg-secondary text-foreground text-xs font-bold flex items-center justify-center border border-border">
                            #{item.number}
                          </span>
                        </div>

                        {/* Title & Icon */}
                        <div className="flex items-start gap-3 mb-2.5">
                          <div className={`shrink-0 w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center`}>
                            <Icon size={20} />
                          </div>
                          <h3 className="font-bold text-foreground text-base sm:text-lg leading-snug pt-1">
                            {item.title}
                          </h3>
                        </div>

                        {/* Highlight Pill */}
                        {item.highlight && (
                          <div className="mb-3 inline-block">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-secondary/80 text-foreground border border-border">
                              ✓ {item.highlight}
                            </span>
                          </div>
                        )}

                        {/* Description */}
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {item.desc}
                        </p>

                        {/* Extra note */}
                        {item.extraNote && (
                          <p className="mt-3 text-xs text-muted-foreground font-medium">
                            ℹ️ {item.extraNote}
                          </p>
                        )}
                      </div>

                      {/* Phone / Call Button */}
                      {item.phone && (
                        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
                          <span className="text-xs text-muted-foreground font-medium">
                            सम्पर्क सूत्र:
                          </span>
                          <a
                            href={`tel:${item.phone}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-sm"
                          >
                            <PhoneCall size={14} />
                            {item.phone} पर कॉल करें
                          </a>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Gratitude & Closing Note */}
            <div className="mt-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-emerald-500/10 to-teal-500/10 border border-primary/20 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mb-3">
                <HeartHandshake size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                आशा करते हैं आप हमारे साथ जुड़कर Quicko को घर घर तक पहुंचाने मे हमारी मदद करेंगे।
              </h3>
              <p className="mt-2 text-sm text-muted-foreground font-medium">
                धन्यवाद 🙏 — <strong>टीम {shop.name}</strong>
              </p>

              {/* Bottom CTA Button */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={APP_DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground font-bold text-base px-8 py-3 rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
                >
                  <Download size={18} />
                  Quicko ऐप डाउनलोड करें (APK)
                </a>
                <a
                  href="tel:9873294297"
                  className="inline-flex items-center gap-2 border border-border bg-white dark:bg-slate-900 text-foreground font-semibold text-sm px-6 py-3 rounded-xl hover:bg-secondary transition-all"
                >
                  <PhoneCall size={16} className="text-primary" />
                  हेल्पलाइन: 9873294297
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-border/50">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-12">
          Why use Quicko?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-border shadow-sm p-6 flex flex-col gap-3"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Icon size={20} />
              </div>
              <p className="font-bold text-foreground">{title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Install Instructions */}
      <section className="bg-secondary/50 border-y border-border py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-6">How to install Quicko App</h2>
          <ol className="text-left space-y-4 text-sm text-foreground">
            {[
              'Tap "Download APK" above to save the file to your Android device.',
              'Open your device Settings → Security → enable "Install from unknown sources" (or "Allow this source" when prompted).',
              'Locate the downloaded file in your Downloads folder and tap it to install.',
              'Open the app, sign in with your existing account, and start shopping!',
            ].map((step, i) => (
              <li key={i} className="flex gap-4 items-start bg-white dark:bg-slate-900 rounded-xl border border-border p-4">
                <span className="shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>

          {/* CTA again */}
          <a
            href={APP_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
          >
            <Download size={18} />
            Download Now — It's Free
          </a>
        </div>
      </section>

      {/* Back to home */}
      <div className="container mx-auto px-4 py-10 text-center">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          ← Back to {shop.name}
        </Link>
      </div>
    </main>
  );
}