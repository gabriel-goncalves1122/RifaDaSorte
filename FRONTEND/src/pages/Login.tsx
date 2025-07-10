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
  Grid,
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
      const response = await axios.post(
        "/auth/login",
        {
          email: data.email,
          senha: data.senha,
        },
        {
          withCredentials: true,
        }
      );

      const { token } = response.data;
      setToken(token);
      navigate("/");
    } catch (err: any) {
      setErro(err.response?.data?.message || "Erro ao fazer login");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="lg" className="login-container">
        <CssBaseline />
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          {/* Seção do Formulário */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} className="login-paper">
              <Avatar className="login-avatar">
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" className="login-title">
                Entrar
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="login-form"
              >
                <TextField
                  className="login-text-field"
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
                  className="login-text-field"
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
                  control={
                    <Checkbox value="remember" className="login-checkbox" />
                  }
                  label="Lembrar-me"
                  sx={{ mt: 1 }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="login-button"
                >
                  Entrar
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Seção do Título */}
          <Grid item xs={12} md={5}>
            <Box className="login-title-section">
              <Typography variant="h2" className="app-main-title">
                Rifas Da Sorte
              </Typography>
              <Typography variant="subtitle1" className="app-subtitle">
                Sua plataforma de rifas online
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Snackbar
          open={!!erro}
          autoHideDuration={4000}
          onClose={() => setErro("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error" className="login-error-alert">
            {erro}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default Login;
