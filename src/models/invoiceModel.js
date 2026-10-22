/**
 * Invoice Model
 * 
 * Represents a combined invoice and its client allocations.
 * 
 * Combined invoice structure:
 *   - id: unique identifier
 *   - totalAmount: total monetary value of the combined invoice
 *   - allocations: array of { clientId, amount } objects representing the split
 * 
 * This model provides helper methods to interact with the PostgreSQL database
 * using Knex.js. All methods return Promises.
 */

const knex = require('../database/knexfile');

class Invoice {
  /**
   * Retrieve a combined invoice by its ID, including its allocations.
   * @param {number} id - Invoice identifier
   * @returns {Promise<Object>} - Invoice data with allocations
   */
  static async getById(id) {
    const result = await knex('invoices')
      .select('invoices.*', 'allocations.client_identifier', 'allocations.split_amount')
      .leftJoin('allocations', 'invoices.id', 'allocations.invoice_id')
      .where('invoices.id', id);

    // Transform result into a structured object
    if (!result.length) {
      return null;
    }

    const { id, total_amount, created_at } = result[0];
    const allocations = result.map(row => ({
      clientId: row.client_identifier,
      amount: parseFloat(row.split_amount)
    }));

    return {
      id,
      totalAmount: parseFloat(total_amount),
      createdAt: created_at,
      allocations
    };
  }

  /**
   * Create a new combined invoice with its allocations.
   * This runs within a Knex transaction to ensure atomicity.
   * @param {Object} data - { totalAmount: number, allocations: Array<{clientId:string, amount:number}> }
   * @returns {Promise<Object>} - Created invoice data
   */
  static async create(data) {
    const { totalAmount, allocations } = data;

    // Basic validation (could be expanded)
    if (typeof totalAmount !== 'number' || totalAmount <= 0) {
      throw new Error('Invalid total amount');
    }
    if (!Array.isArray(allocations) || allocations.length === 0) {
      throw new Error('At least one allocation is required');
    }

    return await knex.transaction(async trx => {
      // Insert the combined invoice
      const [invoiceId] = await trx('invoices')
        .insert({
          total_amount: totalAmount,
          created_at: trx.raw('CURRENT_TIMESTAMP')
        })
        .returning('id');

      // Insert each allocation linked to the new invoice
      const allocationPromises = allocations.map(alloc => {
        return trx('allocations').insert({
          invoice_id: invoiceId,
          client_identifier: alloc.clientId,
          split_amount: alloc.amount
        });
      });

      await Promise.all(allocationPromises);

      // Return the freshly created invoice (including allocations)
      return Invoice.getById(invoiceId);
    });
  }

  /**
   * Update an existing combined invoice and its allocations.
   * @param {number} id - Invoice identifier
   * @param {Object} data - Partial fields to update (totalAmount, allocations)
   * @returns {Promise<Object>} - Updated invoice data
   */
  static async update(id, data) {
    // For simplicity, we only support updating the total amount.
    // Allocation updates would require more complex handling (delete + re‑insert).
    if (typeof data.totalAmount !== 'undefined') {
      const { totalAmount } = data;
      if (typeof totalAmount !== 'number' || totalAmount <= 0) {
        throw new Error('Invalid total amount');
      }

      await knex('invoices')
        .where('id', id)
        .update({ total_amount: totalAmount, created_at: knex.raw('CURRENT_TIMESTAMP') });
    }

    // Return the updated invoice
    return Invoice.getById(id);
  }

  /**
   * Delete a combined invoice and its allocations.
   * @param {number} id - Invoice identifier
   * @returns {Promise<boolean>} - True if a row was deleted
   */
  static async delete(id) {
    const result = await knex('invoices')
      .where('id', id)
      .delete();

    return !!result;
  }
}

module.exports = Invoice;