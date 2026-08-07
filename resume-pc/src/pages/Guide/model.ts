import { useState } from 'react';

const GuideModel = () => {
  const [showMenu, setShowMenu] = useState(false);
  return {
    showMenu,
    setShowMenu,
  };
};

export default GuideModel;
