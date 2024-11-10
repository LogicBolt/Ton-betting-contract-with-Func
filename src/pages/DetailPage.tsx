// DetailPage.tsx
import React from 'react';

interface DetailPageProps {
    title: string;
    description: string;
    imageUrl: string;
}

const DetailPage: React.FC<DetailPageProps> = ({ title, description, imageUrl }) => (
    <div className="detail-page">
        <img src={imageUrl} alt={title} />
        <h1>{title}</h1>
        <p>{description}</p>
    </div>
);

export default DetailPage;
