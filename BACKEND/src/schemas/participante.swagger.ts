/**
 * @swagger
 * /participantes:
 *   get:
 *     tags: [Participantes]
 *     summary: Listar participantes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de participantes
 *       401:
 *         $ref: '#/components/responses/ErrorResponse'
 */

/**
 * @swagger
 * /participantes/{id}:
 *   get:
 *     tags: [Participantes]
 *     summary: Obter participante por ID
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
 *         description: Dados do participante
 *       404:
 *         $ref: '#/components/responses/ErrorResponse'
 */

/**
 * @swagger
 * /participantes/{id}/bilhetes:
 *   get:
 *     tags: [Participantes]
 *     summary: Listar bilhetes do participante
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