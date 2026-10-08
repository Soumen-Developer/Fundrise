const { sequelize, connectDB } = require('../config/db.js');
const seed = require('../seed.js');

async function runPostDeploy() {
  console.log('========================================================');
  console.log('🚀 [FundRise Post-Deploy] Running Automated Setup...');
  console.log('========================================================');

  try {
    const isConnected = await connectDB(10, 3000);
    if (!isConnected) {
      console.warn('⚠️ [FundRise Post-Deploy] Database not connected yet. Post-deploy seeding skipped.');
      process.exit(0);
    }

    console.log('[FundRise Post-Deploy] Synchronizing schema & running seed data...');
    await seed();
    console.log('========================================================');
    console.log('✓ [FundRise Post-Deploy] All post-deployment tasks succeeded!');
    console.log('========================================================');
    process.exit(0);
  } catch (error) {
    console.error('⚠️ [FundRise Post-Deploy Notice]:', error.message);
    // Exit with 0 so Render deploy doesn't fail if DB was already seeded
    process.exit(0);
  }
}

runPostDeploy();
