import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

export default function FAQPage() {
  const faqs = [
    {
      question: "I'm brand new to medical billing. Where should I start?",
      answer: "Start with foundational training. My Medical Billing Foundations course is designed specifically for beginners and covers everything from coding basics to claim submission and follow-up. If you're not sure if billing is the right career for you, book a Career Q&A session and we'll talk through your options.",
    },
    {
      question: "Do I need a certification to work in medical billing?",
      answer: "Not always, but it helps. Many employers prefer candidates with certifications like CPB (Certified Professional Biller) or CPC (Certified Professional Coder). Certifications show you have a solid foundation and are serious about the work. I can guide you on which certifications make sense for your goals.",
    },
    {
      question: "How long does it take to learn medical billing?",
      answer: "It depends on your prior experience and how much time you dedicate. Most of my beginner courses can be completed in 4-8 weeks if you're learning part-time. But true proficiency comes with practice—expect 6-12 months of real-world experience before you feel fully confident.",
    },
    {
      question: "What's the difference between medical billing and medical coding?",
      answer: "Medical coding is the process of translating diagnoses and procedures into standardized codes (ICD-10, CPT, HCPCS). Medical billing is the process of submitting those codes to insurance companies and ensuring payment. Many roles combine both, but they're distinct skill sets. Medical Coding you need to be certified either through AAPC or AHIMA",
    },
    {
      question: "How do I handle claim denials?",
      answer: "First, read the denial reason carefully. Most denials are fixable—common causes include coding errors, missing information, or timely filing issues. I teach a systematic approach to denial management in my AR courses, but the key is to stay organized and follow up promptly.",
    },
    {
      question: "What is AR cleanup and how do I know if I need it?",
      answer: "AR cleanup is the process of reviewing old, unpaid claims and taking action to collect payment or write them off appropriately. If your practice has a high percentage of AR over 90 days, frequent denials, or disorganized billing processes, AR cleanup can recover lost revenue and improve cash flow.",
    },
    {
      question: "Are your courses live or self-paced?",
      answer: "Most of my courses are self-paced with video lessons you can watch on your schedule. However, all courses include live Zoom Q&A sessions where you can ask questions and connect with other students. Session recordings are available if you can't attend live.",
    },
    {
      question: "Do you offer payment plans for your courses or consulting?",
      answer: "Yes! Payment plans are available for most courses and consulting services. Just reach out and we'll work out a plan that fits your budget.",
    },
    {
      question: "How do you handle HIPAA compliance in consulting?",
      answer: "I take HIPAA very seriously. All consulting sessions are conducted securely, and any protected health information (PHI) shared is kept strictly confidential. I follow best practices for data security and compliance at all times.",
    },
    {
      question: "Can you help me if I work in a specific specialty (e.g., behavioral health, physical therapy, surgery)?",
      answer: "Absolutely. While billing fundamentals are the same across specialties, I have experience working with a wide range of practice types and understand specialty-specific coding and payer rules. Let me know your specialty and I'll tailor my guidance accordingly. We would sign a BA before collaborating.",
    },
    {
      question: "What if I'm not satisfied with a course?",
      answer: "I want you to be confident in your investment. If you're not satisfied within the first 14 days of enrollment, contact me and we'll make it right. See my full refund policy for details.",
    },
    {
      question: "How do I stay current with billing and coding changes?",
      answer: "The industry changes constantly—new codes, payer policies, compliance rules. I share regular updates in my blog and email newsletter. I also recommend subscribing to CMS updates, joining billing forums, and taking continuing education courses annually.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-gray-900 mb-4 md:mb-6">Frequently Asked Questions</h1>
          <p className="text-gray-600">
            Got questions? I've got answers. Here are some of the most common questions I hear from students, clients, and billing professionals.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion type="single" collapsible defaultValue="" className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger value={`item-${index}`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent value={`item-${index}`}>
                  <p className="text-gray-600">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-gray-900 mb-6">Still Have Questions?</h2>
          <p className="text-gray-600 mb-8">
            Can't find what you're looking for? Send me a message and I'll get back to you within 1-2 business days.
          </p>
          <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors">
            <Link to="/contact">Contact Me</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
