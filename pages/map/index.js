// pages/map.js
import React from 'react';
import LeafletMapPage from '../../components/LeafletMapPage.js'; // 确保路径正确

const MapPage = () => {
  return (
    <div>
      <h2>Store Locations</h2>
      <LeafletMapPage />
    </div>
  );
};

export default MapPage;
