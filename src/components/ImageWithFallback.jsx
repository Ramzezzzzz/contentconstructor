export const ImageWithFallback = ({ src, alt, className }) => {
  const handleError = (e) => {
    e.target.src =
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=225&fit=crop";
  };
  return (
    <img src={src} alt={alt} className={className} onError={handleError} />
  );
};
