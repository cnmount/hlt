// pages/map.js
import React from 'react';
import dynamic from 'next/dynamic'
//import LeafletMapPage from '../../components/LeafletMapPage.js'; // 确保路径正确

const LeafletMapPage = dynamic(() => import('../../components/LeafletMapPage.js'), {
  ssr: false,
  loading: () => <p>Loading Map...</p>, // Fallback during loading
  });

const MapPage = () => {
  return (
    <div>
      <h2>Store Locations</h2>
      <LeafletMapPage />
    </div>
  );
};

export default MapPage;
