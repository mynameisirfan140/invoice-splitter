import React from 'react';
import InvoiceSplitter from './components/InvoiceSplitter';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Invoice Splitter</h1>
          <p className="text-gray-600">Split one invoice into many instantly</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <InvoiceSplitter />
      </main>

      <footer className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Irfan N — Tekzbyte
        </div>
      </footer>
    </div>
  );
};

export default App;