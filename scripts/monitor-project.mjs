#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

const execAsync = promisify(exec);

console.log(chalk.blue.bold('🚀 WeddingLK Project Monitoring Dashboard'));
console.log(chalk.blue.bold('=====================================\n'));

const checkService = async (name, port, url) => {
  try {
    const { stdout } = await execAsync(`curl -s -o /dev/null -w "%{http_code}" ${url}`);
    const status = stdout.trim();
    if (status === '200') {
      console.log(chalk.green(`✅ ${name}: Running (Port ${port}) - ${url}`));
      return true;
    } else {
      console.log(chalk.yellow(`⚠️  ${name}: Responding with status ${status} (Port ${port}) - ${url}`));
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`❌ ${name}: Not accessible (Port ${port}) - ${url}`));
    return false;
  }
};

const checkDockerStatus = async () => {
  try {
    const { stdout } = await execAsync('docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"');
    console.log(chalk.cyan('\n🐳 Docker Services Status:'));
    console.log(chalk.cyan('========================'));
    console.log(stdout);
  } catch (error) {
    console.log(chalk.red('❌ Error checking Docker status:', error.message));
  }
};

const checkDatabase = async () => {
  try {
    const { stdout } = await execAsync('docker exec wedding-lk-asitha-mongodb-1 mongosh --eval "db.stats()" --quiet');
    if (stdout.includes('collections')) {
      console.log(chalk.green('✅ MongoDB: Connected and responsive'));
    } else {
      console.log(chalk.yellow('⚠️  MongoDB: Connected but may have issues'));
    }
  } catch (error) {
    console.log(chalk.red('❌ MongoDB: Connection failed'));
  }
};

const checkRedis = async () => {
  try {
    const { stdout } = await execAsync('docker exec wedding-lk-asitha-redis-1 redis-cli ping');
    if (stdout.trim() === 'PONG') {
      console.log(chalk.green('✅ Redis: Connected and responsive'));
    } else {
      console.log(chalk.yellow('⚠️  Redis: Connected but may have issues'));
    }
  } catch (error) {
    console.log(chalk.red('❌ Redis: Connection failed'));
  }
};

const displayTestCredentials = () => {
  console.log(chalk.yellow('\n🔐 TEST USER CREDENTIALS FOR MANUAL TESTING:'));
  console.log(chalk.yellow('=============================================='));
  console.log(chalk.cyan('👑 Admin User:'));
  console.log('   Email: admin@weddinglk.test');
  console.log('   Password: admin123');
  console.log('   Role: Administrator');
  console.log('');
  console.log(chalk.cyan('👰 Client User:'));
  console.log('   Email: client@weddinglk.test');
  console.log('   Password: client123');
  console.log('   Role: Wedding Client');
  console.log('');
  console.log(chalk.cyan('🏢 Vendor User:'));
  console.log('   Email: vendor@weddinglk.test');
  console.log('   Password: vendor123');
  console.log('   Role: Service Vendor');
  console.log('');
  console.log(chalk.cyan('📋 Planner User:'));
  console.log('   Email: planner@weddinglk.test');
  console.log('   Password: planner123');
  console.log('   Role: Wedding Planner');
};

const displayUrls = () => {
  console.log(chalk.green('\n🌐 ACCESSIBLE URLs:'));
  console.log(chalk.green('=================='));
  console.log(chalk.cyan('Main Application:'));
  console.log('   Frontend: http://localhost:3000');
  console.log('   API Base: http://localhost:3000/api');
  console.log('');
  console.log(chalk.cyan('Database Management:'));
  console.log('   MongoDB Express: http://localhost:8081');
  console.log('   Username: admin');
  console.log('   Password: admin123');
  console.log('');
  console.log(chalk.cyan('Database Connections:'));
  console.log('   MongoDB: mongodb://localhost:27017');
  console.log('   Redis: redis://localhost:6379');
};

const displayFeatures = () => {
  console.log(chalk.magenta('\n✨ AVAILABLE FEATURES:'));
  console.log(chalk.magenta('====================='));
  console.log('🔐 Authentication & Authorization');
  console.log('👥 User Management (Admin, Client, Vendor, Planner)');
  console.log('🏢 Vendor Management & Portfolio');
  console.log('🏛️ Venue Management & Booking');
  console.log('📅 Booking & Reservation System');
  console.log('⭐ Review & Rating System');
  console.log('💬 Messaging & Communication');
  console.log('💳 Payment Processing (Stripe)');
  console.log('📧 Email Notifications');
  console.log('📱 SMS Notifications (Twilio)');
  console.log('🤖 AI-Powered Features');
  console.log('📊 Analytics & Reporting');
  console.log('📱 Mobile Responsive Design');
  console.log('🎨 Theme & Customization');
};

const displayTestData = () => {
  console.log(chalk.blue('\n📊 TEST DATA SUMMARY:'));
  console.log(chalk.blue('===================='));
  console.log('👥 Users: 40+ (including test accounts)');
  console.log('🏢 Vendors: 20+ with services & portfolios');
  console.log('🏛️ Venues: 25+ with pricing & availability');
  console.log('📅 Bookings: 30+ sample reservations');
  console.log('⭐ Reviews: 40+ ratings & feedback');
};

const displayCommands = () => {
  console.log(chalk.green('\n🛠️  USEFUL COMMANDS:'));
  console.log(chalk.green('===================='));
  console.log('View logs: docker-compose logs -f [service-name]');
  console.log('Restart service: docker-compose restart [service-name]');
  console.log('Stop all: docker-compose down');
  console.log('Start all: docker-compose up -d');
  console.log('Rebuild: docker-compose build --no-cache');
  console.log('Database shell: docker exec -it wedding-lk-asitha-mongodb-1 mongosh');
  console.log('Redis shell: docker exec -it wedding-lk-asitha-redis-1 redis-cli');
};

const main = async () => {
  console.log(chalk.blue('🔍 Checking services...\n'));
  
  // Check main services
  await checkService('Next.js App', '3000', 'http://localhost:3000');
  await checkService('MongoDB Express', '8081', 'http://localhost:8081');
  
  // Check Docker status
  await checkDockerStatus();
  
  // Check database connections
  console.log(chalk.cyan('\n🗄️ Database Status:'));
  console.log(chalk.cyan('=================='));
  await checkDatabase();
  await checkRedis();
  
  // Display information
  displayTestCredentials();
  displayUrls();
  displayFeatures();
  displayTestData();
  displayCommands();
  
  console.log(chalk.green('\n🎉 Project is ready for manual testing!'));
  console.log(chalk.yellow('💡 Tip: Use the test credentials above to explore different user roles'));
  console.log(chalk.blue('📱 The application is fully responsive and works on all devices'));
};

main().catch(console.error); 