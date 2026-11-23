import { motion } from 'motion/react';
import {
  Download,
  Smartphone,
  ShieldCheck,
  Zap,
  Star,
  Package,
  Gift,
  IndianRupee,
  Users,
  Truck,
  Store,
  PhoneCall,
  Sparkles,
  MapPin,
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
    badge: 'पहला फायदा · सीधी बचत',
    badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    icon: IndianRupee,
    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    borderClass: 'border-emerald-200 dark:border-emerald-800/40 hover:border-emerald-400',
    title: 'हर जगह से सस्ता सामान और सीधी बचत',
    highlight: 'बाज़ार और अन्य ऐप्स से कम रेट',
    desc: 'Quicko की अभी शुरुआत है इसलिए अभी इसपर सारा सामान उपलब्ध नहीं है। लेकिन जो भी सामान अभी उपलब्ध है वह हर जगह से सस्ता है। जो सामान अभी है उसे खरीदकर आप अपने पैसे बचा सकते हैं — ये आपका पहला फायदा है।',
  },
  {
    number: '2',
    badge: 'दूसरा फायदा · फ्री गिफ्ट',
    badgeClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
    icon: Gift,
    iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    borderClass: 'border-rose-200 dark:border-rose-800/40 hover:border-rose-400',
    title: 'हर खरीद पर फ्री गिफ्ट',
    highlight: 'हर आर्डर पर आकर्षक गिफ्ट FREE',
    desc: 'आप जितने का भी सामान Quicko से खरीदते हैं, आपको हर बार फ्री गिफ्ट मिलेगा। हर आर्डर के साथ फ्री गिफ्ट बिल्कुल मुफ्त दिया जाता है।',
  },
  {
    number: '3',
    badge: 'कमाई का मौका · इनकम',
    badgeClass: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
    icon: Users,
    iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    borderClass: 'border-blue-200 dark:border-blue-800/40 hover:border-blue-400',
    title: 'रेफरल और मल्टी-लेवल इनकम',
    highlight: 'वॉलेट से शॉपिंग करें या सीधे बैंक में लें',
    desc: 'अगर आप अपने किसी जानकार को Quicko के बारे में बताते हैं और उसे अपने रेफर लिंक से Quicko जॉइन कराते हैं, तो उसकी हर खरीदारी से आपको कुछ % कमीशन आपके वॉलेट में मिलेगा जिसे आप जब चाहें अपनी शॉपिंग में यूज़ कर सकते हैं या फिर बैंक अकाउंट में भी ले सकते हैं। ये कमीशन आपके डाउन में कई लेवल से आएगा।',
    extraNote: 'लेवल इनकम की विस्तृत जानकारी के लिए आप हमें नीचे दिए गए नंबर पर कॉल कर सकते हैं।',
    phone: '9873294297',
  },
  {
    number: '4',
    badge: 'पारदर्शी नियम · डिलीवरी',
    badgeClass: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20',
    icon: Truck,
    iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    borderClass: 'border-amber-200 dark:border-amber-800/40 hover:border-amber-400',
    title: 'कोई मिनिमम आर्डर लिमिट नहीं · ₹50 डिलीवरी चार्ज',
    highlight: 'चाहे ₹10 का सामान मंगाएं या ₹1000 का',
    desc: 'Quicko में मिनिमम आर्डर वैल्यू कुछ नहीं है। आप चाहे ₹10 का सामान मंगाये या ₹1000 का, ₹50 डिलीवरी चार्ज देना अनिवार्य रहेगा। जिनको ये लगता है कि दूसरी ऐप फ्री में डिलीवरी करती हैं, वो ये जान लें कि वो डिलीवरी करने वाले को अपनी जेब से नहीं देते। वो पहले ही आपसे इतना कमा लेते हैं कि डिलीवरी बॉय को दे सकें।',
  },
  {
    number: '5',
    badge: 'सेल्फ पिकअप · ₹0 डिलीवरी',
    badgeClass: 'bg-teal-500/10 text-teal-800 dark:text-teal-300 border-teal-500/20',
    icon: Store,
    iconBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    borderClass: 'border-teal-200 dark:border-teal-800/40 hover:border-teal-400',
    title: 'दुकान पर आकर खुद सामान ले सकते हैं',
    highlight: 'डिलीवरी चार्ज की पूरी बचत',
    desc: 'जो लोग घर पर सामान की डिलीवरी नहीं चाहते या डिलीवरी चार्ज बचाना चाहते हैं, वो सीधे हमारी दुकान पर आकर भी सामान ले सकते हैं।',
    address: 'सरकारी स्कूल के पास, फूपा हलवाई की पुरानी दुकान के बगल में।',
  },
  {
    number: '6',
    badge: 'हमारा विज़न · ऑल-इन-वन',
    badgeClass: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
    icon: Sparkles,
    iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    borderClass: 'border-purple-200 dark:border-purple-800/40 hover:border-purple-400',
    title: 'सभी सुविधाएं एक ही प्लेटफॉर्म पर',
    highlight: 'कम रेट, गिफ्ट और इनकम हमेशा',
    desc: 'Quicko को इस तरह से डिज़ाइन किया गया है जिससे आपको धीरे-धीरे बाकी सभी ऐप्स वाली सुविधा एक ही प्लेटफार्म पर मिल सके। हर चीज और हर सुविधा बाकी जगह से कम रेट पर और हर चीज पर गिफ्ट और इनकम हमेशा मिलती रहेगी।',
  },
  {
    number: '7',
    badge: 'बिजनेस पार्टनर · सेलर सपोर्ट',
    badgeClass: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20',
    icon: PhoneCall,
    iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    borderClass: 'border-indigo-200 dark:border-indigo-800/40 hover:border-indigo-400',
    title: 'Quicko पर अपना सामान या सेवा बेचें',
    highlight: 'दुकानदार एवं सेलर तुरंत संपर्क करें',
    desc: 'यदि कोई हमारे साथ जुड़कर अपना कोई भी सामान या कोई भी सुविधा हमारे प्लेटफार्म पर बेचना चाहते हैं, तो हमसे तुरंत सम्पर्क कर सकते हैं।',
    phone: '9873294297',
  },
];

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Browse thousands of products and book services in seconds.',
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
    desc: 'App-only offers, flash sales, and early access to new arrivals.',
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
          <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/30 bg-gradient-to-b from-amber-50/70 via-background to-teal-50/40 dark:from-amber-950/20 dark:via-background dark:to-teal-950/20 shadow-xl p-6 sm:p-10 mb-10">
            {/* Top Badge & Download Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                <AlertCircle size={16} className="text-amber-600 dark:text-amber-400" />
                महत्वपूर्ण सूचना · Important Notice
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

            {/* Heading & Greeting */}
            <div className="space-y-4 text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                नमस्कार 🙏 दोस्तों! <span className="text-primary">{shop.name}</span> में आपका स्वागत है।
              </h2>
              <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-amber-200/60 dark:border-amber-800/30 text-foreground/90 text-base sm:text-lg leading-relaxed shadow-sm">
                <p>
                  हमारे घरों में जो सामान डेली यूज़ होता है, क्या आप उस पर होने वाले खर्चे को थोड़ा कम करना चाहते हैं? 
                  और साथ में थोड़ी <strong>इनकम (Income)</strong> भी? तो कृपया एक बार <strong>Quicko</strong> को मौका दीजिये। 
                  Quicko कोशिश करेगा आपको ये दोनों सुविधाएं प्रोवाइड कराने की।
                </p>
                <p className="mt-3 text-sm sm:text-base text-muted-foreground">
                  बाकी ऐप्स को देखते हुए <strong>Quicko</strong> को कुछ अलग तरह से डिजाइन किया गया है ताकि हर ग्राहक को सीधी बचत, हर खरीद पर गिफ्ट और लाइफटाइम रेफरल इनकम मिल सके।
                </p>
              </div>
            </div>

            {/* Clear Points Grid */}
            <div className="mt-8 space-y-4 sm:space-y-5 text-left">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <CheckCircle2 size={20} className="text-primary" />
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  Quicko से जुड़ने के मुख्य नियम एवं फायदे:
                </h3>
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
                          <h4 className="font-bold text-foreground text-base sm:text-lg leading-snug pt-1">
                            {item.title}
                          </h4>
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

                        {/* Address Box (Point 5) */}
                        {item.address && (
                          <div className="mt-3.5 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs sm:text-sm font-medium flex items-start gap-2">
                            <MapPin size={18} className="shrink-0 text-teal-600 mt-0.5" />
                            <span>
                              <strong>दुकान का पता:</strong> {item.address}
                            </span>
                          </div>
                        )}

                        {/* Extra note (Point 3) */}
                        {item.extraNote && (
                          <p className="mt-3 text-xs text-muted-foreground font-medium">
                            ℹ️ {item.extraNote}
                          </p>
                        )}
                      </div>

                      {/* Phone / Call Button (Points 3 & 7) */}
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
            <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-emerald-500/10 to-teal-500/10 border border-primary/20 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mb-3">
                <HeartHandshake size={24} />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-foreground">
                आशा करते हैं आप हमारे साथ जुड़कर Quicko को घर-घर तक पहुंचाने में हमारी मदद करेंगे।
              </h4>
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
          Why use the app?
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
          <h2 className="text-2xl font-bold text-foreground mb-6">How to install</h2>
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
