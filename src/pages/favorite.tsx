import { Alert, Card, CardContent, Chip, Typography, Button, Divider, Backdrop } from "@mui/material";
import { Phone, Email } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { API_CONFIG } from "../api/api.config";
import { ROUTES_CONFIG } from "../routes/routes.config";
import { useFetch } from "../ui/hooks/UseFetch.hook";
import { Contact, CONTACT_LIST } from "../features/contact/Contact.model";
import { Loading } from "../ui/components/Loading";

const { ENDPOINTS: { CONTACTS }, BASE_URL } = API_CONFIG;

const LIST_COLORS = {
  [CONTACT_LIST.BLACKLIST]: 'black',
  [CONTACT_LIST.FAMILY]: 'blue',
  [CONTACT_LIST.FRIENDS]: 'green',
  [CONTACT_LIST.WORK]: 'orange'
};

export const FavorisPage = () => {
  const [backdropOpen, setBackdropOpen] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const navigate = useNavigate();
  const { data, loading, error } = useFetch<Contact>({ url: CONTACTS.LIST, page: 1, limit: 100 });

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavoriteIds(storedFavorites);
  }, []);

  const toggleFavorite = (id: string) => {
    let updated: string[];
    if (favoriteIds.includes(id)) {
      updated = favoriteIds.filter(favId => favId !== id);
    } else {
      updated = [...favoriteIds, id];
    }
    localStorage.setItem('favorites', JSON.stringify(updated));
    setFavoriteIds(updated);
  };

  if (loading) return <Loading />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data) return <Alert severity="warning">No data found.</Alert>;

  const contacts = data.filter(contact => favoriteIds.includes(contact._id));
  if (contacts.length === 0) return <Alert severity="warning">No favorite contacts.</Alert>;

  return (
    <>
      <Typography variant="h5" sx={{ marginBottom: '20px' }}>Favorite Contacts</Typography>
      <Divider sx={{ marginBottom: '20px' }} />

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', width: '100%' }}>
        {contacts.map(contact => (
          <Card
            key={contact._id}
            sx={{ width: { xs: '100%', sm: '50%', md: '33.33%', lg: '17.5%' }, position: 'relative' }}
            data-id={contact._id}
            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => setBackdropOpen(e.currentTarget.dataset.id as string)}
            onMouseLeave={() => setBackdropOpen('')}
          >
            <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
              <img
                crossOrigin='anonymous'
                src={`${contact.avatar ? `${BASE_URL}/${contact.avatar}` : `https://robohash.org/${contact.email}`}`}
                alt={contact.name}
                style={{ width: '100%', borderRadius: '4px', paddingTop:'40px' }}
              />
              <Typography variant="h6">{contact.name}</Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <Email sx={{ fontSize: '1.2rem', marginRight: '5px', color: 'gray' }} />
                {contact.email}
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone sx={{ fontSize: '1.2rem', marginRight: '5px', color: 'gray' }} />
                {contact.phone}
              </Typography>
              {contact.list && (
                <Chip
                  label={contact.list}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: '25px',
                    left: '25px',
                    fontSize: '0.77rem',
                    color: 'white',
                    backgroundColor: LIST_COLORS[contact.list as keyof typeof LIST_COLORS],
                    borderRadius: '5px'
                  }}
                />
              )}
            </CardContent>

            <Backdrop
              open={backdropOpen === contact._id}
              sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '10px', margin:'20px', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
              <Button variant="contained" color="primary" size="small" onClick={() => navigate(ROUTES_CONFIG.CONTACTS.EDIT(contact._id))}>Edit</Button>
              <Button variant="contained" color="error" size="small" onClick={() => toggleFavorite(contact._id)}>Remove</Button>
            </Backdrop>
          </Card>
        ))}
      </div>
    </>
  );
};
