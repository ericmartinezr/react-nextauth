import '../globals.css';
import { getUser } from '../lib/dal';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  console.log('user', user);

  return children;
}
