import Layout from '../../components/layout';
import utilStyles from '../../styles/utils.module.css';
import Head from 'next/head';
import Date from '../../components/date';
import { getAllProjectNames, getProjectData } from '../../lib/projects';

export async function getStaticProps({ params }) {
  const projData = await getProjectData(params.name);
  return {
    props: {
      projData,
    },
  };
}

export async function getStaticPaths() {
  const paths = getAllProjectNames();
  return {
    paths,
    fallback: false,
  };
}

export default function Project({ projData }) {
  return (
    <Layout>
      <Head>
        <title>{projData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{projData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={projData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: projData.contentHtml }} />
      </article>
      {projData.interactive &&
        <h2 className={utilStyles.headingMd}>Interactive Project</h2>
        
      }
      {!projData.interactive && <p><i>This project does not have an in-browser version.</i></p>}
    </Layout>
  );
}