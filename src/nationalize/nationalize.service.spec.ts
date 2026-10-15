import { Test, TestingModule } from '@nestjs/testing';
import { NationalizeService } from './nationalize.service.js';
import { AppBadRequestException, AppInternalServerErrorException } from '../common/exceptions/custom-http-exceptions.js';

describe('NationalizeService', () => {
  let service: NationalizeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NationalizeService],
    }).compile();

    service = module.get<NationalizeService>(NationalizeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('enriches prediction data with country names and rounded percentages', async () => {
    const prediction = {
      count: 25095,
      name: 'budi',
      country: [
        { country_id: 'ID', probability: 0.859415 },
        { country_id: 'MY', probability: 0.037895 },
        { country_id: 'BN', probability: 0.012753 },
        { country_id: 'US', probability: 0.009602 },
        { country_id: 'TW', probability: 0.008207 },
      ],
    };
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(prediction), { status: 200 }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await service.getAll(' budi ');

    expect(fetchMock).toHaveBeenCalledWith('https://api.nationalize.io/?name=budi');
    expect(JSON.parse(JSON.stringify(result))).toMatchObject({
      statusCode: 200,
      data: {
        count: 25095,
        name: 'budi',
        country: [
          { country_id: 'ID', probability: 0.859415, country_name: 'Indonesia', probability_percent: 85.94 },
          { country_id: 'MY', probability: 0.037895, country_name: 'Malaysia', probability_percent: 3.79 },
          { country_id: 'BN', probability: 0.012753, country_name: 'Brunei Darussalam', probability_percent: 1.28 },
          { country_id: 'US', probability: 0.009602, country_name: 'Amerika Serikat', probability_percent: 0.96 },
          { country_id: 'TW', probability: 0.008207, country_name: 'Taiwan', probability_percent: 0.82 },
        ],
      },
    });
  });

  it('looks up restricted countries and preserves unknown country codes', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      count: 2,
      name: 'test',
      country: [
        { country_id: 'CU', probability: 1 },
        { country_id: 'ZZ', probability: 0 },
      ],
    }))));

    const result = await service.getAll('test');

    expect(result.data?.country).toEqual([
      { country_id: 'CU', probability: 1, country_name: 'Cuba', probability_percent: 100 },
      { country_id: 'ZZ', probability: 0, country_name: 'ZZ', probability_percent: 0 },
    ]);
  });

  it('preserves an empty country list when there are no predictions', async () => {
    const prediction = { count: 0, name: 'unknown', country: [] };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(prediction))));

    expect((await service.getAll('unknown')).data).toEqual(prediction);
  });

  it('rejects upstream HTTP errors instead of returning a successful response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 }),
    ));

    await expect(service.getAll('budi')).rejects.toBeInstanceOf(AppInternalServerErrorException);
  });

  it('handles upstream connection failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Connection failed')));

    await expect(service.getAll('budi')).rejects.toBeInstanceOf(AppInternalServerErrorException);
  });

  it.each(['', '   '])('rejects empty names before calling the upstream API: %j', async (name) => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(service.getAll(name)).rejects.toBeInstanceOf(AppBadRequestException);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
