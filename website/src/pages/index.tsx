import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const SERVICES = [
  { name: 'PostgreSQL', cmd: 'devstack add postgres' },
  { name: 'MySQL',      cmd: 'devstack add mysql' },
  { name: 'MongoDB',    cmd: 'devstack add mongo' },
  { name: 'Redis',      cmd: 'devstack add redis' },
  { name: 'RabbitMQ',  cmd: 'devstack add rabbitmq' },
  { name: 'Elasticsearch', cmd: 'devstack add elasticsearch' },
  { name: 'MinIO',     cmd: 'devstack add minio' },
  { name: 'Mailpit',   cmd: 'devstack add mailpit' },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <pre className={styles.asciiArt}>{`
      $$\\                      $$$$$$\\    $$\\                         $$\\
      $$ |                    $$  __$$\\   $$ |                        $$ |
 $$$$$$$ | $$$$$$\\ $$\\    $$\\ $$ /  \\\\$$$$$$\\    $$$$$$\\   $$$$$$$\\ $$ |  $$\\
$$  __$$ |$$  __$$\\\\$$\\  $$  |\\$$$$$$\\  \\_$$  _|   \\____$$\\ $$  _____|$$ | $$  |
$$ /  $$ |$$$$$$$$ |\\$$\\$$  /  \\____$$\\   $$ |     $$$$$$$ |$$ /      $$$$$$  /
$$ |  $$ |$$   ____| \\$$$  /  $$\\   $$ |  $$ |$$\\ $$  __$$ |$$ |      $$  _$$<
\\$$$$$$$ |\\$$$$$$$\\   \\$  /   \\$$$$$$  |  \\$$$$  |\\$$$$$$$ |\\$$$$$$$\\ $$ | \\$$\\
 \\_______| \\_______|   \\_/     \\______/    \\____/  \\_______| \\_______|\\__|  \\__|`}</pre>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/getting-started">
            Get Started →
          </Link>
          <Link className="button button--outline button--secondary button--lg" to="/docs/intro">
            Why devstack?
          </Link>
        </div>
      </div>
    </header>
  );
}

function QuickStart() {
  return (
    <section className={styles.quickstart}>
      <div className="container">
        <Heading as="h2" className="text--center">Up in three commands</Heading>
        <div className={styles.codeBlock}>
          <code>
            <div><span className={styles.prompt}>$</span> devstack init my-project</div>
            <div><span className={styles.prompt}>$</span> devstack add postgres redis</div>
            <div><span className={styles.prompt}>$</span> devstack up</div>
          </code>
        </div>
      </div>
    </section>
  );
}

function ServicesGrid() {
  return (
    <section className={styles.services}>
      <div className="container">
        <Heading as="h2" className="text--center">Supported services</Heading>
        <div className={styles.serviceGrid}>
          {SERVICES.map(({name, cmd}) => (
            <div key={name} className={styles.serviceCard}>
              <strong>{name}</strong>
              <code>{cmd}</code>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <QuickStart />
        <ServicesGrid />
      </main>
    </Layout>
  );
}
