import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    'getting-started',
    {
      type: 'category',
      label: 'Services',
      items: [
        'services/postgres',
        'services/mysql',
        'services/mongo',
        'services/redis',
        'services/rabbitmq',
        'services/elasticsearch',
        'services/minio',
        'services/mailpit',
      ],
    },
    'commands',
    'configuration',
  ],
};

export default sidebars;
