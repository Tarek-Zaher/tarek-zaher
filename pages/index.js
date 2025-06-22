import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import AnimationFolder from '../components/animationFolder';
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import Date from '../components/date';

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
      <section className={utilStyles.headingMd}>
        <p>Hello, my name is Tarek! I'm a web developer, writer, and human.</p>
        <p>
          I'm passionate about creating engaging web experiences and appreciating the beauty of the world around us.
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Recent Animations</h2>
        <div className=''>
          <AnimationFolder size={1} color="#3D72A4" className="" items={[
            <div>🚧</div>,
            <div className="text-right">🚧</div>,
            <Link href="/animations/floatingCloud">
              <div className='text-center text-[44px]'>☁️</div>
            </Link> ]} />
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