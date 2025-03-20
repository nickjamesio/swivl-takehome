import { Result } from '../common/result.js';
import { SwivlApiClient } from '../common/swivlApiClient.js';
import { NotFoundError } from './errors.js';
import { Logger } from 'winston';

export type LocationsResult = {
  location: {
    id: number;
    orgId: number;
  };
  variables: {
    [key: string]: {
      value: string;
      inheritence: 'location' | 'org';
    };
  };
};

export class LocationService {
  private readonly logger: Logger;
  private readonly swivlApiClient: SwivlApiClient;

  constructor(args: { swivlApiClient: SwivlApiClient; logger: Logger }) {
    this.swivlApiClient = args.swivlApiClient;
    this.logger = args.logger;
  }

  async getLocations(args: { orgId: number; variables: Array<string> }) {
    const { orgId, variables: variablesFilter } = args;
    const variablesResult = await this.swivlApiClient.getVariables();
    const locationsResult = await this.swivlApiClient.getLocations();

    if (locationsResult.ok === false) {
      this.logger.error(locationsResult.error);
      return Result.fail(new Error('Could not fetch locations'));
    }

    const locationExists = locationsResult.value.some(
      (location) => location.orgId === orgId,
    );

    if (!locationExists) {
      this.logger.error(`OrgId ${orgId} not found`);
      return Result.fail(new NotFoundError(`OrgId ${orgId} not found`));
    }

    if (variablesResult.ok === false) {
      this.logger.error(variablesResult.error);
      return Result.fail(new Error('Could not fetch variables'));
    }

    const organizationVariables: Record<
      string,
      { value: string; inheritence: 'org' }
    > = {};
    const locationVariables: Record<
      number,
      Record<string, { value: string; inheritence: 'location' }>
    > = {};

    for (const variable of variablesResult.value) {
      if (variable.orgId !== orgId) {
        continue;
      }

      if (
        variable.locationId === null &&
        variablesFilter.includes(variable.key)
      ) {
        organizationVariables[variable.key] = {
          value: variable.value,
          inheritence: 'org',
        };
      } else if (variable.locationId !== null) {
        const existingVariables = locationVariables[variable.locationId] ?? {};
        const newVariables = variablesFilter.includes(variable.key)
          ? {
              ...existingVariables,
              [variable.key]: {
                value: variable.value,
                inheritence: 'location',
              },
            }
          : existingVariables;
        locationVariables[variable.locationId] = newVariables as Record<
          string,
          { value: string; inheritence: 'location' }
        >;
      }
    }

    const result: Array<LocationsResult> = [];
    for (const [locationId, locationVars] of Object.entries(
      locationVariables,
    )) {
      const parsedLocationId = parseInt(locationId);

      result.push({
        location: {
          id: parsedLocationId,
          orgId,
        },
        variables: {
          ...organizationVariables,
          ...locationVars,
        },
      });
    }
    return Result.ok(result);
  }
}
