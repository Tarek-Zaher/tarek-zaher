import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import { Libre_Baskerville, Lato } from 'next/font/google';
import Header from '../components/header';

export const libreBaskervilleBold = Libre_Baskerville({
  subsets: ['latin'],
  weight: '700',
});

export const libreBaskervilleRegular = Libre_Baskerville({
  subsets: ['latin'],
  weight: '400',
});

export const latoRegular = Lato({
  subsets: ['latin'],
  weight: '400',
});

const name = 'Tarek Zaher';
export const siteTitle = 'Tarek Zaher';

export default function Layout({ children, home }) {
  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="Tarek Zaher's personal website"
          content="View Tarek's personal website, showcasing his projects, blog posts, and more!"
        />
        <meta
          property="og:image"
          content="/images/tarek-zaher-cloud-icon.png"
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="/images/tarek-zaher-cloud-icon.png" />
      </Head>
      <Header />
      <main>{children}</main>
    </div >
  );
}