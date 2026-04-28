export const ImageWithFallback = ({ src, alt, className }) => {
  const handleError = (e) => {
    e.target.onerror = null;
    // fallback: можно градиент или цветную заглушку
    e.target.style.background = 'linear-gradient(135deg, #1f2937, #111827)';
    e.target.style.minHeight = '200px'; // чтобы не схлопывалось
  };
  return <img src={src} alt={alt} className={className} onError={handleError} loading="lazy" />;
};