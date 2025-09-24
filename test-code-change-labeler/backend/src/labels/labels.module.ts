import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LabelsController } from './labels.controller';
import { LabelsService } from './labels.service';
import {
  LabelSubmission,
  LabelSubmissionSchema,
} from './schemas/label-submission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LabelSubmission.name, schema: LabelSubmissionSchema },
    ]),
  ],
  controllers: [LabelsController],
  providers: [LabelsService],
})
export class LabelsModule {}
