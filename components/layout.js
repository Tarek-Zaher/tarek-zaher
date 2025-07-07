import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import { Libre_Baskerville } from 'next/font/google';

export const libreBaskervilleBold = Libre_Baskerville({
  subsets: ['latin'],
  weight: '700',
});

export const libreBaskervilleRegular = Libre_Baskerville({
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
      <header className={`${styles.header} ${libreBaskervilleRegular.className}`}>
        <Link href="/">tarek zaher</Link>
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">← Back to home</Link>
        </div>
      )}
    </div >
  );
}