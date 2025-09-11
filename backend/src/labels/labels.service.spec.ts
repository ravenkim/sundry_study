import { Test, TestingModule } from '@nestjs/testing';
import { LabelsService } from './labels.service';
import { getModelToken } from '@nestjs/mongoose';
import { LabelSubmission } from './schemas/label-submission.schema';
import { Model } from 'mongoose';
import { CreateLabelDto } from './dto/create-label.dto';

describe('LabelsService', () => {
  let service: LabelsService;
  let labelSubmissionModel: Model<LabelSubmission>;

  const mockLabelSubmission = {
    _id: 'someId',
    pullRequestUrl: 'https://github.com/test/test-repo/pull/123',
    diffFetchedAt: new Date(),
    labels: [
      {
        file: 'src/app.ts',
        changeType: 'inserted',
        selection: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 10 },
        },
        label: 'bug-fix',
      },
      {
        file: 'src/feature.ts',
        changeType: 'deleted',
        selection: {
          start: { line: 5, col: 0 },
          end: { line: 5, col: 20 },
        },
        label: 'new-feature',
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
    // labelSubmissionModel = module.get<Model<LabelSubmission>>(
    //   getModelToken(LabelSubmission.name),
    // ); // No longer needed as we mock the constructor directly
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new label submission', async () => {
      const createLabelDto: CreateLabelDto = {
        pullRequestUrl: 'https://github.com/test/test-repo/pull/123',
        diffFetchedAt: new Date(),
        labels: [
          {
            file: 'src/app.ts',
            changeType: 'inserted',
            selection: {
              start: { line: 1, col: 0 },
              end: { line: 1, col: 10 },
            },
            label: 'bug-fix',
          },
        ],
      };

      const result = await service.create(createLabelDto);

      expect(mockLabelSubmissionModel).toHaveBeenCalledWith(createLabelDto);
      expect(mockLabelSubmissionModel.mock.results[0].value.save).toHaveBeenCalled();
      expect(result).toEqual(mockLabelSubmission);
    });
  });
});
