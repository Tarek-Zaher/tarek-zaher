import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { getAllPostIds, getPostData } from '../../lib/posts';
import Date from '../../components/date';
import { colorPalette } from '../../lib/colorPalette';
import { libreBaskervilleRegular, latoRegular } from '../../components/layout';
import gsap from 'gsap';

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export default function Post({ postData }) {
  const router = useRouter();
  const postColor = colorPalette[postData.color];

  return (
    <div style={{ backgroundColor: postColor }}>
      <Head>
        <title>{postData.title}</title>
        <meta name="og:title" content={postData.title} />
      </Head>
      <article className={`prose text-[#181818] prose-md p-6 pt-0`}>
        <h5 className={`text-xs pt-3 px-[10px] pb-[10px] text-center uppercase ${latoRegular.className}`}>{postData.type}</h5>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          className="closeX cursor-pointer fixed top-2.5 right-3 z-50"
          onClick={() => router.push('/#posts')}
        >
          <path d="M0 0L20 20" stroke="black" strokeWidth="1" />
          <path d="M20 0L0 20" stroke="black" strokeWidth="1" />
        </svg>
        <h1 className={`text-center text-3xl leading-[1.4] px-8 py-32 font-normal border-b border-[#392F2D] ${libreBaskervilleRegular.className}`}>
          {postData.title}
        </h1>
        <div className={`text-xs grid grid-cols-2 grid-rows-1 justify-between ${libreBaskervilleRegular.className}`}>
          <Date dateString={postData.date} />
          <h5 className={`text-right`}>Tarek Zaher</h5>
        </div>
        <div className={`py-8 text-[#181818] leading-7 text-sm ${libreBaskervilleRegular.className}`} dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </div>
  );
}