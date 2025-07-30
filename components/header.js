import styles from './layout.module.css';
import Link from 'next/link';
import { libreBaskervilleRegular } from '../components/layout';

export default function Header() {
    return(
        <header className={`${styles.header} ${libreBaskervilleRegular.className}`}>
            <Link href="/">tarek zaher</Link>
        </header>
    );
}