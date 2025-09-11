import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { LabelsController } from '../src/labels/labels.controller';
import { LabelsService } from '../src/labels/labels.service';
import { CreateLabelDto } from '../src/labels/dto/create-label.dto';

describe('LabelsController (e2e)', () => {
  let app: INestApplication;

  const mockLabelsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [LabelsController],
      providers: [
        {
          provide: LabelsService,
          useValue: mockLabelsService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('/labels (POST)', () => {
    const createLabelDto: CreateLabelDto = {
      url: 'https://github.com/fika-dev/code-change-labeler/commit/f5083a140c755ef3c0c577b6e933c3c85d0ae2b9',
      time: 1757575602336,
      labels: [
        {
          id: 0,
          fileName: 'docker-compose.yaml',
          changeType: 'Inserted',
          selectedRange: [
            { row: 1, column: 8 },
            { row: 1, column: 12 },
          ],
        },
      ],
    };

    mockLabelsService.create.mockResolvedValue({
      ...createLabelDto,
      _id: 'someId',
    });

    return request(app.getHttpServer())
      .post('/labels')
      .send(createLabelDto)
      .expect(201)
      .then((response) => {
        expect(mockLabelsService.create).toHaveBeenCalledWith(createLabelDto);
        expect(response.body).toEqual({ ...createLabelDto, _id: 'someId' });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
