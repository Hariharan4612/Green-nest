/**
 * contactService.js — GreenNest Contact & Newsletter Service
 */

export async function submitContactForm({ name, email, message }) {
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    throw new Error('All fields are required.');
  }
  await new Promise((r) => setTimeout(r, 900));
  return { success: true, message: "Thanks for reaching out! We'll reply within 24 hours." };
}

export async function subscribeNewsletter(email) {
  if (!email?.trim()) throw new Error('Email is required.');
  await new Promise((r) => setTimeout(r, 600));
  return { success: true, message: `You're subscribed! Check ${email} for a welcome gift 🌿` };
}

