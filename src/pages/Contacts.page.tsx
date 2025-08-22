import { useState, useEffect } from 'react';
import { ContactsList } from '../features/contact/ContactsList';
import { fetchService } from '../api/fetchService';

export const ContactsPage = () => {
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = query ? `/contacts?search=${encodeURIComponent(query)}` : '/contacts';
      const { data, error } = await fetchService(endpoint);
      if (error) {
        setError(error);
      } else {
        setContacts(data || []);
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSearch = () => {
    fetchContacts(search);
  };

  return (
    <>
      <h1>My contacts list</h1>

      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contacts..."
          style={{ padding: '8px', width: '200px', marginRight: '8px' }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '8px 16px',
            cursor: 'pointer'
          }}
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ContactsList contacts={contacts} />
    </>
  );
};
