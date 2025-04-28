// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Language resources (add as many languages as needed)
const resources = {
  en: {
    translation: {
      welcome: 'Welcome to Your Ultimate Football Experience',
      description: 'Book your time slots, manage your profile, and access exclusive features.',
      whyChooseUs: 'Why Choose Us?',
      realTimeAvailability: 'Real-Time Availability',
      realTimeDesc: 'Check live availability and easily book your preferred time slot for football matches.',
      playerProfiles: 'Detailed Player Profiles',
      profilesDesc: 'Track your performance with win/loss stats, favorite positions, and more to improve your game.',
      easyPayment: 'Easy Payment System',
      paymentDesc: 'With our easy-to-use payment system, you can recharge credits or buy special offers in just a few clicks.',
      experience: 'Experience the Stadium',
      testimonials: 'What Players Are Saying',
      readyToPlay: 'Ready to Play?',
      joinUs: 'Join us today and start booking your matches instantly.'
    }
  },
  ar: {
    translation: {
      welcome: 'مرحبًا بك في تجربتك الكروية النهائية',
      description: 'احجز وقتك، إدارة ملفك الشخصي، والوصول إلى المزايا الحصرية.',
      whyChooseUs: 'لماذا تختارنا؟',
      realTimeAvailability: 'توفر في الوقت الفعلي',
      realTimeDesc: 'تحقق من التوفر الحي و احجز وقتك المفضل لمباريات كرة القدم بسهولة.',
      playerProfiles: 'ملفات اللاعب التفصيلية',
      profilesDesc: 'تابع أدائك مع إحصائيات الفوز/الخسارة، المواقع المفضلة، والمزيد لتحسين لعبك.',
      easyPayment: 'نظام الدفع السهل',
      paymentDesc: 'مع نظام الدفع السهل لدينا، يمكنك إعادة شحن الرصيد أو شراء العروض الخاصة بنقرات قليلة.',
      experience: 'اكتشف الملعب',
      testimonials: 'ماذا يقول اللاعبون؟',
      readyToPlay: 'هل أنت مستعد للعب؟',
      joinUs: 'انضم إلينا اليوم وابدأ في حجز مبارياتك فوراً.'
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default language
  fallbackLng: 'en', // Fallback language
  interpolation: {
    escapeValue: false // React already does escaping
  }
});

export default i18n;
