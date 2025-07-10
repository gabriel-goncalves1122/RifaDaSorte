// src/components/CriarRifaDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useFormik } from "formik";

interface CriarRifaDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rifa: any) => void;
  organizadorId: number;
}

export default function CriarRifaDialog({
  open,
  onClose,
  onSubmit,
  organizadorId,
}: CriarRifaDialogProps) {
  const formik = useFormik({
    initialValues: {
      titulo: "",
      descricao: "",
      precoBilhete: 0,
      quantidadeBilhetes: 0,
      dataSorteio: "",
      status: "Ativa",
      organizadorId: organizadorId,
    },
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Nova Rifa</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="titulo"
            label="Título"
            fullWidth
            value={formik.values.titulo}
            onChange={formik.handleChange}
            required
          />
          <TextField
            margin="dense"
            name="descricao"
            label="Descrição"
            fullWidth
            multiline
            rows={4}
            value={formik.values.descricao}
            onChange={formik.handleChange}
          />
          <TextField
            margin="dense"
            name="precoBilhete"
            label="Preço do Bilhete"
            type="number"
            fullWidth
            value={formik.values.precoBilhete}
            onChange={formik.handleChange}
            inputProps={{ min: 0, step: 0.01 }}
            required
          />
          <TextField
            margin="dense"
            name="quantidadeBilhetes"
            label="Quantidade de Bilhetes"
            type="number"
            fullWidth
            value={formik.values.quantidadeBilhetes}
            onChange={formik.handleChange}
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
            value={formik.values.dataSorteio}
            onChange={formik.handleChange}
          />
          <TextField
            margin="dense"
            name="status"
            label="Status"
            select
            fullWidth
            value={formik.values.status}
            onChange={formik.handleChange}
          >
            <MenuItem value="Ativa">Ativa</MenuItem>
            <MenuItem value="Encerrada">Encerrada</MenuItem>
            <MenuItem value="Cancelada">Cancelada</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" color="primary">
            Criar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
