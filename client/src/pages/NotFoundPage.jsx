import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/UIComponents.jsx';
import { Sprout, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-600 flex items-center justify-center">
        <Sprout className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 tracking-tight">404 - Plot Not Found</h1>
      <p className="text-sm text-slate-500 max-w-sm">
        The agricultural field or advisory page you are looking for has been moved or does not exist.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" icon={Home}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}

