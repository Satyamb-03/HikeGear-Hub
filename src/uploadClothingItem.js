// src/UploadClothingItems.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, collection, addDoc } from './firebase';

function UploadClothingItems() {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessages, setErrorMessages] = useState([]);

    const clothingItems = [
        {
            id: 1,
            name: "Outdoor Research Men's Echo Quarter Zip",
            description: 'The Echo Quarter Zip is stretchy, durable and has a soft hand feel...',
            fullDescription: 'The Echo Quarter Zip is stretchy, durable and has a soft hand feel for increased comfort and longevity and features eco-friendly mesh fabric with AirVent™ moisture management to keep you dry. Other features include a quarter zip for extra protection or ventilation when you need it, odour control technology, a UPF 15/20 sun protection rating and thumb loops to anchor sleeves for extra protection and easy layering. Designed to tackle adventures in hot conditions.',
            pricePerDay: 3, // Changed to a number
            image: 'Clothing/OR quaterzip.jpg',
            moreImages: ['Clothing/OR quaterzip 1.jpg'], 
            newArrival: true,
        },
        {
            id: 2,
            name: 'Outdoor Research Women\'s Echo LS Tee',
            description: 'The Echo LS Tee has excellent stretch, a durable and soft...',
            fullDescription: 'The Echo LS Tee has excellent stretch, a durable and soft hand feel for comfort and longevity and an eco-friendly mesh fabric featuring AirVent™ moisture management to keep you dry. Other features include odour control technology and a UPF 15/20 sun protection rating for extra protection. Designed to tackle adventures in hot conditions.',
            pricePerDay: 4, // Changed to a number
            image: 'Clothing/OR Echotee.jpg',
            moreImages: ['Clothing/OR Echotee 1.jpg'],
        },
        {
            id: 3,
            name: '360 Degrees Kid\'s Stratus Pants',
            description: 'The Kid\'s Stratus Pants are waterproof, breathable unisex over...',
            fullDescription: 'The Kid\'s Stratus Pants are waterproof, breathable unisex over pants as at home on the trail as on a bike ride to school. They are made from a lightweight, breathable 2.5 layer fabric that features a polyurethane coating and a DWR treatment and is seam sealed so no water gets in while sweat is wicked through to keep them dry and comfortable. Other features include articulation in the knees for easy movement, an elastic waist with a drawcord for a custom fit and zipped cuffs for easy on/off over footwear.',
            pricePerDay: 8, // Changed to a number
            image: 'Clothing/360pants.jpg',
            moreImages: ['Clothing/360pants 1.jpg'],
        },
        {
            id: 4,
            name: 'Patagonia Men\'s RPS Rock Pants',
            description: 'The rock-paper-scissors RPS Rock Pants have you covered and keep you...',
            fullDescription: 'The rock-paper-scissors RPS Rock Pants have you covered and keep you moving fast on multipitch rock climbs with their stretchy, 96% postconsumer-recycled nylon fabric (sourced from recycled fishing nets to reduce ocean plastic pollution) and articulated patterning. Other features include a durable-water-repellent finish without perfluorinated chemicals, shock-cord cuffs, harness-compatible pockets and an adjustable waist. Fair Trade Certified™ sewn.',
            pricePerDay: 10, // Changed to a number
            image: 'Clothing/Patagonia RPS.jpg',
            moreImages: ['Clothing/Patagonia RPS 1.jpg', 'Clothing/Patagonia RPS 2.jpg'],
        },
        {
            id: 5,
            name: 'The North Face Women\'s ThermoBall Eco 2.0 Hoodie',
            description: 'The ThermoBall Eco Hoodie is designed for warmth, durability...',
            fullDescription: 'The ThermoBall Eco Hoodie is designed for warmth, durability and packability and is made with 100% recycled materials for a lesser environmental impact. It has a baffle pattern that minimises cold spots and ThermoBall™ Eco insulation, which retains loft and traps warmth even when wet. Other features include a hood, hand pockets for extra warmth and protection and can be stowed into its own chest pocket for compact packing.',
            pricePerDay: 7, // Changed to a number
            image: 'Clothing/TNF Thermoball.jpg',
            moreImages: ['Clothing/TNF Thermoball 1.jpg'],
        },
        {
            id: 6,
            name: 'Icebreaker Kid\'s 200 Oasis Leggings',
            description: 'These 200 Oasis Leggings are a versatile lightweight base...',
            fullDescription: 'These 200 Oasis Leggings are a versatile lightweight base layer legging with all the benefits of pure Merino wool to keep kids warm on their adventures in cool conditions. They also feature sport a slim fit for easy layering, a comfortable brushed elastic waistband and a gusset for easy movement and reduced friction. Made from a soft 100% Merino jersey fabric that is naturally odour-resistant and breathable to help regulate body temperature.',
            pricePerDay: 5, // Changed to a number
            image: 'Clothing/Icebreaker leggings.jpg',
            moreImages: ['Clothing/Icebreaker leggings 1.jpg', 'Clothing/Icebreaker leggings 2.jpg'],
        }
    ];

    const handleUpload = async () => {
        setUploading(true);
        setErrorMessages([]);
        const errors = [];

        for (const item of clothingItems) {
            try {
                await addDoc(collection(db, 'clothingItems'), item);
            } catch (error) {
                console.error("Error uploading item:", item.name, error);
                errors.push(`Failed to upload ${item.name}: ${error.message}`);
            }
        }

        if (errors.length > 0) {
            setErrorMessages(errors);
        } else {
            setSuccessMessage("All items uploaded successfully!");
            setTimeout(() => {
                navigate('/');
            }, 2000); // Navigate after 2 seconds
        }
        setUploading(false);
    };

    return (
        <div className="UploadClothingItems">
            <h2>Upload Clothing Items</h2>
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Items'}
            </button>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessages.length > 0 && (
                <div className="error-messages">
                    <h3>Errors:</h3>
                    <ul>
                        {errorMessages.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default UploadClothingItems;
