import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { getAllPostIds, getPostData } from '../../lib/posts';
import Date from '../../components/date';
import { colorPalette } from '../../lib/colorPalette';
import { libreBaskervilleRegular, latoRegular } from '../../components/layout';
import gsap from 'gsap';
import SplitText from 'gsap/SplitText';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from '@gsap/react';
import PostPreview from '../../components/PostPreview';

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

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

export default function Post({ postData }) {
  const router = useRouter();
  const postColor = colorPalette[postData.color];

  useGSAP(() => {

    document.fonts.ready.then(() => {
      SplitText.create(".split", {
        type: "lines",
        mask: "lines",
        autosplit: "true",
        onSplit(self) {
          return gsap.from(self.lines, {
            duration: 0.6,
            y: 100,
            autoAlpha: 0,
            stagger: 0.05,
            scrollTrigger: ".split",
            onComplete: () => self.revert()
          });
        }
      });
    });

    gsap.to('html, body', {
      backgroundColor: postColor,
      duration: 0.6,
      scrollTrigger: {
        trigger: "postText",
      }
    })

  });

  return (
    <div style={{ backgroundColor: postColor }}>
      <Head>
        <title>{postData.title}</title>
        <meta name="og:title" content={postData.title} />
      </Head>
      <article className={`prose text-[#181818] prose-md p-6 pt-0 text-center mx-auto`}>
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
        <h1 className={`split text-center text-3xl leading-[1.4] px-8 py-56 font-normal border-b border-[#392F2D] ${libreBaskervilleRegular.className}`}>
          {postData.title}
        </h1>
        <div className={`text-xs grid grid-cols-2 grid-rows-1 justify-between ${libreBaskervilleRegular.className}`}>
          <Date className="text-left" dateString={postData.date} />
          <h5 className={`text-right`}>Tarek Zaher</h5>
        </div>
        <div className={`postText py-16 text-[#181818] leading-7 text-base text-left ${libreBaskervilleRegular.className}`} dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </div>
  );
}