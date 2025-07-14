import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import PostPreview from '../components/PostPreview.jsx'
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import Date from '../components/date';
import { libreBaskervilleBold } from '../components/layout';
import { libreBaskervilleRegular } from '../components/layout';
import { useRef, useEffect, useState } from 'react';
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
  let [numberOfPostPreviews, setNumberOfPostPreviews] = useState(3);
  const container = useRef();

  useGSAP(() => {
    gsap.set(['html', 'body'], {
      backgroundColor: '#E8DDB5',
    });
  });

  useGSAP(() => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    gsap.from(".postPreview", {
      duration: 0.6,
      y: 50,
      autoAlpha: 0,
      stagger: 0.1,
    });
    gsap.to(".overlapper", {
      scrollTrigger: {
        trigger: "#posts",
        start: "top center",
        end: "bottom top",
        scrub: true,
        toggleActions: "play none none reverse"
      },
      marginTop: "-210px"
    });
  }, {dependencies: [numberOfPostPreviews]});

  useGSAP(() => {

    let nameTl = gsap.timeline({ repeat: -1, defaults: { ease: "power2.inOut" } });

    nameTl
      .from(".tarekText", {
        duration: 0.5,
        autoAlpha: 0,
        x: -100
      })
      .to(".tarekText", {
        duration: 0.5,
        x: 100,
        autoAlpha: 0,
      }, ">3")
      .set(".tarekText", {
        display: "none",
        x: -100
      })
      .from(".webDevText", {
        duration: 0.5,
        autoAlpha: 0,
        x: -100
      })
    nameTl
      .to(".webDevText", {
        duration: 0.5,
        x: 100,
        autoAlpha: 0,
      }, ">2")
      .set(".webDevText", {
        display: "none",
        x: 0
      })
      .from(".writerText", {
        duration: 0.5,
        autoAlpha: 0,
        x: -100
      })
    nameTl
      .to(".writerText", {
        duration: 0.5,
        x: 100,
        autoAlpha: 0,
      }, ">2")
      .set(".writerText", {
        display: "none",
        x: 0
      })
      .from(".designerText", {
        duration: 0.5,
        autoAlpha: 0,
        x: -100
      })
    nameTl
      .to(".designerText", {
        duration: 0.5,
        x: 100,
        autoAlpha: 0,
      }, ">2")
      .set(".designerText", {
        display: "none",
        x: 0
      })

    document.fonts.ready.then(() => {
      SplitText.create(".split", {
        type: "lines",
        mask: "lines",
        autosplit: "true",
        onSplit(self) {
          return gsap.from(self.lines, {
            duration: 1,
            y: 100,
            autoAlpha: 0,
            stagger: 0.05,
            scrollTrigger: ".circles",
            onComplete: () => self.revert()
          });
        }
      });
    });


  });

  return (
    <Layout ref={container} home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={`border-b border-[#392F2D]`}>
        <div className={`bg-[url(/images/clouds/beautiful_clouds.png)] bg-cover bg-center h-[250px] ${utilStyles.bentoRectangle}`}></div>

        <div className={`${utilStyles.nameBento} bg-[#392F2D] h-[250px] overflow-hidden ${utilStyles.bentoRectangle}`}>
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

      <section id="posts" className={`border-b border-[#392F2D] prose max-w-none h-auto`}>
        <h2 className={`${utilStyles.headingLg} ${libreBaskervilleRegular.className} px-[20px] my-8`}>Posts</h2>

        {allPostsData.slice(0, numberOfPostPreviews).map((postData, index, arr) => (
          <PostPreview
            key={postData.id}
            postData={postData}
            height={index === arr.length - 1 ? "200px" : "300px"}
            overlap={index > 0}
            zIndex={index + 1}
          />
        ))}

        {numberOfPostPreviews < 4 ?
          <h5 className={`text-center pb-8 text-sm ${libreBaskervilleRegular.className}`} onClick={() => setNumberOfPostPreviews((prev) => prev + (allPostsData.length - prev))}>Show All</h5>
          :
          <h5 className={`text-center pb-8 text-sm ${libreBaskervilleRegular.className}`} onClick={() => setNumberOfPostPreviews((prev) => 3)}>Show Less</h5>
        }
      </section>

      <footer class="py-32">
        <h5 className={`text-5xl text-center pb-10 ${libreBaskervilleRegular.className}`}>Thank you!</h5>

        <div className="circles flex items-center justify-center">
          <div className="grid grid-cols-2 grid-rows-2 gap-3">
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
      </footer>
    </Layout>
  );
}