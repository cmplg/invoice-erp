import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/'); // Akan di-handle oleh middleware ke dashboard
}