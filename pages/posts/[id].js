import Layout from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import Head from 'next/head';
import Date from '../../components/date';
import utilStyles from '../../styles/utils.module.css';

 
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
  return (
        <article className={`bg-[${postData.color}] height-full width-full`}>
          <h5 className={`text-sm pt-[20px] px-[10px] pb-[10px] text-center`}>{postData.type}</h5>
          <h2 className={`text-center text-[1.5rem] leading-[1.4] my-4 px-8`}>{postData.title}</h2>
          <hr></hr>
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>

    /*<Layout>
        <Head>
            {postData.title}
        </Head>
      <article className='prose prose-md'>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>*/
  );
}