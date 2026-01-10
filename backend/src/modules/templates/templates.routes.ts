import { Router } from 'express';
import { getTemplates, getTemplateById } from './templates';

const router = Router();

/**
 * GET /templates
 * Returns all available architecture templates
 */
router.get('/', (req, res) => {
    const templates = getTemplates();
    res.json(templates);
});

/**
 * GET /templates/:id
 * Returns a single template by ID
 */
router.get('/:id', (req, res) => {
    const template = getTemplateById(req.params.id);

    if (!template) {
        return res.status(404).json({ message: 'Template not found' });
    }

    res.json(template);
});

export default router;
