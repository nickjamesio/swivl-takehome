import { describe, it, vi, expect } from 'vitest';
import {
  LocationService,
  LocationsResult,
} from '../../src/locations/service.js';
import { Variable, Location } from '../../src/common/swivlApiClient.js';
import { OkResult, FailResult } from '../../src/common/result.js';
import { logger } from '../../src/common/logger.js';

describe('LocationService test', () => {
  it('should return an variables object when the the location exists but there is no org or location variable matching the filter', async () => {
    const mockLocations: Array<Location> = [{ id: 1, orgId: 1 }];

    const mockVariables: Array<Variable> = [
      {
        id: 1,
        key: 'BrandName',
        value: 'Public Storage',
        orgId: 1,
        locationId: null,
      },
      {
        id: 2,
        key: 'PhoneNumber',
        value: '(123) 456-7890',
        orgId: 1,
        locationId: 1,
      },
    ];

    const SwivlApiClient = vi.fn().mockImplementation(() => ({
      getVariables: vi
        .fn()
        .mockResolvedValue({ ok: true, value: mockVariables }),
      getLocations: vi
        .fn()
        .mockResolvedValue({ ok: true, value: mockLocations }),
    }));

    const mockedLogger = vi.mocked(logger);

    const locationService = new LocationService({
      swivlApiClient: new SwivlApiClient(),
      logger: mockedLogger,
    });
    const result = await locationService.getLocations({
      orgId: 1,
      variables: ['Address'],
    });
    expect(result.ok).toBe(true);
    expect((result as OkResult<Array<LocationsResult>>).value).toEqual([
      {
        location: { id: 1, orgId: 1 },
        variables: {},
      },
    ]);
  });

  it('should return all locations that have the supplied variable', async () => {
    const mockLocations: Array<Location> = [{ id: 1, orgId: 1 }];

    const mockVariables: Array<Variable> = [
      {
        id: 1,
        key: 'BrandName',
        value: 'Public Storage',
        orgId: 1,
        locationId: 1,
      },
      {
        id: 2,
        key: 'BrandName',
        value: 'Dino Storage',
        orgId: 1,
        locationId: 2,
      },
    ];

    const SwivlApiClient = vi.fn().mockImplementation(() => ({
      getVariables: vi
        .fn()
        .mockResolvedValue({ ok: true, value: mockVariables }),
      getLocations: vi
        .fn()
        .mockResolvedValue({ ok: true, value: mockLocations }),
    }));

    const mockedLogger = vi.mocked(logger);

    const locationService = new LocationService({
      swivlApiClient: new SwivlApiClient(),
      logger: mockedLogger,
    });
    const result = await locationService.getLocations({
      orgId: 1,
      variables: ['BrandName'],
    });
    expect(result.ok).toBe(true);
    expect((result as OkResult<Array<LocationsResult>>).value).toEqual([
      {
        location: { id: 1, orgId: 1 },
        variables: {
          BrandName: { value: 'Public Storage', inheritence: 'location' },
        },
      },
      {
        location: { id: 2, orgId: 1 },
        variables: {
          BrandName: { value: 'Dino Storage', inheritence: 'location' },
        },
      },
    ]);
  });

  it('should only return variables that match the filter', async () => {
    const mockLocations: Array<Location> = [{ id: 1, orgId: 1 }];

    const mockVariables: Array<Variable> = [
      {
        id: 2,
        key: 'BrandName',
        value: 'Public Storage',
        orgId: 1,
        locationId: 1,
      },
      {
        id: 3,
        key: 'PhoneNumber',
        value: 'Dino Storage',
        orgId: 1,
        locationId: 1,
      },
    ];

    const SwivlApiClient = vi.fn().mockImplementation(() => ({
      getVariables: vi
        .fn()
        .mockResolvedValue({ ok: true, value: mockVariables }),
      getLocations: vi
        .fn()
        .mockResolvedValue({ ok: true, value: mockLocations }),
    }));

    const mockedLogger = vi.mocked(logger);

    const locationService = new LocationService({
      swivlApiClient: new SwivlApiClient(),
      logger: mockedLogger,
    });
    const result = await locationService.getLocations({
      orgId: 1,
      variables: ['BrandName'],
    });
    expect(result.ok).toBe(true);
    expect((result as OkResult<Array<LocationsResult>>).value).toEqual([
      {
        location: { id: 1, orgId: 1 },
        variables: {
          BrandName: { value: 'Public Storage', inheritence: 'location' },
        },
      },
    ]);
  });

  it('should return return an org variable if no location variable is found', async () => {
    const mockLocations: Array<Location> = [{ id: 1, orgId: 1 }];

    const mockVariables: Array<Variable> = [
      {
        id: 1,
        key: 'BrandName',
        value: 'Public Storage',
        orgId: 1,
        locationId: null,
      },
      {
        id: 2,
        key: 'PhoneNumber',
        value: '(123) 456-7890',
        orgId: 1,
        locationId: 1,
      },
    ];

    const SwivlApiClient = vi.fn().mockImplementation(() => ({
      getVariables: vi
        .fn()
        .mockResolvedValue({ ok: true, value: mockVariables }),
      getLocations: vi
        .fn()
        .mockResolvedValue({ ok: true, value: mockLocations }),
    }));

    const mockedLogger = vi.mocked(logger);

    const locationService = new LocationService({
      swivlApiClient: new SwivlApiClient(),
      logger: mockedLogger,
    });
    const result = await locationService.getLocations({
      orgId: 1,
      variables: ['BrandName'],
    });
    expect(result.ok).toBe(true);
    expect((result as OkResult<Array<LocationsResult>>).value).toEqual([
      {
        location: { id: 1, orgId: 1 },
        variables: {
          BrandName: { value: 'Public Storage', inheritence: 'org' },
        },
      },
    ]);
  });

  it('should override an org variable if a location one is present', async () => {
    const mockLocations: Array<Location> = [{ id: 1, orgId: 1 }];

    const mockVariables: Array<Variable> = [
      {
        id: 1,
        key: 'PhoneNumber',
        value: '555-123-4567',
        orgId: 1,
        locationId: null,
      },
      {
        id: 2,
        key: 'PhoneNumber',
        value: '(123) 456-7890',
        orgId: 1,
        locationId: 1,
      },
    ];

    const SwivlApiClient = vi.fn().mockImplementation(() => ({
      getVariables: vi
        .fn()
        .mockResolvedValue({ ok: true, value: mockVariables }),
      getLocations: vi
        .fn()
        .mockResolvedValue({ ok: true, value: mockLocations }),
    }));

    const mockedLogger = vi.mocked(logger);

    const locationService = new LocationService({
      swivlApiClient: new SwivlApiClient(),
      logger: mockedLogger,
    });
    const result = await locationService.getLocations({
      orgId: 1,
      variables: ['PhoneNumber'],
    });
    expect(result.ok).toBe(true);
    expect((result as OkResult<Array<LocationsResult>>).value).toEqual([
      {
        location: { id: 1, orgId: 1 },
        variables: {
          PhoneNumber: { value: '(123) 456-7890', inheritence: 'location' },
        },
      },
    ]);
  });

  it('return not found when the specified orgId does not exist', async () => {
    const mockLocations: Array<Location> = [{ id: 1, orgId: 1 }];

    const mockVariables: Array<Variable> = [
      {
        id: 1,
        key: 'PhoneNumber',
        value: '555-123-4567',
        orgId: 1,
        locationId: null,
      },
    ];

    const SwivlApiClient = vi.fn().mockImplementation(() => ({
      getVariables: vi
        .fn()
        .mockResolvedValue({ ok: true, value: mockVariables }),
      getLocations: vi
        .fn()
        .mockResolvedValue({ ok: true, value: mockLocations }),
    }));

    const mockedLogger = vi.mocked(logger);

    const locationService = new LocationService({
      swivlApiClient: new SwivlApiClient(),
      logger: mockedLogger,
    });
    const result = await locationService.getLocations({
      orgId: 2,
      variables: ['PhoneNumber'],
    });
    expect(result.ok).toBe(false);
    expect((result as FailResult).error.message).toMatch(/not found/i);
  });
});
