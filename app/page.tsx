import { redirect } from 'next/navigation';
import { APP_ROUTES } from './constants/routes';

export default function Home() {
  redirect(APP_ROUTES.login);
}
