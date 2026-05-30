import styles from './layout.module.css';
import Link from 'next/link';

export default function Header() {
    return(
        <header className={`${styles.header} font-libre-baskerville`}>
            <Link href="/">tarek zaher</Link>
        </header>
    );
}