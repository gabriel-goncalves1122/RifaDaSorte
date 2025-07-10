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
import "./pages.css"; // Importação do CSS

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
      setErro(err.response?.data?.message || "Erro ao carregar as rifas");
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
    if (!rifaSelecionada) {
      console.error("Nenhuma rifa selecionada para exclusão");
      setErro("Nenhuma rifa selecionada para exclusão");
      setConfirmAberto(false);
      return;
    }

    try {
      console.log("Iniciando exclusão da rifa ID:", rifaSelecionada.id);

      const response = await axios.delete(`/rifas/${rifaSelecionada.id}`);

      // Verifica se a exclusão foi bem-sucedida (status 2xx)
      if (response.status >= 200 && response.status < 300) {
        console.log("Rifa excluída com sucesso:", response.data);

        // Atualiza a lista de rifas
        await carregarRifas();

        // Feedback visual para o usuário (opcional)
        setErro(""); // Limpa erros anteriores
        // Você poderia adicionar um estado para mensagens de sucesso

        // Fecha o diálogo de confirmação
        setConfirmAberto(false);
      } else {
        // Trata respostas não bem-sucedidas que não lançaram erro
        throw new Error(response.data?.message || "Erro ao excluir rifa");
      }
    } catch (error: any) {
      console.error("Erro na exclusão:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Mensagens de erro mais amigáveis
      let errorMessage = "Erro ao excluir rifa";

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Rifa não encontrada (já pode ter sido excluída)";
        } else if (error.response.status === 403) {
          errorMessage = "Você não tem permissão para excluir esta rifa";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErro(errorMessage);

      // Mantém o diálogo aberto apenas se for um erro recuperável
      if (error.response?.status === 404 || error.response?.status === 403) {
        setConfirmAberto(false);
      }
    }
  };
  const organizadorId = 1;

  const salvarRifa = async (rifa: any) => {
    try {
      const dadosFormatados = {
        ...rifa,
        precoBilhete: Number(rifa.precoBilhete),
        quantidadeBilhetes: Number(rifa.quantidadeBilhetes),
        dataSorteio: rifa.dataSorteio
          ? new Date(rifa.dataSorteio).toISOString()
          : null,
        organizadorId: organizadorId,
      };

      if (modoEdicao && rifaSelecionada) {
        await axios.put(`/rifas/${rifaSelecionada.id}`, dadosFormatados);
      } else {
        await axios.post("/rifas", dadosFormatados);
      }
      carregarRifas();
      setDialogAberto(false);
    } catch (error: any) {
      setErro(
        error.response?.data?.message ||
          `Erro ao ${modoEdicao ? "editar" : "criar"} rifa`
      );
    }
  };

  const getCardHeaderClass = (status: string) => {
    switch (status) {
      case "Ativa":
        return "card-header-ativa";
      case "Encerrada":
        return "card-header-encerrada";
      case "Cancelada":
        return "card-header-cancelada";
      default:
        return "";
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" className="dashboard-container">
        <Box className="dashboard-header">
          <Typography variant="h4" className="dashboard-title">
            Lista de Rifas
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCriarRifa}
            className="new-rifa-button"
          >
            Nova Rifa
          </Button>
        </Box>

        {carregando ? (
          <Box className="loading-container">
            <CircularProgress size={60} />
          </Box>
        ) : erro ? (
          <Alert
            severity="error"
            onClose={() => setErro("")}
            className="error-alert"
          >
            {erro}
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {rifas.map((rifa) => (
              <Grid item xs={12} sm={6} md={4} key={rifa.id}>
                <Card className="rifa-card" elevation={3}>
                  <CardHeader
                    title={rifa.titulo}
                    subheader={`Status: ${rifa.status}`}
                    className={getCardHeaderClass(rifa.status)}
                    action={
                      <Box>
                        <IconButton
                          onClick={() => handleEditarRifa(rifa)}
                          className="action-button"
                          aria-label="editar"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleExcluirRifa(rifa)}
                          className="action-button"
                          aria-label="excluir"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    }
                  />
                  <CardContent className="rifa-card-content">
                    <Typography variant="body1" paragraph>
                      {rifa.descricao}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Preço do bilhete:</strong>{" "}
                      <span className="price-text">
                        R$ {rifa.precoBilhete.toFixed(2)}
                      </span>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      <strong>Total de bilhetes:</strong>{" "}
                      {rifa.quantidadeBilhetes}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      <strong>Data do sorteio:</strong>{" "}
                      {formatarData(rifa.dataSorteio)}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mt={2}
                    >
                      Criada em: {formatarData(rifa.createdAt)}
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
