'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.addColumn('Loans', 'interest_rate', {
     *   type: Sequelize.FLOAT,
     *   allowNull: false
     * });
     */
    await queryInterface.addColumn('Loans', 'interest_rate', {
      type: Sequelize.FLOAT,
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.removeColumn('Loans', 'interest_rate');
     */
    await queryInterface.removeColumn('Loans', 'interest_rate');
  }
};

