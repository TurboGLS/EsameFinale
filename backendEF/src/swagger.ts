import { Express } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

// carico la specifica OpenAPI dal file openapi.yaml (nella root del backend)
const swaggerDocument = YAML.load(path.join(__dirname, '..', 'openapi.yaml'));

/**
 * Registra la documentazione interattiva (Swagger UI) sull'app Express.
 * Raggiungibile su: http://localhost:<PORT>/api/docs
 */
export function setupSwagger(app: Express): void {
    app.use(
        '/api/docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument, {
            customSiteTitle: 'Academy aziendale - API',
            // mantiene il Bearer token dopo il refresh della pagina
            swaggerOptions: {
                persistAuthorization: true,
            },
        })
    );
}
