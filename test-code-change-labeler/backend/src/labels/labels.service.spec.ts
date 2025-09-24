import { Test, TestingModule } from '@nestjs/testing';
import { LabelsService } from './labels.service';
import { getModelToken } from '@nestjs/mongoose';
import { LabelSubmission } from './schemas/label-submission.schema';
import { CreateLabelDto } from './dto/create-label.dto';

describe('LabelsService', () => {
  let service: LabelsService;

  const mockLabelSubmission = {
    _id: 'someId',
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
      {
        id: 1,
        fileName: 'frontend/.dockerignore',
        changeType: 'Deleted',
        selectedRange: [
          { row: 2, column: 1 },
          { row: 2, column: 5 },
        ],
      },
    ],
    createdAt: new Date(),
  };

  const mockLabelSubmissionModel = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue(mockLabelSubmission),
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LabelsService,
        {
          provide: getModelToken(LabelSubmission.name),
          useValue: mockLabelSubmissionModel,
        },
      ],
    }).compile();

    service = module.get<LabelsService>(LabelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new label submission', async () => {
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

      const result = await service.create(createLabelDto);

      expect(mockLabelSubmissionModel).toHaveBeenCalledWith(createLabelDto);
      expect(
        mockLabelSubmissionModel.mock.results[0].value.save,
      ).toHaveBeenCalled();
      expect(result).toEqual(mockLabelSubmission);
    });
  });
});
