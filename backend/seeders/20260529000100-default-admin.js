"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const [organizations] = await queryInterface.sequelize.query("SELECT id FROM organizations WHERE slug = 'default' LIMIT 1");
    let organizationId = organizations[0]?.id;
    if (!organizationId) {
      await queryInterface.bulkInsert("organizations", [
        { name: "Default Organization", slug: "default", created_at: now, updated_at: now }
      ]);
      const [created] = await queryInterface.sequelize.query("SELECT id FROM organizations WHERE slug = 'default' LIMIT 1");
      organizationId = created[0].id;
    }
    const [users] = await queryInterface.sequelize.query("SELECT id FROM users WHERE email = 'admin@tracker.com' LIMIT 1");
    if (users.length) return;
    await queryInterface.bulkInsert("users", [
      {
        organization_id: organizationId,
        name: "Default Admin",
        email: "admin@tracker.com",
        password_hash: await bcrypt.hash("Admin@123", 12),
        role: "ADMIN",
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete("users", { email: "admin@tracker.com" });
    await queryInterface.bulkDelete("organizations", { slug: "default" });
  }
};
