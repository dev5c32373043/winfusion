import Link from 'next/link';

export default function Main() {
  return (
    <main className="hero min-h-screen" style={{ backgroundImage: 'url(/giveaway.jpg)', objectFit: 'contain' }}>
      <div className="hero-overlay bg-opacity-70"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Elevate Your Brand with Engaging Giveaways</h1>
          <p className="mb-5">
            Join us in the journey of enhancing your brand&apos;s presence through captivating giveaways. Connect with
            your audience, amplify engagement, and foster lasting connections with ease. Start your brand&apos;s
            evolution today.
          </p>
          <Link href="/giveaways" className="btn btn-primary">
            Make a giveaway
          </Link>
        </div>
      </div>
    </main>
  );
}
