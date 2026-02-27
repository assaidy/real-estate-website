import dotenv from 'dotenv';
dotenv.config();

const config = {
  mongodb: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate',
    options: {
      maxPoolSize: 10,
    }
  },
  migrationsDir: 'migrations',
  migrationFileExtension: '.js',
  useFileNamingConvention: false,
  moduleSystem: 'commonjs',
};

export default config;
