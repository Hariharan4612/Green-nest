import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function FAQ() {
  const faqs = [
    {
      q: 'How are the plants packaged for shipping?',
      a: 'We use custom biodegradable packaging with moisture-retaining coco pads and reinforced plant stems to guarantee safe arrival with zero spilled soil.'
    },
    {
      q: 'What if my plant arrives damaged or unhealthy?',
      a: 'We offer a 7-day plant health guarantee. Simply snap a photo and email support@greennest.com for an immediate free replacement or refund.'
    },
    {
      q: 'Do your plants come in ceramic pots?',
      a: 'Yes, each specimen includes a premium white ceramic planter with built-in drainage and saucer, ready to display immediately.'
    },
    {
      q: 'How often should I water my indoor plants?',
      a: 'Most indoor plants prefer the "soak and dry" method — allow the top 2 inches of soil to dry out before watering again.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7]">
      <Navbar />
      <main className="flex-1 py-12 max-w-4xl mx-auto px-4 sm:px-6 w-full">
        <h1 className="text-3xl font-extrabold text-[#142e1b] mb-2">Frequently Asked Questions</h1>
        <p className="text-xs text-gray-500 mb-8">Everything you need to know about GreenNest plants, delivery, and care.</p>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-[#e2ece0] shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm mb-2">{faq.q}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
