import { useState, useEffect } from 'react';
import PartnerTile from './PartnerTile';
import { PartnerData } from '../types';
import './Dashboard.css';

interface Partner {
  id: string;
  details: PartnerData;
}

const Dashboard: React.FC = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchActive, setSearchActive] = useState<boolean | null>(null);
    const authToken = 'secret-token'; // Hardcoded token for simplicity, replace with a more secure method in production

    useEffect(() => {
        fetch('http://localhost:4000/partners')
            .then(response => response.json())
            .then(data => {
                const partnersArray = Object.entries(data).map(([id, details]) => ({ id, details: details as PartnerData }));
                setPartners(partnersArray);
            });
    }, []);

    const addPartner = (partner: PartnerData) => {
        fetch('http://localhost:4000/partners', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(partner),
        })
            .then(response => response.json())
            .then(newPartner => {
                const id = new Date().getTime().toString();
                setPartners([...partners, { id, details: newPartner }]);
            });
    };

    const deletePartner = (id: string) => {
        fetch(`http://localhost:4000/partners/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        }).then(() => {
            setPartners(partners.filter(partner => partner.id !== id));
        });
    };

    const editPartner = (id: string, updatedDetails: PartnerData) => {
        fetch(`http://localhost:4000/partners/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(updatedDetails),
        })
            .then(response => response.json())
            .then(() => {
                setPartners(partners.map(partner => (partner.id === id ? { id, details: updatedDetails } : partner)));
            });
    };

    const searchPartners = () => {
        let url = `http://localhost:4000/search?`;
        if (searchQuery) url += `query=${searchQuery}&`;
        if (searchActive !== null) url += `active=${searchActive}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const partnersArray = data.map(({ id, details }: { id: string, details: PartnerData }) => ({ id, details }));
                setPartners(partnersArray);
            });
    };

    return (
        <div className="dashboard">
            <h1>Partners Dashboard</h1>
            <div className="search-bar">
                <input type="text" placeholder="Search by name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <select value={searchActive ?? ' '} onChange={(e) => setSearchActive(e.target.value === '' ? null : e.target.value === 'true')}>
                    <option value="">All</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
                <button onClick={searchPartners}>Search</button>
            </div>
            <PartnerList partners={partners} onDelete={deletePartner} onEdit={editPartner} />
            <AddPartnerForm onAdd={addPartner} />
        </div>
    );
};

interface PartnerListProps {
    partners: Partner[];
    onDelete: (id: string) => void;
    onEdit: (id: string, updatedDetails: PartnerData) => void;
}

const PartnerList: React.FC<PartnerListProps> = ({ partners, onDelete, onEdit }) => {
    return (
        <div>
            {partners.map(partner => (
                <PartnerTile key={partner.id} partnerData={partner.details} onDelete={() => onDelete(partner.id)} onEdit={(updatedDetails) => onEdit(partner.id, updatedDetails)} />
            ))}
        </div>
    );
};

interface AddPartnerFormProps {
    onAdd: (partner: PartnerData) => void;
}

const AddPartnerForm: React.FC<AddPartnerFormProps> = ({ onAdd }) => {
    const [name, setName] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [description, setDescription] = useState('');
    const [active, setActive] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        console.log("got here")
        e.preventDefault();
        const newPartner: PartnerData = { name, thumbnailUrl, description, active };
        onAdd(newPartner);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
            <input type="text" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="Logo URL" required />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
            <label>
                Active:
                <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            </label>
            <button type="submit">Add Partner</button>
        </form>
    );
};
export default Dashboard;