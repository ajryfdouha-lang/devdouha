import React, { useState } from 'react';
import api from '../api';

const GestionStock = ({ produitId }) => {
    const [quantite, setQuantite] = useState(0);

    const handleUpdate = () => {
        api.patch(`/admin/stock/${produitId}`, { quantite })
           .then(res => alert("Stock mis à jour ! L'action 'After Email' a été déclenchée."));
    };

    return (
        <div>
            <h3>Réapprovisionnement</h3>
            <input type="number" onChange={(e) => setQuantite(e.target.value)} />
            <button onClick={handleUpdate}>Mettre à jour le stock</button>
        </div>
    );
};