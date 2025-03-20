import { Router } from 'express';
import validate from 'express-zod-safe';
import { SwivlApiClient } from '../common/swivlApiClient.js';
import { z } from 'zod';
import { LocationService } from './service.js';
import { NotFoundError } from './errors.js';
import { logger } from '../common/logger.js';

const router = Router();

router.post(
  '/:orgId',
  validate({
    body: z.array(
      z.enum(['BrandName', 'StoreHours', 'Name', 'PhoneNumber', 'Address']),
    ),
    params: z.object({
      orgId: z.coerce.number(),
    }),
  }),
  async (req, res) => {
    const { orgId } = req.params;
    const variables = req.body;

    const swivlApiClient = new SwivlApiClient();
    const locationService = new LocationService({
      swivlApiClient,
      logger,
    });

    const result = await locationService.getLocations({
      orgId,
      variables,
    });

    if (result.ok === false) {
      if (result.error instanceof NotFoundError) {
        res.status(404).json({ error: result.error.message });
        return;
      }

      logger.error(result.error);
      res.status(500).json({ error: 'Something went wrong' });
      return;
    }

    res.status(200).json(result.value);
  },
);

export { router as locationsRouter };
