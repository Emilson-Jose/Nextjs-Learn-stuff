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
        <h1 className={utilStyles.headingXl}>{projData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={projData.date} />
          <p>the name is {projData.name}</p>
          <p>{projData.jsonContent}</p>
          <p>the title is {projData.title}</p>
          <p>{projData.date}</p>
        </div>
        <div />
      </Layout>
    );
  }