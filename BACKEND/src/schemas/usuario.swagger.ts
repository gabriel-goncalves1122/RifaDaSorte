/**
 * @swagger
 * /usuarios:
 *   post:
 *     tags: [Usuários]
 *     summary: Criação de usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               cpf:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         $ref: '#/components/responses/ErrorResponse'
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     tags: [Usuários]
 *     summary: Obter usuário por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       404:
 *         $ref: '#/components/responses/ErrorResponse'
 */