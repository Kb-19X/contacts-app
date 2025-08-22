import {
  Alert,
  Card,
  CardContent,
  Chip,
  Typography,
  Pagination,
  Stack,
  Button,
  Divider,
  Backdrop,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
  Dialog,
} from "@mui/material";
import { Phone, Email } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { API_CONFIG } from "../../api/api.config";
import { ROUTES_CONFIG } from "../../routes/routes.config";

import { useFetch } from "../../ui/hooks/UseFetch.hook";
import { fetchService } from "../../services/fetch.service";
import { Contact, CONTACT_LIST } from "./Contact.model";
import { useAuth } from "../auth/Auth.context";
import { Loading } from "../../ui/components/Loading";

const { ENDPOINTS: { CONTACTS }, METHODS, BASE_URL } = API_CONFIG;

const LIST_COLORS = {
  [CONTACT_LIST.BLACKLIST]: 'black',
  [CONTACT_LIST.FAMILY]: 'blue',
  [CONTACT_LIST.FRIENDS]: 'green',
  [CONTACT_LIST.WORK]: 'orange'
};

export const ContactsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [backdropOpen, setBackdropOpen] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [errorAPI, setErrorAPI] = useState<string | null>(null);

  const navigate = useNavigate();
  const { token } = useAuth();
  const { data, metadata, loading, error } = useFetch({ url: CONTACTS.LIST, page: currentPage, limit: 10 });

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    setCurrentPage(value);
  };

  const handleDelete = async () => {
    const { error } = await fetchService(CONTACTS.DELETE(contactToDelete?._id as string), METHODS.DELETE, null, token);
    if (error) setErrorAPI(error);
    setModalOpen(false);
    setContactToDelete(null);
  };

  if (loading) return <Loading />;
  if (error) return <Alert severity="error">Error: {error}</Alert>;
  if (!data) return <Alert severity="warning">No data found.</Alert>;

  const contacts = data as Contact[];
  const totalPages = metadata.totalPages;

  if (contacts.length === 0) return <Alert severity="warning">There are no contacts to display.</Alert>;

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => navigate(ROUTES_CONFIG.CONTACTS.CREATE)}>Add Contact</Button>

      <Divider sx={{ marginBottom: '20px', marginTop: '10px' }} />

      {errorAPI && <Alert severity="error" sx={{ marginBottom: '20px' }}>{errorAPI}</Alert>}
      
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px', width:'100%' }}>
        {contacts.map((contact) => (
          <Card
            key={contact._id}
            sx={{ 
              width: {
                xs: '100%',
                sm: '50%',
                md: '33.33%',
                lg: '17.5%'
              },
              position: 'relative'
            }}
            data-id={contact._id}
            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => setBackdropOpen(e.currentTarget.dataset.id as string)}
            onMouseLeave={() => setBackdropOpen('')}
          >
            <CardContent>
              <img
                crossOrigin='anonymous'
                src={`${contact.avatar ? `${BASE_URL}/${contact.avatar}` : `https://robohash.org/${contact.email}`}`}
                alt={contact.name}
                style={{ width: '100%', borderRadius: '4px' }} />
              
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
                  marginRight: '5px',
                  color: 'white',
                  backgroundColor: LIST_COLORS[contact.list as keyof typeof LIST_COLORS],
                  borderRadius: '5px'
                }} />
              )}
            </CardContent>

            <Backdrop
              open={backdropOpen === contact._id}
              sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '10px', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)'
              }}
            >
              <Button variant="contained" color="primary" size="small" onClick={() => navigate(ROUTES_CONFIG.CONTACTS.EDIT(contact._id))}>Edit</Button>
              <Button variant="contained" color="error" size="small" onClick={() => { setContactToDelete(contact); setModalOpen(true); }}>Delete</Button>
            </Backdrop>
          </Card>
        ))}
      </div>

      <Stack spacing={2} sx={{ marginTop: '40px' }}>
        <Pagination 
          count={totalPages} 
          page={currentPage} 
          onChange={handlePageChange}
          color="primary"
          variant="outlined"
          shape="rounded"
        />
      </Stack>

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Contact deletion"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action will definitely remove the contact.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>

          <Button onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
