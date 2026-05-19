import { motion } from 'motion/react';

type SectionHeaderProps = {
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeader({
  label,
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const isCenter = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-10 sm:mb-12 ${isCenter ? 'text-center' : 'text-left'} ${className}`}
    >
      {label && <span className="section-label">{label}</span>}
      <h2 className="section-title">{title}</h2>
      {subtitle && (
        <p className={`section-subtitle mt-3 ${isCenter ? 'mx-auto' : ''}`}>{subtitle}</p>
      )}
    </motion.div>
  );
}
