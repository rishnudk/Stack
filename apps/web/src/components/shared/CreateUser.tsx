'use client';

import { useState } from 'react';
import { trpc } from '@/utils/trpc';

export default function CreateUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const createUser = trpc.users.createUser.useMutation({
    onSuccess: (data: any) => {
      alert(`✅ User created: ${data.name}`);
      setName('');
      setEmail('');
    },
    onError: (error: any) => {
      alert(`❌ Error: ${error.message}`);
    },
  } as any);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser.mutate({ name, email });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-4 border rounded flex flex-col gap-3">
      <h2 className="text-xl font-bold text-center">Create User</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        disabled={createUser.isPending}
      >
        {createUser.isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
