import { useState } from 'react';
import { motion } from 'motion/react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { shop } from '../config/shop';

export function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing!');
      setEmail('');
    }
  };

  return (
    <section className="section-pad">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-surface max-w-3xl mx-auto p-8 sm:p-12 text-center"
        >
          <h2 className="section-title text-2xl sm:text-3xl">Stay in the loop</h2>
          <p className="section-subtitle mx-auto mt-3">
            Get updates from {shop.name} — offers, new {shop.catalog.plural}, and more.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-modern flex-1"
            />
            <button type="submit" className="btn-primary shrink-0">
              Subscribe
              <Send size={16} />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
