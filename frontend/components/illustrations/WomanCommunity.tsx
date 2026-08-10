import Image from "next/image";

export default function WomanCommunity({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/images/community-illustration.png"
        alt="Diverse group of independent, mature Indian women"
        width={600}
        height={400}
        className="w-full h-auto drop-shadow-2xl rounded-[30px] mix-blend-multiply"
      />
    </div>
  );
}
