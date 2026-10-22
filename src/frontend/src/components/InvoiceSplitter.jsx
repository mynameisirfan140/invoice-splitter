import React, { useState, useEffect } from 'react';

const InvoiceSplitter = () => {
  const [totalAmount, setTotalAmount] = useState('');
  const [clients, setClients] = useState([]); // { id, name, amount }
  const [formErrors, setFormErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize with one client row if none exist
  useEffect(() => {
    if (clients.length === 0) {
      setClients([{ id: Date.now(), name: '', amount: '' }]);
    }
  }, []);

  const validate = () => {
    const total = parseFloat(totalAmount);
    const sum = clients.reduce((acc, client) => {
      const amt = parseFloat(client.amount);
      return acc + (isNaN(amt) ? 0 : amt);
    }, 0);

    if (isNaN(total) || total <= 0) {
      setFormErrors('Please enter a valid total amount.');
      return false;
    }
    if (Math.abs(total - sum) > 0.01) {
      setFormErrors(
        `Total amount (${total}) does not match sum of splits (${sum.toFixed(2)}).`
      );
      return false;
    }
    setFormErrors('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setSuccessMessage('');

    try {
      // Simulate API call to backend
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccessMessage('Invoices generated successfully!');
    } catch (err) {
      setFormErrors('Failed to generate invoices. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientChange = (e, index) => {
    const { name, value } = e.target;
    const updatedClients = [...clients];
    updatedClients[index][name] = value;
    setClients(updatedClients);
  };

  const handleDeleteClient = (index) => {
    const updatedClients = clients.filter((_, i) => i !== index);
    setClients(updatedClients);
  };

  const handleAddClient = () => {
    setClients([...clients, { id: Date.now(), name: '', amount: '' }]);
  };

  const isFormValid = totalAmount !== '' && clients.every((c) => c.amount !== '' && parseFloat(c.amount) > 0);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Enter Combined Invoice Details</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Total Amount */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="total-amount">
            Total Invoice Amount
          </label>
          <input
            id="total-amount"
            type="number"
            step="0.01"
            min="0"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formErrors && <p className="text-red-600">{formErrors}</p>}
        </div>

        {/* Clients List */}
        <div>
          <h3 className="text-lg font-medium mb-2">Clients / Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clients.map((client, index) => (
              <div key={client.id} className="flex-1">
                <div className="flex items-center mb-2">
                  <input
                    type="text"
                    placeholder="Client name"
                    value={client.name}
                    onChange={(e) => handleClientChange(e, index)}
                    className="flex-1 border rounded px-3 py-1"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Split amount"
                    value={client.amount}
                    onChange={(e) => handleClientChange(e, index)}
                    className="flex-1 border rounded px-3 py-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteClient(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddClient}
            className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Add Client
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className={`w-full py-2 px-4 rounded text-white font-medium ${
            isLoading || !isFormValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Generating...' : 'Generate Split Invoices'}
        </button>

        {/* Messages */}
        {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
      </form>
    </div>
  );
};

export default InvoiceSplitter;