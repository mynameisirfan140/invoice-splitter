/**
 * Jest unit tests for the Invoice Controller.
 * Mocks the Knex database layer to verify correct interactions.
 */

const Invoice = require('../models/invoiceModel');
const knex = require('../database/knexfile');

// Mock the Knex instance used by the model
jest.mock('../database/knexfile', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    invoices: {
      select: jest.fn(),
      insert: jest.fn(),
      where: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    allocations: {
      select: jest.fn(),
      insert: jest.fn(),
      where: jest.fn()
    },
    transaction: jest.fn((callback) => callback(knex))
}));

const mockKnex = require('../database/knexfile')();

describe('Invoice Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getById returns null when invoice not found', async () => {
    mockKnex.invoices.select.mockResolvedValue([]);
    const result = await Invoice.getById(999);
    expect(result).toBeNull();
  });

  test('getById returns correct invoice with allocations', async () => {
    const mockRows = [
      {
        id: 1,
        total_amount: '1000.00',
        created_at: '2023-01-01T12:00:00Z',
        'client_identifier': 'Client A',
        'split_amount': '300.00'
      },
      {
        id: 1,
        'client_identifier': 'Client B',
        'split_amount': '700.00'
      }
    ];

    mockKnex.invoices.select.mockResolvedValue(mockRows);

    const result = await Invoice.getById(1);
    expect(result).toMatchObject({
      id: 1,
      totalAmount: 1000.0,
      allocations: [
        { clientId: 'Client A', amount: 300.0 },
        { clientId: 'Client B', amount: 700.0 }
      ]
    });
  });

  test('create inserts invoice and allocations within a transaction', async () => {
    const mockTransaction = jest.fn();
    mockKnex.transaction.mockReturnValueOnce(mockTransaction);

    const data = {
      totalAmount: 500.0,
      allocations: [
        { clientId: 'A', amount: 200.0 },
        { clientId: 'B', amount: 300.0 }
      ]
    };

    // Mock insert returns the new invoice id
    mockKnex.invoices.insert.mockResolvedValueOnce(42);
    mockKnex.allocations.insert.mockResolvedValueOnce(true);

    const result = await Invoice.create(data);
    expect(mockTransaction).toHaveBeenCalled();
    expect(mockKnex.invoices.insert).toHaveBeenCalledWith(
      expect.objectContaining({ total_amount: 500.0 })
    );
    expect(mockKnex.allocations.insert).toHaveBeenCalledTimes(2);
    expect(result).toMatchObject({
      id: 42,
      totalAmount: 500.0,
      allocations: [
        { clientId: 'A', amount: 200.0 },
        { clientId: 'B', amount: 300.0 }
      ]
    });
  });

  test('update modifies total amount', async () => {
    mockKnex.invoices.update.mockResolvedValueOnce(true);
    const result = await Invoice.update(1, { totalAmount: 750.0 });
    expect(result.totalAmount).toBe(750.0);
    expect(mockKnex.invoices.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ total_amount: 750.0 })
    );
  });

  test('delete removes invoice', async () => {
    mockKnex.invoices.delete.mockResolvedValueOnce(1);
    const deleted = await Invoice.delete(1);
    expect(deleted).toBe(true);
    expect(mockKnex.invoices.delete).toHaveBeenCalledWith(1);
  });
});