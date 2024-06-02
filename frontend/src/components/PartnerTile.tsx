import React, { useState } from 'react';
import { PartnerData } from '../types';

interface PartnerTileProps {
    partnerData: PartnerData;
    onDelete: () => void;
    onEdit: (updatedDetails: PartnerData) => void;
}

const PartnerTile: React.FC<PartnerTileProps> = ({ partnerData, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedPartner, setEditedPartner] = useState(partnerData);

    const handleEdit = () => {
        onEdit(editedPartner);
        setIsEditing(false);
    };


    return (
        <div className="partner-tile">
            <img className="partner-thumbnail" src={partnerData.thumbnailUrl} alt={partnerData.name} />
            <hr />
            <div className="partner-info">
                {isEditing ? (
                    <div>
                        <input type="text" value={editedPartner.name} onChange={(e) => setEditedPartner({ ...editedPartner, name: e.target.value })} />
                        <input type="text" value={editedPartner.thumbnailUrl} onChange={(e) => setEditedPartner({ ...editedPartner, thumbnailUrl: e.target.value })} />
                        <textarea value={editedPartner.description} onChange={(e) => setEditedPartner({ ...editedPartner, description: e.target.value })} />
                        <label>
                            Active:
                            <input type="checkbox" checked={editedPartner.active} onChange={(e) => setEditedPartner({ ...editedPartner, active: e.target.checked })} />
                        </label>
                        <button onClick={handleEdit}>Save</button>
                    </div>
                ) : (
                    <div>
                        <h2>{partnerData.name}</h2>
                        <p>{partnerData.description}</p>
                        <p>{partnerData.active ? 'Active' : 'Inactive'}</p>
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button onClick={onDelete}>Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PartnerTile;
