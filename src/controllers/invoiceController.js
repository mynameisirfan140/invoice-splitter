const knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: { min: 2, max: 10 },
});

async function createInvoice(req, res, next) {
  try {
    const { totalAmount, splits } = req.body;

    // Validation
    if (typeof totalAmount !== 'number' || totalAmount <= 0) {
      return res.status(400).json({ error: 'Invalid total amount' });
    }

    if (!Array.isArray(splits) || splits.length === 0) {
      return res.status(400).json({ error: 'Splits array is required' });
    }

    // Validate each split
    let sum = 0;
    for (const split of splits) {
      if (typeof split.clientId !== 'string' || typeof split.amount !== 'number' || split.amount <= 0) {
        return res.status(400).json({ error: 'Invalid split data' });
      }
      sum += split.amount;
    }

    if (Math.abs(sum - totalAmount) > 0.01) {
      return res.status(400).json({ error: 'Sum of split amounts does not match total amount' });
    }

    // Insert combined invoice
    const [invoiceId] = await knex('invoices').insert({
      total_amount: totalAmount,
    }).returning('id');

    // Insert allocations
    const allocationPromises = splits.map(split =>
      knex('allocations').insert({
        invoice_id: invoiceId[0],
        client_id: split.clientId,
        amount: split.amount,
      })
    );

    await Promise.all(allocationPromises);

    res.status(201).json({
      message: 'Invoice split successfully',
      invoiceId,
    });
  } catch (err) {
    next(err);
  }
}

async function getInvoice(req, res, next) {
  try {
    const invoiceId = req.params.id;
    if (isNaN(invoiceId)) {
      return res.status(400).json({ error: 'Invalid invoice ID' });
    }

    // Fetch allocations for the invoice
    const allocations = await knex('allocations')
      .where('invoice_id', invoiceId)
      .select('client_id', 'amount');

    if (allocations.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Fetch invoice total
    const invoiceRow = await knex('invoices').where('id', invoiceId).first();
    if (!invoiceRow) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const result = {
      invoiceId: invoiceRow.id,
      totalAmount: invoiceRow.total_amount,
      allocations: allocations.map(a => ({
        clientId: a.client_id,
        amount: a.amount,
      })),
    };

    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { createInvoice, getInvoice };