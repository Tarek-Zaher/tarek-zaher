import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import PostPreview from '../components/PostPreview.jsx'
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import Date from '../components/date';
import { libreBaskervilleBold } from '../components/layout';
import { libreBaskervilleRegular } from '../components/layout';
import { useRef } from 'react';
import gsap from 'gsap';
import SplitText from 'gsap/SplitText';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from '@gsap/react';

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

export default function Home({ allPostsData }) {

  const introductionSection = useRef();

  const { contextSafe } = useGSAP({ scope: introductionSection });

  let nameTl = gsap.timeline();

  let clickCounter = 0;
  const handleNameClick = contextSafe(() => {
    clickCounter++;

    gsap.to(".nameBento", {
      x: 10,
      y: 5
    })

    switch (clickCounter) {
      case 1:
        nameTl
          .to(".tarekText", {
            duration: 0.5,
            x: 100,
            autoAlpha: 0,
          })
          .set(".tarekText", {
            display: "none",
            x: -100
          })
          .from(".webDevText", {
            duration: 0.5,
            autoAlpha: 0,
            x: -100
          })
        break;
      case 2:
        nameTl
          .to(".webDevText", {
            duration: 0.5,
            x: 100,
            autoAlpha: 0,
          })
          .set(".webDevText", {
            display: "none",
            x: 0
          })
          .from(".writerText", {
            duration: 0.5,
            autoAlpha: 0,
            x: -100
          })
        break;
      case 3:
        nameTl
          .to(".writerText", {
            duration: 0.5,
            x: 100,
            autoAlpha: 0,
          })
          .set(".writerText", {
            display: "none",
            x: 0
          })
          .from(".designerText", {
            duration: 0.5,
            autoAlpha: 0,
            x: -100
          })
        break;
      case 4:
        nameTl
          .to(".designerText", {
            duration: 0.5,
            x: 100,
            autoAlpha: 0,
          })
          .set(".designerText", {
            display: "none",
            x: 0
          })
          .to(".tarekText", {
            display: "block",
            autoAlpha: 1,
            x: 0
          })
          .set(".webDevText, .writerText, .designerText", {
            display: "block",
            autoAlpha: 1,
          })
        clickCounter = 0;
        break;
      default:
        break;
    }
  });

  useGSAP(() => {

    SplitText.create(".split", {
      type: "lines",
      mask: "lines",
      autosplit: "true",
      onSplit(self) {
        return gsap.from(self.lines, {
          duration: 2,
          y: 100,
          autoAlpha: 0,
          stagger: 0.05,
          scrollTrigger: ".circles",
          onComplete: () => self.revert()
        });
      }
    });
  });


  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section ref={introductionSection} className={`border-b border-[#392F2D]`}>
        <div className={`bg-[url(/images/clouds/beautiful_clouds.png)] bg-cover bg-center h-[250px] ${utilStyles.bentoRectangle}`}></div>

        <div onClick={handleNameClick} className={`${utilStyles.nameBento} bg-[#392F2D] h-[250px] overflow-hidden ${utilStyles.bentoRectangle}`}>
          <h3 className={`text-white p-8 text-2xl ${libreBaskervilleBold.className}`}>I'm</h3>
          <h3 className={`tarekText text-white text-center text-8xl px-4 my-4 ${libreBaskervilleBold.className} h-auto`}>Tarek</h3>
          <h3 className={`webDevText text-white text-5xl px-8 ${libreBaskervilleBold.className} h-auto`}>a web developer</h3>
          <h3 className={`writerText text-white text-5xl px-8 mb-8 mt-12 ${libreBaskervilleBold.className} h-auto`}>a writer</h3>
          <h3 className={`designerText text-white text-5xl px-8 mb-8 mt-12 ${libreBaskervilleBold.className} h-auto`}>a designer</h3>
        </div>

        <h2 className={`passionStatement split m-[20px] px-4 pt-4 pb-0 text-black text-xl ${libreBaskervilleRegular.className}`}>I'm passionate about creating engaging web experiences and appreciating the beauty of the world around us.</h2>

        <div className="circles flex items-center justify-center my-8">
          <div className="grid grid-cols-4 grid-rows-1 gap-1">
            <svg width="80" height="80" viewBox="0 0 80 80" className="block">
              <path d="M40,0 A40,40 0 1,0 40,80 A40,40 0 1,0 40,0" fill="#95B8D1" />
            </svg>
            <svg width="80" height="80" viewBox="0 0 80 80" className="block">
              <path d="M40,0 A40,40 0 1,0 40,80 A40,40 0 1,0 40,0" fill="#8A9B68" />
            </svg>
            <svg width="80" height="80" viewBox="0 0 80 80" className="block">
              <path d="M40,0 A40,40 0 1,0 40,80 A40,40 0 1,0 40,0" fill="#D7816A" />
            </svg>
            <svg width="80" height="80" viewBox="0 0 80 80" className="block">
              <path d="M40,0 A40,40 0 1,0 40,80 A40,40 0 1,0 40,0" fill="#726675" />
            </svg>
          </div>
        </div>

        <div className={`bg-[url(/images/tarek.png)] bg-cover bg-center h-[500px] ${utilStyles.bentoRectangle}`}></div>

      </section>

      <section id="fragments" className={`border-b border-[#392F2D]`}>
        <h2 className={`${utilStyles.headingLg} ${libreBaskervilleRegular.className} px-[20px]`}>Posts</h2>

        <PostPreview post={allPostsData[0]} color="#95B8D1" height="300px" />
        <PostPreview post={allPostsData[1]} color="#8A9B68" height="300px" overlap />
        <PostPreview post={allPostsData[2]} color="#D7816A" height="200px" overlap />
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={`${utilStyles.headingLg} ${libreBaskervilleRegular.className} px-[20px]`}>Fragments</h2>
        <ul className={utilStyles.list}>
          {allPostsData.slice(0, 3).map(({ id, date, title, type }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                {type}
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}