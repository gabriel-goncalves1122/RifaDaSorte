// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Button,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "../api/axios";
import Header from "../components/Header";
import RifaFormDialog from "../components/RifaFormDialog";
import ConfirmDialog from "../components/ConfirmDialog";

interface Rifa {
  id: number;
  titulo: string;
  descricao: string;
  precoBilhete: number;
  quantidadeBilhetes: number;
  dataSorteio?: string;
  status: "Ativa" | "Encerrada" | "Cancelada";
  createdAt: string;
}

export default function Dashboard() {
  const [rifas, setRifas] = useState<Rifa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [dialogAberto, setDialogAberto] = useState(false);
  const [confirmAberto, setConfirmAberto] = useState(false);
  const [rifaSelecionada, setRifaSelecionada] = useState<Rifa | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  useEffect(() => {
    carregarRifas();
  }, []);

  const carregarRifas = async () => {
    try {
      setCarregando(true);
      const response = await axios.get("/rifas");
      setRifas(response.data);
    } catch (err: any) {
      setErro("Erro ao carregar as rifas");
    } finally {
      setCarregando(false);
    }
  };

  const formatarData = (dataString?: string) => {
    if (!dataString) return "A definir";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };

  const handleCriarRifa = () => {
    setRifaSelecionada(null);
    setModoEdicao(false);
    setDialogAberto(true);
  };

  const handleEditarRifa = (rifa: Rifa) => {
    setRifaSelecionada(rifa);
    setModoEdicao(true);
    setDialogAberto(true);
  };

  const handleExcluirRifa = (rifa: Rifa) => {
    setRifaSelecionada(rifa);
    setConfirmAberto(true);
  };

  const confirmarExclusao = async () => {
    if (!rifaSelecionada) return;

    try {
      await axios.delete(`/rifas/${rifaSelecionada.id}`);
      carregarRifas();
      setConfirmAberto(false);
    } catch (error) {
      setErro("Erro ao excluir rifa");
    }
  };

  const organizadorId = 1; // Substitua pelo ID real do organizador logado

  const salvarRifa = async (rifa: any) => {
    try {
      const dadosFormatados = {
        ...rifa,
        precoBilhete: Number(rifa.precoBilhete),
        quantidadeBilhetes: Number(rifa.quantidadeBilhetes),
        dataSorteio: rifa.dataSorteio
          ? new Date(rifa.dataSorteio).toISOString()
          : null,
        // organizadorId já está incluso
      };

      if (modoEdicao && rifaSelecionada) {
        await axios.put(`/rifas/${rifaSelecionada.id}`, dadosFormatados);
      } else {
        await axios.post("/rifas", dadosFormatados);
      }
      carregarRifas();
      setDialogAberto(false);
    } catch (error) {
      setErro(`Erro ao ${modoEdicao ? "editar" : "criar"} rifa`);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4">Lista de Rifas</Typography>
          <Button variant="contained" color="primary" onClick={handleCriarRifa}>
            Nova Rifa
          </Button>
        </Box>

        {carregando ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : erro ? (
          <Alert severity="error">{erro}</Alert>
        ) : (
          <Grid container spacing={3}>
            {rifas.map((rifa) => (
              <Grid item xs={12} sm={6} md={4} key={rifa.id}>
                <Card
                  elevation={3}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardHeader
                    title={rifa.titulo}
                    subheader={`Status: ${rifa.status}`}
                    action={
                      <Box>
                        <IconButton onClick={() => handleEditarRifa(rifa)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleExcluirRifa(rifa)}>
                          <Delete color="error" />
                        </IconButton>
                      </Box>
                    }
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" paragraph>
                      {rifa.descricao}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Preço do bilhete:</strong> R${" "}
                      {rifa.precoBilhete.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Total de bilhetes:</strong>{" "}
                      {rifa.quantidadeBilhetes}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Data do sorteio:</strong>{" "}
                      {formatarData(rifa.dataSorteio)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      <strong>Criada em:</strong> {formatarData(rifa.createdAt)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <RifaFormDialog
          open={dialogAberto}
          onClose={() => setDialogAberto(false)}
          onSubmit={salvarRifa}
          initialData={rifaSelecionada}
          organizadorId={organizadorId}
        />

        <ConfirmDialog
          open={confirmAberto}
          onClose={() => setConfirmAberto(false)}
          onConfirm={confirmarExclusao}
          title="Confirmar Exclusão"
          message={`Deseja realmente excluir a rifa "${rifaSelecionada?.titulo}"?`}
        />
      </Container>
    </>
  );
}
