import { Select, MenuItem } from '@mui/material';
import { useState } from 'react';
const PlatformSelector = ({ platforms }) => {
  const [selected, setSelected] = useState('');

  return (
    <Select
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
    >
      {platforms.map((platform) => (
        <MenuItem key={platform.id} value={platform.id}>
          {/* تمرير name فقط، وليس الكائن كاملًا */}
          {platform.name}
        </MenuItem>
      ))}
    </Select>
  );
};
export default PlatformSelector;