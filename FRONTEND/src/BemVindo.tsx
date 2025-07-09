import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
export default function BemVindo() {
 const [opcao, setOpcao] = useState(0);
 return (
  <Box>
   <Tabs value={opcao} onChange={(e, outra) => setOpcao(outra)}>
    <Tab label="Tab Um" />
    <Tab label="Tab Dois" />
    <Tab label="Tab Três" />
   </Tabs>
   {[0, 1, 2].map(i => opcao === i &&
        <Box key={i} p={2}>Conteúdo {i + 1}</Box>)}
  </Box> ); };

