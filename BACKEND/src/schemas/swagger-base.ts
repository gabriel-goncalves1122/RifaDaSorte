/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Mensagem de erro"
 */

/**
 * @swagger
 * tags:
 *   - name: Autenticação
 *   - name: Usuários
 *   - name: Participantes
 *   - name: Rifas
 *   - name: Bilhetes
 */