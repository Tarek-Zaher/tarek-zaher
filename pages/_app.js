import '../styles/global.css';
import { fontVariables } from '../lib/fonts';
import { Analytics } from "@vercel/analytics/next"

export default function App({ Component, pageProps }) {
  return (
    <div className={fontVariables}>
      <Component {...pageProps} />
      <Analytics />
    </div>
  );
}
