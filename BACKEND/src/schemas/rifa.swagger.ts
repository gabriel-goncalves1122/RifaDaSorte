/**
 * @swagger
 * /rifas:
 *   get:
 *     tags: [Rifas]
 *     summary: Listar rifas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de rifas
 *       401:
 *         $ref: '#/components/responses/ErrorResponse'
 * 
 *   post:
 *     tags: [Rifas]
 *     summary: Criar rifa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               precoBilhete:
 *                 type: number
 *               quantidadeBilhetes:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Rifa criada
 *       400:
 *         $ref: '#/components/responses/ErrorResponse'
 */

/**
 * @swagger
 * /rifas/{id}:
 *   get:
 *     tags: [Rifas]
 *     summary: Obter rifa por ID
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
 *         description: Dados da rifa
 *       404:
 *         $ref: '#/components/responses/ErrorResponse'
 * 
 *   put:
 *     tags: [Rifas]
 *     summary: Atualizar rifa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RifaInput'
 *     responses:
 *       200:
 *         description: Rifa atualizada
 *       400:
 *         $ref: '#/components/responses/ErrorResponse'
 * 
 *   delete:
 *     tags: [Rifas]
 *     summary: Remover rifa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Rifa removida
 *       404:
 *         $ref: '#/components/responses/ErrorResponse'
 */

/**
 * @swagger
 * /rifas/{id}/bilhetes:
 *   get:
 *     tags: [Rifas]
 *     summary: Listar bilhetes da rifa
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
 *         description: Lista de bilhetes
 *       404:
 *         $ref: '#/components/responses/ErrorResponse'
 */

