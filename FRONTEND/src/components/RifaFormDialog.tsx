// src/components/RifaFormDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

interface RifaFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rifa: any) => void;
  initialData?: any;
  organizadorId: number;
}

export default function RifaFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  organizadorId, // Receba o organizadorId
}: RifaFormDialogProps) {
  const [rifa, setRifa] = useState(
    initialData || {
      titulo: "",
      descricao: "",
      precoBilhete: 0,
      quantidadeBilhetes: 0,
      dataSorteio: "",
      status: "Ativa",
      organizadorId: organizadorId, // Inclua o organizadorId no state
    }
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRifa({ ...rifa, [name]: value });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? "Editar Rifa" : "Nova Rifa"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="titulo"
          label="Título"
          fullWidth
          value={rifa.titulo}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="descricao"
          label="Descrição"
          fullWidth
          multiline
          rows={4}
          value={rifa.descricao}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="precoBilhete"
          label="Preço do Bilhete"
          type="number"
          fullWidth
          value={rifa.precoBilhete}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="quantidadeBilhetes"
          label="Quantidade de Bilhetes"
          type="number"
          fullWidth
          value={rifa.quantidadeBilhetes}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="dataSorteio"
          label="Data do Sorteio"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          value={rifa.dataSorteio}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="status"
          label="Status"
          select
          fullWidth
          value={rifa.status}
          onChange={handleChange}
        >
          <MenuItem value="Ativa">Ativa</MenuItem>
          <MenuItem value="Encerrada">Encerrada</MenuItem>
          <MenuItem value="Cancelada">Cancelada</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => onSubmit(rifa)}>Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}
