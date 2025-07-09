/**
 * @swagger
 * /bilhetes:
 *   post:
 *     tags:
 *       - Bilhetes
 *     summary: Compra um bilhete
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rifaId:
 *                 type: integer
 *                 example: 1
 *               quantidade:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Bilhete comprado com sucesso
 *       401:
 *         description: Não autorizado
 * 
 * /bilhetes/{id}:
 *   get:
 *     tags:
 *       - Bilhetes
 *     summary: Obtém um bilhete pelo ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do bilhete
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bilhete'
 */