import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import AnimationFolder from '../components/animationFolder';
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import Date from '../components/date';
import { libreBaskervilleBold } from '../components/layout';
import { libreBaskervilleRegular } from '../components/layout';

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <div className={`bg-[url(/images/beautiful_clouds.png)] bg-cover bg-center h-[40vh] ${utilStyles.bentoRectangle}`}></div>
        
        <div className={`bg-[#392F2D] ${utilStyles.bentoRectangle}`}>
          <h3 className={`text-white p-8 text-2xl ${libreBaskervilleBold.className}`}>I'm</h3>
          <h3 className={`text-white text-center text-8xl px-4 my-4 ${libreBaskervilleBold.className} h-auto`}>Tarek</h3>
        </div>

        <h2 className={`m-[20px] p-4 text-black text-xl ${libreBaskervilleRegular.className}`}>I'm passionate about creating engaging web experiences and appreciating the beauty of the world around us.</h2>
        
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-2 grid-rows-2 gap-5">
            <svg width="120" height="120" viewBox="0 0 120 120" className="block">
              <path d="M60,0 A60,60 0 1,0 60,120 A60,60 0 1,0 60,0" fill="#95B8D1" />
            </svg>
            <svg width="120" height="120" viewBox="0 0 120 120" className="block">
              <path d="M60,0 A60,60 0 1,0 60,120 A60,60 0 1,0 60,0" fill="#8A9B68" />
            </svg>
            <svg width="120" height="120" viewBox="0 0 120 120" className="block">
              <path d="M60,0 A60,60 0 1,0 60,120 A60,60 0 1,0 60,0" fill="#D7816A" />
            </svg>
            <svg width="120" height="120" viewBox="0 0 120 120" className="block">
              <path d="M60,0 A60,60 0 1,0 60,120 A60,60 0 1,0 60,0" fill="#726675" />
            </svg>
          </div>
        </div>

        <div className={`bg-[url(/images/tarek.png)] bg-cover bg-center h-[80vh] ${utilStyles.bentoRectangle}`}></div>

      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Recent Animations</h2>
        <div className=''>
          <AnimationFolder size={1} color="#3D72A4" className="" items={[
            <div>🚧</div>,
            <div className="text-right">🚧</div>,
            <Link href="/animations/floatingCloud">
              <div className='text-center text-[44px]'>☁️</div>
            </Link>]} />
        </div>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Posts</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}