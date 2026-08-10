import Image from "next/image";

export default function WomanHero({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/images/hero-illustration.png"
        alt="Mature, independent Indian woman looking happy"
        width={500}
        height={500}
        priority
        className="w-full h-auto drop-shadow-2xl animate-float rounded-[40px] mix-blend-multiply"
      />
    </div>
  );
}
