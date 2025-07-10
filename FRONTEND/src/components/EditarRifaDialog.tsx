// src/components/EditarRifaDialog.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

interface EditarRifaDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rifa: any) => void;
  rifaData: any;
}

export default function EditarRifaDialog({
  open,
  onClose,
  onSubmit,
  rifaData,
}: EditarRifaDialogProps) {
  const [rifa, setRifa] = useState(rifaData);

  useEffect(() => {
    setRifa(rifaData);
  }, [rifaData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRifa({ ...rifa, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(rifa);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Rifa</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="titulo"
          label="Título"
          fullWidth
          value={rifa.titulo || ""}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          name="descricao"
          label="Descrição"
          fullWidth
          multiline
          rows={4}
          value={rifa.descricao || ""}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="precoBilhete"
          label="Preço do Bilhete"
          type="number"
          fullWidth
          value={rifa.precoBilhete || 0}
          onChange={handleChange}
          inputProps={{ min: 0, step: 0.01 }}
          required
        />
        <TextField
          margin="dense"
          name="quantidadeBilhetes"
          label="Quantidade de Bilhetes"
          type="number"
          fullWidth
          value={rifa.quantidadeBilhetes || 0}
          onChange={handleChange}
          inputProps={{ min: 1 }}
          required
        />
        <TextField
          margin="dense"
          name="dataSorteio"
          label="Data do Sorteio"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          value={rifa.dataSorteio || ""}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="status"
          label="Status"
          select
          fullWidth
          value={rifa.status || "Ativa"}
          onChange={handleChange}
        >
          <MenuItem value="Ativa">Ativa</MenuItem>
          <MenuItem value="Encerrada">Encerrada</MenuItem>
          <MenuItem value="Cancelada">Cancelada</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} color="primary">
          Salvar Alterações
        </Button>
      </DialogActions>
    </Dialog>
  );
}
