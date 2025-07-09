import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Paper,
  Avatar,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import axios from "../api/axios";

interface ILogin {
  email: string;
  senha: string;
}

const schema = yup
  .object({
    email: yup.string().email("Email inválido").required("Email é obrigatório"),
    senha: yup
      .string()
      .min(6, "Senha deve ter no mínimo 6 caracteres")
      .required("Senha é obrigatória"),
  })
  .required();

const defaultTheme = createTheme();

function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [erro, setErro] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ILogin) => {
    try {
      console.log("Enviando:", { email: data.email, senha: data.senha });
      const response = await axios.post(
        "/auth/login",
        {
          email: data.email, // Alterado para enviar email ao invés de nome
          senha: data.senha,
        },
        {
          withCredentials: true, // apenas se back usa cookie auth
        }
      );
      console.log("Resposta:", response.data);

      const { token } = response.data;
      setToken(token);
      navigate("/");
    } catch (err: any) {
      console.error("Erro completo:", err);
      setErro(err.response?.data?.message || "Erro ao fazer login");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper
          elevation={3}
          sx={{
            marginTop: 8,
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Entrar
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Endereço de Email"
              autoComplete="email"
              autoFocus
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Senha"
              type="password"
              id="senha"
              autoComplete="current-password"
              {...register("senha")}
              error={!!errors.senha}
              helperText={errors.senha?.message}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Lembrar-me"
              sx={{ mt: 1 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
          </Box>
        </Paper>
        <Snackbar
          open={!!erro}
          autoHideDuration={4000}
          onClose={() => setErro("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {erro}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default Login;
