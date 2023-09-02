import Image from 'next/image';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Image
        src="/smile.png"
        alt="greetings!"
        width={96}
        height={96}
        priority={true}
        quality={100}
        className="w-24 h-24 mb-4"
      />
      <h2 className="text-3xl font-semibold mb-2">Welcome to Win Fusion!</h2>
      <p className="text-gray-600 text-center text-lg leading-relaxed">It&apos;s time to giveaway some prizes!</p>
    </div>
  );
}
