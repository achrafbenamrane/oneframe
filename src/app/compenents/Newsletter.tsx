'use client';

import React, { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Phone } from "lucide-react";
import { useI18n } from './LanguageProvider';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const Newsletter = () => {
  const { lang } = useI18n();
  const [phoneError, setPhoneError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^(0)(5|6|7)[0-9]{8}$/;
    if (!phone) {
      return lang === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required';
    }
    if (!phone.startsWith('0')) {
      return lang === 'ar' ? 'يجب أن يبدأ رقم الهاتف بـ 0' : 'Phone number must start with 0';
    }
    if (!/^0[567]/.test(phone)) {
      return lang === 'ar' ? 'يجب أن يكون الرقم الثاني 5 أو 6 أو 7' : 'Second digit must be 5, 6, or 7';
    }
    if (phone.length !== 10) {
      return lang === 'ar' ? 'يجب أن يتكون رقم الهاتف من 10 أرقام' : 'Phone number must be exactly 10 digits';
    }
    if (!phoneRegex.test(phone)) {
      return lang === 'ar' ? 'رقم الهاتف غير صالح' : 'Invalid phone number format';
    }
    return '';
  };

  const translations = {
    heading: {
      en: "Personalise Your 3D Experience and Be The Only One Algerian owner",
      ar: "خصص تجربتك ثلاثية الأبعاد وكن المالك الجزائري الوحيد"
    },
    subheading: {
      en: "Create your own frame by leaving your phone number and we'll contact you as soon as possible",
      ar: "قم بانشاء اطارك الخاص عبر ترك رقم  هاتفك و سنراسلك في أقرب وقت ممكن"
    },
    emailPlaceholder: {
      en: "Your Phone Number",
      ar: "رقم هاتفك"
    },
    button: {
      en: "Get Notified",
      ar: "اشترك الآن"
    },
    joinedText: {
      en: "joined already",
      ar: "مشترك حالياً"
    }
  };

  return (
    <div className="relative w-full mb-8 py-8 sm:py-12 md:py-16 flex items-center justify-center overflow-hidden p-3 sm:p-4 bg-white/80 dark:bg-[url(/emailbg.jpg)] bg-cover bg-center dark:bg-cover dark:bg-center backdrop-blur-sm transition-colors duration-300">
      <motion.div
        className={`relative z-10 container mx-auto text-center max-w-3xl ${lang === 'ar' ? 'rtl' : 'ltr'}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-gray-800 dark:text-gray-100 px-2"
          variants={itemVariants}
        >
          {translations.heading[lang as keyof typeof translations.heading]}
        </motion.h2>

      

        <motion.form
          className="mt-6 sm:mt-8 md:mt-10 max-w-lg mx-auto px-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const phoneNumber = (form.elements.namedItem('phoneNumber') as HTMLInputElement).value;

            // Validate before submission
            const error = validatePhoneNumber(phoneNumber);
            if (error) {
              setPhoneError(error);
              return;
            }

            setSubmitStatus('loading');
            setIsSubmitting(true);

            try {
              const response = await fetch('/api/send', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  number: phoneNumber
                }),
              });

              const responseData = await response.json();

              if (!response.ok || !responseData.success) {
                console.error('API Error:', {
                  status: response.status,
                  statusText: response.statusText,
                  data: responseData
                });

                const errorMessage = responseData.error || `Error ${response.status}: ${response.statusText}`;
                throw new Error(errorMessage);
              }

              console.log('Success:', responseData);

              form.reset();
              setSubmitStatus('success');
              setPhoneError('');

              // Reset success message after 3 seconds
              setTimeout(() => {
                setSubmitStatus('idle');
              }, 3000);
            } catch (err) {
              const error = err as Error;
              console.error('Submission Error:', error);
              setSubmitStatus('error');
              setPhoneError(
                lang === 'ar'
                  ? `حدث خطأ أثناء إرسال رقم هاتفك. يرجى المحاولة مرة أخرى. (${error.message})`
                  : `An error occurred while sending your phone number. Please try again. (${error.message})`
              );
            } finally {
              setIsSubmitting(false);
            }
          }}
          variants={itemVariants}
        >
          {/* Single line container for input and button */}
          <div className="flex flex-row items-center bg-white dark:bg-gray-800  p-1.5 sm:p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 group hover:border-cyan-500 dark:hover:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-900 transition-all duration-300">
            <Phone className={`${lang === 'ar' ? 'ml-3' : 'mr-3'} h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500 flex-shrink-0`} />

            <input
              name="phoneNumber"
              type="tel"
              pattern="(0)(5|6|7)[0-9]{8}"
              placeholder={translations.emailPlaceholder[lang as keyof typeof translations.emailPlaceholder]}
              className={`flex-1 bg-transparent px-2 sm:px-3 py-2 text-sm sm:text-base text-gray-700 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-none ${phoneError ? 'border-red-500 focus:border-red-500' : ''
                }`}
              onChange={(e) => {
                const error = validatePhoneNumber(e.target.value);
                setPhoneError(error);
              }}
              required
              title={lang === 'ar' ? 'يرجى إدخال رقم هاتف جزائري صحيح (مثال: 0561234567)' : 'Please enter a valid Algerian phone number (e.g., 0561234567)'}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={`ml-2 px-4 sm:px-6 py-2 sm:py-3 bg-cyan-600 dark:bg-cyan-500 text-white font-semibold rounded-full transition-colors duration-300 shadow-md transform text-sm sm:text-base whitespace-nowrap flex-shrink-0 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-cyan-700 dark:hover:bg-cyan-600 group-hover:scale-105'
                }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {lang === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                </span>
              ) : (
                translations.button[lang as keyof typeof translations.button]
              )}
            </button>
          </div>

          {/* Error and success messages below the input line */}
          {phoneError && (
            <p className={`text-xs sm:text-sm text-red-500 mt-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              {phoneError}
            </p>
          )}
          {submitStatus === 'success' && (
            <p className={`text-xs sm:text-sm text-green-500 mt-2 text-center text-align-center`}>
              {lang === 'ar' ? 'تم إرسال رقم هاتفك بنجاح!' : 'Your phone number has been sent successfully!'}
            </p>
          )}
        </motion.form>
          <motion.p
          className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2"
          variants={itemVariants}
        >
          {translations.subheading[lang as keyof typeof translations.subheading]}
        </motion.p>


      </motion.div>
    </div>
  );
};

export default Newsletter;