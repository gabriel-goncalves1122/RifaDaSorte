/**
 * @openapi
 * tags:
 *   - name: Autenticação
 *     description: Endpoints relacionados ao login e emissão de token
 * /auth/login:
 *   post:
 *     tags:
 *       - Autenticação
 *     security: []  
 *     summary: Realiza login e gera um token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna o token JWT
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Dados inválidos (nome ou senha ausentes)
 *       401:
 *         description: Usuário não encontrado ou senha inválida
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       required:
 *         - nome
 *         - senha
 *       properties:
 *         nome:
 *           type: string
 *           example: Don Blake
 *         senha:
 *           type: string
 *           example: senha123
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Login realizado com sucesso!
 *         token:
 *           type: string
 *           example: eyJhbGciOiJzI1NiIsInRCI6IkpX9...
 */
