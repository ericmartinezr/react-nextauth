import Link from 'next/link';
import LogoutButton from './ui/logout-button';

export default function Home() {
  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start'>
        <Link href={'/register'}>Create account</Link>
        <Link href={'/dashboard'}>Go to dashboard</Link>
        <Link href={'/api/auth/signin'}>Go to login</Link>
        <LogoutButton />
      </main>
    </div>
  );
}
