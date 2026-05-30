import '../styles/global.css';
import { fontVariables } from '../lib/fonts';

export default function App({ Component, pageProps }) {
  return (
    <div className={fontVariables}>
      <Component {...pageProps} />
    </div>
  );
}
