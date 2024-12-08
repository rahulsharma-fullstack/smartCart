// BarcodeModal.jsx
import React from 'react';
import { 
  ShoppingBag,
  Gauge,
  CreditCard,
  ClipboardList,
  User,
  X
} from 'lucide-react';

const BarcodeModal = ({ isOpen, onClose, total, items }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-6">
          {/* Cart Icon and Title */}
          <div className="flex items-center">
            <ShoppingBag className="w-6 h-6 text-gray-600" />
            <p className="ml-2 text-gray-700">Here we have today</p>
          </div>

          {/* Items List */}
          <div className="space-y-4 max-h-48 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-gray-400" />
                </div>
                <span className="flex-grow mx-4 text-gray-700">{item.name}</span>
                <span className="text-gray-700">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center border-t pt-4">
            <span className="font-medium">Total</span>
            <div className="flex items-center">
              <span className="font-medium">${total.toFixed(2)}</span>
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Save $5.00 today!
              </span>
            </div>
          </div>

          {/* Barcode Section */}
          <div className="text-center space-y-4">
            <p className="text-gray-600">Can be scanned to checkout</p>
            <div className="mx-auto bg-pink-50 rounded-2xl p-6">
              <svg className="mx-auto" width="200" height="80" viewBox="0 0 200 80">
                <rect x="10" y="10" width="180" height="60" fill="none" stroke="black" strokeWidth="2"/>
                {/* Generate barcode-like lines */}
                {Array.from({ length: 30 }).map((_, i) => (
                  <rect
                    key={i}
                    x={20 + (i * 5)}
                    y="20"
                    width="2"
                    height="40"
                    fill="black"
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Gauge className="w-6 h-6 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <CreditCard className="w-6 h-6 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ClipboardList className="w-6 h-6 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <User className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeModal;