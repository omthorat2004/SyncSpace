// components/skeleton/Skeleton.tsx

const Skeleton = ({ className = '' }: { className?: string }) => {
  return <div className={`shimmer ${className}`} />;
};

export default Skeleton;